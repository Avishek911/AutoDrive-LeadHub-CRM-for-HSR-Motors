export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Test Drive Scheduled'
  | 'Qualified'
  | 'Won'
  | 'Lost';

export type LeadSource =
  | 'Facebook Ads'
  | 'Google Search'
  | 'Twitter / X'
  | 'HSR Website'
  | 'Offline Event'
  | 'Showroom Walk-in';

export type LeadScore = 'Hot' | 'Warm' | 'Cold';

export type FuelType = 'Petrol' | 'Diesel' | 'Electric (EV)' | 'Hybrid';

export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'EV / Eco';

export interface TestDrive {
  id: string;
  date: string;
  timeSlot: string;
  locationType: 'Home Test Drive' | 'Showroom Visit';
  address?: string;
  vehicleModel: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  author: string;
  type: 'Call' | 'Note' | 'Status Change' | 'Test Drive' | 'Email' | 'WhatsApp' | 'System';
  content: string;
}

export interface SalesRep {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  activeLeads: number;
  conversionRate: number; // percentage
  testDrivesThisMonth: number;
  totalSalesThisMonth: number;
}

export interface Lead {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  source: LeadSource;
  status: LeadStatus;
  score: LeadScore;
  interestedModel: string;
  bodyType: BodyType;
  fuelType: FuelType;
  budget: string; // e.g., "₹12 - ₹16 Lakhs" or "$25,000"
  budgetValue: number; // numerical for sorting/filtering
  purchaseTimeframe: 'Immediate (< 1 wk)' | 'This Month' | 'Next 2-3 Months' | 'Just Exploring';
  tradeInVehicle?: string; // e.g., "2018 Swift VXi"
  assignedRepId: string;
  assignedRepName: string;
  createdAt: string;
  updatedAt: string;
  slaMinutesRemaining: number; // Countdown in minutes to contact
  isSlaBreached: boolean;
  testDrive?: TestDrive;
  activityLogs: ActivityLog[];
  notes: string;
  tags: string[];
}

export interface AutoRoutingRule {
  id: string;
  ruleName: string;
  sourceFilter: string; // 'All' or specific source
  minBudgetValue: number;
  assignToRepId: string;
  assignToRepName: string;
  isActive: boolean;
}

export interface AssignmentDocConfig {
  userName: string;
  collegeId: string;
  appName: string;
  date: string;
  overview: string;
  features: string[];
  userFlow: string;
  otherLinks: string;
}
