/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  MapPin, 
  Search, 
  WifiOff, 
  RefreshCw, 
  ChevronRight, 
  Plus,
  ShieldCheck,
  Stethoscope,
  X,
  ArrowLeft,
  Fingerprint,
  ShieldCheck as Shield,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DocumentScanner } from './components/DocumentScanner';
import { BenefitRoadmap } from './components/BenefitRoadmap';
import { PatientData, MedicalExtraction } from './types';

const MOCK_PATIENTS: PatientData[] = [
  { id: 'P-001', name: 'Maria Dela Cruz', category: 'Indigent', isVerified: false, age: 45 },
  { id: 'P-002', name: 'Jose Rizal', category: 'Senior', isVerified: false, age: 62 },
];

export default function App() {
  const [step, setStep] = useState<'home' | 'consent' | 'verification' | 'scanner' | 'roadmap' | 'emergency' | 'family_choice'>('home');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [extraction, setExtraction] = useState<MedicalExtraction | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cachedBenefits, setCachedBenefits] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isForDependent, setIsForDependent] = useState(false);

  // Simulate PhilSys eVerify
  const handleVerify = async () => {
    if (!selectedPatient) return;
    setIsVerifying(true);
    
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedPatient: PatientData = {
      ...selectedPatient,
      isVerified: true,
      category: selectedPatient.age && selectedPatient.age >= 60 ? 'Senior' : selectedPatient.category
    };
    
    setSelectedPatient(updatedPatient);
    setIsVerifying(false);
    setStep('family_choice');
  };

  // Simulate Offline Persistence
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const saved = localStorage.getItem('avengers_cache_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCachedBenefits(parsed);
      } catch (e) {
        console.error("Failed to parse cache", e);
        setCachedBenefits([]);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleExtraction = (data: MedicalExtraction) => {
    setExtraction(data);
    setStep('roadmap');
    
    // Auto-save to cache
    const newCache = [{ patient: selectedPatient, data, timestamp: new Date().toISOString() }, ...cachedBenefits];
    setCachedBenefits(newCache);
    localStorage.setItem('avengers_cache_2026', JSON.stringify(newCache.slice(0, 5)));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#0f172a] font-sans flex flex-col selection:bg-blue-100">
      {/* Header - Geometric Balance Style */}
      <header className="bg-[#0f172a] text-white p-4 h-20 flex justify-between items-center border-b border-white/10 shrink-0">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            setStep('home');
            setExtraction(null);
            setSelectedPatient(null);
          }}
        >
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-xl">J</div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight uppercase">Juan's Health Wallet</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-mono">Personal Health Navigator • 2026</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider">
            <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-orange-400' : 'bg-emerald-500'}`}></div>
            <span>{isOffline ? 'Offline Data Cache' : 'Cloud Sync Active'}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono hidden md:block uppercase tracking-widest">BHW-NAV-2026</div>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-white/10 rounded transition-colors"><Search className="w-4 h-4 text-slate-400" /></button>
            <button className="p-2 hover:bg-white/10 rounded transition-colors"><Users className="w-4 h-4 text-slate-400" /></button>
            {step !== 'home' && (
              <button 
                onClick={() => {
                  setStep('home');
                  setExtraction(null);
                  setSelectedPatient(null);
                }}
                className="p-2 hover:bg-red-500/20 rounded transition-colors group flex items-center gap-2 border border-white/10 ml-2"
                title="Exit to Registry"
              >
                <X className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white hidden sm:block">Exit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto w-full px-6 py-12 space-y-12 overflow-auto"
            >
              {/* Registry Header */}
              <section>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-blue-600 pl-4 uppercase">Patient Registry</h2>
                    <p className="text-sm text-slate-500 mt-1">Select a patient to begin analysis or benefit matching.</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep('emergency')}
                      className="px-4 py-2 bg-red-600 rounded-lg text-[10px] font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-200 animate-pulse flex items-center gap-2 uppercase tracking-widest"
                    >
                      <AlertCircle className="w-4 h-4" /> Emergency
                    </button>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5 hover:underline pl-4 border-l border-slate-200">
                      <Plus className="w-4 h-4" /> Add Patient
                    </button>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 overflow-hidden rounded-xl shadow-sm">
                  {MOCK_PATIENTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setStep('consent');
                      }}
                      className="group p-8 bg-white text-left hover:bg-slate-50 transition-all flex flex-col justify-between h-[220px]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded flex items-center justify-center transition-colors">
                          <Heart className="w-5 h-5 text-red-500 group-hover:text-white" />
                        </div>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400 tracking-tighter">{p.id}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{p.name}</h3>
                        <div className="flex gap-2 mb-4">
                          <span className={`status-pill ${p.category === 'Indigent' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{p.category}</span>
                          <span className="status-pill bg-slate-100 text-slate-500">Unverified</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-600">
                          Verify Identity <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Cache Feed */}
              {cachedBenefits.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" />
                    Local Data History (Offline)
                  </h3>
                  <div className="card-border divide-y divide-slate-100 overflow-hidden shadow-sm">
                    {cachedBenefits.map((item, i) => (
                      <div 
                        key={i}
                        className="p-4 bg-white flex justify-between items-center group cursor-pointer hover:bg-slate-50"
                        onClick={() => {
                          setSelectedPatient(item.patient);
                          setExtraction(item.data);
                          setStep('roadmap');
                        }}
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                           <div>
                             <p className="font-bold text-slate-900">{item.patient?.name}</p>
                             <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{item.data?.document_analysis?.diagnosis || 'Unknown Diagnosis'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">₱{item.data?.document_analysis?.total_bill?.toLocaleString() || '0'}</p>
                          <p className="text-[10px] font-mono text-slate-400 italic">{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Unknown Time'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Quick Resources */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {[
                  { icon: Stethoscope, label: 'Rates 2026' },
                  { icon: MapPin, label: 'Centers' },
                  { icon: Heart, label: 'PhilHealth' },
                  { icon: ShieldCheck, label: 'AICS Help' }
                ].map((item, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 p-6 bg-white hover:bg-slate-50 transition-colors group">
                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'consent' && selectedPatient && (
            <motion.div 
              key="consent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto w-full px-6 py-12"
            >
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6 text-blue-600" />
                   </div>
                   <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Data Privacy Consent</h2>
                </div>

                <div className="prose prose-sm text-slate-600 mb-8">
                  <p className="font-bold text-slate-900 mb-4">Republic Act No. 10173 (Data Privacy Act of 2012)</p>
                  <p className="leading-relaxed mb-4">
                    In compliance with the Data Privacy Act, "Juan's Health Wallet" requests your consent to process medical information for the purpose of UHC benefit matching.
                  </p>
                  <ul className="space-y-3 bg-slate-50 p-4 rounded-xl list-none">
                    <li className="flex gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                       <span className="text-xs">We only use your medical data for internal benefit calculation.</span>
                    </li>
                    <li className="flex gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                       <span className="text-xs">Your data is encrypted and will not be shared with unauthorized third parties.</span>
                    </li>
                    <li className="flex gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                       <span className="text-xs">You may withdraw this consent at any time from your settings.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setStep('verification')}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all uppercase tracking-widest text-sm"
                  >
                    I Agree & Continue
                  </button>
                  <button 
                    onClick={() => setStep('home')}
                    className="w-full bg-slate-50 text-slate-400 font-bold py-3 rounded-xl hover:bg-slate-100 transition-all uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'verification' && selectedPatient && (
            <motion.div 
              key="verification"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto w-full px-6 py-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <button 
                  onClick={() => setStep('home')}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3 h-3" /> Registry
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Step 1: Identity Verification</h2>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors ${isVerifying ? 'bg-blue-50 text-blue-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                    <Fingerprint className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 uppercase tracking-wider font-bold">PhilSys eVerify Integration</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Automated Checks:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Confirm PhilSys ID Authenticity
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> RA 10645 Senior Category Verif.
                      </li>
                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> DSWD Listahanan (Poverty) Match
                      </li>
                    </ul>
                  </div>
                </div>

                <button 
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full bg-[#0f172a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Connecting to eVerify.gov.ph...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-blue-400" />
                      Verify with PhilSys
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
                  Confirms identity and pulls demographic data to bypass manual paperwork (RA 11463 Compliance).
                </p>
              </div>
            </motion.div>
          )}

          {step === 'family_choice' && selectedPatient && (
            <motion.div 
              key="family_choice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto w-full px-6 py-12"
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Who is this for?</h2>
                <p className="text-slate-500">Select if you are scanning for yourself or a dependent.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  onClick={() => {
                    setIsForDependent(false);
                    setStep('scanner');
                  }}
                  className="p-8 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-blue-500 transition-all group"
                >
                  <Users className="w-10 h-10 text-slate-300 group-hover:text-blue-500 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">For Me</h3>
                  <p className="text-xs text-slate-400">Apply my verified status directly to this analysis.</p>
                </button>

                <button 
                  onClick={() => {
                    setIsForDependent(true);
                    setStep('scanner');
                  }}
                  className="p-8 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-blue-500 transition-all group"
                >
                  <Plus className="w-10 h-10 text-slate-300 group-hover:text-blue-500 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Family Member</h3>
                  <p className="text-xs text-slate-400">I am the guardian (Son/Daughter/Spouse/Parent).</p>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'emergency' && (
            <motion.div 
              key="emergency"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto w-full px-6 py-12"
            >
              <div className="bg-red-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="w-10 h-10 text-red-200" />
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Emergency Bypass</h2>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                       <AlertCircle className="w-6 h-6" /> Your Rights (RA 8344)
                    </h3>
                    <p className="text-lg leading-relaxed mb-6 font-medium italic">
                      "Under the Anti-Hospital Deposit Law, hospitals are FORBIDDEN from demanding advance payment for emergency and serious cases."
                    </p>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-5 h-5 bg-emerald-400 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-900">1</div>
                        <p className="text-sm">Proceed to ER admission immediately. Do not stop at billing.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-5 h-5 bg-emerald-400 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-900">2</div>
                        <p className="text-sm">UHC automatic coverage applies to all emergency routing.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setStep('home')}
                      className="flex-grow bg-white text-red-600 font-bold py-4 rounded-xl text-center uppercase tracking-widest shadow-xl shadow-red-900/20"
                    >
                      Return to Home
                    </button>
                    <button 
                      onClick={() => setStep('scanner')}
                      className="flex-grow bg-red-900/40 text-white border border-white/20 backdrop-blur-sm font-bold py-4 rounded-xl text-center uppercase tracking-widest"
                    >
                      Scan Document Later
                    </button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-20 translate-x-20 opacity-10">
                  <Heart className="w-96 h-96" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'scanner' && (
            <motion.div 
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto w-full px-6 py-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <button 
                  onClick={() => setStep('home')}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3 h-3" /> Registry
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Step 2: Scan Your Bill</h2>
              </div>
              <DocumentScanner onDataExtracted={handleExtraction} />
            </motion.div>
          )}

          {step === 'roadmap' && extraction && selectedPatient && (
            <motion.div 
              key="roadmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col overflow-hidden"
            >
              <BenefitRoadmap 
                extraction={extraction} 
                patient={selectedPatient} 
                onReset={() => {
                  setStep('home');
                  setExtraction(null);
                  setSelectedPatient(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <div className="flex gap-4">
             <span>Terms of Care</span>
             <span>UHC Guidelines</span>
           </div>
           <p>© 2026 Avengers Project Manila</p>
        </div>
      </footer>
    </div>
  );
}
