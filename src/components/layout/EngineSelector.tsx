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
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'deepseek-reasoner':
        return <Brain className="w-3.5 h-3.5 text-purple-400" />;
      case 'gemini-3.7-flash':
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
      case 'procedural':
        return <Server className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="btn-engine-selector"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-slate-200 transition-all flex items-center space-x-2 ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
        }`}
        title="Select AI Engine (DeepSeek V3, DeepSeek R1, Gemini 3.7 Flash, Procedural)"
      >
        {getProviderIcon(selectedEngine)}
        <span className="font-mono text-slate-200 font-semibold">{currentConfig.badge}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0e111a] border border-white/15 rounded-xl shadow-2xl py-2 z-50 divide-y divide-white/10 animate-in fade-in zoom-in-95 duration-150">
            {/* Header / Server Status Indicator */}
            <div className="px-3.5 py-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  AI Gateway & Engines
                </span>
                <span className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ready</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span
                  className={`px-1.5 py-0.5 rounded border ${
                    health?.providers?.deepseek?.available
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  DeepSeek: {health?.providers?.deepseek?.available ? 'Connected' : 'Standby / Local'}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded border ${
                    health?.providers?.gemini?.available
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                      : 'bg-white/5 text-slate-400 border-white/10'
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
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-white/[0.04] transition-colors flex items-start space-x-3 ${
                      isSelected ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getProviderIcon(provider.id)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-indigo-300 font-bold' : 'text-slate-200'
                          }`}
                        >
                          {provider.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {provider.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-3.5 py-2 text-[10px] font-mono text-slate-400 bg-black/20">
              DeepSeek-V3 and DeepSeek-R1 support zero-latency simulation and structured JSON output.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
