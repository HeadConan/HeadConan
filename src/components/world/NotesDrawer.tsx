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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e111a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <StickyNote className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-serif font-semibold text-slate-100">
              Deductive Memory & Scratchpad
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleAdd} className="p-4 border-b border-white/5 bg-white/[0.01]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="e.g. I don't trust the Chancellor..."
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              autoFocus
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Record</span>
            </button>
          </div>
        </form>

        {/* List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400/80">
                  <span className="flex items-center space-x-1">
                    <Pin className="w-3 h-3" />
                    <span>{note.createdAt}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{note.content}</p>

                {onActionFromNote && (
                  <button
                    onClick={() => {
                      onActionFromNote(`Act upon recorded deduction: "${note.content}"`);
                      onClose();
                    }}
                    className="text-[11px] font-mono text-amber-300 hover:text-amber-200 underline decoration-amber-500/30 block pt-1"
                  >
                    Translate into active action →
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-slate-500 font-mono">
              No deductions recorded. Use this scratchpad to track suspicions, goals, and secret observations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
