import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { Users, User, ShieldAlert, MessageSquare, Sparkles, ChevronRight, Camera, Image as ImageIcon } from 'lucide-react';
import { Character } from '../../world/types';

export const CharacterBlock: React.FC<UIBlockProps> = ({ block, world, onAction, onOpenVisualStudio }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(world.characters[0] || null);

  return (
    <div id="block-characters-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'Characters & Cabinet'}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {onOpenVisualStudio && (
            <button
              onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar?.id })}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Portrait Studio</span>
            </button>
          )}
          <span className="text-xs font-mono text-slate-400">{world.characters.length} Key Personas</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Character List */}
        <div className="w-1/2 border-r border-white/5 overflow-y-auto divide-y divide-white/5">
          {world.characters.map((char) => {
            const isSelected = selectedChar?.id === char.id;
            const loyaltyColor = 
              char.loyalty >= 75 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
              char.loyalty >= 50 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
              'text-rose-400 bg-rose-400/10 border-rose-400/20';

            return (
              <div
                key={char.id}
                id={`char-card-${char.id}`}
                onClick={() => setSelectedChar(char)}
                className={`p-3.5 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-indigo-950/30 border-l-2 border-l-indigo-400 pl-3' 
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    {char.imageUrl || char.avatar ? (
                      <img
                        src={char.imageUrl || char.avatar}
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-indigo-500/30 shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-900/40 to-slate-800 border border-white/10 flex items-center justify-center text-slate-300 font-serif font-bold text-sm">
                        {char.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-slate-100 leading-tight">{char.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{char.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${loyaltyColor}`}>
                    {char.loyalty}%
                  </span>
                </div>

                {char.faction && (
                  <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                    <span>{char.faction}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Character Detail & Direct Interaction */}
        <div className="w-1/2 p-5 bg-[#0a0c14] overflow-y-auto flex flex-col justify-between">
          {selectedChar ? (
            <div>
              <div className="flex items-center space-x-3 pb-3 border-b border-white/5">
                {selectedChar.imageUrl || selectedChar.avatar ? (
                  <div className="relative group/avatar">
                    <img
                      src={selectedChar.imageUrl || selectedChar.avatar}
                      alt={selectedChar.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-indigo-500/40 shadow-md"
                    />
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar.id })}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white"
                        title="Regenerate Portrait"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-950 via-slate-800 to-indigo-900 border border-indigo-500/20 flex flex-col items-center justify-center text-xl font-serif text-indigo-200 relative group/avatar">
                    <span>{selectedChar.name.charAt(0)}</span>
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar.id })}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center text-[10px] text-cyan-300 font-sans"
                      >
                        <Camera className="w-3.5 h-3.5 mb-0.5" />
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-serif font-semibold text-slate-100">{selectedChar.name}</h4>
                  <p className="text-xs text-indigo-300/80">{selectedChar.role}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {selectedChar.faction && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                        {selectedChar.faction}
                      </span>
                    )}
                    {onOpenVisualStudio && (
                      <button
                        onClick={() => onOpenVisualStudio({ type: 'character', id: selectedChar.id })}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{selectedChar.imageUrl ? 'Redraw Portrait' : 'Generate Portrait'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Loyalty Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-400">Allegiance Index</span>
                  <span className="text-slate-200 font-semibold">{selectedChar.loyalty} / 100</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Current Stance</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedChar.status}</p>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Intelligence Summary</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedChar.summary}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              Select a persona to inspect dossiers
            </div>
          )}

          {selectedChar && onAction && (
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
              <button
                id={`interact-confront-${selectedChar.id}`}
                onClick={() => onAction(`Summon ${selectedChar.name} for a private audience regarding their loyalties and recent decisions`)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-200 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interrogate {selectedChar.name.split(' ')[0]}</span>
              </button>
              <button
                id={`interact-surveil-${selectedChar.id}`}
                onClick={() => onAction(`Initiate discrete surveillance on ${selectedChar.name} and audit private communications`)}
                className="w-full px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Audit Secret Communications</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
