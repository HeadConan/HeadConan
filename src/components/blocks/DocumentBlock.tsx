import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { FileText, Lock, Shield, Eye, BookOpen } from 'lucide-react';
import { WorldDocument } from '../../world/types';

export const DocumentBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  const [selectedDoc, setSelectedDoc] = useState<WorldDocument | null>(world.documents[0] || null);

  return (
    <div id="block-document-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'Classified Intelligence & Files'}</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">{world.documents.length} Archival Items</span>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Selector Column */}
        <div className="w-2/5 border-r border-white/5 overflow-y-auto divide-y divide-white/5">
          {world.documents.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-amber-950/20 border-l-2 border-l-amber-400 pl-2.5' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-amber-400/90 mb-1">
                  <Lock className="w-3 h-3" />
                  <span className="truncate">{doc.classification}</span>
                </div>
                <h4 className="text-xs font-medium text-slate-100 line-clamp-2 leading-snug">{doc.title}</h4>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{doc.date}</span>
                  <span className="truncate max-w-[90px]">{doc.author.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Document Content (Editorial Typewriter / Archival Theme) */}
        <div className="w-3/5 p-5 bg-[#080a11] overflow-y-auto flex flex-col justify-between font-mono">
          {selectedDoc ? (
            <div>
              {/* Header Stamp */}
              <div className="p-3 bg-amber-500/[0.04] border border-amber-500/20 rounded-lg mb-4">
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold tracking-widest uppercase">
                  <span>{selectedDoc.classification}</span>
                  <span>RECORD #{selectedDoc.id.slice(-4).toUpperCase()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Origin: {selectedDoc.author}</span>
                  <span>Date: {selectedDoc.date}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-200 mb-3 font-sans tracking-tight">
                {selectedDoc.title}
              </h4>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-white/[0.015] p-3.5 rounded border border-white/5">
                {selectedDoc.content}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 font-sans">
              Select a classified file to decrypt
            </div>
          )}

          {selectedDoc && onAction && (
            <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
              <button
                id={`doc-act-investigate-${selectedDoc.id}`}
                onClick={() => onAction(`Investigate the claims in classified document "${selectedDoc.title}" and identify the author's sources`)}
                className="flex-1 px-3 py-2 text-xs font-medium text-amber-200 bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/30 rounded-lg transition-colors font-sans flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify Intel Authenticity</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
