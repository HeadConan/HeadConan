import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { MapPin, Navigation, Shield, Compass, Eye, AlertCircle, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { WorldLocation } from '../../world/types';

export const MapBlock: React.FC<UIBlockProps> = ({ block, world, onAction, onOpenVisualStudio }) => {
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(
    world.locations[0] || null
  );

  return (
    <div id="block-map-view" className="relative flex h-[520px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'Spatial & Tactical Map'}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          {onOpenVisualStudio && (
            <button
              onClick={() => onOpenVisualStudio({ type: 'location', id: selectedLocation?.id })}
              className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <Camera className="size-3.5" strokeWidth={1.75} />
              <span>Scene Art Studio</span>
            </button>
          )}
          <span className="flex items-center gap-1">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500"></span>
            <span>Live Sector Scan</span>
          </span>
          <span className="text-zinc-300">|</span>
          <span className="tabular-nums">{world.locations.length} Active Coordinates</span>
        </div>
      </div>

      {/* SVG Canvas and Details Overlay */}
      <div className="relative flex flex-1 overflow-hidden bg-zinc-50">
        {/* SVG Map Area */}
        <div className="relative h-full min-h-[340px] flex-1">
          <svg className="h-full w-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Grid pattern */}
              <pattern id="tactical-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(24, 24, 27, 0.06)" strokeWidth="0.5" />
              </pattern>

              {/* Radial gradient background */}
              <radialGradient id="map-glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.06)" />
                <stop offset="100%" stopColor="rgba(244, 244, 245, 0)" />
              </radialGradient>
            </defs>

            {/* Background Grid & Ambient Glow */}
            <rect width="100%" height="100%" fill="url(#map-glow)" />
            <rect width="100%" height="100%" fill="url(#tactical-grid)" />

            {/* Stylized Topography / Faction Territory outlines */}
            <path
              d="M 15 20 Q 35 10 60 25 T 90 20 L 85 80 Q 55 90 30 75 Z"
              fill="rgba(24, 24, 27, 0.02)"
              stroke="rgba(24, 24, 27, 0.1)"
              strokeWidth="0.4"
              strokeDasharray="2, 2"
            />

            {/* Connection Routes / Strategic Supply Lines */}
            {world.locations.length > 1 && (
              <g stroke="rgba(99, 102, 241, 0.35)" strokeWidth="0.6" strokeDasharray="1, 1.5">
                {world.locations.map((loc, i) => {
                  if (i === 0) return null;
                  const prev = world.locations[0];
                  return (
                    <line
                      key={`route-${i}`}
                      x1={prev.coordinates.x}
                      y1={prev.coordinates.y}
                      x2={loc.coordinates.x}
                      y2={loc.coordinates.y}
                    />
                  );
                })}
              </g>
            )}

            {/* Interactive Location Nodes */}
            {world.locations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <g
                  key={loc.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedLocation(loc)}
                >
                  {/* Outer pulse when selected */}
                  {isSelected && (
                    <circle
                      cx={loc.coordinates.x}
                      cy={loc.coordinates.y}
                      r="4.5"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="0.6"
                      className="origin-center animate-ping opacity-75"
                    />
                  )}

                  {/* Halo */}
                  <circle
                    cx={loc.coordinates.x}
                    cy={loc.coordinates.y}
                    r="3"
                    fill={isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(24, 24, 27, 0.04)'}
                    stroke={isSelected ? '#4f46e5' : 'rgba(24, 24, 27, 0.25)'}
                    strokeWidth="0.5"
                  />

                  {/* Center Dot */}
                  <circle
                    cx={loc.coordinates.x}
                    cy={loc.coordinates.y}
                    r="1.2"
                    fill={isSelected ? '#4338ca' : '#71717a'}
                  />

                  {/* Label */}
                  <text
                    x={loc.coordinates.x}
                    y={loc.coordinates.y + 4.5}
                    textAnchor="middle"
                    fill={isSelected ? '#3730a3' : '#71717a'}
                    fontSize="2.4"
                    fontFamily="monospace"
                    className="pointer-events-none select-none font-medium tracking-tight"
                  >
                    {loc.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Compass Rose Indicator */}
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white/90 p-2 font-mono text-[10px] text-zinc-500 backdrop-blur">
            <Navigation className="size-3 text-indigo-600" strokeWidth={1.75} />
            <span>N 48° // E 12°</span>
          </div>
        </div>

        {/* Selected Location Inspector Panel */}
        {selectedLocation && (
          <div className="flex w-72 flex-col justify-between overflow-y-auto border-l border-zinc-200 bg-white p-4">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-700">Coordinates [{selectedLocation.coordinates.x}, {selectedLocation.coordinates.y}]</span>
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-600">{selectedLocation.type}</span>
              </div>

              <h4 className="mt-2.5 font-serif text-base font-semibold leading-snug text-zinc-900">
                {selectedLocation.name}
              </h4>

              {selectedLocation.controllingFaction && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Shield className="size-3.5 text-amber-600" strokeWidth={1.75} />
                  <span>Controlled by: <strong className="text-zinc-800">{selectedLocation.controllingFaction}</strong></span>
                </div>
              )}

              <div className="mt-3 rounded border border-zinc-100 bg-zinc-50 p-2.5 text-xs leading-relaxed text-zinc-700">
                <div className="mb-1 flex items-center gap-1 font-mono text-[10px] uppercase text-zinc-500">
                  <AlertCircle className="size-3 text-amber-600" strokeWidth={1.75} />
                  <span>Telemetry Status</span>
                </div>
                {selectedLocation.status}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                {selectedLocation.significance}
              </p>
            </div>

            {onAction && (
              <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
                <button
                  id={`action-dispatch-${selectedLocation.id}`}
                  onClick={() => onAction(`前往${selectedLocation.name}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
                >
                  <Eye className="size-3.5" strokeWidth={1.75} />
                  <span>前往{selectedLocation.name}</span>
                </button>
                <button
                  id={`action-fortify-${selectedLocation.id}`}
                  disabled
                  title="W3 即将支持"
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-400"
                >
                  Reinforce Sector
                  <span className="rounded border border-zinc-300 bg-zinc-100 px-1 py-0.5 font-mono text-[9px] uppercase text-zinc-500">W3</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
