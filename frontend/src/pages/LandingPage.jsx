import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Lock, AlertTriangle, Key, Users, 
  ChevronRight, Sparkles, Check, HelpCircle, ArrowRight,
  Shield, CheckCircle2, FileText, Bell, EyeOff, BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // FAQs State
  const [openFaq, setOpenFaq] = useState(null);

  // Payment Simulation State for landing page pricing
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: 'Premium', price: '₹99/month', family: false });

  // 3D Mouse Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width; // 0 to 1
    const y = (e.clientY - card.top) / card.height; // 0 to 1
    const tiltX = (y - 0.5) * 14; // -7deg to +7deg
    const tiltY = (0.5 - x) * 14; // -7deg to +7deg
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const faqs = [
    {
      q: "How does inactivity detection work?",
      a: "If you enable inactivity monitoring, the system watches for periodic logins. If you do not access the system for your set threshold (e.g., 30 days), LifePause begins a secure countdown sending SMS and email check-ins. If no check-in response is received, your selected vault items are securely released to your trusted contacts."
    },
    {
      q: "Is my private data readable by LifePause administrators?",
      a: "No. LifePause uses zero-knowledge inspired client side encryption principles. Your vaults are locked using keys generated from your credentials. We have no access to the keys nor the plain text content of your passwords and folders."
    },
    {
      q: "Can I cancel a pending emergency countdown?",
      a: "Yes! If a countdown begins, you can instantly cancel it by tapping 'Check In' from our email, SMS links, or logging into your dashboard. This instantly returns the status to inactive."
    },
    {
      q: "What is the difference between Emergency Access and Viewer access?",
      a: "A contact with 'Viewer' permissions can see your medical profile instantly for general coordinate needs. 'Emergency Access' contacts are granted secure vault decryption access only AFTER the inactivity countdown has expired or you manually click SOS trigger."
    }
  ];

  const handlePlanClick = (planName, price, family) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    setSelectedPlan({ name: planName, price, family });
    setPaymentOpen(true);
  };

  return (
    <div className="bg-brand-dark min-h-screen relative overflow-hidden text-slate-200 perspective-1000">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none z-0" />
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-accent/15 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-neon/8 blur-[180px] pointer-events-none" />

      {/* Floating Interactive 3D Background Shapes */}
      <div className="absolute top-[20%] left-[8%] w-16 h-16 bg-gradient-to-tr from-brand-accent to-brand-neon rounded-2xl opacity-20 filter blur-[1px] animate-float-3d-slow pointer-events-none hidden md:block preserve-3d" />
      <div className="absolute top-[65%] right-[6%] w-24 h-24 border-[3px] border-dashed border-brand-accent/20 rounded-full opacity-35 animate-spin-3d-slow pointer-events-none hidden md:block" />
      <div className="absolute bottom-[25%] left-[10%] w-20 h-20 bg-brand-neon/10 rounded-full filter blur-[2px] animate-float-3d-medium pointer-events-none hidden md:block preserve-3d" />

      {/* Navigation Header */}
      <header className="sticky top-0 w-full glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center z-50">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-accent p-2 rounded-xl text-white shadow-glow-indigo">
            <ShieldAlert size={18} />
          </div>
          <span className="font-bold text-white tracking-wide text-lg">LifePause</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</Link>
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-semibold rounded-xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center gap-1.5"
            >
              Go to Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link
                to="/signup"
                className="px-4.5 py-2 bg-brand-accent text-white text-xs font-semibold rounded-xl hover:bg-brand-accent/90 transition-all shadow-glow-indigo"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-accent/15 border border-brand-accent/30 rounded-full text-xs text-brand-accent font-semibold mb-6 animate-pulse"
        >
          <Sparkles size={12} /> Introducing Digital Legacy Automation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl"
        >
          Your Digital Life, Protected Even When{' '}
          <span className="bg-gradient-to-r from-brand-accent via-indigo-400 to-brand-neon bg-clip-text text-transparent">
            You’re Not There
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-slate-400 text-base sm:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          LifePause secures your credentials, medical cards, and critical files, automating release to trusted family members if you become inactive. Complete emergency redundancy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-accent to-brand-neon text-white font-semibold rounded-2xl hover:opacity-95 shadow-glow-indigo transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
          >
            Start Protecting Your Legacy <ChevronRight size={18} />
          </Link>
          <a
            href="#workflow"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/10 text-slate-300 font-medium rounded-2xl hover:bg-white/10 transition-all transform hover:-translate-y-1"
          >
            How it works
          </a>
        </motion.div>

        {/* Floating UI cards simulation with Mouse-Tracking 3D Perspective Tilt */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-5xl relative cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="glass rounded-3xl border border-white/10 shadow-2xl p-4 md:p-6 bg-slate-900/40 relative overflow-hidden backdrop-blur-xl preserve-3d card-3d"
            style={{ 
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(30px)`,
              transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)'
            }}
          >
            {/* Top Dashboard Simulation */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-glow-alert" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest">EMERGENCY PROTOCOL v2.4 // ACTIVE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-5 bg-slate-950/70 border border-white/5 rounded-2xl text-left transform transition-transform hover:translate-z-10 hover:border-brand-neon/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold tracking-wider">Inactivity Monitor</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-success animate-pulse shadow-[0_0_10px_#10B981]" />
                </div>
                <span className="text-2xl font-black text-white tracking-wide">Active</span>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Countdown triggers in 30 days of absolute silence.</p>
              </div>
              {/* Card 2 */}
              <div className="p-5 bg-slate-950/70 border border-white/5 rounded-2xl text-left transform transition-transform hover:translate-z-10 hover:border-brand-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold tracking-wider">Emergency Contacts</span>
                  <span className="text-[10px] font-bold text-brand-neon bg-brand-neon/10 px-2 py-0.5 rounded-full border border-brand-neon/20">2 Verified</span>
                </div>
                <span className="text-2xl font-black text-white tracking-wide">Priya S., Rajesh S.</span>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Configured for Decryption Vault Release.</p>
              </div>
              {/* Card 3 */}
              <div className="p-5 bg-slate-950/70 border border-white/5 rounded-2xl text-left transform transition-transform hover:translate-z-10 hover:border-brand-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold tracking-wider">Locker Encryption</span>
                  <Lock size={12} className="text-brand-accent" />
                </div>
                <span className="text-2xl font-black text-white tracking-wide">Zero-Knowledge</span>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">Passwords, Bank details, Medical card locked.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem Statement - Extruded 3D Isometric Blocks */}
      <section className="py-24 bg-slate-950/60 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">The Vulnerability</h2>
            <p className="text-3xl sm:text-5xl font-black text-white">What happens to your digital life in an emergency?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-brand-alert/30 transition-all iso-depth-accent preserve-3d">
              <AlertTriangle className="text-brand-alert mb-5" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Locked Out Families</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your family cannot access banking pins, passwords, or legacy settings when they need it most, triggering months of legal loops.
              </p>
            </div>
            <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-brand-warning/30 transition-all iso-depth-cyan preserve-3d">
              <EyeOff className="text-brand-warning mb-5" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Hidden Medical Records</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Critical health details, drug allergies, insurance numbers, and preferred hospitals remain hidden inside deep desktop folders.
              </p>
            </div>
            <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all iso-depth-accent preserve-3d">
              <ShieldAlert className="text-brand-accent mb-5" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Uncontrolled Accounts</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Subscriptions run continuously, charging credit cards, while digital profiles are left unattended without closure directives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview with 3D Holographic Card Display */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-xs font-bold text-brand-neon uppercase tracking-widest mb-3">Our Core Mandate</h2>
              <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">Designed to pause and protect.</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                LifePause was founded as a modern startup product built exclusively for emergency redundancy. We act as a digital dead-man’s switch. 
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-success mt-0.5 shrink-0" size={18} />
                  <div>
                    <strong className="text-white text-sm block">Smart Check-in Ping</strong>
                    <span className="text-xs text-slate-400">Periodic confirmations ensure you are actively in control.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-success mt-0.5 shrink-0" size={18} />
                  <div>
                    <strong className="text-white text-sm block">Family Decryption Trust</strong>
                    <span className="text-xs text-slate-400">Release access details only to users verified with custom credentials.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-tr from-brand-accent/20 to-brand-neon/15 p-[2px] rounded-3xl border border-white/10 overflow-hidden transform hover:rotate-2 hover:scale-[1.01] transition-transform duration-500 shadow-glow-cyan">
              <div className="glass rounded-[22px] p-6 bg-slate-900/60 preserve-3d">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Ready for SOS trigger</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950/60 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-400">Manual Check-In Status</span>
                    <span className="text-brand-success font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-brand-success animate-ping" /> Active & Safe
                    </span>
                  </div>
                  <div className="p-3 bg-brand-alert/10 border border-brand-alert/20 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-brand-alert font-bold">SOS Manual Override</span>
                    <button className="bg-brand-alert text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-alert/90 shadow-glow-alert transition-all">Trigger SOS</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Emergency Workflow timeline */}
      <section id="workflow" className="py-24 bg-slate-950/60 relative z-10 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Automation Flow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">How the emergency pipeline executes</p>
          </div>

          <div className="relative border-l-2 border-white/10 ml-4 md:ml-32 space-y-12">
            {/* Step 1 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brand-accent rounded-full border-4 border-slate-950 group-hover:scale-125 transition-transform" />
              <div className="absolute -left-28 top-0.5 text-xs text-slate-500 font-bold hidden md:block w-20 text-right">Step 1</div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-brand-accent transition-colors">Configure Inactivity Monitor</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Set up a duration threshold (e.g. 30 days). If you do not access LifePause, our background job triggers.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brand-warning rounded-full border-4 border-slate-950 group-hover:scale-125 transition-transform" />
              <div className="absolute -left-28 top-0.5 text-xs text-slate-500 font-bold hidden md:block w-20 text-right">Step 2</div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-brand-warning transition-colors">Initiate Verification Pings</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                We send alerts to you via SMS and email. If you check in (even a single click), we reset the inactivity counter.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brand-alert rounded-full border-4 border-slate-950 group-hover:scale-125 transition-transform" />
              <div className="absolute -left-28 top-0.5 text-xs text-slate-500 font-bold hidden md:block w-20 text-right">Step 3</div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-brand-alert transition-colors">Secure Countdown Trigger</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                If the verification ping is ignored, a 7-day countdown starts. We alert you and notify your trusted contacts that check-ins are failing.
              </p>
            </div>
            {/* Step 4 */}
            <div className="relative pl-8 group">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-brand-success rounded-full border-4 border-slate-950 group-hover:scale-125 transition-transform" />
              <div className="absolute -left-28 top-0.5 text-xs text-slate-500 font-bold hidden md:block w-20 text-right">Step 4</div>
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-brand-success transition-colors">Decryption Release</h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Once the countdown expires, the encryption keys are securely shared with your verified emergency contacts. They gain vault access based on your rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Zero Knowledge features */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-16">
            <h2 className="text-xs font-bold text-brand-neon uppercase tracking-widest mb-3">Military Grade Protection</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Built on Zero-Knowledge Security</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 glass rounded-2xl border border-white/5 text-left hover:border-brand-neon/30 transition-all card-3d preserve-3d">
              <Key className="text-brand-neon mb-4" size={28} />
              <h4 className="text-base font-bold text-white mb-2">Zero-Knowledge</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your encrypted data remains private and accessible only to authorized users. We never see your vaults.
              </p>
            </div>
            <div className="p-6 glass rounded-2xl border border-white/5 text-left hover:border-brand-success/30 transition-all card-3d preserve-3d">
              <Shield className="text-brand-success mb-4" size={28} />
              <h4 className="text-base font-bold text-white mb-2">Audited History</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every file upload, login, and setting changes triggers a logged security alert to lock malicious attempts.
              </p>
            </div>
            <div className="p-6 glass rounded-2xl border border-white/5 text-left hover:border-brand-accent/30 transition-all card-3d preserve-3d">
              <BrainCircuit className="text-brand-accent mb-4" size={28} />
              <h4 className="text-base font-bold text-white mb-2">Biometric Locking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secure authentication checks block device hijacking with secondary email token confirmation.
              </p>
            </div>
            <div className="p-6 glass rounded-2xl border border-white/5 text-left hover:border-brand-warning/30 transition-all card-3d preserve-3d">
              <Users className="text-brand-warning mb-4" size={28} />
              <h4 className="text-base font-bold text-white mb-2">Double Verification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Family members are verified via multi-step token matching prior to gaining emergency vault access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-950/60 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Testimonials</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Trusted by families across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-brand-accent/25 transition-all">
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "As a startup founder in Bangalore, my digital footprints are massive. Setting up LifePause gives me peace of mind that my wife can seamlessly access our banking, investments, and keys if something happens to me."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-xs">AS</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Amit Sharma</h4>
                  <span className="text-[10px] text-slate-500">Tech Entrepreneur, Bangalore</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-brand-neon/25 transition-all">
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "The Medical Card feature is amazing. During my father's hospitalization last month, having his health profile and health policy number instantly readable on the dashboard saved us critical hours."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-neon/20 flex items-center justify-center font-bold text-brand-neon text-xs">PS</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Priya Sen</h4>
                  <span className="text-[10px] text-slate-500">Product Manager, Mumbai</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-brand-success/25 transition-all">
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "Our family set up the Family Plan with 4 members. We share insurance policies and have shared emergency countdown settings. Highly professional security and extremely polished interface."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-success/20 flex items-center justify-center font-bold text-brand-success text-xs">VR</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Vikram Roy</h4>
                  <span className="text-[10px] text-slate-500">Cardiologist, New Delhi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Interactive 3D Holographic Pillars */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-brand-neon uppercase tracking-widest mb-3">Flexible Plans</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Protect your legacy at your pace</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto perspective-1000">
            {/* Free Plan */}
            <div className="p-8 glass rounded-3xl border border-white/5 flex flex-col justify-between card-3d preserve-3d transition-transform hover:-translate-y-4 hover:scale-[1.02] duration-300">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Basic Security</span>
                <h3 className="text-2xl font-black text-white mb-2">Free Plan</h3>
                <span className="text-3xl font-black text-white block mb-6">₹0 <span className="text-xs text-slate-500 font-medium">/ forever</span></span>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> 5 Vault Items</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> 2 Secure Documents</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> 1 Trusted Contact</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> 3 Active Reminders</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Medical Emergency Card</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Manual SOS Trigger</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-500 line-through"><Check size={14} className="text-slate-600" /> Inactivity Automation</li>
                </ul>
              </div>
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl text-center transition-all block"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="p-8 glass rounded-3xl border border-brand-accent/50 shadow-glow-indigo flex flex-col justify-between relative card-3d preserve-3d transition-transform hover:-translate-y-6 hover:scale-[1.03] duration-300 transform md:-translate-y-2">
              <span className="absolute top-4 right-4 bg-brand-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_#6366F1]">Most Popular</span>
              <div>
                <span className="text-xs font-bold text-brand-accent uppercase tracking-widest block mb-4">Complete Automation</span>
                <h3 className="text-2xl font-black text-white mb-2">Premium Plan</h3>
                <span className="text-3xl font-black text-white block mb-6">₹99 <span className="text-xs text-slate-500 font-medium">/ month</span></span>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Unlimited Vault Items</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Unlimited Documents</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Unlimited Reminders</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Inactivity Monitoring</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Automated Emergency Trigger</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Smart Analytics Dashboard</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Export/Import backups</li>
                </ul>
              </div>
              <button
                onClick={() => handlePlanClick('Premium', '₹99/month', false)}
                className="w-full py-3 bg-gradient-to-r from-brand-accent to-brand-neon text-white text-xs font-bold rounded-xl text-center transition-all block shadow-glow-indigo"
              >
                Upgrade to Premium
              </button>
            </div>

            {/* Family Plan */}
            <div className="p-8 glass rounded-3xl border border-white/5 flex flex-col justify-between card-3d preserve-3d transition-transform hover:-translate-y-4 hover:scale-[1.02] duration-300">
              <div>
                <span className="text-xs font-bold text-brand-neon uppercase tracking-widest block mb-4">Complete Coordination</span>
                <h3 className="text-2xl font-black text-white mb-2">Family Plan</h3>
                <span className="text-3xl font-black text-white block mb-6">₹299 <span className="text-xs text-slate-500 font-medium">/ month</span></span>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Everything in Premium</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Up to 5 Family Members</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Shared Vault & Locker</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Shared Emergency Workflows</li>
                  <li className="flex items-center gap-2.5 text-xs text-slate-300"><Check size={14} className="text-brand-success" /> Family Admin controls</li>
                </ul>
              </div>
              <button
                onClick={() => handlePlanClick('Family', '₹299/month', true)}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl text-center transition-all block"
              >
                Upgrade Family
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-24 bg-slate-950/60 relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">Learn More</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <HelpCircle size={16} className="text-brand-neon shrink-0" /> {faq.q}
                  </span>
                  <span className="text-slate-400 text-lg">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-brand-dark relative z-10 px-6 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-accent p-1.5 rounded-lg text-white">
              <ShieldAlert size={14} />
            </div>
            <span className="font-bold text-white text-sm">LifePause</span>
          </div>
          <span className="text-xs text-slate-500">© 2026 LifePause Digital Legacy Systems Private Limited. All rights reserved.</span>
          <span className="text-xs text-slate-500 font-medium">Zero-Knowledge Certified | SSL Encrypted</span>
        </div>
      </footer>

      {/* Payment simulation modal */}
      {paymentOpen && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          familyMode={selectedPlan.family}
        />
      )}
    </div>
  );
};

export default LandingPage;
