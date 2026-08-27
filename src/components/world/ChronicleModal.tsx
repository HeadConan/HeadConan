import React from 'react';
import { X, History, Sparkles, AlertCircle } from 'lucide-react';
import { WorldState } from '../../world/types';

interface ChronicleEntry {
  turn: number;
  action: string;
  narrative: string;
  timestamp: string;
}

interface ChronicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: ChronicleEntry[];
  world: WorldState;
}

export const ChronicleModal: React.FC<ChronicleModalProps> = ({
  isOpen,
  onClose,
  entries,
  world,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <History className="size-5 text-zinc-700" strokeWidth={1.75} />
            <h3 className="font-serif text-base font-semibold text-zinc-900">
              World Chronicle & Turn History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Narrative stream */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Genesis Card */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-1.5 flex items-center justify-between font-mono text-xs text-zinc-600">
              <span>GENESIS // PREMISE</span>
              <span>Turn #1</span>
            </div>
            <p className="font-serif text-sm italic leading-relaxed text-zinc-800">
              “{world.premise}”
            </p>
            <div className="mt-3 border-t border-zinc-200 pt-2 text-xs text-zinc-500">
              Atmosphere: <span className="text-zinc-700">{world.atmosphere}</span>
            </div>
          </div>

          {/* Subsequent turns */}
          {entries.map((entry, idx) => (
            <div key={idx} className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-zinc-900">TURN #{entry.turn}</span>
                <span className="text-zinc-400">{entry.timestamp}</span>
              </div>

              <div className="font-mono text-xs text-zinc-500">
                <span className="text-zinc-400">Directive:</span> “{entry.action}”
              </div>

              <div className="rounded border border-zinc-100 bg-zinc-50 p-3 font-sans text-xs leading-relaxed text-zinc-700">
                {entry.narrative}
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="py-8 text-center font-mono text-xs text-zinc-400">
              World newly formed. Dispatch directives from the command dock below to begin recording history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
