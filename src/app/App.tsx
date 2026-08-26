import React, { useState, useEffect, useMemo } from 'react';
import { WorldState, UIPlanning, UIBlock } from '../world/types';
import { EMPIRE_SEED_WORLD, UNIVERSITY_SEED_WORLD, MYSTERY_SEED_WORLD, DEMO_PRESETS } from '../data/mockWorlds';
import { generateWorldFromAI, interactWorldWithAI, AIProviderId } from '../ai/client';
import { applyWorldMutations } from '../world/mutations';
import { EmptyPromptSpace } from '../components/world/EmptyPromptSpace';
import { WorldGenesisAnimation } from '../components/world/WorldGenesisAnimation';
import { Header } from '../components/layout/Header';
import { WorldCanvasRenderer } from '../ui/renderer';
import { ActionDock } from '../components/layout/ActionDock';
import { ChronicleModal } from '../components/world/ChronicleModal';
import { NotesDrawer } from '../components/world/NotesDrawer';
import { computeUIPlan } from '../interface/director';
import { RoleSlot } from '../roles/model';
import { Sparkles, Wand2, Shield, Eye, AlertCircle } from 'lucide-react';

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
    setAppPhase('prompt');
  };

  // Render based on Phase
  if (appPhase === 'prompt') {
    return (
      <EmptyPromptSpace
        onSubmitPrompt={handleInitiatePrompt}
        onSelectPreset={handleSelectPreset}
        selectedEngine={selectedEngine}
        onSelectEngine={handleSelectEngine}
      />
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

  const canvasBgClass = world.style?.tokens?.canvasBg || 'bg-[#08090d]';

  return (
    <div className={`min-h-screen ${canvasBgClass} text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-500`}>
      {/* World Frame (Layer 0) */}
      <Header
        world={world}
        onResetToPrompt={handleResetToPrompt}
        onSelectPreset={handleSelectPreset}
        onOpenFeedModal={() => setShowChronicleModal(true)}
        onOpenNotesModal={() => setShowNotesDrawer(true)}
        selectedEngine={selectedEngine}
        onSelectEngine={handleSelectEngine}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
        isDirectorOverlayOpen={isDirectorOverlayOpen}
        onToggleDirectorOverlay={() => setIsDirectorOverlayOpen(!isDirectorOverlayOpen)}
      />

      {/* Main World Canvas (Layer 1 & Layer 2) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6">
        {/* Role Banner / Active Lens Notice */}
        {activeRole.type !== 'PLAYER' && (
          <div className="mb-5 px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs font-mono backdrop-blur-md animate-in fade-in duration-200 shadow-lg bg-purple-950/40 border-purple-500/30 text-purple-200">
            <div className="flex items-center space-x-2.5">
              <span className="text-base">{activeRole.avatar || '🎭'}</span>
              <div>
                <span className="font-bold uppercase tracking-wider">{activeRole.name}</span>
                <span className="opacity-70 ml-2 hidden sm:inline">— {activeRole.description}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const playerRole = world.roles.find(r => r.type === 'PLAYER');
                if (playerRole) handleSelectRole(playerRole.id);
              }}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors shrink-0"
            >
              Return to Player Role
            </button>
          </div>
        )}

        {/* Narrative Outcome Consequence Banner */}
        {latestNarrativeOutcome && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold mb-1">
                    Consequence & World Reaction // {world.style?.temporalGrammar?.timeDisplayPrefix || 'Turn'} #{world.turnCount}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {latestNarrativeOutcome}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLatestNarrativeOutcome(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors ml-4 shrink-0"
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
      </main>

      {/* Interaction Surface (Layer 3) */}
      <ActionDock
        suggestedActions={activeUiPlan.suggestedInteractions || []}
        onSubmitAction={handleDispatchAction}
        isProcessing={isProcessingAction}
        selectedEngine={selectedEngine}
        worldStyle={world.style}
        activeRole={activeRole}
      />

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
    </div>
  );
};
