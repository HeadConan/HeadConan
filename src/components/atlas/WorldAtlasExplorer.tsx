import React, { useState, useMemo } from 'react';
import { 
  WORLD_ATLAS_ENTRIES, 
  WorldAtlasEntry, 
  MediumType, 
  PrimaryFantasyType, 
  AudienceScaleType,
  WorldCategoryType,
  RightsStatusType,
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
  Play,
  ShieldCheck,
  Star,
  Compass as CompassIcon,
  Scale
} from 'lucide-react';

interface WorldAtlasExplorerProps {
  onSelectPromptForWorld?: (prompt: string) => void;
  onClose?: () => void;
}

export const WorldAtlasExplorer: React.FC<WorldAtlasExplorerProps> = ({
  onSelectPromptForWorld,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'analytics' | 'benchmarks'>('grid');
  const [selectedWorld, setSelectedWorld] = useState<WorldAtlasEntry | null>(null);

  const [filters, setFilters] = useState<AtlasFilters>({
    searchQuery: '',
    category: 'ALL',
    rightsStatus: 'ALL',
    medium: 'ALL',
    primaryFantasy: 'ALL',
    audienceScale: 'ALL',
    goldenOnly: false,
    benchmarkOnly: false,
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
    
    // Group by category
    const categoryCounts: Record<string, number> = {
      'Fictional IP': 0,
      'Historical World': 0,
      'Real-World / Life World': 0,
      'Original Archetype': 0
    };
    WORLD_ATLAS_ENTRIES.forEach(w => {
      const cat = w.worldCategory || (
        w.medium === 'Historical & Real-World' ? 'Historical World' :
        w.medium === 'Philosophical & Concept' ? 'Original Archetype' : 'Fictional IP'
      );
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

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

    // Group by rights
    const rightsCounts: Record<string, number> = {
      'public_domain': 0,
      'historical_real_world': 0,
      'original_archetype': 0,
      'licensed_required': 0,
      'unclear': 0
    };
    WORLD_ATLAS_ENTRIES.forEach(w => {
      const r = w.rightsStatus || (
        w.medium === 'Historical & Real-World' ? 'historical_real_world' :
        w.medium === 'Philosophical & Concept' ? 'original_archetype' : 'licensed_required'
      );
      rightsCounts[r] = (rightsCounts[r] || 0) + 1;
    });

    const goldenCount = 12;
    const benchmarkCount = 4;

    return { total, avgFamiliarity, avgPotential, categoryCounts, mediumCounts, fantasyCounts, rightsCounts, goldenCount, benchmarkCount };
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
    'Identity': 'bg-purple-50 text-purple-700 border-purple-800/40',
    'Power': 'bg-amber-50 text-amber-700 border-amber-800/40',
    'Social': 'bg-blue-50 text-blue-700 border-blue-800/40',
    'Relationship': 'bg-pink-950/60 text-pink-300 border-pink-800/40',
    'Exploration': 'bg-emerald-50 text-emerald-700 border-emerald-800/40',
    'Mystery & Knowledge': 'bg-cyan-50 text-cyan-700 border-cyan-800/40',
    'Survival': 'bg-red-950/60 text-red-300 border-red-800/40',
    'Creation & System': 'bg-indigo-50 text-indigo-600 border-indigo-800/40',
    'Political & Intrigue': 'bg-orange-950/60 text-orange-300 border-orange-800/40',
    'Life & Path': 'bg-teal-950/60 text-teal-300 border-teal-800/40',
    'Transformation & Causality': 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-800/40'
  };

  const getRightsBadge = (rights?: RightsStatusType, medium?: MediumType) => {
    const effectiveRights = rights || (
      medium === 'Historical & Real-World' ? 'historical_real_world' :
      medium === 'Philosophical & Concept' ? 'original_archetype' : 'licensed_required'
    );

    switch (effectiveRights) {
      case 'public_domain':
        return <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Public Domain</span>;
      case 'historical_real_world':
        return <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Historical (Free)</span>;
      case 'original_archetype':
        return <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Proprietary</span>;
      case 'licensed_required':
        return <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Commercial IP</span>;
      default:
        return <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-300/20 text-zinc-500 border border-zinc-300/30">Unclear</span>;
    }
  };

  const isGoldenWorld = (id: string) => {
    return [
      'atlas-spy-family', 'atlas-hogwarts', 'atlas-sherlock', 'atlas-got',
      'atlas-cyberpunk-edge', 'atlas-outer-wilds', 'atlas-ancient-rome',
      'atlas-heian-kyoto', 'atlas-elite-university', 'atlas-silicon-valley-1999',
      'atlas-disco-elysium', 'atlas-papers-please'
    ].includes(id);
  };

  const getBenchmarkInfo = (id: string) => {
    switch (id) {
      case 'atlas-spy-family':
        return { type: 'SOCIAL', label: 'Benchmark A (Social World)', hypothesis: 'Tests Multi-Agent Asymmetric Knowledge & Conversational Subtext/Camouflage without breaking epistemic isolation.' };
      case 'atlas-got':
        return { type: 'POLITICAL', label: 'Benchmark B (Political World)', hypothesis: 'Tests 5+ Faction Power Balance, Asymmetric Leverage & Cascading Unintended Macro Consequences.' };
      case 'atlas-outer-wilds':
        return { type: 'EXPLORATION', label: 'Benchmark C (Exploration World)', hypothesis: 'Tests Spatial Discovery, Ontological Physical Rules & Epistemic Player Curiosity in a Time Loop.' };
      case 'atlas-sherlock':
        return { type: 'MYSTERY', label: 'Benchmark D (Mystery World)', hypothesis: 'Tests Sealed Immutable Ground Truth, Incomplete Clue Distribution & Deductive Graph Inference.' };
      default:
        return null;
    }
  };

  const handleLaunchWorld = (world: WorldAtlasEntry) => {
    if (onSelectPromptForWorld) {
      const prompt = `Inhabit ${world.name} (${world.sourceOrOrigin}). Role: ${world.inhabitedExperience.primaryRoleInhabited}. Genre: ${world.genre.join(', ')}. Setting: ${world.setting}. Era: ${world.era}.`;
      onSelectPromptForWorld(prompt);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-100 backdrop-blur-xl flex flex-col text-zinc-900 overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-200 text-indigo-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                HeadConan World Atlas
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-900/20 text-indigo-600 border border-indigo-200">
                  Research Specification v0
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-500">
              Taxonomy of Human Fantasies & Candidate Worlds for Inhabitation ({WORLD_ATLAS_ENTRIES.length} Cataloged)
            </p>
          </div>
        </div>

        {/* View Switcher & Close */}
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-zinc-100 p-1 border border-zinc-200 text-xs font-medium">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'grid' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Atlas Grid ({filteredEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'benchmarks' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>4 Benchmarks</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Strategic Analytics</span>
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-100 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Sidebar */}
        <aside className="w-80 border-r border-zinc-200 bg-zinc-50 p-5 overflow-y-auto flex flex-col gap-5 shrink-0">
          {/* Search Box */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              Search Atlas
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
                placeholder="Name, IP, setting, role, genre..."
                className="w-full bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-200 focus:ring-1 focus:ring-indigo-500/50"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters(f => ({ ...f, searchQuery: '' }))}
                  className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Golden & Benchmark Quick Toggles */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-700" />
              Curated Shortlists
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFilters(f => ({ ...f, goldenOnly: !f.goldenOnly }))}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  filters.goldenOnly 
                    ? 'bg-amber-50 border-amber-200 text-amber-700' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                }`}
              >
                <Star className="w-3 h-3 text-amber-700" />
                <span>12 Golden</span>
              </button>

              <button
                onClick={() => setFilters(f => ({ ...f, benchmarkOnly: !f.benchmarkOnly }))}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                  filters.benchmarkOnly 
                    ? 'bg-zinc-900/20 border-indigo-200 text-indigo-600' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                }`}
              >
                <Target className="w-3 h-3 text-indigo-600" />
                <span>4 Benchmarks</span>
              </button>
            </div>
          </div>

          {/* World Category Filter */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                World Category
              </span>
              {filters.category !== 'ALL' && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, category: 'ALL' }))}
                  className="text-[10px] text-indigo-600 hover:underline lowercase"
                >
                  reset
                </button>
              )}
            </label>
            <div className="flex flex-col gap-1">
              {(['ALL', 'Fictional IP', 'Historical World', 'Real-World / Life World', 'Original Archetype'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters(f => ({ ...f, category: cat }))}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    filters.category === cat
                      ? 'bg-zinc-900/30 border border-indigo-200 text-white font-medium'
                      : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] font-mono opacity-60">
                    {cat === 'ALL' ? WORLD_ATLAS_ENTRIES.length : analyticsSummary.categoryCounts[cat] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rights Status Filter */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Legal / Rights Status
              </span>
              {filters.rightsStatus !== 'ALL' && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, rightsStatus: 'ALL' }))}
                  className="text-[10px] text-indigo-600 hover:underline lowercase"
                >
                  reset
                </button>
              )}
            </label>
            <div className="flex flex-wrap gap-1">
              {(['ALL', 'public_domain', 'historical_real_world', 'original_archetype', 'licensed_required'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setFilters(f => ({ ...f, rightsStatus: r }))}
                  className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors ${
                    filters.rightsStatus === r
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                      : 'bg-zinc-100 border-zinc-100 text-zinc-500 hover:bg-zinc-100'
                  }`}
                >
                  {r === 'ALL' ? 'ALL RIGHTS' : r.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Medium Filter */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Source Medium
              </span>
              {filters.medium !== 'ALL' && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, medium: 'ALL' }))}
                  className="text-[10px] text-indigo-600 hover:underline lowercase"
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
                      ? 'bg-zinc-900/30 border border-indigo-200 text-white font-medium'
                      : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
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
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Primary Human Fantasy
              </span>
              {filters.primaryFantasy !== 'ALL' && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, primaryFantasy: 'ALL' }))}
                  className="text-[10px] text-indigo-600 hover:underline lowercase"
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
                      ? 'bg-zinc-900 text-white border-indigo-200 font-medium shadow-sm'
                      : 'bg-zinc-100 border-zinc-100 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                  }`}
                >
                  {fan} {fan !== 'ALL' && <span className="opacity-60 text-[9px] font-mono ml-0.5">({analyticsSummary.fantasyCounts[fan] || 0})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Option */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              Sort Dimension
            </label>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as any }))}
              className="w-full bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-indigo-200"
            >
              <option value="overallScore" className="bg-white">HeadConan Suitability (High to Low)</option>
              <option value="familiarity" className="bg-white">Cultural Familiarity (High to Low)</option>
              <option value="agency" className="bg-white">Player Agency Degree</option>
              <option value="simulationDepth" className="bg-white">Simulation System Depth</option>
              <option value="name" className="bg-white">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Quick Clear */}
          <button
            onClick={() => setFilters({
              searchQuery: '',
              category: 'ALL',
              rightsStatus: 'ALL',
              medium: 'ALL',
              primaryFantasy: 'ALL',
              audienceScale: 'ALL',
              goldenOnly: false,
              benchmarkOnly: false,
              minCulturalFamiliarity: 0,
              sortBy: 'overallScore'
            })}
            className="w-full py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs text-zinc-500 hover:text-zinc-800 transition-colors text-center mt-auto"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Right Dynamic View Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {activeTab === 'grid' && (
            <div>
              {/* Results counter and overview banner */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Showing {filteredEntries.length} Candidate Worlds
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Systematic catalog covering Fictional IPs, Historical Eras, Real-World Systems & Original Archetypes.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-zinc-500 font-mono">
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
                {filteredEntries.map(world => {
                  const isGolden = isGoldenWorld(world.id);
                  const benchmark = getBenchmarkInfo(world.id);

                  return (
                    <div
                      key={world.id}
                      className="group relative bg-white/80 hover:bg-white border border-zinc-200 hover:border-indigo-200 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20"
                    >
                      <div>
                        {/* Card Header: Medium & Badges */}
                        <div className="flex items-center justify-between mb-3 text-xs">
                          <span className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                            {mediumIcons[world.medium]}
                            {world.medium}
                          </span>

                          <div className="flex items-center space-x-1.5">
                            {getRightsBadge(world.rightsStatus, world.medium)}
                            {isGolden && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-700" /> Golden
                              </span>
                            )}
                          </div>
                        </div>

                        {benchmark && (
                          <div className="mb-2 px-2 py-1 rounded bg-indigo-50 border border-indigo-200 text-[10px] font-mono text-indigo-600 flex items-center gap-1.5">
                            <Target className="w-3 h-3 text-indigo-600 shrink-0" />
                            <span className="font-bold">{benchmark.label}</span>
                          </div>
                        )}

                        {/* World Name & Source */}
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-600 transition-colors leading-tight mb-1">
                          {world.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mb-3">
                          {world.sourceOrOrigin} • <span className="text-zinc-500">{world.era}</span>
                        </p>

                        {/* Primary Fantasy & Genre Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${fantasyColorBadge[world.fantasyProfile.primary]}`}>
                            Fantasy: {world.fantasyProfile.primary}
                          </span>
                          {world.genre.slice(0, 2).map(g => (
                            <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-100">
                              {g}
                            </span>
                          ))}
                        </div>

                        {/* Inhabited Role Box */}
                        <div className="bg-zinc-100 border border-zinc-100 rounded-lg p-2.5 mb-4">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-semibold mb-1">
                            Inhabited Archetype Role
                          </div>
                          <p className="text-xs text-zinc-700 line-clamp-2">
                            {world.inhabitedExperience.primaryRoleInhabited}
                          </p>
                        </div>

                        {/* UI Archetype Preview */}
                        <div className="text-[11px] text-zinc-500 mb-4 bg-zinc-100 p-2 rounded border border-zinc-100">
                          <span className="text-indigo-600 font-mono">UI Grammar: </span>
                          <span className="text-zinc-700">{world.inhabitedExperience.uiArchetypeSuitability}</span>
                        </div>
                      </div>

                      {/* Card Footer: Metrics & Action */}
                      <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-[11px] font-mono text-zinc-500">
                          <div>
                            <span className="text-zinc-500">Agency: </span>
                            <span className="text-white font-bold">{world.interactionProfile.agency}/5</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Sim: </span>
                            <span className="text-white font-bold">{world.interactionProfile.simulationDepth}/5</span>
                          </div>
                          <div>
                            <span className="text-zinc-500">Score: </span>
                            <span className="text-indigo-600 font-bold">★ {world.headConanPotential.overallScore}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedWorld(world)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-100 text-xs text-zinc-800 transition-colors"
                          >
                            Dossier
                          </button>
                          {onSelectPromptForWorld && (
                            <button
                              onClick={() => handleLaunchWorld(world)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-900 text-white transition-colors"
                              title="Inhabit World Now"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="border-b border-zinc-200 pb-4">
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  The 4 Benchmark Worlds & Testing Hypotheses
                </h2>
                <p className="text-xs text-zinc-500">
                  Four rigorous stress-tests evaluating fundamental capabilities of HeadConan's generative world runtime.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benchmark A */}
                <div className="p-6 rounded-xl bg-white border border-indigo-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      Benchmark A: Social World
                    </span>
                    <span className="text-xs font-mono text-zinc-500">SPY × FAMILY</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Multi-Agent Concealment & Social Camouflage</h3>
                  <p className="text-xs text-zinc-700 leading-relaxed font-mono bg-zinc-100 p-3 rounded-lg border border-zinc-100">
                    "Hypothesis: HeadConan can generate an emotionally compelling, high-tension social world where characters maintain secret agendas, interpret user actions through private biases, and react dynamically without breaking epistemic isolation."
                  </p>
                  <div className="text-xs text-zinc-500 space-y-1.5">
                    <div className="font-semibold text-zinc-800">Core Affordances:</div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-500">
                      <li>Cover Suspicion Meter (0–100%)</li>
                      <li>Public vs. Covert Operative Dual Dossier</li>
                      <li>Dinner Table Dialogue Subtext Radar</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      const entry = WORLD_ATLAS_ENTRIES.find(w => w.id === 'atlas-spy-family');
                      if (entry) setSelectedWorld(entry);
                    }}
                    className="w-full py-2 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 border border-indigo-200 text-xs font-medium text-indigo-700 transition-colors"
                  >
                    View Full SPY × FAMILY Dossier
                  </button>
                </div>

                {/* Benchmark B */}
                <div className="p-6 rounded-xl bg-white border border-orange-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                      Benchmark B: Political World
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Game of Thrones</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Multi-Faction Statecraft & Cascading Consequences</h3>
                  <p className="text-xs text-zinc-700 leading-relaxed font-mono bg-zinc-100 p-3 rounded-lg border border-zinc-100">
                    "Hypothesis: HeadConan can maintain a persistent political simulation where macro decrees alter multi-faction power balances, economic resources, and military stances, producing emergent diplomatic crises rather than scripted dead-ends."
                  </p>
                  <div className="text-xs text-zinc-500 space-y-1.5">
                    <div className="font-semibold text-zinc-800">Core Affordances:</div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-500">
                      <li>Westeros Realm SVG Map & Army Tokens</li>
                      <li>Raven Scroll Inbox & Decryption Table</li>
                      <li>Grain Stockpile & Treasury Cash Ledger</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      const entry = WORLD_ATLAS_ENTRIES.find(w => w.id === 'atlas-got');
                      if (entry) setSelectedWorld(entry);
                    }}
                    className="w-full py-2 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-xs font-medium text-orange-200 transition-colors"
                  >
                    View Full Game of Thrones Dossier
                  </button>
                </div>

                {/* Benchmark C */}
                <div className="p-6 rounded-xl bg-white border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Benchmark C: Exploration World
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Outer Wilds</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Spatial Wonder, Physics & Epistemic Progression</h3>
                  <p className="text-xs text-zinc-700 leading-relaxed font-mono bg-zinc-100 p-3 rounded-lg border border-zinc-100">
                    "Hypothesis: HeadConan can simulate a geographically and physically coherent world where environmental rules remain constant, exploration is driven by curiosity, and discovered lore directly unlocks physical puzzles."
                  </p>
                  <div className="text-xs text-zinc-500 space-y-1.5">
                    <div className="font-semibold text-zinc-800">Core Affordances:</div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-500">
                      <li>Planetary Orbital Vector Radar</li>
                      <li>Interactive Ship Log Knowledge-Web</li>
                      <li>Signalscope Frequency Tuner</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      const entry = WORLD_ATLAS_ENTRIES.find(w => w.id === 'atlas-outer-wilds');
                      if (entry) setSelectedWorld(entry);
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-medium text-emerald-200 transition-colors"
                  >
                    View Full Outer Wilds Dossier
                  </button>
                </div>

                {/* Benchmark D */}
                <div className="p-6 rounded-xl bg-white border border-cyan-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                      Benchmark D: Mystery World
                    </span>
                    <span className="text-xs font-mono text-zinc-500">Victorian Sherlock</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Forensic Deduction & Incomplete Information</h3>
                  <p className="text-xs text-zinc-700 leading-relaxed font-mono bg-zinc-100 p-3 rounded-lg border border-zinc-100">
                    "Hypothesis: HeadConan can maintain a sealed ground truth for complex mysteries, allowing users to discover clues incrementally, connect evidence nodes on an interactive pinboard, and deduce perpetrators through valid inference."
                  </p>
                  <div className="text-xs text-zinc-500 space-y-1.5">
                    <div className="font-semibold text-zinc-800">Core Affordances:</div>
                    <ul className="list-disc list-inside space-y-1 text-zinc-500">
                      <li>Forensic Evidence Pinboard with Yarn Links</li>
                      <li>Witness Alibi Consistency Matrix</li>
                      <li>Victorian London Gazette Dispatch</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      const entry = WORLD_ATLAS_ENTRIES.find(w => w.id === 'atlas-sherlock');
                      if (entry) setSelectedWorld(entry);
                    }}
                    className="w-full py-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-xs font-medium text-cyan-800 transition-colors"
                  >
                    View Full Victorian Sherlock Dossier
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="border-b border-zinc-200 pb-4">
                <h2 className="text-xl font-bold text-white mb-1">
                  Strategic Portfolio Analytics & Research Insights
                </h2>
                <p className="text-xs text-zinc-500">
                  Quantitative mapping of the 72 candidate worlds across categories, legal rights, and human fantasy archetypes.
                </p>
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-zinc-200">
                  <div className="text-xs font-mono text-zinc-500 mb-1">Total Cataloged</div>
                  <div className="text-2xl font-bold text-white">{analyticsSummary.total} Worlds</div>
                  <div className="text-[10px] text-zinc-500 mt-1">4 Distinct Categories</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-zinc-200">
                  <div className="text-xs font-mono text-zinc-500 mb-1">Golden Launch Set</div>
                  <div className="text-2xl font-bold text-amber-700">{analyticsSummary.goldenCount} Worlds</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Max Diversity Shortlist</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-zinc-200">
                  <div className="text-xs font-mono text-zinc-500 mb-1">Benchmark Suite</div>
                  <div className="text-2xl font-bold text-indigo-600">{analyticsSummary.benchmarkCount} Worlds</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Runtime Stress Tests</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-zinc-200">
                  <div className="text-xs font-mono text-zinc-500 mb-1">Zero-License Core</div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {(analyticsSummary.rightsCounts['public_domain'] || 0) + (analyticsSummary.rightsCounts['historical_real_world'] || 0) + (analyticsSummary.rightsCounts['original_archetype'] || 0)} Worlds
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Public Domain + History + Original</div>
                </div>
              </div>

              {/* 4 Pillars Category Breakdown */}
              <div className="p-6 rounded-xl bg-white border border-zinc-200">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  The 4 Foundational World Pillars
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analyticsSummary.categoryCounts).map(([cat, count]) => (
                    <div key={cat} className="p-3 rounded-lg bg-zinc-100 border border-zinc-100">
                      <div className="text-xs font-semibold text-zinc-800 mb-1">{cat}</div>
                      <div className="text-xl font-bold text-indigo-600">{count}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        {Math.round((count / analyticsSummary.total) * 100)}% of candidate portfolio
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Rights Portfolio Breakdown */}
              <div className="p-6 rounded-xl bg-white border border-zinc-200">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Legal & Platform Licensing Distribution
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100">
                    <div className="text-xs font-semibold text-emerald-700 mb-1">Public Domain</div>
                    <div className="text-xl font-bold text-white">{analyticsSummary.rightsCounts['public_domain'] || 0}</div>
                    <div className="text-[10px] text-zinc-500">Zero-royalty literature & myth</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100">
                    <div className="text-xs font-semibold text-blue-700 mb-1">Historical Facts</div>
                    <div className="text-xl font-bold text-white">{analyticsSummary.rightsCounts['historical_real_world'] || 0}</div>
                    <div className="text-[10px] text-zinc-500">Uncopyrightable human history</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100">
                    <div className="text-xs font-semibold text-purple-700 mb-1">Original Archetypes</div>
                    <div className="text-xl font-bold text-white">{analyticsSummary.rightsCounts['original_archetype'] || 0}</div>
                    <div className="text-[10px] text-zinc-500">100% proprietary HeadConan IP</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100">
                    <div className="text-xs font-semibold text-amber-700 mb-1">Commercial IP</div>
                    <div className="text-xl font-bold text-white">{analyticsSummary.rightsCounts['licensed_required'] || 0}</div>
                    <div className="text-[10px] text-zinc-500">Prompt sandbox / UGC</div>
                  </div>
                </div>
              </div>

              {/* Fantasy Distribution Bar */}
              <div className="p-6 rounded-xl bg-white border border-zinc-200">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  The 11-Dimensional Human Fantasy Distribution
                </h3>
                <div className="space-y-2">
                  {Object.entries(analyticsSummary.fantasyCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([fan, count]) => {
                      const percent = Math.round((count / analyticsSummary.total) * 100);
                      return (
                        <div key={fan} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-700">{fan}</span>
                            <span className="font-mono text-zinc-500">{count} ({percent}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-zinc-900 rounded-full" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* World Detail Dossier Modal */}
      {selectedWorld && (
        <div className="fixed inset-0 z-60 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-200 bg-white flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs text-indigo-600 font-mono mb-1">
                  <span>{selectedWorld.sourceOrOrigin}</span>
                  <span>•</span>
                  <span>{selectedWorld.era}</span>
                  <span>•</span>
                  {getRightsBadge(selectedWorld.rightsStatus, selectedWorld.medium)}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedWorld.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${fantasyColorBadge[selectedWorld.fantasyProfile.primary]}`}>
                    Primary Fantasy: {selectedWorld.fantasyProfile.primary}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                    Secondary: {selectedWorld.fantasyProfile.secondary}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-900/20 text-indigo-600 border border-indigo-200">
                    Familiarity: {selectedWorld.culturalFamiliarity}%
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    HeadConan Score: {selectedWorld.headConanPotential.overallScore}/5.0
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorld(null)}
                className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-100 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Benchmark Banner if applicable */}
              {getBenchmarkInfo(selectedWorld.id) && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <div className="text-xs font-mono uppercase text-indigo-600 font-bold flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-600" />
                    {getBenchmarkInfo(selectedWorld.id)?.label}
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed font-mono">
                    {getBenchmarkInfo(selectedWorld.id)?.hypothesis}
                  </p>
                </div>
              )}

              {/* Inhabited Experience Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold">
                  1. Inhabited Roleplay & Experiential Loop
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200">
                    <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold mb-1">
                      Primary Inhabited Role
                    </div>
                    <p className="text-sm font-medium text-white">
                      {selectedWorld.inhabitedExperience.primaryRoleInhabited}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200">
                    <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold mb-1">
                      Alternative Role Slots (Agency Shifts)
                    </div>
                    <ul className="text-xs text-zinc-700 space-y-1">
                      {selectedWorld.inhabitedExperience.alternativeRoles.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="text-[11px] font-mono uppercase text-indigo-600 font-semibold mb-1">
                    Core Experiential Interaction Loop
                  </div>
                  <p className="text-xs text-zinc-800 leading-relaxed font-mono">
                    {selectedWorld.inhabitedExperience.coreExperientialLoop}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200">
                  <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold mb-1">
                    Why This World Must Be Inhabited (Not Merely Read or Watched)
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {selectedWorld.inhabitedExperience.whyInhabitedNotWatched}
                  </p>
                </div>
              </div>

              {/* Generative UI & Interaction Grammar */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-bold">
                  2. Generative UI Archetype & Interface Grammar
                </h4>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-zinc-900/20 text-indigo-600 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white mb-1">
                      Dedicated Interface Vocabulary
                    </div>
                    <p className="text-xs font-mono text-indigo-600">
                      {selectedWorld.inhabitedExperience.uiArchetypeSuitability}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">Player Agency</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.interactionProfile.agency}/5</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">Social Density</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.interactionProfile.socialDensity}/5</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">Simulation Depth</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.interactionProfile.simulationDepth}/5</div>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-100 border border-zinc-100 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">Replayability</div>
                    <div className="text-lg font-bold text-white">{selectedWorld.headConanPotential.replayability}/5</div>
                  </div>
                </div>
              </div>

              {/* Strategic Research Notes */}
              <div className="pt-4 border-t border-zinc-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">
                  3. Strategic Research & Product Insight
                </h4>
                <p className="text-xs text-zinc-700 leading-relaxed italic bg-zinc-100 p-3 rounded-lg border border-zinc-100">
                  "{selectedWorld.notes}"
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-zinc-200 bg-white p-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedWorld(null)}
                className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-100 text-xs text-zinc-700 hover:text-white transition-colors"
              >
                Close Dossier
              </button>

              {onSelectPromptForWorld && (
                <button
                  onClick={() => handleLaunchWorld(selectedWorld)}
                  className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-900 text-xs font-semibold text-white transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
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
