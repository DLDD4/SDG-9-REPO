import React, { useState, useRef, useEffect } from 'react';
import { 
  ResearchPaper, 
  AssistantPersonaId, 
  AssistantMessage, 
  AssistantCitation 
} from '../types/repository';
import { 
  PERSONAS, 
  QUICK_PROMPTS, 
  askScholarAssistant, 
  PersonaConfig 
} from '../services/scholarAiEngine';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Flame, 
  Compass, 
  Coffee, 
  FileText, 
  ExternalLink, 
  RotateCcw, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Atom,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface ScholarBotAssistantProps {
  papers: ResearchPaper[];
  onInspectPaper: (paperId: string) => void;
  onNavigateToView?: (view: any) => void;
}

export const ScholarBotAssistant: React.FC<ScholarBotAssistantProps> = ({
  papers,
  onInspectPaper,
  onNavigateToView
}) => {
  const [selectedPersona, setSelectedPersona] = useState<AssistantPersonaId>('archie');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [caffeineLevel, setCaffeineLevel] = useState(85);
  const [activeTab, setActiveTab] = useState<'chat' | 'lab_tools' | 'paper_matchmaker'>('chat');

  // Interactive Paper Idea Sandbox State
  const [sandboxTitle, setSandboxTitle] = useState('');
  const [sandboxDept, setSandboxDept] = useState('Computer Science & Engineering');
  const [sandboxRoastResult, setSandboxRoastResult] = useState<{
    roast: string;
    rewrite: string;
    matchedPaper: ResearchPaper | null;
  } | null>(null);

  const activePersona: PersonaConfig = PERSONAS[selectedPersona];

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: PERSONAS.archie.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: 'archie',
      citations: papers.slice(0, 2).map(p => ({
        paperId: p.id,
        title: p.title,
        department: p.department,
        relevance: 'Benchmark college reference'
      })),
      suggestedPrompts: [
        '🔥 Roast my draft research title',
        '🧪 Who in our college is working on IoT or AI?',
        '💡 What thesis topics have zero college papers so far?'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // When changing persona, push a greeting if last message isn't already from them
  const handlePersonaChange = (newPersonaId: AssistantPersonaId) => {
    setSelectedPersona(newPersonaId);
    const newPersona = PERSONAS[newPersonaId];
    
    // Add persona introduction message
    const introMsg: AssistantMessage = {
      id: `persona-switch-${Date.now()}`,
      role: 'assistant',
      content: `*Switches lab desk...* ${newPersona.greeting}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: newPersonaId,
      suggestedPrompts: [
        '🔥 Roast my abstract idea',
        '💡 What are the open literature gaps on campus?',
        '📋 Explain required Turnitin and IRB proofs'
      ]
    };
    setMessages(prev => [...prev, introMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isTyping) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Boost caffeine or adjust quirky stat
    setCaffeineLevel(prev => Math.min(100, prev + 5));

    try {
      const response = await askScholarAssistant(
        query,
        selectedPersona,
        papers,
        messages
      );

      const botMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona,
        citations: response.citations,
        suggestedPrompts: [
          'Can you elaborate on the methodology?',
          'Which UN SDGs align with this?',
          'What proof documents will the college require?'
        ]
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Oops! My lab equipment sparked! Here's a quick thought: check our college repository records for [${papers[0]?.id}] to get started.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPromptClick = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        content: `*Lab bench cleared and coffee refilled!* ${activePersona.greeting}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona
      }
    ]);
  };

  const handleRunSandboxRoast = () => {
    if (!sandboxTitle.trim()) return;

    // Pick closest match from papers
    const words = sandboxTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matched = papers.find(p => 
      words.some(w => p.title.toLowerCase().includes(w) || p.keywords.some(k => k.toLowerCase().includes(w)))
    ) || papers[0];

    setSandboxRoastResult({
      roast: `"${sandboxTitle}" has that classic 2 AM thesis vibe where buzzwords attempt to replace empirical rigor! Your title suggests 5 different PhD dissertations in one sentence.`,
      rewrite: `An Empirical Assessment of ${words[0] ? words[0].toUpperCase() : 'Novel'} Architectural Benchmarks in ${sandboxDept}: Quantitative Baselines and Institutional Validation`,
      matchedPaper: matched
    });
  };

  return (
    <div className="space-y-6">
      {/* Quirky Header Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        {/* Quirky Background Lab Graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Atom className="w-80 h-80 text-blue-400 animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Separated Category · College SLM Research Companion
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>ScholarBot Lab</span>
            <span className="text-sm font-mono px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 font-normal">
              v2.5 SLM Edition
            </span>
          </h1>

          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Your interactive, slightly eccentric college research AI! Connected directly to our campus repository
            of <strong className="text-white">{papers.length} verified manuscripts</strong>, UN SDGs, and Turnitin ethics records.
            Brainstorm thesis topics, roast draft abstracts, or find cross-department research partners.
          </p>

          {/* Quirky Lab Telemetry Bar */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-slate-800">
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">College Knowledge Base</span>
              <span className="font-bold text-white text-sm font-mono">{papers.length} Papers Live</span>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Caffeine Level</span>
              <div className="flex items-center gap-2">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-amber-300 text-sm font-mono">{caffeineLevel}%</span>
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Turnitin Panic Filter</span>
              <span className="font-bold text-emerald-400 text-sm font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Active (&lt;10%)
              </span>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Model Engine</span>
              <span className="font-bold text-indigo-300 text-sm font-mono">Gemini 3.8 Flash SLM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs: Interactive Chat, Fast Lab Tools, Title Roaster */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            Interactive AI Lab Console
          </button>
          <button
            onClick={() => setActiveTab('lab_tools')}
            className={`px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'lab_tools'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-500" />
            Title Roaster & Sandbox
          </button>
          <button
            onClick={() => setActiveTab('paper_matchmaker')}
            className={`px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'paper_matchmaker'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            Campus Gap & Matchmaker
          </button>
        </div>

        <button
          onClick={handleClearChat}
          className="text-slate-400 hover:text-slate-700 text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Reset conversation history"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Console</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'lab_tools' ? (
        /* Title Roaster & Abstract Sandbox */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Abstract & Title Roaster 3000</h3>
                <p className="text-xs text-slate-500">Test your thesis proposal before your committee sees it</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Draft Research Title / Problem Statement:
                </label>
                <textarea
                  value={sandboxTitle}
                  onChange={(e) => setSandboxTitle(e.target.value)}
                  placeholder="e.g., A Revolutionary Smart Deep Learning Framework for Drone-based Crop Inspection using Blockchain..."
                  rows={4}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-blue-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Department:
                </label>
                <select
                  value={sandboxDept}
                  onChange={(e) => setSandboxDept(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
                  <option value="Mechanical & Mechatronics">Mechanical & Mechatronics</option>
                </select>
              </div>

              <button
                onClick={handleRunSandboxRoast}
                disabled={!sandboxTitle.trim()}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                Roast My Title & Generate Reviewer-Ready Version
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            {sandboxRoastResult ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Reviewer #2's Candid Verdict
                  </div>
                  <p className="text-xs text-rose-950 leading-relaxed font-medium">
                    {sandboxRoastResult.roast}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Peer-Reviewed Recommended Title
                  </div>
                  <p className="text-sm text-emerald-950 font-bold leading-relaxed">
                    {sandboxRoastResult.rewrite}
                  </p>
                </div>

                {sandboxRoastResult.matchedPaper && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                      <span>Closest Campus Benchmark Paper:</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {sandboxRoastResult.matchedPaper.id}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 mb-1">
                      {sandboxRoastResult.matchedPaper.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                      {sandboxRoastResult.matchedPaper.abstract}
                    </p>
                    <button
                      onClick={() => onInspectPaper(sandboxRoastResult.matchedPaper!.id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
                    >
                      Inspect College Dossier & Citations <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(`I used the title roaster for: "${sandboxTitle}". How can I formulate an experiment plan for this?`);
                  }}
                  className="w-full py-2 px-4 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer text-center"
                >
                  Continue Discussing with Archie in Chat →
                </button>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Flame className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="text-sm font-bold text-slate-700 mb-1">Waiting for your thesis draft</h4>
                <p className="text-xs max-w-sm text-slate-500">
                  Type a title or thesis pitch on the left. We'll cross-reference it against existing college papers and show you how to bullet-proof it!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'paper_matchmaker' ? (
        /* Campus Literature Gap Radar */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Literature Gaps Radar</h3>
                <p className="text-xs text-slate-500">Topics currently unexplored across our college departments</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>🌊 Microplastics in Campus Drainage (SDG 14)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-semibold">0 College Papers</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Zero papers in Civil or Biotech on local campus watershed microplastics. A low-cost sensor project could instantly become a flagship publication!
                </p>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage('Archie, tell me how a Master or UG team can build a project on campus watershed microplastic detection!');
                  }}
                  className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer"
                >
                  Ask Archie for methodology blueprint →
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>⚡ Battery Life Prediction for Campus E-Shuttles (SDG 7)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-semibold">0 College Papers</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Combine Electrical Engineering with Mechanical telemetry. No one has published a lithium-ion degradation paper in our archives yet.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage('How can I collaborate with the Electrical Engineering department on EV battery degradation?');
                  }}
                  className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer"
                >
                  Ask Archie to find professors & papers →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <Atom className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top College Research Anchors</h3>
                <p className="text-xs text-slate-500">Most cited and proven methodologies ready for student extensions</p>
              </div>
            </div>

            <div className="space-y-3">
              {papers.slice(0, 3).map(paper => (
                <div key={paper.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                      <span>{paper.id}</span>
                      <span className="text-indigo-700 font-semibold">{paper.citationsCount} Citations</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">{paper.title}</h4>
                    <p className="text-[11px] text-slate-500 mb-2">{paper.department} · Lead: {paper.authors[0]?.name}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <button
                      onClick={() => onInspectPaper(paper.id)}
                      className="text-slate-700 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> View Dossier
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(`How can I extend paper [${paper.id}: "${paper.title}"] for my final year research project?`);
                      }}
                      className="text-blue-700 font-semibold hover:underline cursor-pointer"
                    >
                      Brainstorm Extensions →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Chat Experience */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Quirky Persona Switcher & Fast Tools */}
          <div className="lg:col-span-4 space-y-4">
            {/* Persona Selector Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select AI Lab Persona
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  4 Personalities
                </span>
              </div>

              <div className="space-y-2">
                {(Object.keys(PERSONAS) as AssistantPersonaId[]).map((pId) => {
                  const persona = PERSONAS[pId];
                  const isSelected = selectedPersona === pId;

                  return (
                    <button
                      key={pId}
                      onClick={() => handlePersonaChange(pId)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? `${persona.accentColor} border-2 shadow-xs`
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-1 rounded-lg bg-white shadow-xs">
                        {persona.avatar}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {persona.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {persona.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed italic">
                "{activePersona.description}"
              </div>
            </div>

            {/* Quick Prompt Starters */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Quirky Research Prompts
              </span>
              <div className="space-y-1.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPromptClick(qp.prompt)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-xs text-slate-800 flex items-center gap-2 cursor-pointer group"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">{qp.icon}</span>
                    <span className="font-semibold text-slate-800 truncate">{qp.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chat Stream & Console */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col h-[650px] overflow-hidden">
            {/* Chat Top Bar */}
            <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activePersona.avatar}</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {activePersona.name}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </h3>
                  <span className="text-[11px] text-slate-500">{activePersona.tagline}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 hidden sm:inline text-[11px]">Grounded in:</span>
                <span className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
                  {papers.length} Institutional Papers
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              {messages.map((msg) => {
                const isBot = msg.role === 'assistant';
                const persona = msg.persona ? PERSONAS[msg.persona] : activePersona;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-base shadow-xs bg-white border border-slate-200">
                      {isBot ? persona.avatar : '🎓'}
                    </div>

                    {/* Speech Bubble */}
                    <div className={`max-w-[85%] space-y-2`}>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isBot
                            ? 'bg-white border border-slate-200 text-slate-800'
                            : 'bg-blue-700 text-white font-medium rounded-tr-none'
                        }`}
                      >
                        {/* Header info */}
                        <div className="flex items-center justify-between gap-3 text-[10px] mb-2 font-mono">
                          <span className={isBot ? 'font-bold text-slate-600' : 'text-blue-200'}>
                            {isBot ? persona.name : 'You (Student / Scholar)'}
                          </span>
                          <span className={isBot ? 'text-slate-400' : 'text-blue-300'}>
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Content formatted with basic markdown rendering */}
                        <div className="prose-xs space-y-2 whitespace-pre-wrap font-sans">
                          {msg.content}
                        </div>

                        {/* Clickable Citations if any */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Referenced College Literature:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.citations.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => onInspectPaper(c.paperId)}
                                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-900 border border-slate-200 text-slate-800 text-[11px] font-medium transition-colors cursor-pointer group"
                                  title={`Inspect paper: ${c.title}`}
                                >
                                  <FileText className="w-3 h-3 text-blue-600" />
                                  <span className="font-mono font-bold text-blue-700">{c.paperId}</span>
                                  <span className="max-w-[140px] truncate text-slate-600">{c.title}</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Suggested Prompts pills below message */}
                      {isBot && msg.suggestedPrompts && (
                        <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                          {msg.suggestedPrompts.map((sPrompt, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sPrompt)}
                              className="text-[11px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 rounded-full px-2.5 py-0.5 transition-colors cursor-pointer shadow-xs"
                            >
                              + {sPrompt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 shadow-xs">
                    {activePersona.avatar}
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-500 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                    <span className="italic font-medium">{activePersona.name} is scanning college records...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Ask ${activePersona.name} anything about college research, prior art, or project ideas... (Enter to send)`}
                    rows={2}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-blue-600 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 text-white rounded-xl transition-colors shadow-sm cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
                <span>Press Enter to send, Shift+Enter for newline</span>
                <span className="flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Small Language Model Grounded
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
