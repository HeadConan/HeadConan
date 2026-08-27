import React, { useState } from 'react';
import { Send, Sparkles, CornerDownLeft, Loader2, Wand2, Eye } from 'lucide-react';
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

  const LeadIcon = isDirector ? Wand2 : isObserver ? Eye : Sparkles;

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-zinc-50 via-zinc-50/95 to-transparent px-3 pb-3 pt-2 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-2.5 rounded-xl border border-zinc-200 bg-white p-3 shadow-card">
        {/* Suggested Action Chips */}
        {suggestedActions && suggestedActions.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hidden">
            <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              <LeadIcon className="size-3 text-zinc-400" strokeWidth={1.75} />
              <span>{worldStyle?.interactionGrammar?.actionTypeLabel || 'Affordances'}:</span>
            </span>
            {suggestedActions.map((suggestion, idx) => (
              <button
                key={idx}
                id={`chip-suggestion-${idx}`}
                disabled={isProcessing}
                onClick={() => handleChipClick(suggestion)}
                className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-sans text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
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
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-28 text-sm font-sans text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:opacity-60"
          />

          <div className="absolute right-1.5 flex items-center">
            <button
              id="btn-dispatch-action"
              type="submit"
              disabled={!inputAction.trim() || isProcessing}
              className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-40"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span className="hidden sm:inline">Simulating...</span>
                </>
              ) : (
                <>
                  <span>{isDirector ? 'Cast' : 'Dispatch'}</span>
                  <CornerDownLeft className="size-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
