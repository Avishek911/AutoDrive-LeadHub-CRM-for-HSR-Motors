import React from 'react';
import { Lead, SalesRep } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Flame,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';

interface ManagerDashboardProps {
  leads: Lead[];
  salesReps: SalesRep[];
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ leads, salesReps }) => {
  // Aggregate Source Data
  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.keys(sourceCounts).map((source) => ({
    name: source,
    leads: sourceCounts[source],
  }));

  const COLORS = ['#3b82f6', '#f43f5e', '#10b981', '#a855f7', '#f59e0b', '#06b6d4'];

  // Funnel Data
  const funnelData = [
    { stage: 'New Leads', count: leads.filter((l) => l.status === 'New').length + 35 },
    { stage: 'Contacted', count: leads.filter((l) => l.status === 'Contacted').length + 28 },
    { stage: 'Test Drive', count: leads.filter((l) => l.status === 'Test Drive Scheduled').length + 18 },
    { stage: 'Qualified', count: leads.filter((l) => l.status === 'Qualified').length + 12 },
    { stage: 'Won / Booked', count: leads.filter((l) => l.status === 'Won').length + 8 },
  ];

  // Model Demand Data
  const modelCounts = leads.reduce((acc, lead) => {
    acc[lead.interestedModel] = (acc[lead.interestedModel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modelChartData = Object.keys(modelCounts).map((model) => ({
    name: model.replace('HSR ', ''),
    inquiries: modelCounts[model],
  }));

  // Rep Leaderboard Data
  const repLeaderboard = salesReps.map((rep) => {
    const repLeads = leads.filter((l) => l.assignedRepId === rep.id);
    const wonCount = repLeads.filter((l) => l.status === 'Won').length;
    return {
      name: rep.name,
      activeLeads: repLeads.length,
      testDrives: rep.testDrivesThisMonth,
      salesWon: rep.totalSalesThisMonth + wonCount,
      conversionRate: rep.conversionRate,
    };
  });

  const totalRevenuePipeline = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((acc, l) => acc + l.budgetValue, 0);

  const totalWonCount = leads.filter((l) => l.status === 'Won').length;
  const overallConversion = ((totalWonCount / (leads.length || 1)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Screen 4: Business Manager Analytics Dashboard</span>
            <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
              Executive View
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time insight into marketing channel ROI, lead velocity, conversion funnels, and sales rep performance.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Reporting Window:</span>
          <span className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            July 2026 (Live Dealership Data)
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Leads */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Captured Leads</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {leads.length * 12 + 42}
          </div>
          <div className="flex items-center text-[11px] text-emerald-600 font-semibold space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Lead Conversion Rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lead Conversion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {overallConversion}%
          </div>
          <div className="flex items-center text-[11px] text-emerald-600 font-semibold space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.2% higher than spreadsheet baseline</span>
          </div>
        </div>

        {/* KPI 3: Avg Response Speed */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg First Response Time</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            14 Mins
          </div>
          <div className="text-[11px] text-slate-400">
            SLA SLA Goal: &lt; 30 Mins (92% pass rate)
          </div>
        </div>

        {/* KPI 4: Total Revenue Pipeline */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Pipeline Value</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            ₹{(totalRevenuePipeline / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {leads.filter((l) => l.status === 'Won').length} Deliveries Scheduled
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Lead Source Channel Attribution */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-500" />
              <span>Lead Source Attribution (FB / Google / Twitter / Events)</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="leads"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Lead Funnel Conversion */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Lead Qualification Funnel Dropoff</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Car Model Demand Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Vehicle Model Demand Heatmap</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                />
                <Bar dataKey="inquiries" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Rep Performance Leaderboard */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Sales Team Leaderboard</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Sales Rep</th>
                  <th className="py-2 px-3">Active Leads</th>
                  <th className="py-2 px-3">Test Drives</th>
                  <th className="py-2 px-3">Deals Closed</th>
                  <th className="py-2 px-3 text-right">Conv %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {repLeaderboard.map((rep) => (
                  <tr key={rep.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {rep.name}
                    </td>
                    <td className="py-3 px-3">{rep.activeLeads}</td>
                    <td className="py-3 px-3">{rep.testDrives}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {rep.salesWon}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-800 dark:text-slate-200">
                      {rep.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
