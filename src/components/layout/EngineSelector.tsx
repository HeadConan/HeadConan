import React, { useState, useEffect } from 'react';
import { AIProviderId, AI_PROVIDERS, checkServerAIHealth, ServerHealthResponse } from '../../ai/client';
import { Cpu, ChevronDown, Check, Zap, Brain, Sparkles, Server } from 'lucide-react';

interface EngineSelectorProps {
  selectedEngine: AIProviderId;
  onSelectEngine: (engine: AIProviderId) => void;
  compact?: boolean;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  selectedEngine,
  onSelectEngine,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [health, setHealth] = useState<ServerHealthResponse | null>(null);

  useEffect(() => {
    checkServerAIHealth().then((h) => {
      if (h) setHealth(h);
    });
  }, []);

  const currentConfig = AI_PROVIDERS.find((p) => p.id === selectedEngine) || AI_PROVIDERS[0];

  const getProviderIcon = (id: AIProviderId) => {
    switch (id) {
      case 'deepseek-chat':
        return <Zap className="size-3.5 text-cyan-600" strokeWidth={1.75} />;
      case 'deepseek-reasoner':
        return <Brain className="size-3.5 text-purple-600" strokeWidth={1.75} />;
      case 'gemini-3.7-flash':
        return <Sparkles className="size-3.5 text-blue-600" strokeWidth={1.75} />;
      case 'procedural':
        return <Server className="size-3.5 text-emerald-600" strokeWidth={1.75} />;
      default:
        return <Cpu className="size-3.5 text-zinc-600" strokeWidth={1.75} />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="btn-engine-selector"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-50 ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
        }`}
        title="Select AI Engine (DeepSeek V3, DeepSeek R1, Gemini 3.7 Flash, Procedural)"
      >
        {getProviderIcon(selectedEngine)}
        <span className="font-mono font-semibold text-zinc-800">{currentConfig.badge}</span>
        <ChevronDown className="size-3 text-zinc-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg sm:w-80">
            {/* Header / Server Status Indicator */}
            <div className="px-3.5 py-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  AI Gateway & Engines
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Ready</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span
                  className={`rounded border px-1.5 py-0.5 ${
                    health?.providers?.deepseek?.available
                      ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                  }`}
                >
                  DeepSeek: {health?.providers?.deepseek?.available ? 'Connected' : 'Standby / Local'}
                </span>
                <span
                  className={`rounded border px-1.5 py-0.5 ${
                    health?.providers?.gemini?.available
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                  }`}
                >
                  Gemini: {health?.providers?.gemini?.available ? 'Connected' : 'Standby'}
                </span>
              </div>
            </div>

            {/* Provider Options */}
            <div className="py-1">
              {AI_PROVIDERS.map((provider) => {
                const isSelected = provider.id === selectedEngine;
                return (
                  <button
                    key={provider.id}
                    id={`engine-option-${provider.id}`}
                    onClick={() => {
                      onSelectEngine(provider.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-zinc-50 ${
                      isSelected ? 'bg-zinc-50' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getProviderIcon(provider.id)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${isSelected ? 'font-bold text-zinc-900' : 'text-zinc-800'}`}>
                          {provider.name}
                        </span>
                        {isSelected && <Check className="ml-2 size-3.5 shrink-0 text-zinc-900" strokeWidth={2} />}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                        {provider.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-zinc-100 px-3.5 py-2 text-[10px] font-mono text-zinc-500">
              DeepSeek-V3 and DeepSeek-R1 support zero-latency simulation and structured JSON output.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
