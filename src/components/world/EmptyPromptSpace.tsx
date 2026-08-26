import React, { useState } from 'react';
import { ArrowRight, Sparkles, Compass, Shield, GraduationCap, Building2, History } from 'lucide-react';
import { DEMO_PRESETS } from '../../data/mockWorlds';
import { AIProviderId, AI_PROVIDERS } from '../../ai/client';
import { EngineSelector } from '../layout/EngineSelector';

interface EmptyPromptSpaceProps {
  onSubmitPrompt: (prompt: string) => void;
  onSelectPreset: (presetId: string) => void;
  selectedEngine: AIProviderId;
  onSelectEngine: (engine: AIProviderId) => void;
  onOpenAtlas?: () => void;
}

export const EmptyPromptSpace: React.FC<EmptyPromptSpaceProps> = ({
  onSubmitPrompt,
  onSelectPreset,
  selectedEngine,
  onSelectEngine,
  onOpenAtlas,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmitPrompt(prompt.trim());
  };

  const currentConfig = AI_PROVIDERS.find((p) => p.id === selectedEngine) || AI_PROVIDERS[0];

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-between px-6 py-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center">
            <span className="w-2 h-2 rounded-sm bg-indigo-300 transform rotate-45" />
          </div>
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-400 font-semibold">
            HeadConan
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {onOpenAtlas && (
            <button
              onClick={onOpenAtlas}
              className="px-3 py-1.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 text-xs font-medium text-indigo-200 transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Open HeadConan World Atlas & Portfolio Catalog"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>World Atlas (60+)</span>
            </button>
          )}
          <EngineSelector
            selectedEngine={selectedEngine}
            onSelectEngine={onSelectEngine}
          />
        </div>
      </header>

      {/* Central Creative Space */}
      <main className="max-w-3xl mx-auto w-full my-auto z-10 text-center flex flex-col items-center py-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-indigo-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Generative World Synthesis Engine // Powered by {currentConfig.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight text-slate-100 mb-4 leading-tight">
          What do you want to experience?
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mb-8 leading-relaxed font-sans">
          Give HeadConan an idea, scenario, role, or situation. A living interactive world and custom interface will form around your imagination.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative mb-8">
          <div className="relative group">
            <input
              id="initial-imagination-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I want to become the ruler of a fictional empire..."
              className="w-full bg-[#10131e]/90 text-slate-100 text-base placeholder-slate-500 px-6 py-4 pr-14 rounded-2xl border border-white/15 focus:border-indigo-400/60 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-2xl transition-all font-sans"
              autoFocus
            />
            <button
              id="submit-imagination-button"
              type="submit"
              disabled={!prompt.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-indigo-600 flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Subtle Example Presets */}
        <div className="w-full max-w-2xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3 text-left">
            Or step into an existing premise:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            {DEMO_PRESETS.map((demo) => (
              <button
                key={demo.id}
                id={`btn-preset-${demo.id}`}
                onClick={() => onSelectPreset(demo.id)}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/30 transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold tracking-wider text-indigo-300 group-hover:text-indigo-200">
                      {demo.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-white/5">
                      {demo.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-snug">
                    {demo.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {onOpenAtlas && (
            <button
              onClick={onOpenAtlas}
              className="w-full mt-3 p-3 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-indigo-950/40 border border-indigo-500/30 hover:border-indigo-400/60 transition-all flex items-center justify-between text-xs group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-white group-hover:text-indigo-200 block">
                    Explore Systematic World Atlas & Portfolio
                  </span>
                  <span className="text-[11px] text-slate-400">
                    60+ candidate worlds across Literature, Gaming, Anime, History & Philosophy
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 font-mono text-indigo-300 text-[11px]">
                <span>Browse Atlas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 z-10 font-mono flex items-center justify-between">
        <span>Minimum Sufficient Reality • Decoupled Domain State</span>
        <span className="text-slate-500">Active Engine: {currentConfig.name}</span>
      </footer>
    </div>
  );
};
