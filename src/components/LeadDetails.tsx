import React, { useState } from 'react';
import { Lead, LeadStatus, TestDrive } from '../types';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  DollarSign, 
  Calendar, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ChevronLeft, 
  Flame, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  AlertTriangle,
  Tag,
  Building2,
  RefreshCw
} from 'lucide-react';

interface LeadDetailsProps {
  lead: Lead | null;
  onBackToListing: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, noteContent: string, noteType: 'Call' | 'Note' | 'WhatsApp') => void;
  onScheduleTestDrive: (leadId: string, testDrive: TestDrive) => void;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  onBackToListing,
  onUpdateLeadStatus,
  onAddNote,
  onScheduleTestDrive,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [noteType, setNoteType] = useState<'Call' | 'Note' | 'WhatsApp'>('Note');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiTaskType, setAiTaskType] = useState<'call_script' | 'whatsapp' | 'executive_summary'>('call_script');
  const [copied, setCopied] = useState(false);

  // Test Drive Modal State inside details screen
  const [showTdModal, setShowTdModal] = useState(false);
  const [tdDate, setTdDate] = useState('2026-07-27');
  const [tdSlot, setTdSlot] = useState('11:00 AM - 12:00 PM');
  const [tdLocation, setTdLocation] = useState<'Home Test Drive' | 'Showroom Visit'>('Home Test Drive');
  const [tdAddress, setTdAddress] = useState(lead?.city || 'Bangalore');

  if (!lead) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto shadow-sm">
        <User className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Lead Selected</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">Please select a lead from Screen 1 (Listing) or Screen 3 (Kanban) to view 360° details.</p>
        <button
          onClick={onBackToListing}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
        >
          Go to Screen 1: Lead Listing
        </button>
      </div>
    );
  }

  const pipelineSteps: LeadStatus[] = [
    'New',
    'Contacted',
    'Test Drive Scheduled',
    'Qualified',
    'Won',
  ];

  const currentStepIndex = pipelineSteps.indexOf(lead.status as LeadStatus);

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(lead.id, newNoteText.trim(), noteType);
    setNewNoteText('');
  };

  const handleScheduleTdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTd: TestDrive = {
      id: `td-${Date.now()}`,
      date: tdDate,
      timeSlot: tdSlot,
      locationType: tdLocation,
      address: tdAddress,
      vehicleModel: lead.interestedModel,
      status: 'Scheduled',
    };
    onScheduleTestDrive(lead.id, newTd);
    setShowTdModal(false);
  };

  const generateAiCopilot = async (type: 'call_script' | 'whatsapp' | 'executive_summary') => {
    setAiTaskType(type);
    setAiGenerating(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/lead-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          taskType: type,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.text);
      } else {
        setAiResponse('Could not generate AI response. Please verify server setup.');
      }
    } catch (err) {
      setAiResponse(`Fallback Assistant:\n- Customer: ${lead.customerName}\n- Interested Vehicle: ${lead.interestedModel}\n- Recommendation: Connect via phone to confirm budget ${lead.budget} and schedule a home test drive for Saturday.`);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCopyAi = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToListing}
          className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-500 font-semibold text-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Screen 1: Lead Listing</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Lead ID:</span>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {lead.id}
          </span>
        </div>
      </div>

      {/* Main 360 Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/20 shrink-0">
              {lead.customerName.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {lead.customerName}
                </h1>

                {/* Score Tag */}
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                  lead.score === 'Hot'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>{lead.score} Lead</span>
                </span>

                {/* Channel Badge */}
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Source: {lead.source}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <a href={`tel:${lead.phone}`} className="hover:underline font-medium">{lead.phone}</a>
                </span>
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>{lead.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                  <span>{lead.city}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Test Drive Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>

            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => setShowTdModal(true)}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Test Drive</span>
            </button>
          </div>
        </div>

        {/* Lead Pipeline Progress Stepper */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Lead Qualification Status Pipeline
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {pipelineSteps.map((step, idx) => {
              const isCurrent = lead.status === step;
              const isPast = currentStepIndex >= idx && lead.status !== 'Lost';

              return (
                <button
                  key={step}
                  onClick={() => onUpdateLeadStatus(lead.id, step)}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    isCurrent
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/30 font-bold'
                      : isPast
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Step {idx + 1}
                    </span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className="text-xs mt-1 truncate">{step}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Vehicle Preference & Test Drive Dossier */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Car & Buyer Preference Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-500" />
                <span>Car & Financing Dossier</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Target Vehicle</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm block mt-0.5">
                  {lead.interestedModel}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                  {lead.fuelType} • {lead.bodyType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl">
                  <span className="text-slate-400 text-[10px] block font-medium">Budget Range</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                    {lead.budget}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl">
                  <span className="text-slate-400 text-[10px] block font-medium">Timeline</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 block">
                    {lead.purchaseTimeframe}
                  </span>
                </div>
              </div>

              {lead.tradeInVehicle && (
                <div className="bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300">
                  <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">
                    Trade-In Car Details
                  </span>
                  <span className="font-bold text-xs mt-0.5 block">{lead.tradeInVehicle}</span>
                </div>
              )}

              <div>
                <span className="text-slate-400 text-[10px] block font-medium mb-1">Customer Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-medium border border-slate-200 dark:border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Assigned Sales Rep:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{lead.assignedRepName}</span>
              </div>
            </div>
          </div>

          {/* Test Drive Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Test Drive Status</span>
              </h3>
              <button
                onClick={() => setShowTdModal(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {lead.testDrive ? 'Reschedule' : '+ Book Slot'}
              </button>
            </div>

            {lead.testDrive ? (
              <div className="bg-indigo-50/60 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                    {lead.testDrive.locationType}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                    {lead.testDrive.status}
                  </span>
                </div>

                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {lead.testDrive.vehicleModel}
                </div>

                <div className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lead.testDrive.date} ({lead.testDrive.timeSlot})</span>
                  </div>
                  {lead.testDrive.address && (
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="truncate">{lead.testDrive.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400 space-y-2">
                <p>No active test drive scheduled for this customer.</p>
                <button
                  onClick={() => setShowTdModal(true)}
                  className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-all text-xs"
                >
                  Book Test Drive Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (2 Cols wide): Activity Feed & Gemini AI Copilot */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Gemini AI Copilot Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-400/30 text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Gemini AI Sales Copilot</h3>
                  <p className="text-[10px] text-indigo-300">
                    Instant high-conversion call scripts, WhatsApp proposals & executive summaries
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-indigo-500/30 text-xs">
                <button
                  onClick={() => generateAiCopilot('call_script')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    aiTaskType === 'call_script' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Call Script
                </button>
                <button
                  onClick={() => generateAiCopilot('whatsapp')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    aiTaskType === 'whatsapp' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => generateAiCopilot('executive_summary')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    aiTaskType === 'executive_summary' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Risk Summary
                </button>
              </div>
            </div>

            {/* AI Output Box */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-indigo-500/20 min-h-[100px] text-xs text-slate-200 relative">
              {aiGenerating ? (
                <div className="flex items-center justify-center py-6 space-x-2 text-indigo-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI is analyzing customer profile & crafting custom message...</span>
                </div>
              ) : aiResponse ? (
                <div className="space-y-3">
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
                    {aiResponse}
                  </pre>
                  <div className="flex justify-end">
                    <button
                      onClick={handleCopyAi}
                      className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">
                  <p>Click any button above to generate AI recommendations tailored for {lead.customerName}.</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log & Communication Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Interaction Timeline & Call History</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {lead.activityLogs.length} activity entries
              </span>
            </h3>

            {/* Form to log new activity/note */}
            <form onSubmit={handleAddNoteSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Log New Interaction:</span>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setNoteType('Note')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${noteType === 'Note' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('Call')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${noteType === 'Call' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    Phone Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('WhatsApp')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${noteType === 'WhatsApp' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>

              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter details of customer conversation, preferred color, loan status, or follow-up promise..."
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Add Log</span>
                </button>
              </div>
            </form>

            {/* Timeline Logs */}
            <div className="space-y-3 pt-2">
              {lead.activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start space-x-3 text-xs"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    log.type === 'Call'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : log.type === 'WhatsApp'
                      ? 'bg-teal-500/10 text-teal-600'
                      : log.type === 'Test Drive'
                      ? 'bg-indigo-500/10 text-indigo-600'
                      : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {log.type === 'Call' ? <Phone className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{log.author}</span>
                      <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{log.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Scheduling Test Drive */}
      {showTdModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span>Schedule Test Drive</span>
            </h3>

            <form onSubmit={handleScheduleTdSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Test Drive Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTdLocation('Home Test Drive')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold ${
                      tdLocation === 'Home Test Drive'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Home Test Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setTdLocation('Showroom Visit')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold ${
                      tdLocation === 'Showroom Visit'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Showroom Visit
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  disabled
                  value={lead.interestedModel}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={tdDate}
                    onChange={(e) => setTdDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={tdSlot}
                    onChange={(e) => setTdSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Location Address</label>
                <input
                  type="text"
                  value={tdAddress}
                  onChange={(e) => setTdAddress(e.target.value)}
                  placeholder="Customer address for home test drive..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTdModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
