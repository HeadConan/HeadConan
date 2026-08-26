import React, { useState, useEffect } from 'react';
import { WorldState, UIPlanning, UIBlock } from '../world/types';
import { EMPIRE_SEED_WORLD, UNIVERSITY_SEED_WORLD, DEMO_PRESETS } from '../data/mockWorlds';
import { generateWorldFromAI, interactWorldWithAI } from '../ai/client';
import { applyWorldMutations } from '../world/mutations';
import { EmptyPromptSpace } from '../components/world/EmptyPromptSpace';
import { WorldGenesisAnimation } from '../components/world/WorldGenesisAnimation';
import { Header } from '../components/layout/Header';
import { WorldCanvasRenderer } from '../ui/renderer';
import { ActionDock } from '../components/layout/ActionDock';
import { ChronicleModal } from '../components/world/ChronicleModal';
import { NotesDrawer } from '../components/world/NotesDrawer';
import { Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface ChronicleEntry {
  turn: number;
  action: string;
  narrative: string;
  timestamp: string;
}

export const App: React.FC = () => {
  // App Phase: 'prompt' | 'genesis' | 'workspace'
  const [appPhase, setAppPhase] = useState<'prompt' | 'genesis' | 'workspace'>('prompt');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // World and UI Plan State
  const [world, setWorld] = useState<WorldState | null>(null);
  const [uiPlan, setUiPlan] = useState<UIPlanning | null>(null);

  // Interaction State
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);
  const [latestNarrativeOutcome, setLatestNarrativeOutcome] = useState<string | null>(null);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);

  // Modals
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);

  // Temporary container while genesis animation runs
  const [pendingWorldData, setPendingWorldData] = useState<{ world: WorldState; uiPlanning: UIPlanning } | null>(null);

  // Load initial local storage if present
  useEffect(() => {
    try {
      const savedWorld = localStorage.getItem('headconan_active_world');
      const savedPlan = localStorage.getItem('headconan_active_plan');
      const savedChronicle = localStorage.getItem('headconan_active_chronicle');
      if (savedWorld && savedPlan) {
        setWorld(JSON.parse(savedWorld));
        setUiPlan(JSON.parse(savedPlan));
        if (savedChronicle) setChronicle(JSON.parse(savedChronicle));
        setAppPhase('workspace');
      }
    } catch (e) {
      console.warn('Could not restore cached world state:', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (world && uiPlan && appPhase === 'workspace') {
      try {
        localStorage.setItem('headconan_active_world', JSON.stringify(world));
        localStorage.setItem('headconan_active_plan', JSON.stringify(uiPlan));
        localStorage.setItem('headconan_active_chronicle', JSON.stringify(chronicle));
      } catch (e) {
        console.warn('Failed to save world to localStorage:', e);
      }
    }
  }, [world, uiPlan, chronicle, appPhase]);

  // Handler: User submits an imaginative prompt
  const handleInitiatePrompt = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setAppPhase('genesis');
    setLatestNarrativeOutcome(null);
    setChronicle([]);

    // Start generation immediately in parallel with animation
    const result = await generateWorldFromAI(prompt);
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
        setPendingWorldData(JSON.parse(JSON.stringify(matched.preset)));
      } else if (matched.prompt) {
        handleInitiatePrompt(matched.prompt);
      }
    }
  };

  // Handler: Genesis animation completed
  const handleGenesisComplete = () => {
    if (pendingWorldData) {
      setWorld(pendingWorldData.world);
      setUiPlan(pendingWorldData.uiPlanning);
    } else {
      // Fallback to Empire seed if pending data somehow missing
      setWorld(JSON.parse(JSON.stringify(EMPIRE_SEED_WORLD.world)));
      setUiPlan(JSON.parse(JSON.stringify(EMPIRE_SEED_WORLD.uiPlanning)));
    }
    setAppPhase('workspace');
  };

  // Handler: User performs an action
  const handleDispatchAction = async (action: string) => {
    if (!world || !uiPlan || isProcessingAction) return;

    setIsProcessingAction(true);
    setLatestNarrativeOutcome(null);

    try {
      const userNotes = world.notes?.map(n => n.content) || [];
      const interactionResult = await interactWorldWithAI(action, world, userNotes);

      // Apply mutations
      const nextWorld = applyWorldMutations(world, interactionResult);
      setWorld(nextWorld);

      // Record narrative
      setLatestNarrativeOutcome(interactionResult.narrativeOutcome);
      const newEntry: ChronicleEntry = {
        turn: nextWorld.turnCount,
        action,
        narrative: interactionResult.narrativeOutcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChronicle(prev => [newEntry, ...prev]);

      // Update suggested actions if new ones arrived
      if (interactionResult.suggestedNextActions && interactionResult.suggestedNextActions.length > 0) {
        setUiPlan(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            suggestedInteractions: interactionResult.suggestedNextActions!
          };
        });
      }
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
      localStorage.removeItem('headconan_active_world');
      localStorage.removeItem('headconan_active_plan');
      localStorage.removeItem('headconan_active_chronicle');
    } catch (e) {}
    setWorld(null);
    setUiPlan(null);
    setLatestNarrativeOutcome(null);
    setChronicle([]);
    setAppPhase('prompt');
  };

  // Render based on Phase
  if (appPhase === 'prompt') {
    return (
      <EmptyPromptSpace
        onSubmitPrompt={handleInitiatePrompt}
        onSelectPreset={handleSelectPreset}
      />
    );
  }

  if (appPhase === 'genesis') {
    return (
      <WorldGenesisAnimation
        prompt={currentPrompt || 'Synthesizing world parameters...'}
        onComplete={handleGenesisComplete}
      />
    );
  }

  if (!world || !uiPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <Header
        world={world}
        onResetToPrompt={handleResetToPrompt}
        onSelectPreset={handleSelectPreset}
        onOpenFeedModal={() => setShowChronicleModal(true)}
        onOpenNotesModal={() => setShowNotesDrawer(true)}
      />

      {/* Main World Canvas */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Narrative Outcome Alert Banner */}
        {latestNarrativeOutcome && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold mb-1">
                    Consequence & World Reaction // Turn #{world.turnCount}
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

        {/* Dynamic UI Block Canvas */}
        <WorldCanvasRenderer
          world={world}
          blocks={uiPlan.blocks}
          onAction={handleDispatchAction}
          onAddNote={handleAddNote}
        />
      </main>

      {/* Bottom Interactive Command Dock */}
      <ActionDock
        suggestedActions={uiPlan.suggestedInteractions || []}
        onSubmitAction={handleDispatchAction}
        isProcessing={isProcessingAction}
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
