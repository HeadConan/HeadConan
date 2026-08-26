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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e111a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-serif font-semibold text-slate-100">
              World Chronicle & Turn History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Genesis Card */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-300 mb-1.5">
              <span>GENESIS // PREMISE</span>
              <span>Turn #1</span>
            </div>
            <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
              “{world.premise}”
            </p>
            <div className="mt-3 pt-2 border-t border-white/5 text-xs text-slate-400">
              Atmosphere: <span className="text-slate-300">{world.atmosphere}</span>
            </div>
          </div>

          {/* Subsequent turns */}
          {entries.map((entry, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">TURN #{entry.turn}</span>
                <span className="text-slate-500">{entry.timestamp}</span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                <span className="text-slate-500">Directive:</span> “{entry.action}”
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-sans bg-black/30 p-3 rounded border border-white/5">
                {entry.narrative}
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500 font-mono">
              World newly formed. Dispatch directives from the command dock below to begin recording history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
