import React from 'react';
import { 
  Car, 
  ListFilter, 
  UserCheck, 
  Kanban, 
  LayoutDashboard, 
  Plus, 
  Users, 
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeScreen: 'listing' | 'details' | 'management' | 'dashboard';
  setActiveScreen: (screen: 'listing' | 'details' | 'management' | 'dashboard') => void;
  userRole: 'sales' | 'manager';
  setUserRole: (role: 'sales' | 'manager') => void;
  onOpenNewLeadModal: () => void;
  onOpenAssignmentDoc?: () => void;
  selectedLeadId: string | null;
  totalLeadsCount: number;
  slaBreachCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  setActiveScreen,
  userRole,
  setUserRole,
  onOpenNewLeadModal,
  selectedLeadId,
  totalLeadsCount,
  slaBreachCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand & Dealership Identity */}
          <div className="flex items-center space-x-2.5 shrink-0 min-w-0">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
              <Car className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-100">
                  HSR Motors
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30 shrink-0">
                  LeadHub CRM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block whitespace-nowrap leading-none mt-0.5">
                Dealership Lead Management & Analytics
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs for Screens 1 to 4 */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80 shrink-0">
            <button
              id="nav-screen-1-listing"
              onClick={() => setActiveScreen('listing')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeScreen === 'listing'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-emerald-300" />
              <span>1. Lead Listing</span>
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] bg-slate-900/90 text-slate-200 rounded font-bold border border-slate-700/50">
                {totalLeadsCount}
              </span>
            </button>

            <button
              id="nav-screen-2-details"
              onClick={() => setActiveScreen('details')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeScreen === 'details'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>2. Lead Details</span>
              {selectedLeadId && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              )}
            </button>

            <button
              id="nav-screen-3-management"
              onClick={() => setActiveScreen('management')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeScreen === 'management'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-emerald-300" />
              <span>3. Kanban Pipeline</span>
              {slaBreachCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                  {slaBreachCount} SLA
                </span>
              )}
            </button>

            <button
              id="nav-screen-4-dashboard"
              onClick={() => setActiveScreen('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeScreen === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-300" />
              <span>4. Dashboard</span>
            </button>
          </nav>

          {/* Controls (Role Switcher & New Lead Button) */}
          <div className="flex items-center space-x-2 shrink-0">
            
            {/* Role Toggle Switcher */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center space-x-1 shrink-0">
              <button
                id="toggle-role-sales"
                onClick={() => setUserRole('sales')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-1 transition-all ${
                  userRole === 'sales'
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Sales Rep View"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sales Rep</span>
              </button>
              <button
                id="toggle-role-manager"
                onClick={() => setUserRole('manager')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-1 transition-all ${
                  userRole === 'manager'
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Business Manager View"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Manager</span>
              </button>
            </div>

            {/* Quick Add Lead Button */}
            <button
              id="btn-add-lead-header"
              onClick={onOpenNewLeadModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1 whitespace-nowrap transition-all shadow-md hover:shadow-emerald-500/20 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">New Lead</span>
            </button>
          </div>
        </div>

        {/* Medium & Mobile View Screen Navigation Row */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto text-xs gap-1 no-scrollbar">
          <button
            onClick={() => setActiveScreen('listing')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeScreen === 'listing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>1. Listing</span>
            <span className="px-1.5 py-0.2 bg-slate-900/80 text-[10px] rounded font-bold">{totalLeadsCount}</span>
          </button>

          <button
            onClick={() => setActiveScreen('details')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeScreen === 'details'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>2. Details</span>
          </button>

          <button
            onClick={() => setActiveScreen('management')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeScreen === 'management'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>3. Kanban</span>
            {slaBreachCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {slaBreachCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveScreen('dashboard')}
            className={`px-3 py-1 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 ${
              activeScreen === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>4. Dashboard</span>
          </button>
        </div>
      </div>
    </header>
  );
};
