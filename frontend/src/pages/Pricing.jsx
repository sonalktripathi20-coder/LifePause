import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { PremiumCard } from '../components/PremiumCard';
import { Sparkles, Check, ChevronRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export const Pricing = () => {
  const { user } = useAuth();
  const { showToast } = useAppState();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Premium', price: '₹99/month', family: false });

  const handleUpgrade = (planName, price, family) => {
    setSelectedPlan({ name: planName, price, family });
    setPaymentOpen(true);
  };

  return (
    <DashboardLayout pageTitle="Subscription Plans">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Upgrade Your Legacy Safety</h3>
        <p className="text-xs text-slate-400">
          Unleash automatic inactivity switches, complete shared family lockers, and zero-knowledge encryption models.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto mb-12">
        {/* Free Plan */}
        <PremiumCard hoverGlow="none" className="flex flex-col justify-between p-6">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Basic Access</span>
            <h4 className="text-lg font-bold text-white mb-1">Free Plan</h4>
            <span className="text-xl font-bold text-white block mb-5">₹0 <span className="text-xs text-slate-500">/ forever</span></span>
            
            <ul className="space-y-3 mb-6 text-left text-xs">
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> 5 Vault Items</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> 2 Secure Documents</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> 1 Trusted Contact</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Medical Emergency Card</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Manual SOS Trigger</li>
              <li className="flex items-center gap-2 text-slate-500 line-through"><Check size={12} className="text-slate-600" /> Inactivity Dead-man Switch</li>
            </ul>
          </div>
          <button
            disabled
            className="w-full py-2 bg-white/5 border border-white/5 text-slate-500 text-xs font-semibold rounded-xl text-center"
          >
            Current Plan
          </button>
        </PremiumCard>

        {/* Premium Plan */}
        <PremiumCard hoverGlow="indigo" className="flex flex-col justify-between p-6 border-brand-accent/40 shadow-glow-indigo relative transform md:-translate-y-1">
          <span className="absolute top-3 right-3 bg-brand-accent text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
          <div>
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest block mb-3">Complete Automation</span>
            <h4 className="text-lg font-bold text-white mb-1">Premium Plan</h4>
            <span className="text-xl font-bold text-white block mb-5">₹99 <span className="text-xs text-slate-500">/ month</span></span>
            
            <ul className="space-y-3 mb-6 text-left text-xs">
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Unlimited Vault Items</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Unlimited Documents</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Unlimited Contacts & Reminders</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Automatic Inactivity Monitors</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Cyberpunk Analytics audits</li>
            </ul>
          </div>
          
          {user?.subscriptionPlan === 'Premium' ? (
            <span className="text-xs text-brand-success font-semibold flex items-center justify-center gap-1 py-2">
              <CheckCircle2 size={12} /> Active Premium Plan
            </span>
          ) : (
            <button
              onClick={() => handleUpgrade('Premium', '₹99/month', false)}
              className="w-full py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl text-center shadow-glow-indigo"
            >
              Upgrade to Premium
            </button>
          )}
        </PremiumCard>

        {/* Family Plan */}
        <PremiumCard hoverGlow="cyan" className="flex flex-col justify-between p-6">
          <div>
            <span className="text-[10px] font-bold text-brand-neon uppercase tracking-widest block mb-3">Coordinated Trust</span>
            <h4 className="text-lg font-bold text-white mb-1">Family Plan</h4>
            <span className="text-xl font-bold text-white block mb-5">₹299 <span className="text-xs text-slate-500">/ month</span></span>
            
            <ul className="space-y-3 mb-6 text-left text-xs">
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Everything in Premium</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Register Up to 5 Family Members</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Shared Legacy Lockers</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Multi-recipient SOS dispatch</li>
              <li className="flex items-center gap-2 text-slate-300"><Check size={12} className="text-brand-success" /> Family Admin controls</li>
            </ul>
          </div>
          
          {user?.subscriptionPlan === 'Family' ? (
            <span className="text-xs text-brand-success font-semibold flex items-center justify-center gap-1 py-2">
              <CheckCircle2 size={12} /> Active Family Plan
            </span>
          ) : (
            <button
              onClick={() => handleUpgrade('Family', '₹299/month', true)}
              className="w-full py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl text-center"
            >
              Upgrade Family Plan
            </button>
          )}
        </PremiumCard>
      </div>

      {paymentOpen && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          familyMode={selectedPlan.family}
        />
      )}
    </DashboardLayout>
  );
};

export default Pricing;
