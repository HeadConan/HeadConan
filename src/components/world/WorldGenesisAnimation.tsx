import React, { useEffect, useState } from 'react';
import { Sparkles, Compass, Shield, Eye, Zap, Brain, Cpu } from 'lucide-react';
import { AIProviderId, AI_PROVIDERS } from '../../ai/client';

interface WorldGenesisAnimationProps {
  prompt: string;
  onComplete: () => void;
  selectedEngine?: AIProviderId;
}

const STAGES = [
  { text: 'Interpreting premise & user role...', icon: Eye, delay: 600 },
  { text: 'Constructing spatial locations & state equilibrium...', icon: Compass, delay: 1200 },
  { text: 'Mapping factions, loyalties & covert tensions...', icon: Shield, delay: 1800 },
  { text: 'Synthesizing generative UI blocks & opening world...', icon: Sparkles, delay: 2400 },
];

export const WorldGenesisAnimation: React.FC<WorldGenesisAnimationProps> = ({
  prompt,
  onComplete,
  selectedEngine = 'auto',
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    STAGES.forEach((stage, idx) => {
      const timer = setTimeout(() => {
        setCurrentStageIndex(idx);
        if (idx === STAGES.length - 1) {
          const completeTimer = setTimeout(() => {
            onComplete();
          }, 800);
          timers.push(completeTimer);
        }
      }, stage.delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  const CurrentIcon = STAGES[currentStageIndex]?.icon || Sparkles;
  const config = AI_PROVIDERS.find((p) => p.id === selectedEngine) || AI_PROVIDERS[0];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-100 p-6 text-zinc-950">
      {/* Subtle pulse background */}
      <div className="pointer-events-none size-96 animate-pulse rounded-full bg-zinc-300/40 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-card">
          <CurrentIcon className="size-6 animate-spin text-zinc-800" style={{ animationDuration: '4s' }} strokeWidth={1.5} />
        </div>

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-600 shadow-sm">
          <span>Engine: {config.name}</span>
        </div>

        <h3 className="mb-6 flex h-8 items-center justify-center text-lg font-medium text-zinc-800">
          {STAGES[currentStageIndex]?.text}
        </h3>

        {/* Prompt quotation */}
        <div className="mx-auto line-clamp-2 max-w-sm rounded-xl border border-zinc-200 bg-white p-3.5 font-sans text-xs italic text-zinc-500 shadow-sm">
          “{prompt}”
        </div>

        {/* Progress Bar */}
        <div className="mt-6 mx-auto h-1 w-48 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all duration-500"
            style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
