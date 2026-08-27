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
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-zinc-100 px-6 py-8 text-zinc-950">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-zinc-300/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 size-96 rounded-full bg-zinc-200/50 blur-[120px]" />

      {/* Top Bar */}
      <header className="z-10 mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-md bg-zinc-900">
            <span className="size-2 rotate-45 rounded-[2px] bg-zinc-100" />
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600">
            HeadConan
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenAtlas && (
            <button
              onClick={onOpenAtlas}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
              title="Open HeadConan World Atlas & Portfolio Catalog"
            >
              <Compass className="size-3.5 text-zinc-500" strokeWidth={1.75} />
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
      <main className="z-10 mx-auto my-auto flex w-full max-w-3xl flex-col items-center py-6 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-[11px] text-zinc-600 shadow-sm">
          <Sparkles className="size-3.5 text-zinc-500" strokeWidth={1.75} />
          <span>Generative World Synthesis Engine // Powered by {currentConfig.badge}</span>
        </div>

        <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
          What do you want to experience?
        </h1>
        <p className="mb-8 max-w-lg font-sans text-sm leading-relaxed text-zinc-500">
          Give HeadConan an idea, scenario, role, or situation. A living interactive world and custom interface will form around your imagination.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative mb-8 w-full max-w-2xl">
          <div className="group relative">
            <input
              id="initial-imagination-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I want to become the ruler of a fictional empire..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-6 py-4 pr-14 font-sans text-base text-zinc-900 shadow-card transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
              autoFocus
            />
            <button
              id="submit-imagination-button"
              type="submit"
              disabled={!prompt.trim()}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-zinc-900 p-2.5 text-white transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900"
            >
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </form>

        {/* Subtle Example Presets */}
        <div className="w-full max-w-2xl">
          <div className="mb-3 text-left font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            Or step into an existing premise:
          </div>
          <div className="grid grid-cols-1 gap-2.5 text-left sm:grid-cols-2">
            {DEMO_PRESETS.map((demo) => (
              <button
                key={demo.id}
                id={`btn-preset-${demo.id}`}
                onClick={() => onSelectPreset(demo.id)}
                className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition-all hover:border-zinc-300 hover:shadow-card"
              >
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-wider text-zinc-900">
                      {demo.title}
                    </span>
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                      {demo.tag}
                    </span>
                  </div>
                  <p className="text-xs leading-snug text-zinc-500 group-hover:text-zinc-700">
                    {demo.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {onOpenAtlas && (
            <button
              onClick={onOpenAtlas}
              className="mt-3 flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 text-xs shadow-sm transition-all hover:border-zinc-300 hover:shadow-card group"
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-zinc-100 p-1.5 text-zinc-700">
                  <Compass className="size-4" strokeWidth={1.75} />
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-zinc-900 group-hover:text-zinc-950">
                    Explore Systematic World Atlas & Portfolio
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    60+ candidate worlds across Literature, Gaming, Anime, History & Philosophy
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                <span>Browse Atlas</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
              </div>
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 mx-auto flex w-full max-w-4xl items-center justify-between font-mono text-xs text-zinc-500">
        <span>Minimum Sufficient Reality • Decoupled Domain State</span>
        <span className="text-zinc-400">Active Engine: {currentConfig.name}</span>
      </footer>
    </div>
  );
};
