import React from 'react';
import { CheckCircle2, FileText, ChevronRight, Info, Download, Heart, ArrowLeft, ShieldCheck, Fingerprint, MapPin, AlertCircle } from 'lucide-react';
import { MedicalExtraction, PatientData } from '../types';
import { motion } from 'motion/react';

interface BenefitRoadmapProps {
  extraction: MedicalExtraction;
  patient: PatientData;
  onReset: () => void;
}

export const BenefitRoadmap: React.FC<BenefitRoadmapProps> = ({ extraction, patient, onReset }) => {
  const { 
    document_analysis, 
    financial_summary, 
    recommended_programs, 
    anti_red_tape_guide
  } = extraction;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full"
    >
      {/* Local Top Nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Patient Registry
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Verification ID: {Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
          <div className="status-pill bg-emerald-50 text-emerald-600 border border-emerald-100">Eligible for UHC Aid</div>
        </div>
      </div>

      <div className="balance-grid flex-grow overflow-auto">
        {/* LEFT PANEL: Patient Information */}
      <aside className="panel border-r border-slate-200">
        <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">UHC Citizen Health Wallet</h2>
        <div className="mb-8">
          <div className="text-2xl font-bold text-slate-900">{patient.name}</div>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-tight">
            {patient.category} • {patient.age} years old
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {patient.isVerified && (
              <span className="status-pill bg-blue-600 text-white flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Identity Verified (RA 10173)
              </span>
            )}
            <span className="status-pill bg-emerald-100 text-emerald-700">PhilHealth Active</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Hospital Bill Analysis</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase">Facility</label>
                <p className="text-xs font-bold text-slate-700">{document_analysis.hospital_name}</p>
                <span className="text-[9px] uppercase font-bold text-slate-400">{document_analysis.hospital_type} Setting</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Diagnosis</label>
                <p className="text-xs font-bold text-slate-700">{document_analysis.diagnosis}</p>
              </div>
            </div>
          </div>

          <div className="card-border p-4 bg-blue-50 border-blue-100">
            <h3 className="text-[10px] font-bold text-blue-800 uppercase mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Nearest YAKAP Facility
            </h3>
            <p className="text-xs font-bold text-blue-900">Philippine General Hospital (PGH)</p>
            <p className="text-[10px] text-blue-700 mt-1">2.3 km away • Metro Manila Rollout</p>
            <button className="mt-3 w-full py-2 bg-white border border-blue-200 text-blue-600 text-[10px] font-bold uppercase rounded hover:bg-blue-100 transition-all">
              View on Maps
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SECTION: Financial Breakdown */}
      <section className="panel space-y-8">
        <div>
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Financial Support Breakdown</h2>
          <div className="relative overflow-hidden bg-[#0f172a] text-white rounded-2xl p-8 shadow-2xl border border-white/5">
             <div className="relative z-10">
               <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Hospital Bill</div>
                    <div className="text-4xl font-bold tracking-tighter">₱{document_analysis.total_bill.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-400 uppercase tracking-widest mb-1">Total Net Payable</div>
                    <div className="text-3xl font-bold text-emerald-400 leading-none">₱{financial_summary.net_payable.toLocaleString()}.00</div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400">
                      <span>UHC Coverage Overview</span>
                      <span>{Math.round(((document_analysis.total_bill - financial_summary.net_payable) / document_analysis.total_bill) * 100)}% Funded</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full flex overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(financial_summary.philhealth_coverage / document_analysis.total_bill) * 100}%` }} />
                      <div className="h-full bg-emerald-500" style={{ width: `${(financial_summary.yakap_coverage / document_analysis.total_bill) * 100}%` }} />
                      <div className="h-full bg-purple-500" style={{ width: `${(financial_summary.ngo_dswd_coverage / document_analysis.total_bill) * 100}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-xs font-mono uppercase tracking-tight">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-slate-400">PhilHealth Coverage</span>
                      <span className="text-blue-400 font-bold">-₱{financial_summary.philhealth_coverage.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-slate-400 text-xs font-bold text-emerald-400">YAKAP Benefit</span>
                      <span className="text-emerald-400 font-bold">-₱{financial_summary.yakap_coverage.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                       <span className="text-slate-400">Other Aid (DSWD/NGO)</span>
                       <span className="text-purple-400 font-bold">-₱{financial_summary.ngo_dswd_coverage.toLocaleString()}</span>
                    </div>
                  </div>
               </div>
             </div>
             <div className="absolute -right-8 -bottom-8 opacity-5">
               <Heart className="w-56 h-56" />
             </div>
          </div>
        </div>

        {/* Recommended Programs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Partner Programs</h2>
            <div className="flex-grow h-px bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended_programs.map((program, idx) => (
              <div key={idx} className="card-border p-5 hover:border-blue-200 transition-colors bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{program.agency_name}</h3>
                  <div className="p-1 bg-emerald-50 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide text-emerald-600">{program.coverage_type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Anti-Red Tape Checklist */}
      <aside className="panel bg-slate-50 border-l border-slate-200">
        <h2 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-6">Anti-Red Tape (ART) Guide</h2>
        <div className="space-y-8 flex-grow">
          {anti_red_tape_guide.map((step, idx) => (
            <div key={idx} className="flex gap-4 group">
              <div className="w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="bg-white p-6 card-border shadow-sm flex flex-col items-center">
            <div className="w-full bg-slate-900 aspect-square rounded-xl flex items-center justify-center mb-6 relative group cursor-pointer overflow-hidden">
               <div className="grid grid-cols-5 gap-1 p-4 opacity-80 group-hover:opacity-100 transition-opacity">
                 {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`w-full h-full ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                 ))}
               </div>
               <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Show in Hospital</span>
               </div>
            </div>
            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-4 text-center">Encrypted Verification Token</p>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest mb-3 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
               <Download className="w-4 h-4" /> Save Patient Pass
            </button>
            <p className="text-[9px] text-slate-400 text-center leading-tight">Present this QR to any YAKAP or Malasakit Center window for instant processing.</p>
          </div>
        </div>
      </aside>
      </div>
    </motion.div>
  );
};
