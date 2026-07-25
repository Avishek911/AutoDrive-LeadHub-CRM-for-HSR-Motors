import React, { useState, useEffect } from 'react';
import { 
  Lead, 
  LeadStatus, 
  SalesRep, 
  AutoRoutingRule, 
  TestDrive, 
  AssignmentDocConfig 
} from './types';
import { 
  INITIAL_LEADS, 
  MOCK_SALES_REPS, 
  INITIAL_ROUTING_RULES, 
  DEFAULT_ASSIGNMENT_DOC 
} from './data/mockData';
import { Header } from './components/Header';
import { LeadListing } from './components/LeadListing';
import { LeadDetails } from './components/LeadDetails';
import { LeadManagement } from './components/LeadManagement';
import { ManagerDashboard } from './components/ManagerDashboard';
import { DeltaXAssignmentModal } from './components/DeltaXAssignmentModal';
import { NewLeadModal } from './components/NewLeadModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'listing' | 'details' | 'management' | 'dashboard'>('listing');
  const [userRole, setUserRole] = useState<'sales' | 'manager'>('sales');
  
  // State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [salesReps, setSalesReps] = useState<SalesRep[]>(MOCK_SALES_REPS);
  const [routingRules, setRoutingRules] = useState<AutoRoutingRule[]>(INITIAL_ROUTING_RULES);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(INITIAL_LEADS[0] || null);
  const [assignmentConfig, setAssignmentConfig] = useState<AssignmentDocConfig>(DEFAULT_ASSIGNMENT_DOC);

  // Modals
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isAssignmentDocOpen, setIsAssignmentDocOpen] = useState(false);

  // SLA countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLeads((prevLeads) =>
        prevLeads.map((lead) => {
          if (lead.status === 'New' && !lead.isSlaBreached) {
            const nextMinutes = lead.slaMinutesRemaining - 1;
            return {
              ...lead,
              slaMinutesRemaining: nextMinutes,
              isSlaBreached: nextMinutes <= 0,
            };
          }
          return lead;
        })
      );
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveScreen('details');
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          const isNowContacted = newStatus !== 'New';
          const updated: Lead = {
            ...lead,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            isSlaBreached: isNowContacted ? false : lead.isSlaBreached,
            activityLogs: [
              {
                id: `act-${Date.now()}`,
                timestamp: new Date().toISOString(),
                author: 'Sales Team',
                type: 'Status Change',
                content: `Status updated to "${newStatus}"`,
              },
              ...lead.activityLogs,
            ],
          };

          if (selectedLead?.id === leadId) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
  };

  const handleReassignLead = (leadId: string, repId: string, repName: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          const updated: Lead = {
            ...lead,
            assignedRepId: repId,
            assignedRepName: repName,
            updatedAt: new Date().toISOString(),
            activityLogs: [
              {
                id: `act-${Date.now()}`,
                timestamp: new Date().toISOString(),
                author: 'Manager Workflow',
                type: 'System',
                content: `Lead reassigned to ${repName}`,
              },
              ...lead.activityLogs,
            ],
          };

          if (selectedLead?.id === leadId) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
  };

  const handleAddNote = (leadId: string, noteContent: string, noteType: 'Call' | 'Note' | 'WhatsApp') => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          const updated: Lead = {
            ...lead,
            updatedAt: new Date().toISOString(),
            activityLogs: [
              {
                id: `act-${Date.now()}`,
                timestamp: new Date().toISOString(),
                author: lead.assignedRepName,
                type: noteType,
                content: noteContent,
              },
              ...lead.activityLogs,
            ],
          };

          if (selectedLead?.id === leadId) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
  };

  const handleScheduleTestDrive = (leadId: string, testDrive: TestDrive) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) => {
        if (lead.id === leadId) {
          const updated: Lead = {
            ...lead,
            status: 'Test Drive Scheduled',
            testDrive,
            updatedAt: new Date().toISOString(),
            activityLogs: [
              {
                id: `act-${Date.now()}`,
                timestamp: new Date().toISOString(),
                author: lead.assignedRepName,
                type: 'Test Drive',
                content: `Scheduled ${testDrive.locationType} for ${testDrive.date} (${testDrive.timeSlot})`,
              },
              ...lead.activityLogs,
            ],
          };

          if (selectedLead?.id === leadId) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
  };

  const handleAddLead = (newLead: Lead) => {
    // Check auto-routing rules
    let assignedRepId = newLead.assignedRepId;
    let assignedRepName = newLead.assignedRepName;

    const matchedRule = routingRules.find(
      (r) =>
        r.isActive &&
        (r.sourceFilter === 'All' || r.sourceFilter === newLead.source) &&
        newLead.budgetValue >= r.minBudgetValue
    );

    if (matchedRule) {
      assignedRepId = matchedRule.assignToRepId;
      assignedRepName = matchedRule.assignToRepName;
    }

    const finalLead: Lead = {
      ...newLead,
      assignedRepId,
      assignedRepName,
    };

    setLeads([finalLead, ...leads]);
    setSelectedLead(finalLead);
  };

  const handleCreateRoutingRule = (newRule: AutoRoutingRule) => {
    setRoutingRules([...routingRules, newRule]);
  };

  const handleToggleRoutingRule = (ruleId: string) => {
    setRoutingRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const slaBreachCount = leads.filter((l) => l.isSlaBreached).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top App Bar Header */}
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenNewLeadModal={() => setIsNewLeadOpen(true)}
        onOpenAssignmentDoc={() => setIsAssignmentDocOpen(true)}
        selectedLeadId={selectedLead?.id || null}
        totalLeadsCount={leads.length}
        slaBreachCount={slaBreachCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'listing' && (
          <LeadListing
            leads={leads}
            salesReps={salesReps}
            onSelectLead={handleSelectLead}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onReassignLead={handleReassignLead}
            onOpenScheduleTestDrive={(lead) => {
              setSelectedLead(lead);
              setActiveScreen('details');
            }}
            onOpenNewLeadModal={() => setIsNewLeadOpen(true)}
          />
        )}

        {activeScreen === 'details' && (
          <LeadDetails
            lead={selectedLead}
            onBackToListing={() => setActiveScreen('listing')}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddNote={handleAddNote}
            onScheduleTestDrive={handleScheduleTestDrive}
          />
        )}

        {activeScreen === 'management' && (
          <LeadManagement
            leads={leads}
            salesReps={salesReps}
            routingRules={routingRules}
            onSelectLead={handleSelectLead}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onReassignLead={handleReassignLead}
            onCreateRoutingRule={handleCreateRoutingRule}
            onToggleRoutingRule={handleToggleRoutingRule}
          />
        )}

        {activeScreen === 'dashboard' && (
          <ManagerDashboard
            leads={leads}
            salesReps={salesReps}
          />
        )}
      </main>

      {/* DeltaX Assignment Solution Document Generator Modal */}
      <DeltaXAssignmentModal
        isOpen={isAssignmentDocOpen}
        onClose={() => setIsAssignmentDocOpen(false)}
        config={assignmentConfig}
        onUpdateConfig={setAssignmentConfig}
        onNavigateScreen={setActiveScreen}
      />

      {/* New Lead Manual Modal */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        salesReps={salesReps}
        onAddLead={handleAddLead}
      />
    </div>
  );
}
