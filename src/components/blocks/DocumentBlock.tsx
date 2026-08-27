import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { FileText, Lock, Shield, Eye, BookOpen } from 'lucide-react';
import { WorldDocument } from '../../world/types';

export const DocumentBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  const [selectedDoc, setSelectedDoc] = useState<WorldDocument | null>(world.documents[0] || null);

  return (
    <div id="block-document-view" className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'Classified Intelligence & Files'}</h3>
        </div>
        <span className="font-mono text-xs tabular-nums text-zinc-500">{world.documents.length} Archival Items</span>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Document Selector Column */}
        <div className="w-2/5 divide-y divide-zinc-100 overflow-y-auto border-r border-zinc-100">
          {world.documents.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                onClick={() => setSelectedDoc(doc)}
                className={`cursor-pointer p-3 transition-colors ${
                  isSelected ? 'border-l-2 border-l-zinc-900 bg-zinc-50 pl-2.5' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                  <Lock className="size-3" strokeWidth={1.75} />
                  <span className="truncate">{doc.classification}</span>
                </div>
                <h4 className="line-clamp-2 text-xs font-medium leading-snug text-zinc-900">{doc.title}</h4>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-zinc-400">
                  <span>{doc.date}</span>
                  <span className="max-w-[90px] truncate">{doc.author.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Document Content (Editorial Typewriter / Archival Theme) */}
        <div className="flex w-3/5 flex-col justify-between overflow-y-auto bg-zinc-50 p-5 font-mono">
          {selectedDoc ? (
            <div>
              {/* Header Stamp */}
              <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-700">
                  <span>{selectedDoc.classification}</span>
                  <span>RECORD #{selectedDoc.id.slice(-4).toUpperCase()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Origin: {selectedDoc.author}</span>
                  <span>Date: {selectedDoc.date}</span>
                </div>
              </div>

              <h4 className="mb-3 font-sans text-sm font-semibold tracking-tight text-zinc-900">
                {selectedDoc.title}
              </h4>

              <div className="whitespace-pre-wrap rounded border border-zinc-200 bg-white p-3.5 font-sans text-xs leading-relaxed text-zinc-700">
                {selectedDoc.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center font-sans text-xs text-zinc-400">
              Select a classified file to decrypt
            </div>
          )}

          {selectedDoc && onAction && (
            <div className="mt-4 flex gap-2 border-t border-zinc-200 pt-3">
              <button
                id={`doc-act-investigate-${selectedDoc.id}`}
                onClick={() => onAction(`Investigate the claims in classified document "${selectedDoc.title}" and identify the author's sources`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-900 bg-zinc-900 px-3 py-2 font-sans text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
              >
                <Eye className="size-3.5" strokeWidth={1.75} />
                <span>Verify Intel Authenticity</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
