import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Send, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/AppStateContext';

export const PaymentModal = ({ isOpen, onClose, planName, planPrice, familyMode = false }) => {
  const { upgradeSubscription } = useAuth();
  const { showToast } = useAppState();
  const [method, setMethod] = useState('card'); // 'card' | 'upi'
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  
  // Card Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI Fields
  const [upiId, setUpiId] = useState('');

  // Family Emails
  const [familyEmails, setFamilyEmails] = useState(['', '', '']);

  const handleFamilyEmailChange = (index, val) => {
    const updated = [...familyEmails];
    updated[index] = val;
    setFamilyEmails(updated);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (method === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        showToast('Please fill all card fields.', 'error');
        return;
      }
    } else {
      if (!upiId || !upiId.includes('@')) {
        showToast('Please enter a valid UPI ID (e.g. name@okhdfc).', 'error');
        return;
      }
    }

    setStep('processing');
    
    // Simulate API Upgrade Call after a delay
    setTimeout(async () => {
      try {
        const activeFamilyEmails = familyEmails.filter(email => email.trim() !== '');
        const res = await upgradeSubscription(planName, activeFamilyEmails);
        if (res.success) {
          setStep('success');
        } else {
          showToast(res.message || 'Payment processing failed.', 'error');
          setStep('form');
        }
      } catch (err) {
        showToast('Payment execution crashed. Try again.', 'error');
        setStep('form');
      }
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg overflow-hidden glass rounded-3xl border border-white/10 shadow-2xl relative"
      >
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-white mb-1">Upgrade to {planName}</h3>
              <p className="text-sm text-slate-400 mb-6">
                Complete your transaction securely to unlock premium digital protection.
              </p>

              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Plan selected</span>
                  <span className="text-base font-semibold text-white">{planName} Plan</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Due</span>
                  <span className="text-lg font-bold text-brand-neon">{planPrice}</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950/40 p-1.5 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    method === 'card'
                      ? 'bg-brand-accent text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard size={16} /> Credit/Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    method === 'upi'
                      ? 'bg-brand-accent text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Send size={16} /> UPI ID
                </button>
              </div>

              <form onSubmit={handlePay}>
                {method === 'card' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. Amit Sharma"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        placeholder="4532 9982 1204 4829"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Expiry Date</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">CVV</label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={3}
                          className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors text-center"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">UPI ID</label>
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="amitsharma@okhdfcbank"
                        className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-colors"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">A payment request will be sent to your mobile payment app.</span>
                    </div>
                  </div>
                )}

                {/* Family Setup Fields if Family mode */}
                {familyMode && (
                  <div className="mt-6 border-t border-white/5 pt-4 space-y-3">
                    <label className="block text-xs font-bold text-brand-neon uppercase tracking-wider">Invite Family Members (Up to 3 emails)</label>
                    {familyEmails.map((email, idx) => (
                      <input
                        key={idx}
                        type="email"
                        value={email}
                        onChange={(e) => handleFamilyEmailChange(idx, e.target.value)}
                        placeholder={`Member ${idx + 1} Email (e.g. sibling@family.com)`}
                        className="w-full bg-slate-900/40 border border-white/5 rounded-xl px-4 py-2 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-semibold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={18} /> Pay Securely {planPrice}
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <ShieldCheck size={12} className="text-brand-success" /> SSL Encrypted & Zero-Knowledge Guaranteed.
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 flex flex-col items-center justify-center text-center"
            >
              <Loader2 size={48} className="text-brand-accent animate-spin mb-6" />
              <h3 className="text-lg font-bold text-white mb-2">Verifying Transaction</h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Communicating with authorization gateway. Please do not close or reload this window.
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 md:p-12 flex flex-col items-center justify-center text-center"
            >
              <CheckCircle2 size={56} className="text-brand-success mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade Successful!</h3>
              <p className="text-sm text-slate-300 max-w-sm mb-6">
                Congratulations! Your LifePause account is now upgraded to the <span className="font-bold text-brand-neon">{planName} Plan</span>. Enjoy unlimited access.
              </p>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-all"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
