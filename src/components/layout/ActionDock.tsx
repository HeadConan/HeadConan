import React, { useState } from 'react';
import { Send, Sparkles, CornerDownLeft, Loader2, Wand2, Eye, X, MessageSquare } from 'lucide-react';
import { AIProviderId, AI_PROVIDERS } from '../../ai/client';
import { WorldStyle } from '../../style/worldStyle';
import { RoleSlot } from '../../roles/model';

interface DialogueTarget {
  id: string;
  name: string;
}

interface ActionDockProps {
  suggestedActions: string[];
  onSubmitAction: (action: string, targetId?: string) => void;
  isProcessing: boolean;
  selectedEngine?: AIProviderId;
  worldStyle?: WorldStyle;
  activeRole?: RoleSlot;
  /** W3.3：当前对话目标（conversation 场景点击角色卡片后设置） */
  dialogueTarget?: DialogueTarget | null;
  onClearDialogueTarget?: () => void;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  suggestedActions,
  onSubmitAction,
  isProcessing,
  selectedEngine = 'auto',
  worldStyle,
  activeRole,
  dialogueTarget,
  onClearDialogueTarget,
}) => {
  const [inputAction, setInputAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAction.trim() || isProcessing) return;
    onSubmitAction(inputAction.trim(), dialogueTarget?.id);
    setInputAction('');
  };

  const handleChipClick = (suggestion: string) => {
    if (isProcessing) return;
    onSubmitAction(suggestion, dialogueTarget?.id);
  };

  const currentConfig = AI_PROVIDERS.find((p) => p.id === selectedEngine) || AI_PROVIDERS[0];
  const isDirector = activeRole?.type === 'DIRECTOR' || activeRole?.type === 'ARCHITECT';
  const isObserver = activeRole?.type === 'OBSERVER';

  const defaultPlaceholder = dialogueTarget
    ? `对 ${dialogueTarget.name} 说……`
    : isDirector
    ? "把约尔的秘密透露给洛德，或输入「让洛德知道钢笔是窃听器」..."
    : isObserver
    ? "Ask the world simulation a question or request an omniscient retrospective..."
    : worldStyle?.interactionGrammar?.placeholder || "What do you want to do in this world?";

  const LeadIcon = isDirector ? Wand2 : isObserver ? Eye : Sparkles;

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-zinc-50 via-zinc-50/95 to-transparent px-3 pb-3 pt-2 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-2.5 rounded-xl border border-zinc-200 bg-white p-3 shadow-card">
        {/* W3.3: 对话目标指示（conversation 场景点击角色卡片后出现） */}
        {dialogueTarget && (
          <div className="flex items-center justify-between rounded-lg border border-zinc-900/20 bg-zinc-900 px-3 py-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-100">
              <MessageSquare className="size-3" strokeWidth={1.75} />
              正在对 <span className="font-semibold">{dialogueTarget.name}</span> 说话——输入将定向该角色
            </span>
            <button
              id="btn-clear-dialogue-target"
              onClick={onClearDialogueTarget}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
            >
              <X className="size-3" strokeWidth={1.75} />
              <span>取消定向</span>
            </button>
          </div>
        )}

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
