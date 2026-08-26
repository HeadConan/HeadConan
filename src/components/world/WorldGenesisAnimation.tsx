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
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle pulse background */}
      <div className="w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-5 shadow-2xl">
          <CurrentIcon className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-widest text-indigo-400/90 mb-3">
          <span>Engine: {config.name}</span>
        </div>

        <h3 className="text-lg font-serif font-medium text-slate-200 mb-6 h-8 flex items-center justify-center">
          {STAGES[currentStageIndex]?.text}
        </h3>

        {/* Prompt quotation */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 italic max-w-sm mx-auto line-clamp-2">
          “{prompt}”
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-1 w-48 mx-auto bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
            style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
