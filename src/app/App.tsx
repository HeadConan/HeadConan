import React, { useState, useEffect, useMemo } from 'react';
import { WorldState, UIPlanning, UIBlock } from '../world/types';
import { EMPIRE_SEED_WORLD, UNIVERSITY_SEED_WORLD, MYSTERY_SEED_WORLD, DEMO_PRESETS } from '../data/mockWorlds';
import { generateWorldFromAI, interactWorldWithAI, AIProviderId } from '../ai/client';
import { applyWorldMutations } from '../world/mutations';
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

interface ChronicleEntry {
  turn: number;
  action: string;
  narrative: string;
  timestamp: string;
  provider?: string;
  model?: string;
}

export const App: React.FC = () => {
  // App Phase: 'prompt' | 'genesis' | 'workspace'
  const [appPhase, setAppPhase] = useState<'prompt' | 'genesis' | 'workspace'>('prompt');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // Selected AI Engine
  const [selectedEngine, setSelectedEngine] = useState<AIProviderId>(() => {
    try {
      const saved = localStorage.getItem('headconan_selected_engine');
      if (saved) return saved as AIProviderId;
    } catch (e) {}
    return 'auto';
  });

  // World State
  const [world, setWorld] = useState<WorldState | null>(null);

  // Director Overlay State
  const [isDirectorOverlayOpen, setIsDirectorOverlayOpen] = useState<boolean>(false);

  // Interaction State
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [latestNarrativeOutcome, setLatestNarrativeOutcome] = useState<string | null>(null);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);

  // Modals
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [showAtlasModal, setShowAtlasModal] = useState(false);
  const [showLayoutLabModal, setShowLayoutLabModal] = useState(false);

  // Sidebar active item
  const [sidebarActive, setSidebarActive] = useState<SidebarItemId>('overview');

  // Temporary container while genesis animation runs
  const [pendingWorldData, setPendingWorldData] = useState<{ world: WorldState; uiPlanning?: UIPlanning } | null>(null);

  // Persist selected engine
  const handleSelectEngine = (engine: AIProviderId) => {
    setSelectedEngine(engine);
    try {
      localStorage.setItem('headconan_selected_engine', engine);
    } catch (e) {}
  };

  // Derive Active RoleSlot
  const activeRole: RoleSlot = useMemo(() => {
    if (!world || !world.roles || world.roles.length === 0) {
      return {
        id: 'default-player',
        name: 'Player Inhabitant',
        type: 'PLAYER',
        title: 'Observer & Protagonist',
        agency: 'character-level',
        perspective: 'first-person',
        knowledge: 'limited',
        permissions: ['talk', 'move', 'decide', 'command'],
        description: 'You inhabit this world as its central protagonist.',
        suggestedPrompts: []
      };
    }
    const found = world.roles.find(r => r.id === world.activeRoleId);
    return found || world.roles[0];
  }, [world]);

  // Compute UI Plan dynamically from World State + Role Slot + Director Engine
  const activeUiPlan: UIPlanning = useMemo(() => {
    if (!world) {
      return {
        activeLayout: 'workspace',
        suggestedInteractions: [],
        blocks: []
      };
    }
    return computeUIPlan(world, {
      activeRole,
      isDirectorOverlayActive: isDirectorOverlayOpen
    });
  }, [world, activeRole, isDirectorOverlayOpen]);

  // Load initial local storage if present
  useEffect(() => {
    try {
      const savedWorld = localStorage.getItem('headconan_active_world_v2');
      const savedChronicle = localStorage.getItem('headconan_active_chronicle_v2');
      if (savedWorld) {
        setWorld(JSON.parse(savedWorld));
        if (savedChronicle) setChronicle(JSON.parse(savedChronicle));
        setAppPhase('workspace');
      }
    } catch (e) {
      console.warn('Could not restore cached world state:', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (world && appPhase === 'workspace') {
      try {
        localStorage.setItem('headconan_active_world_v2', JSON.stringify(world));
        localStorage.setItem('headconan_active_chronicle_v2', JSON.stringify(chronicle));
      } catch (e) {
        console.warn('Failed to save world to localStorage:', e);
      }
    }
  }, [world, chronicle, appPhase]);

  // Handler: User submits an imaginative prompt
  const handleInitiatePrompt = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setAppPhase('genesis');
    setLatestNarrativeOutcome(null);
    setChronicle([]);
    setIsDirectorOverlayOpen(false);

    // Start generation immediately in parallel with animation using selectedEngine
    const result = await generateWorldFromAI(prompt, selectedEngine);
    setPendingWorldData({
      world: result.world,
      uiPlanning: result.uiPlanning,
    });
  };

  // Handler: User selects a preset
  const handleSelectPreset = (presetId: string) => {
    const matched = DEMO_PRESETS.find(p => p.id === presetId);
    if (matched) {
      if (matched.preset) {
        setCurrentPrompt(matched.subtitle);
        setAppPhase('genesis');
        setLatestNarrativeOutcome(null);
        setChronicle([]);
        setIsDirectorOverlayOpen(false);
        setPendingWorldData(JSON.parse(JSON.stringify(matched.preset)));
      }
    }
  };

  // Handler: Genesis animation completed
  const handleGenesisComplete = () => {
    if (pendingWorldData) {
      setWorld(pendingWorldData.world);
    } else {
      setWorld(JSON.parse(JSON.stringify(EMPIRE_SEED_WORLD.world)));
    }
    setAppPhase('workspace');
  };

  // Handler: Role Slot Selection (Agency Shift)
  const handleSelectRole = (roleId: string) => {
    if (!world) return;
    setWorld(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        activeRoleId: roleId
      };
    });
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

  // Handler: User performs an action
  const handleDispatchAction = async (action: string) => {
    if (!world || isProcessingAction) return;

    setIsProcessingAction(true);
    setLatestNarrativeOutcome(null);

    try {
      const userNotes = world.notes?.map(n => n.content) || [];
      const interactionResult = await interactWorldWithAI(action, world, userNotes, selectedEngine);

      // Apply mutations
      const nextWorld = applyWorldMutations(world, interactionResult);
      setWorld(nextWorld);

      // Record narrative
      setLatestNarrativeOutcome(interactionResult.narrativeOutcome);
      const newEntry: ChronicleEntry = {
        turn: nextWorld.turnCount,
        action,
        narrative: interactionResult.narrativeOutcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: (interactionResult as any).provider,
        model: (interactionResult as any).model,
      };
      setChronicle(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error('Interaction execution error:', err);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Handler: User records a note
  const handleAddNote = (content: string) => {
    if (!world) return;
    const newNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: `Turn #${world.turnCount || 1}`
    };
    const nextWorld = {
      ...world,
      notes: [newNote, ...(world.notes || [])]
    };
    setWorld(nextWorld);
  };

  // Handler: Reset to creative space
  const handleResetToPrompt = () => {
    try {
      localStorage.removeItem('headconan_active_world_v2');
      localStorage.removeItem('headconan_active_chronicle_v2');
    } catch (e) {}
    setWorld(null);
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

  if (!world) {
    return null;
  }

  return (
    <div className="flex h-screen gap-2 overflow-hidden bg-zinc-100 p-2 text-zinc-950">
      {/* Sidebar (Layer 0 nav, §7.1) */}
      <AppSidebar
        activeItem={sidebarActive}
        onNavigate={handleSidebarNavigate}
        noteCount={world.notes?.length || 0}
        isDirectorOpen={isDirectorOverlayOpen}
        selectedEngine={selectedEngine}
        onSelectEngine={handleSelectEngine}
        worldName={world.name}
        turnCount={world.turnCount}
      />

      {/* Main Content Area (floating panel on zinc canvas, §3.1) */}
      <main className="relative min-w-0 flex-1 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50 shadow-sm">
        <div id="main-scroll-container" className="flex h-full flex-col overflow-y-auto scrollbar-fade">
          {/* World Frame (Layer 0) */}
          <Header
            world={world}
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
                    const playerRole = world.roles.find(r => r.type === 'PLAYER');
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
                        Consequence & World Reaction // {world.style?.temporalGrammar?.timeDisplayPrefix || 'Turn'} #{world.turnCount}
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-zinc-800">
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

            {/* Dynamic Composition Surface (World Canvas Renderer) */}
            <WorldCanvasRenderer
              world={world}
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
            worldStyle={world.style}
            activeRole={activeRole}
          />
        </div>
      </main>

      {/* Modals */}
      <ChronicleModal
        isOpen={showChronicleModal}
        onClose={() => setShowChronicleModal(false)}
        entries={chronicle}
        world={world}
      />

      <NotesDrawer
        isOpen={showNotesDrawer}
        onClose={() => setShowNotesDrawer(false)}
        notes={world.notes || []}
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

      {showLayoutLabModal && world && (
        <LayoutLab
          world={world}
          onClose={() => setShowLayoutLabModal(false)}
          onAction={handleDispatchAction}
        />
      )}
    </div>
  );
};
