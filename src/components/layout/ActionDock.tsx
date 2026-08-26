import React, { useState } from 'react';
import { Send, Sparkles, CornerDownLeft, Loader2 } from 'lucide-react';

interface ActionDockProps {
  suggestedActions: string[];
  onSubmitAction: (action: string) => void;
  isProcessing: boolean;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  suggestedActions,
  onSubmitAction,
  isProcessing,
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

  return (
    <div className="sticky bottom-0 z-30 bg-[#090b12]/95 backdrop-blur-xl border-t border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Suggested Action Chips */}
        {suggestedActions && suggestedActions.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center space-x-1 shrink-0">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Affordances:</span>
            </span>
            {suggestedActions.map((suggestion, idx) => (
              <button
                key={idx}
                id={`chip-suggestion-${idx}`}
                disabled={isProcessing}
                onClick={() => handleChipClick(suggestion)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-white/5 hover:border-indigo-500/30 transition-all shrink-0 font-sans disabled:opacity-50"
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
                ? 'The world is responding to your directive...'
                : 'What do you want to do? (e.g. Move the army north, or Question the Chancellor)'
            }
            className="w-full bg-[#10131e] text-slate-100 text-sm placeholder-slate-500 pl-4 pr-24 py-3 rounded-xl border border-white/15 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans shadow-lg disabled:opacity-60"
          />

          <div className="absolute right-2 flex items-center space-x-1">
            <button
              id="btn-dispatch-action"
              type="submit"
              disabled={!inputAction.trim() || isProcessing}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 text-white disabled:text-slate-500 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Evolving...</span>
                </>
              ) : (
                <>
                  <span>Dispatch</span>
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
