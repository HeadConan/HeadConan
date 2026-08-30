import React, { useState, useEffect, useMemo } from 'react';
import { WorldState, UIPlanning, UserNote } from '../world/types';
import { DEMO_PRESETS } from '../data/mockWorlds';
import { AIProviderId } from '../ai/client';
import { EmptyPromptSpace } from '../components/world/EmptyPromptSpace';
import { WorldGenesisAnimation } from '../components/world/WorldGenesisAnimation';
import { Header } from '../components/layout/Header';
import { AppSidebar, SidebarItemId } from '../components/layout/AppSidebar';
import { WorldCanvasRenderer } from '../ui/renderer';
import { ActionDock } from '../components/layout/ActionDock';
import { ChronicleModal } from '../components/world/ChronicleModal';
import { NotesDrawer } from '../components/world/NotesDrawer';
import { WorldAtlasExplorer } from '../components/atlas/WorldAtlasExplorer';
import { LayoutLab } from '../components/layout/LayoutLab';
import { computeUIPlan } from '../interface/director';
import { RoleSlot } from '../roles/model';
import { Sparkles } from 'lucide-react';

import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF, SPY_FAMILY_SECRET_UTTERANCES } from '../world/spyFamily/spyFamilyMin';
import { spyFamilyRelationResolver, spyFamilyRoleOf, spyFamilyReaction } from '../world/spyFamily/spyFamilyReactions';
import { instantiate } from '../world/runtime/instantiate';
import { applyEvent, tickScheduler, type KernelOptions, type KernelEvent } from '../world/runtime/kernel2';
import { resolveUserAction, resolveDirectorAction } from '../world/runtime/kernel2Resolver';
import { deriveScene, type SceneIntentHint } from '../world/runtime/scene';
import { recordDialogueTurn } from '../world/runtime/dialogue';
import { proposeUserEvents } from '../ai/propose';
import { projectLegacyWorld } from '../world/runtime/legacyAdapter';
import type { WorldStateInstance, SceneType } from '../world/representation/types/state';
import type { EntityId } from '../world/representation/types/primitives';

const KERNEL_OPTS: KernelOptions = {
  relationResolver: spyFamilyRelationResolver,
  roleOf: spyFamilyRoleOf,
  reactions: spyFamilyReaction,
  // W2.3 观察闭环：公开话语披露 → 解析层判定命中哪些秘密，内核只执行传播
  discloseFactResolver: (_world, event) =>
    SPY_FAMILY_SECRET_UTTERANCES.filter(({ pattern }) => pattern.test(event.utterance)).map(({ factId }) => factId),
};

const LS_KERNEL_STATE = 'headconan_kernel_state_v3';
const LS_CHRONICLE = 'headconan_kernel_chronicle_v3';
const LS_NOTES = 'headconan_kernel_notes_v3';
const LS_ROLE = 'headconan_kernel_role_v3';

interface ChronicleEntry {
  turn: number;
  action: string;
  narrative: string;
  timestamp: string;
  provider?: string;
  model?: string;
}

const DEFAULT_PLAYER_ROLE: RoleSlot = {
  id: 'role:spyf:loid',
  name: 'Loid Forger',
  type: 'PLAYER',
  title: '洛德·福杰（玩家）',
  agency: 'character-level',
  perspective: 'first-person',
  knowledge: 'limited',
  permissions: ['talk', 'move', 'decide', 'command'],
  controlledEntityId: SPYF.loid,
  avatar: '🧭',
  description: '扮演洛德·福杰，在伪装家庭与间谍使命之间走钢丝。',
  suggestedPrompts: [],
};

function isWorldStateInstance(v: unknown): v is WorldStateInstance {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.instanceId === 'string' &&
    typeof o.definitionId === 'string' &&
    typeof o.clock === 'object' &&
    typeof o.entityStates === 'object' &&
    typeof o.epistemics === 'object'
  );
}

function entityName(id: string): string {
  return SPY_FAMILY_MIN.characters.find(c => c.id === id)?.name ?? id;
}

function shortName(fullName: string): string {
  return fullName.split('（')[0].split('·')[0];
}

const SCENE_LABELS: Record<SceneType, string> = {
  conversation: '对话',
  everyday: '日常',
  exploration: '探索',
  world_editing: '世界编辑',
};

export const App: React.FC = () => {
  // App Phase: 'prompt' | 'genesis' | 'workspace'
  const [appPhase, setAppPhase] = useState<'prompt' | 'genesis' | 'workspace'>('prompt');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // Selected AI Engine（W1 内核路径不使用；W3 LLM 提议通道接管）
  const [selectedEngine, setSelectedEngine] = useState<AIProviderId>(() => {
    try {
      const saved = localStorage.getItem('headconan_selected_engine');
      if (saved) return saved as AIProviderId;
    } catch (e) {}
    return 'auto';
  });

  // 内核真相（绞杀者模式：唯一状态源）
  const [kernelState, setKernelState] = useState<WorldStateInstance | null>(null);

  // 显示层附加状态（内核之外，纯呈现）
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [activeRoleId, setActiveRoleId] = useState<string>(DEFAULT_PLAYER_ROLE.id);

  // Director Overlay State
  const [isDirectorOverlayOpen, setIsDirectorOverlayOpen] = useState<boolean>(false);

  // Interaction State
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [latestNarrativeOutcome, setLatestNarrativeOutcome] = useState<string | null>(null);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);

  // W3.3: 对话目标（conversation 场景点击角色卡片后设置；定向后续话语）
  const [dialogueTargetId, setDialogueTargetId] = useState<EntityId | null>(null);

  // Modals
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [showAtlasModal, setShowAtlasModal] = useState(false);
  const [showLayoutLabModal, setShowLayoutLabModal] = useState(false);

  // Sidebar active item
  const [sidebarActive, setSidebarActive] = useState<SidebarItemId>('overview');

  // 观察者：由当前角色推导（玩家=洛德，导演=全知 null）
  const observerEntityId: EntityId | null = useMemo(() => {
    const slot = SPY_FAMILY_MIN.possibilitySpace.availableRoles.find(r => r.id === activeRoleId);
    return slot?.associatedEntityId ?? null;
  }, [activeRoleId]);

  // 每帧投影：内核真相 → 外壳可显示的 legacy WorldState（绞杀者模式核心）
  const displayWorld: WorldState | null = useMemo(() => {
    if (!kernelState) return null;
    return projectLegacyWorld(SPY_FAMILY_MIN, kernelState, observerEntityId, {
      notes,
      activeRoleId,
    });
  }, [kernelState, observerEntityId, notes, activeRoleId]);

  // Persist selected engine
  const handleSelectEngine = (engine: AIProviderId) => {
    setSelectedEngine(engine);
    try {
      localStorage.setItem('headconan_selected_engine', engine);
    } catch (e) {}
  };

  // Derive Active RoleSlot（来自投影结果，切换角色 → 投影即变）
  const activeRole: RoleSlot = useMemo(() => {
    if (!displayWorld || !displayWorld.roles || displayWorld.roles.length === 0) {
      return DEFAULT_PLAYER_ROLE;
    }
    return displayWorld.roles.find(r => r.id === activeRoleId) || displayWorld.roles[0];
  }, [displayWorld, activeRoleId]);

  // W3.3: 对话目标（id + 短名，供 ActionDock / 建议话语使用）
  const dialogueTarget = useMemo(() => {
    if (!dialogueTargetId) return null;
    const c = SPY_FAMILY_MIN.characters.find(ch => ch.id === dialogueTargetId);
    if (!c) return null;
    return { id: c.id, name: shortName(c.name) };
  }, [dialogueTargetId]);

  // Compute UI Plan dynamically from Projected World State + Role Slot + Scene
  const activeUiPlan: UIPlanning = useMemo(() => {
    if (!displayWorld) {
      return { activeLayout: 'workspace', suggestedInteractions: [], blocks: [] };
    }
    return computeUIPlan(displayWorld, {
      activeRole,
      isDirectorOverlayActive: isDirectorOverlayOpen,
      scene: kernelState?.scene.current, // W3.1：场景驱动界面重组
      dialogueTargetName: dialogueTarget?.name, // W3.3：对话目标定向建议话语
    });
  }, [displayWorld, activeRole, isDirectorOverlayOpen, kernelState?.scene.current, dialogueTarget?.name]);

  // Load initial local storage if present
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LS_KERNEL_STATE);
      const savedChronicle = localStorage.getItem(LS_CHRONICLE);
      const savedNotes = localStorage.getItem(LS_NOTES);
      const savedRole = localStorage.getItem(LS_ROLE);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (isWorldStateInstance(parsed)) {
          // W2.1: 旧 v3 快照无 scheduler 字段 → 补默认，避免恢复后 tickScheduler 崩溃
          if (!parsed.scheduler) {
            parsed.scheduler = { queue: [], budgetPerTurn: 3, seed: 0xc0ffee, nextSeq: 0 };
          }
          // W3.1: 旧快照无 scene 字段 → 补默认场景
          if (!parsed.scene) {
            parsed.scene = { current: 'everyday', inScene: {} };
          }
          setKernelState(parsed);
          if (savedChronicle) setChronicle(JSON.parse(savedChronicle));
          if (savedNotes) setNotes(JSON.parse(savedNotes));
          if (savedRole) setActiveRoleId(savedRole);
          setAppPhase('workspace');
        }
      }
    } catch (e) {
      console.warn('Could not restore cached world state:', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (kernelState && appPhase === 'workspace') {
      try {
        localStorage.setItem(LS_KERNEL_STATE, JSON.stringify(kernelState));
        localStorage.setItem(LS_CHRONICLE, JSON.stringify(chronicle));
        localStorage.setItem(LS_NOTES, JSON.stringify(notes));
        localStorage.setItem(LS_ROLE, activeRoleId);
      } catch (e) {
        console.warn('Failed to save world to localStorage:', e);
      }
    }
  }, [kernelState, chronicle, notes, activeRoleId, appPhase]);

  // Handler: User submits an imaginative prompt（W1：任何 prompt 都引导至内核演示世界）
  const handleInitiatePrompt = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setAppPhase('genesis');
    setLatestNarrativeOutcome(null);
    setChronicle([]);
    setNotes([]);
    setIsDirectorOverlayOpen(false);
  };

  // Handler: User selects a preset
  const handleSelectPreset = (presetId: string) => {
    const matched = DEMO_PRESETS.find(p => p.id === presetId);
    setCurrentPrompt(matched?.subtitle ?? 'SPY×FAMILY 内核演示');
    setAppPhase('genesis');
    setLatestNarrativeOutcome(null);
    setChronicle([]);
    setNotes([]);
    setIsDirectorOverlayOpen(false);
  };

  // Handler: Genesis animation completed → 实例化内核世界
  const handleGenesisComplete = () => {
    const fresh = instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
    setKernelState(fresh);
    setActiveRoleId(SPY_FAMILY_MIN.possibilitySpace.availableRoles[0].id);
    setAppPhase('workspace');
  };

  // Handler: Role Slot Selection（切换角色 = 切换观察者 → 界面内容真的变）
  const handleSelectRole = (roleId: string) => {
    setActiveRoleId(roleId);
  };

  // Handler: Sidebar navigation
  const handleSidebarNavigate = (id: SidebarItemId) => {
    setSidebarActive(id);
    switch (id) {
      case 'chronicle':
        setShowChronicleModal(true);
        break;
      case 'notes':
        setShowNotesDrawer(true);
        break;
      case 'atlas':
        setShowAtlasModal(true);
        break;
      case 'layout-lab':
        setShowLayoutLabModal(true);
        break;
      case 'director':
        setIsDirectorOverlayOpen(v => !v);
        break;
      case 'new-world':
        handleResetToPrompt();
        break;
      case 'overview':
      default:
        document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
        break;
    }
  };

  // Handler: User performs an action → 确定性解析 → 内核应用（拒绝即事件）
  // W3.3: targetId 为显式对话目标（点击角色卡片注入）；缺省回退当前 dialogueTargetId
  const handleDispatchAction = async (action: string, targetId?: string) => {
    if (!kernelState || isProcessingAction) return;

    setIsProcessingAction(true);
    setLatestNarrativeOutcome(null);

    try {
      const isDirector = observerEntityId === null || isDirectorOverlayOpen;
      const effectiveTarget = (targetId ?? dialogueTargetId) as EntityId | undefined;
      const parts: string[] = [];
      let next = kernelState;
      let sceneHint: SceneIntentHint | undefined;
      let dialogueTurns = 0;

      if (isDirector) {
        const d = resolveDirectorAction(action, SPY_FAMILY_MIN);
        if (d.notice) {
          parts.push(d.notice);
        } else if (d.event) {
          const r = applyEvent(SPY_FAMILY_MIN, next, d.event, KERNEL_OPTS);
          next = r.nextState;
          const last = next.eventChronicleLog.at(-1);
          if (last) parts.push(last.description);
          if (r.rejected && r.reason) parts.push(`[世界拒绝] ${r.reason}`);
        }
      } else {
        // W3.2：LLM 提议为主通道；确定性解析为回退（LLM 不可用/解析失败/低置信 → 永不硬阻塞）
        const proposed = await proposeUserEvents(action, SPY_FAMILY_MIN, next, observerEntityId as EntityId, {
          provider: selectedEngine,
          fallback: resolveUserAction,
          targetId: effectiveTarget,
        });
        sceneHint = proposed.sceneHint;
        if (proposed.source === 'clarify') {
          parts.push(proposed.notice ?? '（意图不够明确，请说得更具体一些）');
        } else {
          if (proposed.source === 'llm') {
            parts.push(`（LLM 提议 · 置信 ${Math.round(proposed.confidence * 100)}%）`);
          }
          if (proposed.confidence < 0.85) {
            parts.push('（未识别为具体指令，已当作对约尔的一句闲聊）');
          }
          for (const ev of proposed.events) {
            const r = applyEvent(SPY_FAMILY_MIN, next, ev, KERNEL_OPTS);
            next = r.nextState;
            // W3.3: 成功 speech_act 计入对话轮次（场景内状态递增）
            if (!r.rejected && ev.type === 'speech_act') dialogueTurns += 1;
            const last = next.eventChronicleLog.at(-1);
            if (last) parts.push(last.description);
            for (const resp of r.responses) parts.push(`${entityName(resp.from)}：${resp.text}`);
            if (r.rejected && r.reason) parts.push(`[世界拒绝] ${r.reason}`);
          }
        }
      }

      // W2.1：世界自发事件推进（调度器：延迟 once / 周期 periodic / 概率级联到期的 [世界] 事件）
      const tick = tickScheduler(next, SPY_FAMILY_MIN, KERNEL_OPTS);
      next = tick.nextState;
      for (const r of tick.executed) {
        const last = r.nextState.eventChronicleLog.at(-1);
        if (last) parts.push(`[世界] ${last.description}`);
        if (r.rejected && r.reason) parts.push(`[世界拒绝] ${r.reason}`);
      }

      // W3.1：场景推导（用户意图 + 地点节奏 + 导演视角）
      next.scene = deriveScene(SPY_FAMILY_MIN, next, observerEntityId, sceneHint);
      // W3.3：对话轮次记账（成功 speech_act 递增场景内 dialogueTurn，随快照持久化）
      if (dialogueTurns > 0) {
        next.scene = recordDialogueTurn(next.scene, dialogueTurns);
      }

      setKernelState(next);
      // W3.3：离开 conversation 场景 → 清除对话目标（目标只在对话场景有意义）
      if (next.scene.current !== 'conversation') {
        setDialogueTargetId(null);
      }
      const narrative = parts.join('\n');
      setLatestNarrativeOutcome(narrative);
      const newEntry: ChronicleEntry = {
        turn: next.clock.turnNumber,
        action,
        narrative,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'kernel',
        model: 'deterministic',
      };
      setChronicle(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error('Interaction execution error:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handler: User records a note（显示层状态，不进入内核）
  const handleAddNote = (content: string) => {
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: `Turn #${kernelState?.clock.turnNumber ?? 1}`,
    };
    setNotes(prev => [newNote, ...prev]);
  };

  // Handler: Reset to creative space
  const handleResetToPrompt = () => {
    try {
      localStorage.removeItem(LS_KERNEL_STATE);
      localStorage.removeItem(LS_CHRONICLE);
      localStorage.removeItem(LS_NOTES);
      localStorage.removeItem(LS_ROLE);
      localStorage.removeItem('headconan_active_world_v2');
      localStorage.removeItem('headconan_active_chronicle_v2');
    } catch (e) {}
    setKernelState(null);
    setNotes([]);
    setActiveRoleId(DEFAULT_PLAYER_ROLE.id);
    setLatestNarrativeOutcome(null);
    setChronicle([]);
    setIsDirectorOverlayOpen(false);
    setSidebarActive('overview');
    setAppPhase('prompt');
  };

  // Render based on Phase
  if (appPhase === 'prompt') {
    return (
      <>
        <EmptyPromptSpace
          onSubmitPrompt={handleInitiatePrompt}
          onSelectPreset={handleSelectPreset}
          selectedEngine={selectedEngine}
          onSelectEngine={handleSelectEngine}
          onOpenAtlas={() => setShowAtlasModal(true)}
        />
        {showAtlasModal && (
          <WorldAtlasExplorer
            onSelectPromptForWorld={(prompt) => {
              setShowAtlasModal(false);
              handleInitiatePrompt(prompt);
            }}
            onClose={() => setShowAtlasModal(false)}
          />
        )}
      </>
    );
  }

  if (appPhase === 'genesis') {
    return (
      <WorldGenesisAnimation
        prompt={currentPrompt || 'Synthesizing world parameters...'}
        onComplete={handleGenesisComplete}
        selectedEngine={selectedEngine}
      />
    );
  }

  if (!displayWorld || !kernelState) {
    return null;
  }

  return (
    <div className="flex h-screen gap-2 overflow-hidden bg-zinc-100 p-2 text-zinc-950">
      {/* Sidebar (Layer 0 nav, §7.1) */}
      <AppSidebar
        activeItem={sidebarActive}
        onNavigate={handleSidebarNavigate}
        noteCount={notes.length}
        isDirectorOpen={isDirectorOverlayOpen}
        selectedEngine={selectedEngine}
        onSelectEngine={handleSelectEngine}
        worldName={displayWorld.name}
        turnCount={displayWorld.turnCount}
      />

      {/* Main Content Area (floating panel on zinc canvas, §3.1) */}
      <main className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50 shadow-sm">
        <div id="main-scroll-container" className="flex h-full flex-col overflow-y-auto scrollbar-fade">
          {/* World Frame (Layer 0) */}
          <Header
            world={displayWorld}
            onResetToPrompt={handleResetToPrompt}
            onSelectPreset={handleSelectPreset}
            onOpenFeedModal={() => setShowChronicleModal(true)}
            onOpenNotesModal={() => setShowNotesDrawer(true)}
            onOpenAtlas={() => setShowAtlasModal(true)}
            onOpenLayoutLab={() => setShowLayoutLabModal(true)}
            activeRole={activeRole}
            onSelectRole={handleSelectRole}
            isDirectorOverlayOpen={isDirectorOverlayOpen}
            onToggleDirectorOverlay={() => setIsDirectorOverlayOpen(!isDirectorOverlayOpen)}
          />

          {/* Main World Canvas (Layer 1 & Layer 2) */}
          <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-6 sm:px-6">
            {/* Role Banner / Active Lens Notice */}
            {activeRole.type !== 'PLAYER' && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs shadow-card animate-in fade-in duration-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{activeRole.avatar || '🎭'}</span>
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-zinc-900">{activeRole.name}</span>
                    <span className="ml-2 hidden text-zinc-500 sm:inline">— {activeRole.description}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const playerRole = displayWorld.roles.find(r => r.type === 'PLAYER');
                    if (playerRole) handleSelectRole(playerRole.id);
                  }}
                  className="shrink-0 rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  Return to Player Role
                </button>
              </div>
            )}

            {/* Narrative Outcome Consequence Banner */}
            {latestNarrativeOutcome && (
              <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-card animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-zinc-100 p-1.5 text-zinc-700">
                      <Sparkles className="size-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                        Consequence & World Reaction // {displayWorld.style?.temporalGrammar?.timeDisplayPrefix || 'Turn'} #{displayWorld.turnCount}
                      </div>
                      <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-zinc-800">
                        {latestNarrativeOutcome}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLatestNarrativeOutcome(null)}
                    className="ml-4 shrink-0 rounded-md px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* W3.1: 场景徽标（当前场景 + 切换原因） */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-600 shadow-sm">
                <span className="size-1.5 rounded-full bg-zinc-900" />
                场景 · {SCENE_LABELS[kernelState.scene.current]}
              </span>
              {kernelState.scene.lastTransition && (
                <span className="text-[11px] text-zinc-400">
                  {kernelState.scene.lastTransition.reason}（Turn #{kernelState.scene.lastTransition.turn}）
                </span>
              )}
            </div>

            {/* Dynamic Composition Surface (World Canvas Renderer) */}
            <WorldCanvasRenderer
              world={displayWorld}
              blocks={activeUiPlan.blocks}
              onAction={handleDispatchAction}
              onAddNote={handleAddNote}
            />
          </div>

          {/* Interaction Surface (Layer 3) */}
          <ActionDock
            suggestedActions={activeUiPlan.suggestedInteractions || []}
            onSubmitAction={handleDispatchAction}
            isProcessing={isProcessingAction}
            selectedEngine={selectedEngine}
            worldStyle={displayWorld.style}
            activeRole={activeRole}
          />
        </div>
      </main>

      {/* Modals */}
      <ChronicleModal
        isOpen={showChronicleModal}
        onClose={() => setShowChronicleModal(false)}
        entries={chronicle}
        world={displayWorld}
      />

      <NotesDrawer
        isOpen={showNotesDrawer}
        onClose={() => setShowNotesDrawer(false)}
        notes={notes}
        onAddNote={handleAddNote}
        onActionFromNote={handleDispatchAction}
      />

      {showAtlasModal && (
        <WorldAtlasExplorer
          onSelectPromptForWorld={(prompt) => {
            setShowAtlasModal(false);
            handleInitiatePrompt(prompt);
          }}
          onClose={() => setShowAtlasModal(false)}
        />
      )}

      {showLayoutLabModal && displayWorld && (
        <LayoutLab
          world={displayWorld}
          onClose={() => setShowLayoutLabModal(false)}
          onAction={handleDispatchAction}
        />
      )}
    </div>
  );
};
