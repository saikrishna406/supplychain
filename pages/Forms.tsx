import React, { useState } from 'react';
import { AppState, User, PhoneRecord } from '../types';
import { ArrowLeft, Loader2, CheckCircle2, ShieldAlert, Info, MapPin, User as UserIcon, Calendar, Box } from 'lucide-react';
import { getSupplyChainInsights } from '../services/geminiService';
import { mockBlockchain } from '../services/mockBlockchain';

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
    model: 'IPHONE_16_ULTRA',
    receiver: '',
    manufacturer: 'CHAIN_MFG_LTD',
  });
  const [aiInsight, setAiInsight] = useState<{ analysis: string, riskScore: number } | null>(null);
  const [fetchedPhone, setFetchedPhone] = useState<PhoneRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const titles = {
    [AppState.ADD_PHONE]: 'PROVISION_DEVICE',
    [AppState.TRANSFER]: 'TRANSFER_OWNERSHIP',
    [AppState.TRACK]: 'TRACE_HISTORY',
    [AppState.VERIFY]: 'CRYPT_VERIFY',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFetchedPhone(null);

    // Process AI insights
    if (type === AppState.VERIFY || type === AppState.TRACK) {
      const insight = await getSupplyChainInsights(formData.imei);
      setAiInsight(insight);
    }

    // Simulate Network Delay
    await new Promise(r => setTimeout(r, 1500));

    let result = false;

    if (type === AppState.ADD_PHONE) {
      result = await mockBlockchain.addPhone(formData.imei, formData.model, user.address || '0xManufacturer');
    } else if (type === AppState.TRANSFER) {
      result = await mockBlockchain.transferPhone(formData.imei, formData.receiver, user.address || '0xSender');
    } else if (type === AppState.TRACK || type === AppState.VERIFY) {
      const phone = await mockBlockchain.getPhone(formData.imei);
      if (phone) {
        setFetchedPhone(phone);
        result = true;
      } else {
        setError("DEVICE_NOT_FOUND_ON_CHAIN");
        result = false;
      }
    }

    setLoading(false);
    if (result) {
      setSuccess(true);
    } else if (!error) {
      setError("TRANSACTION_FAILED_OR_DUPLICATE");
    }
  };

  if (success && (type === AppState.TRACK || type === AppState.VERIFY)) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-[70vh] bg-chorke-blue">
        <div className="max-w-2xl w-full bg-white p-8 md:p-12 border-4 border-black shadow-[20px_20px_0px_#000]">
          <button onClick={onBack} className="mb-6 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest hover:underline">
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-6">
            <div className="w-16 h-16 bg-chorke-green border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h2 className="font-space text-3xl font-black uppercase italic">VERIFIED_AUTHENTIC</h2>
              <p className="font-mono text-xs text-gray-500">{fetchedPhone?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">MODEL</p>
              <p className="font-space text-2xl font-bold">{fetchedPhone?.model}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">CURRENT_OWNER</p>
              <p className="font-mono text-sm bg-gray-100 p-2 border border-black">{fetchedPhone?.currentOwner}</p>
            </div>
          </div>

          {/* History Feed */}
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">IMMUTABLE_HISTORY</p>
            <div className="space-y-4">
              {fetchedPhone?.history.map((tx, i) => (
                <div key={i} className="flex gap-4 p-4 border-2 border-dashed border-gray-300 hover:border-black transition-colors">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-xs shrink-0">
                    {i + 1}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm uppercase">{tx.action}</p>
                    <p className="font-mono text-[10px] text-gray-500 truncate">Tx: {tx.txHash}</p>
                    <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase text-gray-400">
                      <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                      <span>To: {tx.to.slice(0, 6)}...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {aiInsight && (
            <div className="text-left p-6 bg-[#f8f8f8] border-2 border-black space-y-4 relative overflow-hidden mb-8">
              <div className="flex items-center justify-between border-b border-black pb-4">
                <span className="font-space font-black text-xs uppercase italic">AI_SECURITY_AUDIT</span>
                <span className={`text-[10px] font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] ${aiInsight.riskScore < 30 ? 'bg-chorke-green' : 'bg-chorke-pink'}`}>
                  RISK: {aiInsight.riskScore}%
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-gray-800 italic">
                "{aiInsight.analysis}"
              </p>
            </div>
          )}

        </div>
      </div>
    );
  }

  if (success && (type === AppState.ADD_PHONE || type === AppState.TRANSFER)) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[70vh] bg-chorke-green">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-12 border-4 border-black shadow-[20px_20px_0px_#000]">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-bounce">
              <CheckCircle2 size={40} />
            </div>
          </div>
          <h2 className="font-space text-4xl font-black uppercase italic">TRANSACTION_CONFIRMED</h2>
          <p className="font-mono text-xs">Block: #812,029<br />Gas Used: 21,000</p>
          <button onClick={onBack} className="brutal-btn-pill w-full bg-black text-white border-4 border-black hover:bg-white hover:text-black shadow-[6px_6px_0px_#000]">
            Return & Continue
          </button>
        </div>
      </div>
    )
  }

  // ... (Keep existing form layout for the input phase, just adding the error display) ...
  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12">
      <button
        onClick={onBack}
        className="group flex items-center gap-3 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-[#00f090] transition-colors"
      >
        <ArrowLeft size={16} /> BACK_TO_ORIGIN
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-12">
          <h1 className="font-space text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter italic">
            {titles[type as keyof typeof titles]}
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] leading-loose max-w-sm border-l-4 border-black pl-6">
            NOTICE: This operation queries the decentralized ledger. No personal data is stored. Truth is immutable.
          </p>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-bold text-xs uppercase tracking-widest">
              ⚠ {error}
            </div>
          )}

          {!user.isConnected && type === AppState.VERIFY && (
            <div className="p-8 bg-chorke-blue border-4 border-black shadow-[10px_10px_0px_#000]">
              <div className="flex gap-4 items-start">
                <Info className="shrink-0" size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase italic tracking-widest">Public Access Mode</p>
                  <p className="text-[10px] font-bold uppercase mt-2 leading-relaxed text-gray-600">You are accessing verification as a Guest. No wallet required.</p>
                </div>
              </div>
            </div>
          )}

          {user.isConnected && (
            <div className="p-8 bg-chorke-pink border-4 border-black shadow-[10px_10px_0px_#000]">
              <div className="flex gap-4 items-start">
                <ShieldAlert className="shrink-0" size={24} />
                <div>
                  <p className="text-[10px] font-black uppercase italic tracking-widest">Institutional Signature Required</p>
                  <p className="text-[10px] font-bold uppercase mt-2 leading-relaxed">TX will be signed by: {user.address?.slice(0, 10)}...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-10 bg-white border-4 border-black shadow-[16px_16px_0px_#fde047]">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">DEVICE_IMEI_OR_SERIAL</label>
              <input
                type="text"
                placeholder="E.G. 358402100..."
                value={formData.imei}
                onChange={(v) => setFormData({ ...formData, imei: v.target.value })}
                className="w-full bg-[#f8f8f8] border-2 border-black rounded-none p-5 focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_#000] transition-all font-mono text-sm tracking-widest"
              />
            </div>

            {(type === AppState.ADD_PHONE || type === AppState.TRANSFER) && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{type === AppState.ADD_PHONE ? "MODEL_IDENTIFIER" : "RECIPIENT_LEDGER_ADDR"}</label>
                  <input
                    type="text"
                    placeholder={type === AppState.ADD_PHONE ? "MODEL_X_PRO" : "0x..."}
                    value={type === AppState.ADD_PHONE ? formData.model : formData.receiver}
                    onChange={(v) => type === AppState.ADD_PHONE ? setFormData({ ...formData, model: v.target.value }) : setFormData({ ...formData, receiver: v.target.value })}
                    className="w-full bg-[#f8f8f8] border-2 border-black rounded-none p-5 focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_#000] transition-all font-mono text-sm tracking-widest"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.imei}
              className="brutal-btn-pill w-full py-6 bg-chorke-green text-black uppercase text-sm border-4 border-black disabled:bg-gray-100 disabled:text-gray-400 font-black italic shadow-[8px_8px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={20} />
                  QUERYING_LEDGER...
                </div>
              ) : (
                titles[type as keyof typeof titles]
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
