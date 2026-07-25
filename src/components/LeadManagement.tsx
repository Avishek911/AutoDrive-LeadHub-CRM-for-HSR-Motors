import React, { useState } from 'react';
import { Lead, LeadStatus, SalesRep, AutoRoutingRule } from '../types';
import { 
  Kanban, 
  Clock, 
  AlertCircle, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  Car, 
  CheckCircle2, 
  UserPlus, 
  Settings2,
  Trash2,
  Flame,
  ArrowRight
} from 'lucide-react';

interface LeadManagementProps {
  leads: Lead[];
  salesReps: SalesRep[];
  routingRules: AutoRoutingRule[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onReassignLead: (leadId: string, repId: string, repName: string) => void;
  onCreateRoutingRule: (rule: AutoRoutingRule) => void;
  onToggleRoutingRule: (ruleId: string) => void;
}

export const LeadManagement: React.FC<LeadManagementProps> = ({
  leads,
  salesReps,
  routingRules,
  onSelectLead,
  onUpdateLeadStatus,
  onReassignLead,
  onCreateRoutingRule,
  onToggleRoutingRule,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'rules'>('kanban');
  const [showRuleModal, setShowRuleModal] = useState(false);

  // New Rule Form State
  const [ruleName, setRuleName] = useState('');
  const [ruleSource, setRuleSource] = useState('Facebook Ads');
  const [ruleMinBudget, setRuleMinBudget] = useState(1500000);
  const [ruleAssignRepId, setRuleAssignRepId] = useState(salesReps[0]?.id || '');

  const columns: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'New', label: 'New Leads', color: 'border-t-blue-500' },
    { id: 'Contacted', label: 'Contacted', color: 'border-t-indigo-500' },
    { id: 'Test Drive Scheduled', label: 'Test Drive Scheduled', color: 'border-t-amber-500' },
    { id: 'Qualified', label: 'Qualified / Negotiation', color: 'border-t-purple-500' },
    { id: 'Won', label: 'Won / Booked', color: 'border-t-emerald-500' },
    { id: 'Lost', label: 'Lost', color: 'border-t-rose-500' },
  ];

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = salesReps.find((r) => r.id === ruleAssignRepId);
    if (!rep) return;

    const newRule: AutoRoutingRule = {
      id: `rule-${Date.now()}`,
      ruleName: ruleName || `${ruleSource} Auto-Route to ${rep.name}`,
      sourceFilter: ruleSource,
      minBudgetValue: Number(ruleMinBudget),
      assignToRepId: rep.id,
      assignToRepName: rep.name,
      isActive: true,
    };

    onCreateRoutingRule(newRule);
    setShowRuleModal(false);
    setRuleName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Screen Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Screen 3: Lead Management & Pipeline Kanban</span>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-300 dark:border-indigo-800">
              Workflow Engine
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual pipeline board with real-time SLA breach countdowns and automated lead routing rules.
          </p>
        </div>

        {/* View Switcher: Kanban Board vs Routing Rules */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'kanban'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Auto-Routing Rules ({routingRules.length})</span>
          </button>
        </div>
      </div>

      {/* View 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {columns.map((col) => {
              const colLeads = leads.filter((l) => l.status === col.id);

              return (
                <div
                  key={col.id}
                  className={`flex-1 min-w-[280px] bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 border-t-4 ${col.color} space-y-3 flex flex-col`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Cards inside column */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                    {colLeads.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-xs">
                        No leads in {col.label}
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className={`bg-white dark:bg-slate-900 p-4 rounded-xl border transition-all shadow-sm hover:shadow-md ${
                            lead.isSlaBreached
                              ? 'border-rose-500 shadow-rose-500/10 dark:border-rose-600 ring-2 ring-rose-500/30'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {/* Top: SLA or Score Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400">
                              {lead.id}
                            </span>

                            {lead.isSlaBreached ? (
                              <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px] px-2 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-1 animate-pulse">
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                <span>SLA Breached</span>
                              </span>
                            ) : (
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                                lead.score === 'Hot'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                                {lead.score === 'Hot' ? '🔥 Hot' : '⚡ Warm'}
                              </span>
                            )}
                          </div>

                          {/* Customer Title */}
                          <h4
                            onClick={() => onSelectLead(lead)}
                            className="font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-emerald-500 cursor-pointer"
                          >
                            {lead.customerName}
                          </h4>

                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            {lead.interestedModel}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                            <span>{lead.budget}</span>
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium text-[10px]">
                              {lead.source}
                            </span>
                          </div>

                          {/* Rep Assignment & Action Bar */}
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]" title={lead.assignedRepName}>
                              👤 {lead.assignedRepName}
                            </span>

                            {/* Move Status buttons */}
                            <div className="flex items-center space-x-1">
                              {col.id !== 'New' && (
                                <button
                                  onClick={() => {
                                    const prevIdx = columns.findIndex((c) => c.id === col.id) - 1;
                                    if (prevIdx >= 0) onUpdateLeadStatus(lead.id, columns[prevIdx].id);
                                  }}
                                  className="p-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded"
                                  title="Move to previous stage"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {col.id !== 'Lost' && col.id !== 'Won' && (
                                <button
                                  onClick={() => {
                                    const nextIdx = columns.findIndex((c) => c.id === col.id) + 1;
                                    if (nextIdx < columns.length) onUpdateLeadStatus(lead.id, columns[nextIdx].id);
                                  }}
                                  className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold"
                                  title="Move to next stage"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: AUTOMATED ROUTING RULES ENGINE */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-emerald-500" />
                  <span>Automated Lead Distribution Engine</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure automated rules to assign high-intent Facebook, Google, or Event leads directly to specialized Sales Consultants.
                </p>
              </div>

              <button
                onClick={() => setShowRuleModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create Routing Rule</span>
              </button>
            </div>

            {/* Rules List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Rule Name</th>
                    <th className="py-3 px-4">Channel Source Filter</th>
                    <th className="py-3 px-4">Min Budget Condition</th>
                    <th className="py-3 px-4">Auto-Assigned Sales Rep</th>
                    <th className="py-3 px-4 text-center">Rule Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {routingRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {rule.ruleName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-semibold">
                          {rule.sourceFilter}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        ≥ ₹{(rule.minBudgetValue / 100000).toFixed(1)} Lakhs
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        👤 {rule.assignToRepName}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onToggleRoutingRule(rule.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                            rule.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {rule.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onToggleRoutingRule(rule.id)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                        >
                          Toggle State
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating Auto-Routing Rule */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-emerald-500" />
              <span>Create Auto-Routing Rule</span>
            </h3>

            <form onSubmit={handleCreateRuleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Budget Facebook EV leads to Priya"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Channel Source Condition</label>
                <select
                  value={ruleSource}
                  onChange={(e) => setRuleSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="HSR Website">HSR Website</option>
                  <option value="Offline Event">Offline Event</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Min Customer Budget: ₹{(ruleMinBudget / 100000).toFixed(1)} Lakhs
                </label>
                <input
                  type="range"
                  min="500000"
                  max="3000000"
                  step="100000"
                  value={ruleMinBudget}
                  onChange={(e) => setRuleMinBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To Sales Rep</label>
                <select
                  value={ruleAssignRepId}
                  onChange={(e) => setRuleAssignRepId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-bold"
                >
                  {salesReps.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.name} ({rep.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
