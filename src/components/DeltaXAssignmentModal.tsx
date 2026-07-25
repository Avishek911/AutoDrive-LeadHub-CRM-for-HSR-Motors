import React, { useState } from 'react';
import { AssignmentDocConfig } from '../types';
import { 
  FileCheck2, 
  X, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Download, 
  Eye, 
  Edit3, 
  RefreshCw,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface DeltaXAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AssignmentDocConfig;
  onUpdateConfig: (newConfig: AssignmentDocConfig) => void;
  onNavigateScreen: (screen: 'listing' | 'details' | 'management' | 'dashboard') => void;
}

export const DeltaXAssignmentModal: React.FC<DeltaXAssignmentModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onNavigateScreen,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  // Form State
  const [userName, setUserName] = useState(config.userName);
  const [collegeId, setCollegeId] = useState(config.collegeId);
  const [appName, setAppName] = useState(config.appName);
  const [dateStr, setDateStr] = useState(config.date);
  const [overview, setOverview] = useState(config.overview);
  const [userFlow, setUserFlow] = useState(config.userFlow);
  const [otherLinks, setOtherLinks] = useState(config.otherLinks);

  if (!isOpen) return null;

  const handleSaveForm = () => {
    onUpdateConfig({
      ...config,
      userName,
      collegeId,
      appName,
      date: dateStr,
      overview,
      userFlow,
      otherLinks,
    });
    setIsEditing(false);
  };

  const generateWithAi = async () => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-assignment-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          collegeId,
          appName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.overview) setOverview(data.overview);
        if (data.userFlow) setUserFlow(data.userFlow);
        if (data.features) {
          onUpdateConfig({
            ...config,
            overview: data.overview || overview,
            features: data.features,
            userFlow: data.userFlow || userFlow,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const getFullMarkdown = () => {
    return `# DELTAX PRODUCT ASSOCIATE ASSIGNMENT SUBMISSION

*Name:* ${userName}
*College ID Number:* ${collegeId}
*Application Name:* ${appName}
*Date:* ${dateStr}

---

## OVERVIEW
${overview}

---

## FEATURES
${config.features.map((f, i) => `${f}`).join('\n')}

---

## WIREFRAME / MOCKUP / PROTOTYPE
- Screen 1: Lead Listing (Search, Multi-Filter, SLA Timers, Bulk Reassignment)
- Screen 2: Lead Details (360° Customer Profile, Test Drive Booking Engine, Activity Log, Gemini AI Copilot)
- Screen 3: Lead Management (Interactive Kanban Pipeline & Auto-Routing Rules Engine)
- Screen 4: Business Dashboard (Source Attribution, Funnel Dropoff, Model Demand Heatmap, Rep Leaderboard)

*Interactive Prototype Applet URL:* ${window.location.href}

---

## USER FLOW
${userFlow}

---

## OTHER LINKS
${otherLinks}
`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(getFullMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-400/30 text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <span>DeltaX Product Associate Assignment Template</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  Submission Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Formatted according to the DeltaX official assignment PDF template
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all border border-slate-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEditing ? 'Preview Document' : 'Edit Fields'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-200 text-xs">
          
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={generateWithAi}
                disabled={generatingAi}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>{generatingAi ? 'Generating AI Content...' : 'Enhance with Gemini AI'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyMarkdown}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Markdown!' : 'Copy Formatted Solution'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 shadow-sm hover:opacity-90 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Export PDF</span>
              </button>
            </div>
          </div>

          {/* Edit Mode vs Preview Mode */}
          {isEditing ? (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">Edit Assignment Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">*Your Name*</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">*College ID Number*</label>
                  <input
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">*Application Name*</label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">*Date*</label>
                  <input
                    type="text"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">OVERVIEW</label>
                <textarea
                  rows={4}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">USER FLOW</label>
                <textarea
                  rows={3}
                  value={userFlow}
                  onChange={(e) => setUserFlow(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">OTHER LINKS</label>
                <input
                  type="text"
                  value={otherLinks}
                  onChange={(e) => setOtherLinks(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveForm}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Save & View Preview
                </button>
              </div>
            </div>
          ) : (
            /* Render Document View matching PDF Format */
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-8 font-sans shadow-inner printable-doc">
              
              {/* DeltaX Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-emerald-500 pb-4">
                <div className="space-y-1">
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    *{userName}*
                  </div>
                  <div className="text-xs text-slate-500">
                    *{collegeId}*
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2">
                    *{appName}*
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    *{dateStr}*
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center justify-end space-x-1">
                    <span className="text-emerald-500">Delta</span><span>X</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Product Associate Solution
                  </span>
                </div>
              </div>

              {/* OVERVIEW SECTION */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                  OVERVIEW
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                  {overview}
                </p>
              </div>

              {/* FEATURES SECTION */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                  FEATURES
                </h3>
                <div className="space-y-2">
                  {config.features.map((feat, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-xs">
                        {feat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* WIREFRAME / MOCKUP / PROTOTYPE SECTION */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center justify-between">
                  <span>WIREFRAME / MOCKUP / PROTOTYPE (4 REQUIRED SCREENS)</span>
                  <span className="text-[10px] font-normal text-emerald-500">Live Interactive Screens</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Screen 1 Thumbnail */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-white border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs">Screen 1 - Lead Listing</span>
                      <button
                        onClick={() => { onClose(); onNavigateScreen('listing'); }}
                        className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        <span>Open Screen</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Centralized inbox with multi-dimensional filtering (Source, Status, Rep, Vehicle), search, SLA countdowns, and bulk reassignment.
                    </p>
                  </div>

                  {/* Screen 2 Thumbnail */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-white border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs">Screen 2 - Lead Details</span>
                      <button
                        onClick={() => { onClose(); onNavigateScreen('details'); }}
                        className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        <span>Open Screen</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      360° customer view, vehicle preferences, trade-in details, test drive booking engine, activity timeline, and Gemini AI script generator.
                    </p>
                  </div>

                  {/* Screen 3 Thumbnail */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-white border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs">Screen 3 - Lead Management</span>
                      <button
                        onClick={() => { onClose(); onNavigateScreen('management'); }}
                        className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        <span>Open Screen</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Interactive Kanban status pipeline with visual SLA breach highlights (&lt; 2h limit) and configurable lead auto-routing rules.
                    </p>
                  </div>

                  {/* Screen 4 Thumbnail */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-white border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs">Screen 4 - Dashboard</span>
                      <button
                        onClick={() => { onClose(); onNavigateScreen('dashboard'); }}
                        className="text-[10px] text-indigo-300 hover:underline flex items-center gap-1"
                      >
                        <span>Open Screen</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Business Manager dashboard featuring channel ROI attribution, sales funnel dropoffs, car model demand heatmaps, and rep leaderboards.
                    </p>
                  </div>
                </div>
              </div>

              {/* USER FLOW SECTION */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                  USER FLOW
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                  {userFlow}
                </p>
              </div>

              {/* OTHER LINKS SECTION */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1">
                  OTHER LINKS
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs break-all">
                  {otherLinks}
                </p>
                <p className="text-[10px] text-slate-400 italic">
                  *Public access confirmed (anyone with the link)*
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
