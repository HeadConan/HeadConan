import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { StickyNote, Plus, Trash2, Pin, Sparkles } from 'lucide-react';

export const NoteBlock: React.FC<UIBlockProps> = ({ block, world, onAddNote, onAction }) => {
  const [newNoteInput, setNewNoteInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim() || !onAddNote) return;
    onAddNote(newNoteInput.trim());
    setNewNoteInput('');
  };

  return (
    <div id="block-notes-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-4 h-4 text-amber-300" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'Personal Reflections & Deductions'}</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{world.notes?.length || 0} Memory Entries</span>
      </div>

      {/* Note Input */}
      <form onSubmit={handleAdd} className="p-3 border-b border-white/5 bg-white/[0.01]">
        <div className="flex gap-2">
          <input
            id="input-user-note"
            type="text"
            value={newNoteInput}
            onChange={(e) => setNewNoteInput(e.target.value)}
            placeholder="Record a suspicion, reminder, or insight..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
          />
          <button
            id="btn-add-note"
            type="submit"
            disabled={!newNoteInput.trim()}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {world.notes && world.notes.length > 0 ? (
          world.notes.map((note) => (
            <div
              key={note.id}
              id={`user-note-${note.id}`}
              className="p-3 rounded-lg bg-amber-500/[0.03] border border-amber-500/15 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/80 mb-1">
                <span className="flex items-center space-x-1">
                  <Pin className="w-3 h-3" />
                  <span>{note.createdAt}</span>
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{note.content}</p>

              {onAction && (
                <button
                  onClick={() => onAction(`Act upon deduction: "${note.content}"`)}
                  className="mt-2 text-[10px] font-mono text-amber-300/80 hover:text-amber-200 underline decoration-amber-500/30"
                >
                  Turn deduction into active command →
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <StickyNote className="w-8 h-8 mb-2 opacity-30 text-amber-400" />
            <p className="text-xs">No user deductions logged yet.</p>
            <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
              Your notes are persistent memory anchors that influence how the world reacts to future decisions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
