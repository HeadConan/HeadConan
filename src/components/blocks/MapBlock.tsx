import React, { useState } from 'react';
import { UIBlockProps } from '../../ui/types';
import { MapPin, Navigation, Shield, Compass, Eye, AlertCircle, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { WorldLocation } from '../../world/types';

export const MapBlock: React.FC<UIBlockProps> = ({ block, world, onAction, onOpenVisualStudio }) => {
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(
    world.locations[0] || null
  );

  return (
    <div id="block-map-view" className="relative bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'Spatial & Tactical Map'}</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          {onOpenVisualStudio && (
            <button
              onClick={() => onOpenVisualStudio({ type: 'location', id: selectedLocation?.id })}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scene Art Studio</span>
            </button>
          )}
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Sector Scan</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>{world.locations.length} Active Coordinates</span>
        </div>
      </div>

      {/* SVG Canvas and Details Overlay */}
      <div className="relative flex-1 bg-[#090b12] overflow-hidden flex">
        {/* SVG Map Area */}
        <div className="relative flex-1 h-full min-h-[340px]">
          <svg className="w-full h-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Grid pattern */}
              <pattern id="tactical-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
              </pattern>

              {/* Radial gradient background */}
              <radialGradient id="map-glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.08)" />
                <stop offset="100%" stopColor="rgba(9, 11, 18, 0)" />
              </radialGradient>
            </defs>

            {/* Background Grid & Ambient Glow */}
            <rect width="100%" height="100%" fill="url(#map-glow)" />
            <rect width="100%" height="100%" fill="url(#tactical-grid)" />

            {/* Stylized Topography / Faction Territory outlines */}
            <path
              d="M 15 20 Q 35 10 60 25 T 90 20 L 85 80 Q 55 90 30 75 Z"
              fill="rgba(255, 255, 255, 0.015)"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="0.4"
              strokeDasharray="2, 2"
            />

            {/* Connection Routes / Strategic Supply Lines */}
            {world.locations.length > 1 && (
              <g stroke="rgba(99, 102, 241, 0.25)" strokeWidth="0.6" strokeDasharray="1, 1.5">
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
                      stroke="#818cf8"
                      strokeWidth="0.6"
                      className="animate-ping opacity-75 origin-center"
                    />
                  )}

                  {/* Halo */}
                  <circle
                    cx={loc.coordinates.x}
                    cy={loc.coordinates.y}
                    r="3"
                    fill={isSelected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.05)'}
                    stroke={isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth="0.5"
                  />

                  {/* Center Dot */}
                  <circle
                    cx={loc.coordinates.x}
                    cy={loc.coordinates.y}
                    r="1.2"
                    fill={isSelected ? '#c7d2fe' : '#94a3b8'}
                  />

                  {/* Label */}
                  <text
                    x={loc.coordinates.x}
                    y={loc.coordinates.y + 4.5}
                    textAnchor="middle"
                    fill={isSelected ? '#e0e7ff' : '#64748b'}
                    fontSize="2.4"
                    fontFamily="monospace"
                    className="font-medium tracking-tight pointer-events-none select-none"
                  >
                    {loc.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Compass Rose Indicator */}
          <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded border border-white/5 flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono">
            <Navigation className="w-3 h-3 text-indigo-400" />
            <span>N 48° // E 12°</span>
          </div>
        </div>

        {/* Selected Location Inspector Panel */}
        {selectedLocation && (
          <div className="w-72 bg-[#0d101a]/95 backdrop-blur-md border-l border-white/10 p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider">Coordinates [{selectedLocation.coordinates.x}, {selectedLocation.coordinates.y}]</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">{selectedLocation.type}</span>
              </div>

              <h4 className="text-base font-serif font-semibold text-slate-100 mt-2.5 leading-snug">
                {selectedLocation.name}
              </h4>

              {selectedLocation.controllingFaction && (
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>Controlled by: <strong className="text-slate-200">{selectedLocation.controllingFaction}</strong></span>
                </div>
              )}

              <div className="mt-3 p-2.5 rounded bg-white/[0.03] border border-white/5 text-xs text-slate-300 leading-relaxed">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Telemetry Status</span>
                </div>
                {selectedLocation.status}
              </div>

              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                {selectedLocation.significance}
              </p>
            </div>

            {onAction && (
              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <button
                  id={`action-dispatch-${selectedLocation.id}`}
                  onClick={() => onAction(`Dispatch an investigative detachment to ${selectedLocation.name}`)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-200 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Survey {selectedLocation.name.split(' ')[0]}</span>
                </button>
                <button
                  id={`action-fortify-${selectedLocation.id}`}
                  onClick={() => onAction(`Establish heightened security protocol at ${selectedLocation.name}`)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-lg transition-colors"
                >
                  Reinforce Sector
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
