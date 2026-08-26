import React, { useState, useMemo } from 'react';
import { 
  WORLD_ATLAS_ENTRIES, 
  WorldAtlasEntry, 
  MediumType, 
  PrimaryFantasyType, 
  AudienceScaleType,
  AtlasFilters,
  filterWorldAtlas
} from '../../data/worldAtlas';
import { 
  Globe, 
  Search, 
  Sparkles, 
  Compass, 
  SlidersHorizontal, 
  Layers, 
  BookOpen, 
  Tv, 
  Gamepad2, 
  Flame, 
  Landmark, 
  Brain, 
  ChevronRight, 
  X, 
  Award, 
  Activity, 
  Users, 
  Zap, 
  Target, 
  ShieldAlert, 
  ArrowUpRight,
  Filter,
  BarChart2,
  PieChart,
  Grid,
  CheckCircle2,
  Play
} from 'lucide-react';

interface WorldAtlasExplorerProps {
  onSelectPromptForWorld?: (prompt: string) => void;
  onClose?: () => void;
}

export const WorldAtlasExplorer: React.FC<WorldAtlasExplorerProps> = ({
  onSelectPromptForWorld,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'analytics'>('grid');
  const [selectedWorld, setSelectedWorld] = useState<WorldAtlasEntry | null>(null);

  const [filters, setFilters] = useState<AtlasFilters>({
    searchQuery: '',
    medium: 'ALL',
    primaryFantasy: 'ALL',
    audienceScale: 'ALL',
    minCulturalFamiliarity: 0,
    sortBy: 'overallScore'
  });

  const filteredEntries = useMemo(() => {
    return filterWorldAtlas(WORLD_ATLAS_ENTRIES, filters);
  }, [filters]);

  // Analytics derivations
  const analyticsSummary = useMemo(() => {
    const total = WORLD_ATLAS_ENTRIES.length;
    const avgFamiliarity = Math.round(WORLD_ATLAS_ENTRIES.reduce((acc, w) => acc + w.culturalFamiliarity, 0) / total);
    const avgPotential = (WORLD_ATLAS_ENTRIES.reduce((acc, w) => acc + w.headConanPotential.overallScore, 0) / total).toFixed(2);
    
    // Group by medium
    const mediumCounts: Record<string, number> = {};
    WORLD_ATLAS_ENTRIES.forEach(w => {
      mediumCounts[w.medium] = (mediumCounts[w.medium] || 0) + 1;
    });

    // Group by primary fantasy
    const fantasyCounts: Record<string, number> = {};
    WORLD_ATLAS_ENTRIES.forEach(w => {
      fantasyCounts[w.fantasyProfile.primary] = (fantasyCounts[w.fantasyProfile.primary] || 0) + 1;
    });

    // Top tier recommendations
    const topTierWorlds = [...WORLD_ATLAS_ENTRIES]
      .sort((a, b) => (b.culturalFamiliarity * b.headConanPotential.overallScore) - (a.culturalFamiliarity * a.headConanPotential.overallScore))
      .slice(0, 6);

    return { total, avgFamiliarity, avgPotential, mediumCounts, fantasyCounts, topTierWorlds };
  }, []);

  const mediumIcons: Record<MediumType, React.ReactNode> = {
    'Literature': <BookOpen className="w-3.5 h-3.5" />,
    'Cinema & TV': <Tv className="w-3.5 h-3.5" />,
    'Anime & Manga': <Flame className="w-3.5 h-3.5" />,
    'Gaming': <Gamepad2 className="w-3.5 h-3.5" />,
    'Historical & Real-World': <Landmark className="w-3.5 h-3.5" />,
    'Mythology & Folklore': <Compass className="w-3.5 h-3.5" />,
    'Philosophical & Concept': <Brain className="w-3.5 h-3.5" />
  };

  const fantasyColorBadge: Record<PrimaryFantasyType, string> = {
    'Identity': 'bg-purple-950/60 text-purple-300 border-purple-800/40',
    'Power': 'bg-amber-950/60 text-amber-300 border-amber-800/40',
    'Social': 'bg-blue-950/60 text-blue-300 border-blue-800/40',
    'Relationship': 'bg-pink-950/60 text-pink-300 border-pink-800/40',
    'Exploration': 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
    'Mystery & Knowledge': 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40',
    'Survival': 'bg-red-950/60 text-red-300 border-red-800/40',
    'Creation & System': 'bg-indigo-950/60 text-indigo-300 border-indigo-800/40',
    'Political & Intrigue': 'bg-orange-950/60 text-orange-300 border-orange-800/40',
    'Life & Path': 'bg-teal-950/60 text-teal-300 border-teal-800/40',
    'Transformation & Causality': 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-800/40'
  };

  const handleLaunchWorld = (world: WorldAtlasEntry) => {
    if (onSelectPromptForWorld) {
      const prompt = `Inhabit ${world.name} (${world.sourceOrOrigin}). Role: ${world.inhabitedExperience.primaryRoleInhabited}. Genre: ${world.genre.join(', ')}. Setting: ${world.setting}. Era: ${world.era}.`;
      onSelectPromptForWorld(prompt);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090d]/95 backdrop-blur-xl flex flex-col text-slate-100 overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#0d0e15]/80 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                HeadConan World Atlas
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Portfolio Research
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Taxonomy of Human Fantasies & Candidate Worlds for Inhabitation ({WORLD_ATLAS_ENTRIES.length} Worlds Cataloged)
            </p>
          </div>
        </div>

        {/* View Switcher & Close */}
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-black/40 p-1 border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'grid' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Atlas Grid ({filteredEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Strategic Portfolio Analytics</span>
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Sidebar */}
        <aside className="w-80 border-r border-white/10 bg-[#0a0b10]/60 p-5 overflow-y-auto flex flex-col gap-6 shrink-0">
          {/* Search Box */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              Search Atlas
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                placeholder="Name, IP, setting, role, genre..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Medium Filter */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Source Medium
              </span>
              {filters.medium !== 'ALL' && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, medium: 'ALL' }))}
                  className="text-[10px] text-indigo-400 hover:underline lowercase"
                >
                  reset
                </button>
              )}
            </label>
            <div className="flex flex-col gap-1">
              {(['ALL', 'Literature', 'Anime & Manga', 'Gaming', 'Cinema & TV', 'Historical & Real-World', 'Philosophical & Concept'] as const).map(med => (
                <button
                  key={med}
                  onClick={() => setFilters(f => ({ ...f, medium: med }))}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    filters.medium === med
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-white font-medium'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {med !== 'ALL' && mediumIcons[med as MediumType]}
                    {med}
                  </span>
                  <span className="text-[10px] font-mono opacity-60">
                    {med === 'ALL' ? WORLD_ATLAS_ENTRIES.length : analyticsSummary.mediumCounts[med] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Human Fantasy Dimension Filter */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Primary Human Fantasy
              </span>
              {filters.primaryFantasy !== 'ALL' && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, primaryFantasy: 'ALL' }))}
                  className="text-[10px] text-indigo-400 hover:underline lowercase"
                >
                  reset
                </button>
              )}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'Identity', 'Power', 'Social', 'Relationship', 'Exploration', 'Mystery & Knowledge', 'Survival', 'Creation & System', 'Political & Intrigue', 'Life & Path', 'Transformation & Causality'] as const).map(fan => (
                <button
                  key={fan}
                  onClick={() => setFilters(f => ({ ...f, primaryFantasy: fan }))}
                  className={`px-2 py-1 rounded-md text-[11px] transition-colors border ${
                    filters.primaryFantasy === fan
                      ? 'bg-indigo-600 text-white border-indigo-500 font-medium shadow-sm'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  {fan} {fan !== 'ALL' && <span className="opacity-60 text-[9px] font-mono ml-0.5">({analyticsSummary.fantasyCounts[fan] || 0})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Option */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              Sort Dimension
            </label>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as any }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="overallScore" className="bg-[#12131a]">HeadConan Suitability (High to Low)</option>
              <option value="familiarity" className="bg-[#12131a]">Cultural Familiarity (High to Low)</option>
              <option value="agency" className="bg-[#12131a]">Player Agency Degree</option>
              <option value="simulationDepth" className="bg-[#12131a]">Simulation System Depth</option>
              <option value="name" className="bg-[#12131a]">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Quick Clear */}
          <button
            onClick={() => setFilters({
              searchQuery: '',
              medium: 'ALL',
              primaryFantasy: 'ALL',
              audienceScale: 'ALL',
              minCulturalFamiliarity: 0,
              sortBy: 'overallScore'
            })}
            className="w-full py-2 px-3 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-slate-400 hover:text-slate-200 transition-colors text-center mt-auto"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Right Dynamic View Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#08090d]/40">
          {activeTab === 'grid' ? (
            <div>
              {/* Results counter and overview banner */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Showing {filteredEntries.length} Candidate Worlds
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ranked by in-session agency, cultural recognition, and systemic inhabitability.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> High Agency
                  </span>
                  <span className="flex items-center gap-1.5 ml-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span> High Feasibility
                  </span>
                </div>
              </div>

              {/* Grid of World Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredEntries.map(world => (
                  <div
                    key={world.id}
                    className="group relative bg-[#0f1017]/80 hover:bg-[#141622] border border-white/10 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20"
                  >
                    <div>
                      {/* Card Header: Medium & Scores */}
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                          {mediumIcons[world.medium]}
                          {world.medium}
                        </span>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300" title="Cultural Familiarity (0-100)">
                            Familiarity: {world.culturalFamiliarity}%
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold" title="HeadConan Potential Score">
                            ★ {world.headConanPotential.overallScore}
                          </span>
                        </div>
                      </div>

                      {/* World Name & Source */}
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight mb-1">
                        {world.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">
                        {world.sourceOrOrigin} • <span className="text-slate-500">{world.era}</span>
                      </p>

                      {/* Primary Fantasy & Genre Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${fantasyColorBadge[world.fantasyProfile.primary]}`}>
                          Fantasy: {world.fantasyProfile.primary}
                        </span>
                        {world.genre.slice(0, 2).map(g => (
                          <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Inhabited Role Box */}
                      <div className="bg-black/30 border border-white/5 rounded-lg p-2.5 mb-4">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold mb-1">
                          Inhabited Archetype Role
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {world.inhabitedExperience.primaryRoleInhabited}
                        </p>
                      </div>

                      {/* Experiential Loop Highlight */}
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        <span className="text-slate-300 font-medium">Why Inhabited:</span> {world.inhabitedExperience.whyInhabitedNotWatched}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 mt-2">
                      <button
                        onClick={() => setSelectedWorld(world)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                      >
                        Deep Profile & Grammar
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>

                      {onSelectPromptForWorld && (
                        <button
                          onClick={() => handleLaunchWorld(world)}
                          title="Launch prompt with this world"
                          className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium transition-colors flex items-center gap-1 shrink-0 shadow-sm"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Launch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredEntries.length === 0 && (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                  <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1">No candidate worlds matched criteria</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Try relaxing your search query or selecting ALL under medium and human fantasy dimensions.
                  </p>
                  <button
                    onClick={() => setFilters({
                      searchQuery: '',
                      medium: 'ALL',
                      primaryFantasy: 'ALL',
                      audienceScale: 'ALL',
                      minCulturalFamiliarity: 0,
                      sortBy: 'overallScore'
                    })}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-xs text-white hover:bg-indigo-500 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Strategic Portfolio Analytics View */
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Overview Metrics Bento */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0f1017] border border-white/10">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Total Researched Worlds</div>
                  <div className="text-3xl font-bold text-white">{analyticsSummary.total}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">Across 7 distinct medium archetypes</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1017] border border-white/10">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Avg Cultural Familiarity</div>
                  <div className="text-3xl font-bold text-indigo-300">{analyticsSummary.avgFamiliarity}%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Mental models already exist in user minds</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1017] border border-white/10">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Avg Inhabitation Score</div>
                  <div className="text-3xl font-bold text-purple-300">{analyticsSummary.avgPotential} / 5.0</div>
                  <div className="text-[11px] text-slate-400 mt-1">Generative UI & state machine compatibility</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0f1017] border border-white/10">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Human Fantasy Spectrum</div>
                  <div className="text-3xl font-bold text-amber-300">11 Types</div>
                  <div className="text-[11px] text-slate-400 mt-1">From Power to Melancholy to Bureaucracy</div>
                </div>
              </div>

              {/* Strategic Quadrant Matrix: Familiarity vs Inhabitability */}
              <div className="p-6 rounded-2xl bg-[#0f1017] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      Strategic Portfolio Quadrant Matrix
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mapping High Cultural Recognition against Systemic Inhabitability for HeadConan's MVP and Showcase roadmap.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top-Right Quadrant: Golden Launch Tier */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        Tier 1: Flagship Launch Archetypes (High Familiarity + High Inhabitability)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-3">
                      Universally understood rules where users already know what they want to do the moment they open the screen.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Hogwarts School', 'Victorian Sherlock London', 'SPY × FAMILY Berlint', 'Disco Elysium Martinaise', 'Papers, Please Border', 'Outer Wilds Solar Loop', 'The Sims Suburbia', 'Waystar Royco High-Finance'].map(name => (
                        <span key={name} className="px-2 py-1 rounded bg-indigo-900/40 border border-indigo-700/50 text-[11px] text-indigo-200">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top-Left Quadrant: Cult Deep Inhabitation */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        Tier 2: Conceptual & High-Engagement Benchmarks
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mb-3">
                      Exceptional showcase power for HeadConan's unique Generative UI and state machine capabilities.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Library of Babel', 'Steins;Gate Timelines', 'Frieren Post-Hero Fantasy', 'Mnemosyne Memory Market', 'Severance Severed Floor', 'Heian Kyoto Court'].map(name => (
                        <span key={name} className="px-2 py-1 rounded bg-cyan-900/40 border border-cyan-700/50 text-[11px] text-cyan-200">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fantasy Category Breakdown Table */}
              <div className="p-6 rounded-2xl bg-[#0f1017] border border-white/10">
                <h3 className="text-base font-bold text-white mb-3">
                  Human Fantasy Taxonomy Distribution & Core Inhabitation Hook
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase">
                        <th className="py-2.5 px-3">Human Fantasy</th>
                        <th className="py-2.5 px-3">Core Inhabitation Desire</th>
                        <th className="py-2.5 px-3">Catalog Count</th>
                        <th className="py-2.5 px-3">Prime Archetype Example</th>
                        <th className="py-2.5 px-3">Generative UI Affordance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {[
                        { name: 'Identity', hook: '"I want to become someone else"', count: analyticsSummary.fantasyCounts['Identity'] || 0, example: 'Victorian Detective / Cyberpunk Edgerunner', ui: 'Dossier, Mask, Alias Switcher' },
                        { name: 'Power', hook: '"I want extraordinary power and tactical mastery"', count: analyticsSummary.fantasyCounts['Power'] || 0, example: 'Death Note Mind Games / Mass Effect Commander', ui: 'Ability Trees, Tactical Map, Command Slate' },
                        { name: 'Social', hook: '"I want to live among fascinating peers and faculties"', count: analyticsSummary.fantasyCounts['Social'] || 0, example: 'Hogwarts / Ivy League Fellowship', ui: 'Timetables, Common Room Roster, Whispers' },
                        { name: 'Relationship', hook: '"I want to form deep bonds, romances, or intense rivalries"', count: analyticsSummary.fantasyCounts['Relationship'] || 0, example: 'SPY × FAMILY / Red Dead Camp / Hades Underworld', ui: 'Affinity Gauges, Camp Ledger, Dialogue Radar' },
                        { name: 'Exploration', hook: '"I want to discover an awe-inspiring, mysterious world"', count: analyticsSummary.fantasyCounts['Exploration'] || 0, example: 'Outer Wilds Solar Loop / Middle-earth / Pokémon', ui: 'Topographic Star Map, Botanical Log, Signalscope' },
                        { name: 'Mystery & Knowledge', hook: '"I want to solve conspiracies and hidden truths"', count: analyticsSummary.fantasyCounts['Mystery & Knowledge'] || 0, example: 'Sherlock London / Arkham Miskatonic / Severance', ui: 'Evidence Board + Red String, Clue Dossier' },
                        { name: 'Survival', hook: '"I want to endure extreme circumstances through wit and grit"', count: analyticsSummary.fantasyCounts['Survival'] || 0, example: 'Fallout Wasteland / Papers, Please / Chernobyl 1986', ui: 'Vitals & Radiation Gauge, Stamp Station, Rations' },
                        { name: 'Creation & System', hook: '"I want to build or govern an institution or enterprise"', count: analyticsSummary.fantasyCounts['Creation & System'] || 0, example: 'Silicon Valley Startup / Michelin Kitchen Brigade', ui: 'Runway Burn Rate, Expediter Rail, Cap Table' },
                        { name: 'Political & Intrigue', hook: '"I want to maneuver institutions, diplomacy, and statecraft"', count: analyticsSummary.fantasyCounts['Political & Intrigue'] || 0, example: 'Westeros Succession / Rome Senate / Waystar Royco', ui: 'Senate Vote Tally, Faction Matrix, Raven Inbox' },
                        { name: 'Life & Path', hook: '"I want to experience another version of human life"', count: analyticsSummary.fantasyCounts['Life & Path'] || 0, example: 'Stardew Valley / The Sims Suburbia / Frieren', ui: 'Seasonal Crop Calendar, Friendship Web, Clock' },
                        { name: 'Transformation & Causality', hook: '"What happens if I change a crucial choice or break a rule?"', count: analyticsSummary.fantasyCounts['Transformation & Causality'] || 0, example: 'Steins;Gate Worldlines / The Truman Show / Breaking Bad', ui: 'Divergence Meter, Broadcast Switcher, Branch Tree' },
                      ].map(row => (
                        <tr key={row.name} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-semibold text-white">{row.name}</td>
                          <td className="py-2.5 px-3 text-slate-400 italic">{row.hook}</td>
                          <td className="py-2.5 px-3 font-mono text-indigo-300 font-bold">{row.count}</td>
                          <td className="py-2.5 px-3 text-slate-200">{row.example}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{row.ui}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Deep World Dossier Modal / Drawer */}
      {selectedWorld && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#10121a] border border-white/15 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="border-b border-white/10 bg-[#141622] p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-1">
                  <span>{selectedWorld.medium}</span>
                  <span>•</span>
                  <span>{selectedWorld.setting}</span>
                  <span>•</span>
                  <span>{selectedWorld.era}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedWorld.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${fantasyColorBadge[selectedWorld.fantasyProfile.primary]}`}>
                    Primary Fantasy: {selectedWorld.fantasyProfile.primary}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    Secondary: {selectedWorld.fantasyProfile.secondary}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Familiarity: {selectedWorld.culturalFamiliarity}%
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    HeadConan Suitability: {selectedWorld.headConanPotential.overallScore}/5.0
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorld(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Inhabited Experience Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  1. Inhabited Roleplay & Experiential Loop
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                      Primary Inhabited Role
                    </div>
                    <p className="text-sm font-medium text-white">
                      {selectedWorld.inhabitedExperience.primaryRoleInhabited}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                      Alternative Role Slots (Agency Shifts)
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {selectedWorld.inhabitedExperience.alternativeRoles.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                  <div className="text-[11px] font-mono uppercase text-indigo-400 font-semibold mb-1">
                    Core Experiential Interaction Loop
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    {selectedWorld.inhabitedExperience.coreExperientialLoop}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                    Why This World Must Be Inhabited (Not Merely Read or Watched)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedWorld.inhabitedExperience.whyInhabitedNotWatched}
                  </p>
                </div>
              </div>

              {/* Generative UI & Interaction Grammar */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  2. Generative UI Archetype & Interface Grammar
                </h4>

                <div className="p-4 rounded-xl bg-[#151722] border border-white/10 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white mb-1">
                      Dedicated Interface Vocabulary
                    </div>
                    <p className="text-xs font-mono text-indigo-300">
                      {selectedWorld.inhabitedExperience.uiArchetypeSuitability}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Player Agency</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.interactionProfile.agency}/5</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Social Density</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.interactionProfile.socialDensity}/5</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Simulation Depth</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.interactionProfile.simulationDepth}/5</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-center">
                    <div className="text-[10px] font-mono text-slate-400">Replayability</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.headConanPotential.replayability}/5</div>
                  </div>
                </div>
              </div>

              {/* Strategic Research Notes */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                  3. Strategic Research & Product Insight
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
                  "{selectedWorld.notes}"
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-white/10 bg-[#141622] p-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedWorld(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
              >
                Close Dossier
              </button>

              {onSelectPromptForWorld && (
                <button
                  onClick={() => handleLaunchWorld(selectedWorld)}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Inhabited World Experience
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
