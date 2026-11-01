import { ResearchPaper, NotificationSubscription, AutomatedNotification } from '../types/repository';
import { INITIAL_RESEARCH_PAPERS } from '../data/initialPapers';

const PAPERS_STORAGE_KEY = 'college_research_papers_v2';
const SUBSCRIPTIONS_STORAGE_KEY = 'college_research_subscriptions_v2';
const NOTIFICATIONS_STORAGE_KEY = 'college_research_notifications_v2';

const DEFAULT_SUBSCRIPTIONS: NotificationSubscription[] = [
  {
    id: 'sub-deep-learning',
    name: 'AI & Deep Learning Breakthroughs',
    keywords: ['Deep Learning', 'Neural Radiance Fields', 'Large Language Models', 'Computer Vision'],
    departments: ['Computer Science & Engineering', 'Biomedical Engineering'],
    onlyPublishedJournals: false,
    createdDate: '2025-01-01',
    active: true
  },
  {
    id: 'sub-energy-storage',
    name: 'Clean Energy & Nanotech Materials',
    keywords: ['Perovskite Solar Cells', '2D MXenes', 'Solid-State Electrolytes', 'Green Hydrogen'],
    departments: ['Materials Science & Nanotechnology', 'Environmental & Chemical Engineering'],
    onlyPublishedJournals: false,
    createdDate: '2025-01-05',
    active: true
  },
  {
    id: 'sub-peer-reviewed',
    name: 'College Peer-Reviewed Journal Publications',
    keywords: [],
    departments: [],
    onlyPublishedJournals: true,
    createdDate: '2025-01-10',
    active: true
  }
];

const INITIAL_NOTIFICATIONS: AutomatedNotification[] = [
  {
    id: 'notif-seed-1',
    title: 'New Publication in Medical Imaging',
    message: 'Dr. Elena Rostova uploaded research paper "Self-Supervised Neural Radiance Fields..." published in IEEE Transactions on Medical Imaging.',
    paperId: 'CRP-2025-001',
    paperTitle: 'Self-Supervised Neural Radiance Fields for Minimally Invasive Endoscopic Depth Estimation',
    matchedKeywords: ['Neural Radiance Fields', 'Deep Learning', 'Computer Vision'],
    department: 'Biomedical Engineering',
    timestamp: '2025-03-10T14:32:00Z',
    read: false,
    isJournalPublished: true,
    journalName: 'IEEE Transactions on Medical Imaging'
  },
  {
    id: 'notif-seed-2',
    title: 'High-Impact Nanomaterials Paper Uploaded',
    message: 'Dr. Siddharth Nair uploaded research paper on Perovskite Solar Cells matching your "Clean Energy & Nanotech" subscription.',
    paperId: 'CRP-2025-002',
    paperTitle: 'Defect Passivation via 2D MXene Heterostructures in Formamidinium Perovskite Solar Cells',
    matchedKeywords: ['Perovskite Solar Cells', '2D MXenes'],
    department: 'Materials Science & Nanotechnology',
    timestamp: '2025-02-18T10:15:00Z',
    read: true,
    isJournalPublished: true,
    journalName: 'ACS Applied Materials & Interfaces'
  }
];

export const storageService = {
  getPapers(): ResearchPaper[] {
    try {
      const data = localStorage.getItem(PAPERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(INITIAL_RESEARCH_PAPERS));
        return INITIAL_RESEARCH_PAPERS;
      }
      const parsed: ResearchPaper[] = JSON.parse(data);
      let needsSave = false;
      const updated = parsed.map(paper => {
        if (!paper.sdgs || paper.sdgs.length === 0) {
          const seed = INITIAL_RESEARCH_PAPERS.find(s => s.id === paper.id);
          if (seed?.sdgs) {
            needsSave = true;
            return { ...paper, sdgs: seed.sdgs };
          }
        }
        return paper;
      });

      if (needsSave) {
        localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    } catch {
      return INITIAL_RESEARCH_PAPERS;
    }
  },

  savePaper(paper: ResearchPaper): void {
    const papers = this.getPapers();
    const updated = [paper, ...papers.filter(p => p.id !== paper.id)];
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(updated));
  },

  updatePaper(paper: ResearchPaper): void {
    const papers = this.getPapers();
    const updated = papers.map(p => (p.id === paper.id ? paper : p));
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(updated));
  },

  deletePaper(id: string): void {
    const papers = this.getPapers();
    const updated = papers.filter(p => p.id !== id);
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(updated));
  },

  resetToDefault(): void {
    localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(INITIAL_RESEARCH_PAPERS));
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  },

  getSubscriptions(): NotificationSubscription[] {
    try {
      const data = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
        return DEFAULT_SUBSCRIPTIONS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SUBSCRIPTIONS;
    }
  },

  saveSubscription(subscription: NotificationSubscription): void {
    const subs = this.getSubscriptions();
    const exists = subs.some(s => s.id === subscription.id);
    const updated = exists
      ? subs.map(s => (s.id === subscription.id ? subscription : s))
      : [subscription, ...subs];
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  deleteSubscription(id: string): void {
    const subs = this.getSubscriptions();
    const updated = subs.filter(s => s.id !== id);
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  toggleSubscription(id: string): void {
    const subs = this.getSubscriptions();
    const updated = subs.map(s => (s.id === id ? { ...s, active: !s.active } : s));
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  getNotifications(): AutomatedNotification[] {
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification(notif: AutomatedNotification): void {
    const notifs = this.getNotifications();
    const updated = [notif, ...notifs];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  },

  clearNotifications(): void {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify([]));
  }
};
