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
    <div id="block-notes-view" className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <StickyNote className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'Personal Reflections & Deductions'}</h3>
        </div>
        <span className="font-mono text-xs tabular-nums text-zinc-500">{world.notes?.length || 0} Memory Entries</span>
      </div>

      {/* Note Input */}
      <form onSubmit={handleAdd} className="border-b border-zinc-100 bg-zinc-50/60 p-3">
        <div className="flex gap-2">
          <input
            id="input-user-note"
            type="text"
            value={newNoteInput}
            onChange={(e) => setNewNoteInput(e.target.value)}
            placeholder="Record a suspicion, reminder, or insight..."
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
          <button
            id="btn-add-note"
            type="submit"
            disabled={!newNoteInput.trim()}
            className="flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-40"
          >
            <Plus className="size-3.5" strokeWidth={1.75} />
            <span>Record</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {world.notes && world.notes.length > 0 ? (
          world.notes.map((note) => (
            <div
              key={note.id}
              id={`user-note-${note.id}`}
              className="rounded-lg border border-amber-200/70 bg-amber-50/50 p-3 transition-colors hover:border-amber-300"
            >
              <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-amber-700">
                <span className="flex items-center gap-1">
                  <Pin className="size-3" strokeWidth={1.75} />
                  <span>{note.createdAt}</span>
                </span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-zinc-800">{note.content}</p>

              {onAction && (
                <button
                  onClick={() => onAction(`Act upon deduction: "${note.content}"`)}
                  className="mt-2 font-mono text-[10px] text-amber-700 underline decoration-amber-300 hover:text-amber-900"
                >
                  Turn deduction into active command →
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-zinc-400">
            <StickyNote className="mb-2 size-8 opacity-30 text-zinc-400" strokeWidth={1.75} />
            <p className="text-xs">No user deductions logged yet.</p>
            <p className="mt-1 max-w-xs text-[11px] text-zinc-400">
              Your notes are persistent memory anchors that influence how the world reacts to future decisions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
