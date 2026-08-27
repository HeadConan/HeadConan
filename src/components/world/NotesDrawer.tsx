import React, { useState } from 'react';
import { X, StickyNote, Plus, Trash2, Pin } from 'lucide-react';
import { UserNote } from '../../world/types';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: UserNote[];
  onAddNote: (content: string) => void;
  onActionFromNote?: (noteContent: string) => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onActionFromNote,
}) => {
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <StickyNote className="size-5 text-amber-600" strokeWidth={1.75} />
            <h3 className="font-serif text-base font-semibold text-zinc-900">
              Deductive Memory & Scratchpad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleAdd} className="border-b border-zinc-100 bg-zinc-50/60 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. I don't trust the Chancellor..."
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-40"
            >
              <Plus className="size-4" strokeWidth={1.75} />
              <span>Record</span>
            </button>
          </div>
        </form>

        {/* List */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="space-y-2 rounded-xl border border-amber-200/70 bg-amber-50/50 p-3.5"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-amber-700">
                  <span className="flex items-center gap-1">
                    <Pin className="size-3" strokeWidth={1.75} />
                    <span>{note.createdAt}</span>
                  </span>
                </div>
                <p className="font-sans text-xs leading-relaxed text-zinc-800">{note.content}</p>

                {onActionFromNote && (
                  <button
                    onClick={() => {
                      onActionFromNote(`Act upon recorded deduction: "${note.content}"`);
                      onClose();
                    }}
                    className="block pt-1 font-mono text-[11px] text-amber-700 underline decoration-amber-300 hover:text-amber-900"
                  >
                    Translate into active action →
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-10 text-center font-mono text-xs text-zinc-400">
              No deductions recorded. Use this scratchpad to track suspicions, goals, and secret observations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
