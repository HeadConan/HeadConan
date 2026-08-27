import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Image as ImageIcon,
  User,
  MapPin,
  Search,
  Zap,
  Download,
  Check,
  RefreshCw,
  Sliders,
  Maximize2,
  Trash2,
  Layers,
  ArrowRight,
  Eye,
  Camera,
  Moon,
  Compass,
  Palette,
  Radio,
  FileText
} from 'lucide-react';
import { WorldState, Character, WorldLocation, ClueItem, WorldEvent } from '../../world/types';
import {
  ImageService,
  AspectRatio,
  ImageStylePreset,
  STYLE_PRESETS,
  GeneratedImageRecord,
} from '../../ai/imageService';

interface VisualSynthesisStudioProps {
  world: WorldState;
  isOpen: boolean;
  onClose: () => void;
  onUpdateWorldEntity?: (entityType: 'character' | 'location' | 'evidence' | 'event', entityId: string, imageUrl: string) => void;
  initialTarget?: {
    type: 'character' | 'location' | 'evidence' | 'event' | 'freeform';
    id?: string;
  };
}

export const VisualSynthesisStudio: React.FC<VisualSynthesisStudioProps> = ({
  world,
  isOpen,
  onClose,
  onUpdateWorldEntity,
  initialTarget,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  const [targetType, setTargetType] = useState<'character' | 'location' | 'evidence' | 'event' | 'freeform'>(
    initialTarget?.type || 'character'
  );
  const [selectedEntityId, setSelectedEntityId] = useState<string>(initialTarget?.id || '');
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [stylePreset, setStylePreset] = useState<ImageStylePreset>('cinematic-concept');
  const [modelQuality, setModelQuality] = useState<'gemini-3.1-flash-lite-image' | 'gemini-3.1-flash-image'>(
    'gemini-3.1-flash-lite-image'
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<GeneratedImageRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GeneratedImageRecord[]>([]);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  // Load gallery on mount & tab change
  useEffect(() => {
    setGallery(ImageService.getGallery());
  }, [isOpen, activeTab]);

  // Set initial target entity if passed
  useEffect(() => {
    if (initialTarget?.type) {
      setTargetType(initialTarget.type);
      if (initialTarget.id) {
        setSelectedEntityId(initialTarget.id);
      }
    }
  }, [initialTarget]);

  // Sync prompt when entity selection changes
  useEffect(() => {
    if (targetType === 'character') {
      const char = world.characters?.find(c => c.id === selectedEntityId) || world.characters?.[0];
      if (char) {
        if (!selectedEntityId) setSelectedEntityId(char.id);
        setPrompt(ImageService.buildCharacterPrompt(char, world));
        setAspectRatio('1:1');
      }
    } else if (targetType === 'location') {
      const loc = world.locations?.find(l => l.id === selectedEntityId) || world.locations?.[0];
      if (loc) {
        if (!selectedEntityId) setSelectedEntityId(loc.id);
        setPrompt(ImageService.buildLocationPrompt(loc, world));
        setAspectRatio('16:9');
      }
    } else if (targetType === 'evidence') {
      const clue = world.clues?.find(c => c.id === selectedEntityId) || world.clues?.[0];
      if (clue) {
        if (!selectedEntityId) setSelectedEntityId(clue.id);
        setPrompt(ImageService.buildEvidencePrompt(clue, world));
        setStylePreset('forensic-photo');
        setAspectRatio('4:3');
      }
    } else if (targetType === 'event') {
      const evt = world.events?.find(e => e.id === selectedEntityId) || world.events?.[0];
      if (evt) {
        if (!selectedEntityId) setSelectedEntityId(evt.id);
        setPrompt(ImageService.buildEventPrompt(evt, world));
        setAspectRatio('16:9');
      }
    } else if (targetType === 'freeform' && !prompt) {
      setPrompt(`Panoramic keyframe scene set in ${world.name}. Atmosphere: ${world.atmosphere}. High atmospheric fidelity.`);
    }
  }, [targetType, selectedEntityId, world]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter or construct a prompt first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    let entityTitle = '';
    if (targetType === 'character') {
      entityTitle = world.characters?.find(c => c.id === selectedEntityId)?.name || 'Character Portrait';
    } else if (targetType === 'location') {
      entityTitle = world.locations?.find(l => l.id === selectedEntityId)?.name || 'Tactical Sector';
    } else if (targetType === 'evidence') {
      entityTitle = world.clues?.find(c => c.id === selectedEntityId)?.title || 'Forensic Exhibit';
    } else if (targetType === 'event') {
      entityTitle = world.events?.find(e => e.id === selectedEntityId)?.title || 'Chronicle Event';
    }

    try {
      const record = await ImageService.generate({
        prompt: prompt.trim(),
        aspectRatio,
        stylePreset,
        entityType: targetType,
        entityId: selectedEntityId || undefined,
        entityTitle,
        worldContext: {
          name: world.name,
          genre: world.genre,
          atmosphere: world.atmosphere,
          premise: world.premise,
        },
        model: modelQuality,
      });

      setCurrentResult(record);
      setGallery(ImageService.getGallery());

      // Auto-bind to entity if targeted
      if (onUpdateWorldEntity && targetType !== 'freeform' && selectedEntityId) {
        onUpdateWorldEntity(targetType, selectedEntityId, record.imageUrl);
        setAppliedToast(`Applied visual asset directly to ${entityTitle}!`);
        setTimeout(() => setAppliedToast(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Image synthesis failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToEntity = (record: GeneratedImageRecord) => {
    if (!onUpdateWorldEntity) return;

    if (record.entityType !== 'freeform' && record.entityId) {
      onUpdateWorldEntity(record.entityType, record.entityId, record.imageUrl);
      setAppliedToast(`Bound image to ${record.entityTitle || record.entityType}!`);
      setTimeout(() => setAppliedToast(null), 3000);
    } else if (targetType !== 'freeform' && selectedEntityId) {
      onUpdateWorldEntity(targetType, selectedEntityId, record.imageUrl);
      setAppliedToast(`Bound image to current active entity!`);
      setTimeout(() => setAppliedToast(null), 3000);
    }
  };

  const handleDownload = (imageUrl: string, filename = 'headconan-synth.png') => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEnhancePrompt = () => {
    const atmosphere = world.atmosphere ? `immersed in ${world.atmosphere}` : '';
    const genre = world.genre ? `universe of ${world.genre}` : '';
    setPrompt(prev => `${prev.trim()}, ${genre}, ${atmosphere}, 8k UHD resolution, volumetric volumetric lighting, rich composition, dynamic highlights and shadows`);
  };

  return (
    <div id="visual-synthesis-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <ImageIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-wide text-white">Visual Synthesis Studio</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI & Procedural Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate high-fidelity portraits, tactical maps, forensic exhibits & concept illustrations grounded in <span className="text-slate-200 font-medium">"{world.name}"</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab switch */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'create'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesis Deck</span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Gallery Bank ({gallery.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {appliedToast && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs px-6 py-2 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{appliedToast}</span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'create' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Target & Prompt Configuration (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Target Entity Type Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    1. Target Entity Binding
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { type: 'character', label: 'Character', icon: User },
                      { type: 'location', label: 'Sector Map', icon: MapPin },
                      { type: 'evidence', label: 'Exhibit', icon: Search },
                      { type: 'event', label: 'Event', icon: Zap },
                      { type: 'freeform', label: 'Freeform', icon: Sparkles },
                    ].map(item => {
                      const Icon = item.icon;
                      const isSelected = targetType === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setTargetType(item.type as any)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20'
                              : 'bg-slate-850/60 border-slate-750 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className="text-xs font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Specific Entity Selector (if not freeform) */}
                {targetType !== 'freeform' && (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Select {targetType === 'character' ? 'Character' : targetType === 'location' ? 'Outpost / Sector' : targetType === 'evidence' ? 'Evidence Clue' : 'Timeline Event'}
                    </label>
                    <select
                      value={selectedEntityId}
                      onChange={(e) => setSelectedEntityId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
                    >
                      {targetType === 'character' &&
                        world.characters?.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.role} ({c.faction || 'Neutral'})
                          </option>
                        ))}
                      {targetType === 'location' &&
                        world.locations?.map(l => (
                          <option key={l.id} value={l.id}>
                            {l.name} — {l.type}
                          </option>
                        ))}
                      {targetType === 'evidence' &&
                        world.clues?.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.title} [{c.category.toUpperCase()}]
                          </option>
                        ))}
                      {targetType === 'event' &&
                        world.events?.map(e => (
                          <option key={e.id} value={e.id}>
                            {e.title} ({e.urgency.toUpperCase()})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* 3. Prompt Canvas & World Enhancer */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      2. Visual Synthesis Prompt
                    </label>
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>✨ Enhance with World Atmosphere</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe characters, environments, lighting, textures, camera angle..."
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed font-sans placeholder-slate-500"
                  />
                </div>

                {/* 4. Style Preset Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    3. Aesthetic & Style Preset
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STYLE_PRESETS.map(preset => {
                      const isSelected = stylePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setStylePreset(preset.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-sm'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold truncate text-slate-200">{preset.label}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                            {preset.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Aspect Ratio & Model Quality */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      4. Aspect Ratio
                    </label>
                    <div className="flex space-x-1.5">
                      {(['1:1', '16:9', '4:3', '3:4', '9:16'] as AspectRatio[]).map(ratio => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`flex-1 py-2 text-xs font-mono rounded-lg border text-center transition-all ${
                            aspectRatio === ratio
                              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      5. Model Tier
                    </label>
                    <select
                      value={modelQuality}
                      onChange={(e) => setModelQuality(e.target.value as any)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="gemini-3.1-flash-lite-image">Gemini 3.1 Flash Lite Image (Fast, Standard)</option>
                      <option value="gemini-3.1-flash-image">Gemini 3.1 Flash Image (High Fidelity 1K/2K)</option>
                    </select>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Synthesis Trigger Button */}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2 transition-all shadow-lg ${
                    isGenerating
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 active:scale-[0.99]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Synthesizing Visual Asset from Latent Continuum...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Visual Asset</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Live Result & Target Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Synthesis Output
                        </h3>
                      </div>
                      {currentResult && (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          {currentResult.isAiGenerated ? 'Gemini Generative Art' : 'Procedural Vector Asset'}
                        </span>
                      )}
                    </div>

                    {/* Image Render Canvas */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group">
                      {isGenerating ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                            <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-200">Sampling Diffusion Field...</p>
                            <p className="text-[10px] text-slate-400">Grounding composition in {world.genre}</p>
                          </div>
                        </div>
                      ) : currentResult ? (
                        <>
                          <img
                            src={currentResult.imageUrl}
                            alt={currentResult.entityTitle || 'Generated Visual'}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setZoomImage(currentResult.imageUrl)}
                              className="p-2 rounded-lg bg-slate-900/90 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors shadow-lg"
                              title="Inspect Full Resolution"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(currentResult.imageUrl, `${currentResult.entityTitle || 'headconan'}.png`)}
                              className="p-2 rounded-lg bg-slate-900/90 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors shadow-lg"
                              title="Download Asset"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
                          <ImageIcon className="w-12 h-12 stroke-[1.2] text-slate-600" />
                          <p className="text-xs">No image synthesized yet in this session.</p>
                          <p className="text-[10px] text-slate-600 max-w-xs">
                            Select an entity or enter custom prompt on the left, then click Generate.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions for Generated Result */}
                    {currentResult && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between text-slate-400">
                            <span>Entity:</span>
                            <span className="font-semibold text-slate-200">{currentResult.entityTitle || targetType}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Style:</span>
                            <span className="text-cyan-400 font-mono">{currentResult.stylePreset}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Aspect Ratio:</span>
                            <span className="font-mono text-slate-200">{currentResult.aspectRatio}</span>
                          </div>
                        </div>

                        {onUpdateWorldEntity && (
                          <button
                            type="button"
                            onClick={() => handleApplyToEntity(currentResult)}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-900/30"
                          >
                            <Check className="w-4 h-4" />
                            <span>Apply Image to World State</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Generated assets are saved automatically</span>
                    <span>{gallery.length} in Gallery</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Gallery Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Visual Asset History Bank</h3>
                  <p className="text-xs text-slate-400">
                    Browse, inspect, download, or rebind previously synthesized imagery to any world entity.
                  </p>
                </div>
              </div>

              {gallery.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-3">
                  <Layers className="w-12 h-12 mx-auto stroke-[1.2] text-slate-600" />
                  <p className="text-sm">The visual gallery is currently empty.</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                  >
                    Synthesize First Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map(item => (
                    <div
                      key={item.id}
                      className="group relative bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden flex flex-col hover:border-cyan-500/60 transition-all shadow-md"
                    >
                      <div className="aspect-square relative overflow-hidden bg-slate-900">
                        <img
                          src={item.imageUrl}
                          alt={item.entityTitle || 'Gallery asset'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 p-2">
                          <button
                            onClick={() => setZoomImage(item.imageUrl)}
                            className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                            title="Inspect"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownload(item.imageUrl, `${item.entityTitle || 'asset'}.png`)}
                            className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              ImageService.deleteFromGallery(item.id);
                              setGallery(ImageService.getGallery());
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 flex flex-col justify-between flex-1 space-y-2">
                        <div>
                          <div className="text-xs font-bold text-slate-200 truncate">
                            {item.entityTitle || item.entityType}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {item.rawPrompt}
                          </div>
                        </div>

                        {onUpdateWorldEntity && (
                          <button
                            type="button"
                            onClick={() => handleApplyToEntity(item)}
                            className="w-full py-1 text-[10px] font-bold rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-slate-700 transition-colors"
                          >
                            Bind to Entity
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Full Image Zoom Modal */}
        {zoomImage && (
          <div
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setZoomImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setZoomImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-cyan-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={zoomImage}
                alt="Full resolution inspection"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] rounded-xl border border-slate-700 shadow-2xl object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
