import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { Users, User, ShieldAlert, MessageSquare, Sparkles, ChevronRight, Camera, Image as ImageIcon } from 'lucide-react';
import { Character } from '../../world/types';

/** 提取中文短名（"约尔·福杰（Yor Forger）" → "约尔"），供真实解析指令使用 */
function shortName(fullName: string): string {
  return fullName.split('（')[0].split('·')[0];
}

export const CharacterBlock: React.FC<UIBlockProps> = ({ block, world, onAction, onOpenVisualStudio, onSelectTarget, selectedTargetId }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(world.characters[0] || null);

  return (
    <div id="block-characters-view" className="flex h-[520px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'Characters & Cabinet'}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onOpenVisualStudio && (
            <button
              onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar?.id })}
              className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <Camera className="size-3.5" strokeWidth={1.75} />
              <span>Portrait Studio</span>
            </button>
          )}
          <span className="font-mono text-xs tabular-nums text-zinc-500">{world.characters.length} Key Personas</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Character List */}
        <div className="w-1/2 divide-y divide-zinc-100 overflow-y-auto border-r border-zinc-100">
          {world.characters.map((char) => {
            const isSelected = selectedChar?.id === char.id;
            const isTarget = selectedTargetId === char.id;
            const loyaltyColor =
              char.loyalty >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
              char.loyalty >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' :
              'text-rose-700 bg-rose-50 border-rose-200';

            return (
              <div
                key={char.id}
                id={`char-card-${char.id}`}
                onClick={() => {
                  setSelectedChar(char);
                  onSelectTarget?.(char.id);
                }}
                className={`cursor-pointer p-3.5 transition-all ${
                  isSelected
                    ? 'border-l-2 border-l-zinc-900 bg-zinc-50 pl-3'
                    : 'hover:bg-zinc-50'
                } ${isTarget ? 'bg-zinc-50 ring-1 ring-inset ring-zinc-900/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    {char.imageUrl || char.avatar ? (
                      <img
                        src={char.imageUrl || char.avatar}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="size-8 rounded-lg border border-zinc-200 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 font-serif text-sm font-bold text-zinc-600">
                        {char.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium leading-tight text-zinc-900">{char.name}</h4>
                      <p className="mt-0.5 text-[11px] text-zinc-500">{char.role}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {isTarget && (
                      <span className="rounded border border-zinc-900 bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-50">
                        对话目标
                      </span>
                    )}
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] tabular-nums ${loyaltyColor}`}>
                      {char.loyalty}%
                    </span>
                  </div>
                </div>

                {char.faction && (
                  <div className="mt-2 flex items-center font-mono text-[10px] text-zinc-400">
                    <span>{char.faction}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Character Detail & Direct Interaction */}
        <div className="flex w-1/2 flex-col justify-between overflow-y-auto bg-zinc-50/60 p-5">
          {selectedChar ? (
            <div>
              <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                {selectedChar.imageUrl || selectedChar.avatar ? (
                  <div className="group/avatar relative">
                    <img
                      src={selectedChar.imageUrl || selectedChar.avatar}
                      alt={selectedChar.name}
                      referrerPolicy="no-referrer"
                      className="size-14 rounded-xl border border-zinc-200 object-cover shadow-md"
                    />
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar.id })}
                        className="absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-900/60 text-white opacity-0 transition-opacity group-hover/avatar:opacity-100"
                        title="Regenerate Portrait"
                      >
                        <Sparkles className="size-4 text-zinc-100" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="group/avatar relative flex size-14 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 font-serif text-xl text-zinc-600">
                    <span>{selectedChar.name.charAt(0)}</span>
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar.id })}
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-zinc-900/70 font-sans text-[10px] text-zinc-100 opacity-0 transition-opacity group-hover/avatar:opacity-100"
                      >
                        <Camera className="mb-0.5 size-3.5" strokeWidth={1.75} />
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-base font-semibold text-zinc-900">{selectedChar.name}</h4>
                  <p className="text-xs text-zinc-500">{selectedChar.role}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedChar.faction && (
                      <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                        {selectedChar.faction}
                      </span>
                    )}
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar.id })}
                        className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-900"
                      >
                        <Sparkles className="size-3" strokeWidth={1.75} />
                        <span>{selectedChar.imageUrl ? 'Redraw Portrait' : 'Generate Portrait'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Loyalty Bar */}
              <div className="mt-4">
                <div className="mb-1 flex justify-between font-mono text-xs">
                  <span className="text-zinc-500">Allegiance Index</span>
                  <span className="font-semibold tabular-nums text-zinc-900">{selectedChar.loyalty} / 100</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedChar.loyalty >= 75 ? 'bg-emerald-500' :
                      selectedChar.loyalty >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${selectedChar.loyalty}%` }}
                  />
                </div>
              </div>

              {/* Status & Motives */}
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-zinc-100 bg-white p-3">
                  <div className="mb-1 font-mono text-[10px] uppercase text-zinc-500">Current Stance</div>
                  <p className="text-xs leading-relaxed text-zinc-700">{selectedChar.status}</p>
                </div>

                <div className="rounded-lg border border-zinc-100 bg-white p-3">
                  <div className="mb-1 font-mono text-[10px] uppercase text-zinc-500">Intelligence Summary</div>
                  <p className="text-xs leading-relaxed text-zinc-500">{selectedChar.summary}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-zinc-400">
              Select a persona to inspect dossiers
            </div>
          )}

          {selectedChar && onAction && (
            <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
              {selectedTargetId === selectedChar.id && (
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  <MessageSquare className="size-3" strokeWidth={1.75} />
                  <span>正在对 {shortName(selectedChar.name)} 说话——输入框已定向该角色</span>
                </div>
              )}
              <button
                id={`interact-confront-${selectedChar.id}`}
                onClick={() => onAction(`问${shortName(selectedChar.name)}：你最近在忙什么？`)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
              >
                <MessageSquare className="size-3.5" strokeWidth={1.75} />
                <span>问{shortName(selectedChar.name)}：你最近在忙什么？</span>
              </button>
              <button
                id={`interact-surveil-${selectedChar.id}`}
                disabled
                title="W3 即将支持"
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-400"
              >
                <ShieldAlert className="size-3.5 text-zinc-400" strokeWidth={1.75} />
                <span>Audit Secret Communications</span>
                <span className="rounded border border-zinc-300 bg-zinc-100 px-1 py-0.5 font-mono text-[9px] uppercase text-zinc-500">W3</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
