import React, { useState } from 'react';
import { Send, Sparkles, CornerDownLeft, Loader2, Wand2, Shield, Eye } from 'lucide-react';
import { AIProviderId, AI_PROVIDERS } from '../../ai/client';
import { WorldStyle } from '../../style/worldStyle';
import { RoleSlot } from '../../roles/model';

interface ActionDockProps {
  suggestedActions: string[];
  onSubmitAction: (action: string) => void;
  isProcessing: boolean;
  selectedEngine?: AIProviderId;
  worldStyle?: WorldStyle;
  activeRole?: RoleSlot;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  suggestedActions,
  onSubmitAction,
  isProcessing,
  selectedEngine = 'auto',
  worldStyle,
  activeRole,
}) => {
  const [inputAction, setInputAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAction.trim() || isProcessing) return;
    onSubmitAction(inputAction.trim());
    setInputAction('');
  };

  const handleChipClick = (suggestion: string) => {
    if (isProcessing) return;
    onSubmitAction(suggestion);
  };

  const currentConfig = AI_PROVIDERS.find((p) => p.id === selectedEngine) || AI_PROVIDERS[0];
  const isDirector = activeRole?.type === 'DIRECTOR' || activeRole?.type === 'ARCHITECT';
  const isObserver = activeRole?.type === 'OBSERVER';

  const defaultPlaceholder = isDirector
    ? "Direct the world (e.g. 'Spawn sudden crisis', 'Invert faction stance', 'Plant incriminating letter')..."
    : isObserver
    ? "Ask the world simulation a question or request an omniscient retrospective..."
    : worldStyle?.interactionGrammar?.placeholder || "What do you want to do in this world?";

  return (
    <div className="sticky bottom-0 z-30 bg-[#090b12]/95 backdrop-blur-xl border-t border-white/10 px-3 sm:px-6 py-3.5">
      <div className="max-w-6xl mx-auto space-y-2.5">
        {/* Suggested Action Chips */}
        {suggestedActions && suggestedActions.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center space-x-1 shrink-0">
              {isDirector ? (
                <Wand2 className="w-3 h-3 text-purple-400" />
              ) : isObserver ? (
                <Eye className="w-3 h-3 text-emerald-400" />
              ) : (
                <Sparkles className="w-3 h-3 text-indigo-400" />
              )}
              <span>{worldStyle?.interactionGrammar?.actionTypeLabel || 'Affordances'}:</span>
            </span>
            {suggestedActions.map((suggestion, idx) => (
              <button
                key={idx}
                id={`chip-suggestion-${idx}`}
                disabled={isProcessing}
                onClick={() => handleChipClick(suggestion)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-all shrink-0 font-sans disabled:opacity-50 border ${
                  isDirector
                    ? 'bg-purple-950/30 hover:bg-purple-900/50 text-purple-200 border-purple-500/20 hover:border-purple-400/40'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Natural Language Input Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            id="interaction-input-dock"
            type="text"
            value={inputAction}
            onChange={(e) => setInputAction(e.target.value)}
            disabled={isProcessing}
            placeholder={
              isProcessing
                ? `${currentConfig.name} is resolving causality and mutating world reality...`
                : defaultPlaceholder
            }
            className={`w-full text-sm pl-4 pr-28 py-3 rounded-xl border focus:outline-none transition-all font-sans shadow-lg disabled:opacity-60 ${
              isDirector
                ? 'bg-[#140e22] text-purple-100 placeholder-purple-400/40 border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20'
                : 'bg-[#10131e] text-slate-100 placeholder-slate-500 border-white/15 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20'
            }`}
          />

          <div className="absolute right-2 flex items-center space-x-1">
            <button
              id="btn-dispatch-action"
              type="submit"
              disabled={!inputAction.trim() || isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 disabled:opacity-40 text-white ${
                isDirector
                  ? 'bg-purple-600 hover:bg-purple-500'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Simulating...</span>
                </>
              ) : (
                <>
                  <span>{isDirector ? 'Cast' : 'Dispatch'}</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
