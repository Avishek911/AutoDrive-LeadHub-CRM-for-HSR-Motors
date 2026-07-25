import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus, LeadSource, LeadScore, SalesRep } from '../types';
import { 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Download, 
  UserCheck, 
  Sparkles, 
  Facebook, 
  Globe, 
  Twitter, 
  MapPin, 
  Car, 
  Flame,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
  X
} from 'lucide-react';

interface LeadListingProps {
  leads: Lead[];
  salesReps: SalesRep[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onReassignLead: (leadId: string, repId: string, repName: string) => void;
  onOpenScheduleTestDrive: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
}

export const LeadListing: React.FC<LeadListingProps> = ({
  leads,
  salesReps,
  onSelectLead,
  onUpdateLeadStatus,
  onReassignLead,
  onOpenScheduleTestDrive,
  onOpenNewLeadModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedRep, setSelectedRep] = useState<string>('ALL');
  const [selectedScore, setSelectedScore] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'budget' | 'score'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-select for bulk action
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkRepId, setBulkRepId] = useState<string>('');

  // Source Badge renderer
  const renderSourceBadge = (source: LeadSource) => {
    switch (source) {
      case 'Facebook Ads':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-md font-medium">
            <Facebook className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Facebook Ads</span>
          </span>
        );
      case 'Google Search':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-md font-medium">
            <Search className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            <span>Google Search</span>
          </span>
        );
      case 'Twitter / X':
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-800 text-slate-200 border border-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
            <Twitter className="w-3 h-3 text-sky-400" />
            <span>Twitter / X</span>
          </span>
        );
      case 'HSR Website':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-md font-medium">
            <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>HSR Website</span>
          </span>
        );
      case 'Offline Event':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 text-xs px-2.5 py-1 rounded-md font-medium">
            <MapPin className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span>Offline Event</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-md font-medium">
            <Car className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Showroom Walk-in</span>
          </span>
        );
    }
  };

  // Status Badge styling
  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'Contacted':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800';
      case 'Test Drive Scheduled':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'Qualified':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      case 'Won':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      case 'Lost':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
    }
  };

  // Filtered and Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.interestedModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'ALL' || lead.status === selectedStatus;
        const matchesSource = selectedSource === 'ALL' || lead.source === selectedSource;
        const matchesRep = selectedRep === 'ALL' || lead.assignedRepId === selectedRep;
        const matchesScore = selectedScore === 'ALL' || lead.score === selectedScore;

        return matchesSearch && matchesStatus && matchesSource && matchesRep && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'createdAt') {
          return sortOrder === 'desc'
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortBy === 'budget') {
          return sortOrder === 'desc' ? b.budgetValue - a.budgetValue : a.budgetValue - b.budgetValue;
        } else {
          const scoreOrder = { Hot: 3, Warm: 2, Cold: 1 };
          return sortOrder === 'desc'
            ? scoreOrder[b.score] - scoreOrder[a.score]
            : scoreOrder[a.score] - scoreOrder[b.score];
        }
      });
  }, [leads, searchTerm, selectedStatus, selectedSource, selectedRep, selectedScore, sortBy, sortOrder]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkReassign = () => {
    if (!bulkRepId) return;
    const targetRep = salesReps.find((r) => r.id === bulkRepId);
    if (!targetRep) return;

    selectedLeadIds.forEach((id) => {
      onReassignLead(id, targetRep.id, targetRep.name);
    });
    setSelectedLeadIds([]);
    setBulkRepId('');
  };

  const handleExportCSV = () => {
    const headers = ['Lead ID', 'Customer Name', 'Phone', 'Email', 'City', 'Source', 'Status', 'Score', 'Car Model', 'Budget', 'Assigned Rep'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.customerName}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.city}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.score}"`,
      `"${l.interestedModel}"`,
      `"${l.budget}"`,
      `"${l.assignedRepName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HSR_Motors_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Summary metrics bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Screen 1: Lead Listing</span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Real-Time Inbox
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Consolidated lead stream across Facebook, Google, Twitter, HSR Website, and Offline Events.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-slate-500 dark:text-slate-400">Total Filtered:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{filteredLeads.length}</span>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center space-x-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span className="text-rose-700 dark:text-rose-300 font-medium">SLA Breached:</span>
              <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">
                {leads.filter((l) => l.isSlaBreached).length}
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-2">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-emerald-800 dark:text-emerald-300 font-medium">Hot Prospects:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                {leads.filter((l) => l.score === 'Hot').length}
              </span>
            </div>

            <button
              id="btn-export-csv"
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              id="search-leads-input"
              type="text"
              placeholder="Search leads by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-lead-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Test Drive Scheduled">Test Drive Scheduled</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won / Booked</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Source Channel Filter */}
          <div>
            <select
              id="filter-lead-source"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Sources</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Google Search">Google Search</option>
              <option value="Twitter / X">Twitter / X</option>
              <option value="HSR Website">HSR Website</option>
              <option value="Offline Event">Offline Event</option>
              <option value="Showroom Walk-in">Showroom Walk-in</option>
            </select>
          </div>

          {/* Sales Rep Filter */}
          <div>
            <select
              id="filter-sales-rep"
              value={selectedRep}
              onChange={(e) => setSelectedRep(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Sales Reps</option>
              {salesReps.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary controls: Score Filter + Sort Options */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-3 text-xs">
          
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Intent Score:</span>
            {['ALL', 'Hot', 'Warm', 'Cold'].map((sc) => (
              <button
                key={sc}
                onClick={() => setSelectedScore(sc)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedScore === sc
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {sc === 'Hot' ? '🔥 Hot' : sc === 'Warm' ? '⚡ Warm' : sc === 'Cold' ? '❄️ Cold' : 'All'}
              </button>
            ))}
          </div>

          {/* Sorting Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="createdAt">Date Received</option>
              <option value="budget">Budget Amount</option>
              <option value="score">Lead Score</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              title="Toggle Asc/Desc"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (if items selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-emerald-900/90 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-emerald-600 shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{selectedLeadIds.length} lead(s) selected</span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-emerald-200">Reassign to:</span>
            <select
              value={bulkRepId}
              onChange={(e) => setBulkRepId(e.target.value)}
              className="bg-slate-900 text-slate-100 border border-emerald-500 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="">Select Rep...</option>
              {salesReps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleApplyBulkReassign}
              disabled={!bulkRepId}
              className="bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg hover:bg-emerald-300 disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Main Table / Grid of Leads */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredLeads.length > 0 &&
                      selectedLeadIds.length === filteredLeads.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Source Channel</th>
                <th className="py-3.5 px-4">Car Preference</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Status & Score</th>
                <th className="py-3.5 px-4">SLA Timer</th>
                <th className="py-3.5 px-4">Assigned Sales Rep</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Car className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No leads matched your criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new lead.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isChecked = selectedLeadIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        lead.isSlaBreached ? 'bg-rose-50/40 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleLead(lead.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Customer Name & Location */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-emerald-500 cursor-pointer flex items-center gap-1.5"
                          onClick={() => onSelectLead(lead)}
                        >
                          <span>{lead.customerName}</span>
                          {lead.score === 'Hot' && (
                            <span title="Hot Lead High Purchase Intent">🔥</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span>{lead.phone}</span>
                          <span>•</span>
                          <span>{lead.city}</span>
                        </div>
                      </td>

                      {/* Source Channel */}
                      <td className="py-3.5 px-4">
                        {renderSourceBadge(lead.source)}
                      </td>

                      {/* Car Preference */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {lead.interestedModel}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {lead.fuelType} • {lead.bodyType}
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {lead.budget}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {lead.purchaseTimeframe}
                        </div>
                      </td>

                      {/* Status & Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none ${getStatusBadgeStyle(lead.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Test Drive Scheduled">Test Drive</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>

                          {/* Score Pill */}
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            lead.score === 'Hot'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : lead.score === 'Warm'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                          }`}>
                            {lead.score}
                          </span>
                        </div>
                      </td>

                      {/* SLA Timer */}
                      <td className="py-3.5 px-4">
                        {lead.isSlaBreached ? (
                          <span className="inline-flex items-center space-x-1 bg-rose-500/20 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md font-bold text-[10px] border border-rose-500/30 animate-pulse">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span>SLA Breached</span>
                          </span>
                        ) : lead.status === 'New' ? (
                          <span className="inline-flex items-center space-x-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-1 rounded-md font-semibold text-[10px] border border-amber-500/30">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>{lead.slaMinutesRemaining}m left</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>On Track</span>
                          </span>
                        )}
                      </td>

                      {/* Assigned Rep */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.assignedRepId}
                          onChange={(e) => {
                            const rep = salesReps.find((r) => r.id === e.target.value);
                            if (rep) onReassignLead(lead.id, rep.id, rep.name);
                          }}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none"
                        >
                          {salesReps.map((rep) => (
                            <option key={rep.id} value={rep.id}>
                              {rep.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          
                          {/* Call Button */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* WhatsApp Trigger */}
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400 rounded-lg transition-colors border border-teal-200 dark:border-teal-800"
                            title="Send WhatsApp Message"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Schedule Test Drive */}
                          <button
                            onClick={() => onOpenScheduleTestDrive(lead)}
                            className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                            title="Schedule Test Drive"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>

                          {/* View 360 Details */}
                          <button
                            onClick={() => onSelectLead(lead)}
                            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 rounded-lg transition-colors font-bold text-[11px]"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
