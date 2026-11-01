import React, { useState } from 'react';
import { 
  AutomatedNotification, 
  NotificationSubscription, 
  ResearchPaper 
} from '../types/repository';
import { KEYWORD_CATEGORIES, COLLEGE_DEPARTMENTS, ALL_CANONICAL_KEYWORDS } from '../data/keywordsTaxonomy';
import { storageService } from '../services/storageService';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Plus, 
  Sliders, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Radio, 
  Clock,
  Send
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AutomatedNotification[];
  subscriptions: NotificationSubscription[];
  onSelectPaperById: (paperId: string) => void;
  onRefreshNotifications: () => void;
  onSimulatePeerUpload: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  subscriptions,
  onSelectPaperById,
  onRefreshNotifications,
  onSimulatePeerUpload
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'rules'>('feed');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  // New Subscription Form state
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState<string[]>([]);
  const [newRuleCustomKeyword, setNewRuleCustomKeyword] = useState('');
  const [newRuleDepartment, setNewRuleDepartment] = useState<string>('All Departments');
  const [newRulePublishedOnly, setNewRulePublishedOnly] = useState(false);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filterUnreadOnly
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead();
    onRefreshNotifications();
  };

  const handleClearAll = () => {
    storageService.clearNotifications();
    onRefreshNotifications();
  };

  const handleMarkRead = (id: string) => {
    storageService.markNotificationRead(id);
    onRefreshNotifications();
  };

  const handleToggleSub = (id: string) => {
    storageService.toggleSubscription(id);
    onRefreshNotifications();
  };

  const handleDeleteSub = (id: string) => {
    storageService.deleteSubscription(id);
    onRefreshNotifications();
  };

  const handleAddKeywordToRule = (kw: string) => {
    if (newRuleKeywords.includes(kw)) {
      setNewRuleKeywords(newRuleKeywords.filter(k => k !== kw));
    } else {
      setNewRuleKeywords([...newRuleKeywords, kw]);
    }
  };

  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleCustomKeyword.trim()) return;
    if (!newRuleKeywords.includes(newRuleCustomKeyword.trim())) {
      setNewRuleKeywords([...newRuleKeywords, newRuleCustomKeyword.trim()]);
    }
    setNewRuleCustomKeyword('');
  };

  const handleSaveNewSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newSub: NotificationSubscription = {
      id: `sub-${Date.now()}`,
      name: newRuleName.trim(),
      keywords: newRuleKeywords,
      departments: newRuleDepartment === 'All Departments' ? [] : [newRuleDepartment],
      onlyPublishedJournals: newRulePublishedOnly,
      createdDate: new Date().toISOString().split('T')[0],
      active: true
    };

    storageService.saveSubscription(newSub);
    setNewRuleName('');
    setNewRuleKeywords([]);
    setNewRuleDepartment('All Departments');
    setNewRulePublishedOnly(false);
    setShowNewRuleForm(false);
    onRefreshNotifications();
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Automated Research Alerts
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500">
                Triggered automatically upon new matching research uploads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close notification panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Test Trigger Simulator */}
        <div className="p-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-blue-900">
            <strong>Demonstration Simulator:</strong>
          </div>
          <button
            onClick={onSimulatePeerUpload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            title="Simulates a college scholar uploading a new paper to trigger automated subscriber alerts"
          >
            <Send className="w-3.5 h-3.5" />
            Simulate Peer Upload
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 px-4 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'feed'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Alerts Feed ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-blue-700 text-blue-700 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Tracked Keywords & Rules ({subscriptions.length})
          </button>
        </div>

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Feed controls */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterUnreadOnly}
                  onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                  className="rounded"
                />
                <span>Unread only</span>
              </label>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-slate-500 hover:text-red-600 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Notifications list */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No notifications to display.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "Simulate Peer Upload" above to test the automated alert matching!
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      n.read 
                        ? 'bg-white border-slate-200' 
                        : 'bg-blue-50/50 border-blue-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-900 leading-snug">
                        {n.title}
                      </div>
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="text-[10px] text-blue-700 hover:underline shrink-0 cursor-pointer"
                          title="Mark as read"
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {n.message}
                    </p>

                    {/* Matched Keywords Tags */}
                    {n.matchedKeywords && n.matchedKeywords.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Match:
                        </span>
                        {n.matchedKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-medium"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Department / Journal info */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatTime(n.timestamp)}</span>
                      </div>

                      <button
                        onClick={() => {
                          handleMarkRead(n.id);
                          onSelectPaperById(n.paperId);
                          onClose();
                        }}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Paper
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* RULES & SUBSCRIPTIONS TAB */}
        {activeTab === 'rules' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Alert Subscriptions
                </h3>
                <p className="text-[11px] text-slate-500">
                  System monitors new uploads and sends instant in-app alerts.
                </p>
              </div>

              <button
                onClick={() => setShowNewRuleForm(!showNewRuleForm)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded border border-blue-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {showNewRuleForm ? 'Cancel' : 'New Alert'}
              </button>
            </div>

            {/* New Rule Form */}
            {showNewRuleForm && (
              <form onSubmit={handleSaveNewSubscription} className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Create Keyword Alert Rule
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Alert Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Quantum Computing & Photonics Alert"
                    className="w-full text-xs border border-slate-300 rounded p-2 text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Track Specific Keywords ({newRuleKeywords.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-white border border-slate-200 rounded">
                    {ALL_CANONICAL_KEYWORDS.slice(0, 16).map(kw => {
                      const isSel = newRuleKeywords.includes(kw);
                      return (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => handleAddKeywordToRule(kw)}
                          className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                            isSel ? 'bg-blue-700 text-white font-medium' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}{kw}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Target Department
                  </label>
                  <select
                    value={newRuleDepartment}
                    onChange={(e) => setNewRuleDepartment(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-1.5 text-slate-900 bg-white"
                  >
                    <option value="All Departments">All Departments</option>
                    {COLLEGE_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRulePublishedOnly}
                    onChange={(e) => setNewRulePublishedOnly(e.target.checked)}
                    className="rounded"
                  />
                  <span>Only alert if published in a peer-reviewed journal</span>
                </label>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewRuleForm(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded"
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            )}

            {/* Existing Subscriptions list */}
            <div className="overflow-y-auto space-y-3 flex-1">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="p-3 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSub(sub.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-medium cursor-pointer ${
                          sub.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {sub.active ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => handleDeleteSub(sub.id)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer p-0.5"
                        title="Delete subscription"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {sub.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sub.keywords.map(kw => (
                        <span key={kw} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2 flex-wrap">
                    {sub.departments.length > 0 ? (
                      <span>Dept: {sub.departments.join(', ')}</span>
                    ) : (
                      <span>All college departments</span>
                    )}
                    {sub.onlyPublishedJournals && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">Peer-reviewed only</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
