import React, { useState } from 'react';
import { Lead, LeadSource, FuelType, BodyType, SalesRep } from '../types';
import { X, UserPlus, Car, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesReps: SalesRep[];
  onAddLead: (newLead: Lead) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  salesReps,
  onAddLead,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [source, setSource] = useState<LeadSource>('Facebook Ads');
  const [interestedModel, setInterestedModel] = useState('HSR Volt EV Cruiser');
  const [fuelType, setFuelType] = useState<FuelType>('Electric (EV)');
  const [bodyType, setBodyType] = useState<BodyType>('EV / Eco');
  const [budgetText, setBudgetText] = useState('₹20.0 - ₹24.0 Lakhs');
  const [budgetValue, setBudgetValue] = useState(2200000);
  const [purchaseTimeframe, setPurchaseTimeframe] = useState<'Immediate (< 1 wk)' | 'This Month' | 'Next 2-3 Months' | 'Just Exploring'>('Immediate (< 1 wk)');
  const [tradeInVehicle, setTradeInVehicle] = useState('');
  const [assignedRepId, setAssignedRepId] = useState(salesReps[0]?.id || 'rep-1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rep = salesReps.find((r) => r.id === assignedRepId);

    const newLead: Lead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      phone,
      email,
      city,
      source,
      status: 'New',
      score: budgetValue > 2000000 ? 'Hot' : 'Warm',
      interestedModel,
      bodyType,
      fuelType,
      budget: budgetText,
      budgetValue,
      purchaseTimeframe,
      tradeInVehicle: tradeInVehicle || undefined,
      assignedRepId: rep?.id || 'rep-1',
      assignedRepName: rep?.name || 'Rahul Sharma',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaMinutesRemaining: 30,
      isSlaBreached: false,
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Manual Entry',
          type: 'System',
          content: `New lead created manually. Source: ${source}. Interested in ${interestedModel}.`,
        },
      ],
      notes,
      tags: ['Manual Lead', source],
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-500" />
            <span>Add New Customer Lead</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="customer@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">City / Area</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Source Channel</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Google Search">Google Search</option>
                <option value="Twitter / X">Twitter / X</option>
                <option value="HSR Website">HSR Website</option>
                <option value="Offline Event">Offline Event</option>
                <option value="Showroom Walk-in">Showroom Walk-in</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Interested Car Model</label>
              <select
                value={interestedModel}
                onChange={(e) => setInterestedModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                <option value="HSR Volt EV Cruiser">HSR Volt EV Cruiser (EV)</option>
                <option value="HSR Nexa Stealth SUV">HSR Nexa Stealth SUV</option>
                <option value="HSR City Pro Sedan">HSR City Pro Sedan</option>
                <option value="HSR Safari Titan 7-Seater">HSR Safari Titan 7-Seater</option>
                <option value="HSR Compact Hatchback">HSR Compact Hatchback</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Budget Description</label>
              <input
                type="text"
                value={budgetText}
                onChange={(e) => setBudgetText(e.target.value)}
                placeholder="e.g. ₹18.0 - ₹22.0 Lakhs"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assign to Sales Consultant</label>
              <select
                value={assignedRepId}
                onChange={(e) => setAssignedRepId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                {salesReps.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Trade-in Car (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 2018 Maruti Swift VXi"
              value={tradeInVehicle}
              onChange={(e) => setTradeInVehicle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Initial Note / Needs Summary</label>
            <textarea
              rows={2}
              placeholder="Customer interested in test drive and exchange valuation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
            >
              Save & Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
