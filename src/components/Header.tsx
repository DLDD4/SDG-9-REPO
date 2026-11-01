import React from 'react';
import { Bell, Plus, BookOpen, Layers, BarChart2, Globe2, FileSearch, Bot, Sparkles } from 'lucide-react';
import { ViewMode } from '../types/repository';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenUploadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenUploadModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <button
            onClick={() => onViewChange('grid')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap block group-hover:text-blue-700 transition-colors">
              College Research Scholar Hub
            </span>
            <span className="text-xs text-slate-500 whitespace-nowrap block">
              Institutional Paper Repository & Verified Proof Catalog
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600">
          <button
            onClick={() => onViewChange('grid')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              currentView === 'grid' || currentView === 'table'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'hover:text-slate-900'
            }`}
          >
            Repository
          </button>
          <button
            onClick={() => onViewChange('sdg')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentView === 'sdg'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            SDG Catalog
          </button>
          <button
            onClick={() => onViewChange('keywords')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentView === 'keywords'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Keywords
          </button>
          <button
            onClick={() => onViewChange('reviewer')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentView === 'reviewer'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'hover:text-slate-900'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5 text-blue-600" />
            Student Reviewer
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              currentView === 'analytics'
                ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                : 'hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Scholar Analytics
          </button>
          <button
            onClick={() => onViewChange('assistant')}
            className={`whitespace-nowrap transition-all cursor-pointer py-1 px-2.5 rounded-lg flex items-center gap-1.5 font-bold text-xs ${
              currentView === 'assistant'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80'
            }`}
            title="Quirky Small Language Model Research Assistant"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>ScholarBot AI</span>
            <span className="text-[9px] bg-amber-400 text-amber-950 px-1 rounded-sm uppercase tracking-wider font-extrabold">
              Lab
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Automated Notification Bell */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNotifications}
            aria-label="Open automated research notifications"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Automated Research Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-mono tabular-nums shadow-sm">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload Research Paper
          </button>
        </div>
      </div>
    </header>
  );
};
