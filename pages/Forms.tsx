
import React, { useState } from 'react';
import { AppState, User } from '../types';
import { ArrowLeft, Loader2, CheckCircle2, ShieldCheck, ChevronRight, Hash, XCircle } from 'lucide-react';
import { getSupplyChainInsights } from '../services/geminiService';

interface FormProps {
  type: AppState;
  user: User;
  onBack: () => void;
}

export const Forms: React.FC<FormProps> = ({ type, user, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    imei: '',
    model: 'IPHONE_15_PRO_MAX',
    receiver: '',
  });
  const [aiInsight, setAiInsight] = useState<{ analysis: string, riskScore: number } | null>(null);

  const isFake = formData.imei === '000000000000000'; // Demo fake scenario defined in PRD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (type === AppState.VERIFY || type === AppState.TRACK) {
      const insight = await getSupplyChainInsights(formData.imei);
      setAiInsight(insight);
    }
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
  };

  const titles = {
    [AppState.ADD_PHONE]: 'Add Phone',
    [AppState.TRANSFER]: 'Transfer Ownership',
    [AppState.TRACK]: 'Track History',
    [AppState.VERIFY]: 'Verify Phone',
  };

  if (success) {
    const isVerification = type === AppState.VERIFY || type === AppState.TRACK;
    return (
      <div className="flex items-center justify-center p-8 min-h-[70vh]">
        <div className="max-w-3xl w-full text-center space-y-12 bg-white rounded-[60px] p-16 shadow-2xl animate-in zoom-in duration-300">
          <div className="flex justify-center">
            <div className={`w-24 h-24 flex items-center justify-center rounded-full ${isVerification && isFake ? 'bg-red-500 text-white' : 'bg-[#C6F052] text-black'}`}>
                {isVerification && isFake ? <XCircle size={48} /> : <CheckCircle2 size={48} />}
            </div>
          </div>
          
          <div className="space-y-6">
              <h2 className={`text-6xl font-black tracking-tighter italic uppercase leading-none`}>
                {isVerification ? (isFake ? '❌ Fake Device' : '✅ Original') : 'Transaction Signed.'}
              </h2>
              <p className="text-zinc-500 font-black uppercase text-[10px] tracking-ultra">
                {isVerification 
                  ? (isFake ? 'No record found on ChainTrack blockchain' : 'Authenticity verified via Ethereum Ledger') 
                  : 'Immutable record broadcast to network nodes'}
              </p>
          </div>
          
          {!isFake && (
            <div className="text-left p-10 bg-[#F2F2EB] rounded-[32px] space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-ultra text-[#4D5DFB]">Protocol Insights</span>
                    <span className="text-[10px] font-black uppercase text-zinc-400">IMEI: {formData.imei}</span>
                </div>
                {aiInsight && (
                    <p className="text-sm font-bold leading-relaxed text-[#1A1A1A] italic">"{aiInsight.analysis}"</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-zinc-400">Current Owner</p>
                        <p className="text-[10px] font-bold truncate">0x71C765...6d8976F</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl">
                        <p className="text-[9px] font-black uppercase text-zinc-400">Model Name</p>
                        <p className="text-[10px] font-bold">{formData.model}</p>
                    </div>
                </div>
            </div>
          )}

          <button onClick={onBack} className="btn-pill btn-pill-lime w-full py-6 text-sm flex justify-center shadow-lg">
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-20 max-w-7xl mx-auto space-y-20 min-h-screen">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-ultra text-zinc-400 hover:text-black transition-all">
        <ArrowLeft size={16} /> Previous
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-ultra text-[#4D5DFB]">/ Protocol Command</p>
            <h1 className="text-6xl md:text-[7rem] font-black text-[#1A1A1A] leading-none tracking-tighter uppercase italic">
              {titles[type as keyof typeof titles]}<span className="text-outline">.</span>
            </h1>
          </div>
          <p className="max-w-md text-xl text-zinc-500 font-bold leading-tight border-l-[8px] border-[#4D5DFB] pl-8 uppercase">
            Initialize cryptographic state transition for the mobile asset registry.
          </p>
        </div>

        <div className="lg:col-span-5 bg-white rounded-[48px] shadow-2xl p-12 space-y-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400">IMEI IDENTIFIER (15 DIGITS)</label>
                <input 
                    type="text" 
                    placeholder="358402100..." 
                    className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#4D5DFB] font-black text-sm tracking-widest uppercase"
                    value={formData.imei}
                    onChange={(e) => setFormData({...formData, imei: e.target.value})}
                    required
                />
            </div>

            {(type === AppState.ADD_PHONE || type === AppState.TRANSFER) && (
               <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400">
                        {type === AppState.ADD_PHONE ? "DEVICE MODEL" : "NEW OWNER ADDRESS"}
                    </label>
                    <input 
                        type="text" 
                        placeholder={type === AppState.ADD_PHONE ? "e.g. ULTRA_PRO_MAX" : "0x..."} 
                        className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#4D5DFB] font-black text-sm tracking-widest uppercase"
                        value={type === AppState.ADD_PHONE ? formData.model : formData.receiver}
                        onChange={(e) => type === AppState.ADD_PHONE ? setFormData({...formData, model: e.target.value}) : setFormData({...formData, receiver: e.target.value})}
                        required
                    />
               </div>
            )}

            <div className="p-6 bg-[#F2F2EB] rounded-3xl border border-zinc-100 flex gap-4">
                <ShieldCheck size={20} className="text-[#4D5DFB]" />
                <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">Only current owners or authorized manufacturers can sign these state transitions. Records are immutable once broadcast.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading || !formData.imei}
              className="btn-pill btn-pill-lime w-full py-6 text-sm flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>EXECUTE MODULE <ChevronRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
