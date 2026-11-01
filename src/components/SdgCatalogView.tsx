import React, { useState } from 'react';
import { ResearchPaper } from '../types/repository';
import { UN_SDG_GOALS, SDGGoal } from '../data/sdgTaxonomy';
import { storageService } from '../services/storageService';
import { 
  Globe2, 
  Search, 
  ArrowRight, 
  Bell, 
  Check, 
  BookOpen, 
  TrendingUp, 
  Award,
  Layers
} from 'lucide-react';

interface SdgCatalogViewProps {
  papers: ResearchPaper[];
  onSelectSdg: (sdgId: number) => void;
  onRefreshAlerts: () => void;
  onOpenNotifications: () => void;
}

export const SdgCatalogView: React.FC<SdgCatalogViewProps> = ({
  papers,
  onSelectSdg,
  onRefreshAlerts,
  onOpenNotifications
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGoalFilter, setActiveGoalFilter] = useState<number | null>(null);
  const [subscriptionToast, setSubscriptionToast] = useState<string | null>(null);

  // Compute paper count per SDG
  const sdgCounts: Record<number, number> = {};
  for (const paper of papers) {
    if (paper.sdgs) {
      for (const sdgId of paper.sdgs) {
        sdgCounts[sdgId] = (sdgCounts[sdgId] || 0) + 1;
      }
    }
  }

  const totalSdgsCovered = Object.keys(sdgCounts).length;
  const totalPapersWithSdg = papers.filter(p => p.sdgs && p.sdgs.length > 0).length;

  const handleSubscribeSdg = (goal: SDGGoal) => {
    const sub = {
      id: `sub-sdg-${goal.id}-${Date.now()}`,
      name: `UN ${goal.code}: ${goal.shortTitle} Alert`,
      keywords: goal.relevantKeywords.slice(0, 3),
      departments: [],
      onlyPublishedJournals: false,
      createdDate: new Date().toISOString().split('T')[0],
      active: true
    };
    storageService.saveSubscription(sub);
    onRefreshAlerts();
    setSubscriptionToast(`Subscribed to automated alerts for ${goal.code}: ${goal.name}!`);
    setTimeout(() => setSubscriptionToast(null), 3000);
  };

  const filteredGoals = UN_SDG_GOALS.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.relevantKeywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Globe2 className="w-4 h-4" />
            <span>United Nations 2030 Sustainability Agenda</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Cataloguing by Sustainable Development Goals (SDGs)
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Explore college research mapped to the 17 UN Sustainable Development Goals. Track which institutional papers advance clean energy, healthcare access, climate action, clean water, and technological innovation.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SDGs (e.g. Energy, Climate)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-slate-50 focus:bg-white focus:outline-blue-600"
          />
        </div>
      </div>

      {/* Subscription Toast Feedback */}
      {subscriptionToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{subscriptionToast}</span>
          </div>
          <button
            onClick={onOpenNotifications}
            className="text-xs font-bold underline hover:text-emerald-900 cursor-pointer"
          >
            Manage Alert Subscriptions →
          </button>
        </div>
      )}

      {/* SDG Summary KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <span className="text-xs text-slate-500">SDGs Actively Addressed</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
            {totalSdgsCovered} <span className="text-xs font-normal text-slate-500">of 17 Goals</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Sustainability Aligned Papers</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {totalPapersWithSdg} <span className="text-xs font-normal text-slate-500">college papers</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Top Addressed Goal</span>
          <div className="text-sm font-bold text-slate-900 truncate mt-1">
            SDG 9: Industry & Innovation
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Institutional Impact</span>
          <div className="text-sm font-bold text-blue-700 mt-1">
            Global Impact Verified
          </div>
        </div>
      </div>

      {/* 17 SDG Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map((goal) => {
          const count = sdgCounts[goal.id] || 0;
          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                {/* Header with SDG Badge and Paper Count */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg text-white font-black text-xs flex items-center justify-center font-mono shadow-xs shrink-0"
                      style={{ backgroundColor: goal.color }}
                    >
                      {goal.id}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {goal.code}: {goal.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {goal.shortTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold shrink-0">
                    {count} {count === 1 ? 'paper' : 'papers'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {goal.description}
                </p>

                {/* Associated Taxonomy Keywords */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {goal.relevantKeywords.slice(0, 3).map((kw) => (
                    <span 
                      key={kw} 
                      className="text-[10px] bg-slate-50 border border-slate-200/80 text-slate-600 px-1.5 py-0.2 rounded"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleSubscribeSdg(goal)}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-700 transition-colors cursor-pointer py-1"
                  title={`Subscribe to alerts when new research matching ${goal.code} is uploaded`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Track Goal</span>
                </button>

                <button
                  onClick={() => onSelectSdg(goal.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                  style={{ backgroundColor: goal.color }}
                >
                  <span>Filter Papers ({count})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
