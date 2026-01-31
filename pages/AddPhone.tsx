
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { AppState, User } from '../types';
import { blockchainService } from '../services/blockchain';
import { supabase } from '../lib/supabase';
import { Loader2, Smartphone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface AddPhoneProps {
    user: User;
}

export const AddPhone: React.FC<AddPhoneProps> = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ imei: '', model: '' });
    const [status, setStatus] = useState<'idle' | 'mining' | 'syncing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const toastId = toast.loading("Initiating transaction...");
        setStatus('mining');
        setErrorMessage('');

        try {
            // 1. Submit to Blockchain (The "Truth")
            const tx = await blockchainService.addPhone(formData.imei, formData.model);
            setTxHash(tx.hash);

            toast.loading("Transaction confirmed! Syncing Database...", { id: toastId });

            // 2. Transaction Confirmed, now Sync to Database (The "Cache")
            setStatus('syncing');

            const { error } = await supabase.from('devices').insert([
                {
                    imei: formData.imei,
                    model: formData.model,
                    manufacturer_id: (await supabase.auth.getUser()).data.user?.id,
                    status: 'Manufactured'
                }
            ]);

            if (error) throw error;

            toast.success("Device Successfully Minted!", { id: toastId });
            setStatus('success');

            // Trigger Confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Removed auto-redirect so user can see QR Code

        } catch (err: any) {
            console.error(err);
            setStatus('error');

            // Smart Contract Revert Reason Handling
            const msg = err.reason || err.message || "";
            if (msg.includes("Phone already exists")) {
                toast.error("IMEI already registered on Ledger!", { id: toastId });
                setErrorMessage("This IMEI is already registered on the blockchain! Please use a unique IMEI.");
            } else if (msg.includes("user rejected")) {
                toast.error("Transaction Rejected", { id: toastId });
                setErrorMessage("Transaction rejected by user.");
            } else {
                toast.error("Transaction Failed", { id: toastId });
                setErrorMessage("Blockchain Transaction Failed. Check console for details.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
            <div className="max-w-xl w-full bg-white p-12 rounded-[48px] shadow-2xl border border-zinc-100 space-y-10 relative overflow-hidden">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-10 left-10 p-3 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-black transition-all"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="text-center space-y-4 pt-8">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">Mint Device.</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest max-w-sm mx-auto">
                        Permanently register a new unit on the Ethereum Blockchain.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="flex flex-col items-center gap-8 animate-in zoom-in duration-300 py-4">
                        <div className="bg-white p-4 rounded-3xl shadow-lg border border-zinc-100">
                            <QRCodeCanvas
                                value={`${window.location.origin}/verify?imei=${formData.imei}`}
                                size={200}
                                bgColor={"#FFFFFF"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Device Minted Successfully!</h3>
                            <p className="text-[10px] font-mono text-zinc-400 break-all max-w-xs">{txHash}</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-zinc-100 rounded-full text-xs font-bold uppercase hover:bg-zinc-200 transition-colors"
                            >
                                Return to Dashboard
                            </button>
                            <button
                                onClick={() => window.open(`${window.location.origin}/verify?imei=${formData.imei}`, '_blank')}
                                className="px-6 py-3 bg-[#4D5DFB] text-white rounded-full text-xs font-bold uppercase hover:brightness-110 transition-all shadow-lg"
                            >
                                Verify Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">IMEI / Serial Number</label>
                                <input
                                    type="text"
                                    name="imei"
                                    placeholder="Example: 354672091823746"
                                    className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.imei}
                                    onChange={handleChange}
                                    required
                                    disabled={status !== 'idle' && status !== 'error'}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Model Name</label>
                                <input
                                    type="text"
                                    name="model"
                                    placeholder="Example: iPhone 15 Pro Max"
                                    className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                    disabled={status !== 'idle' && status !== 'error'}
                                />
                            </div>
                        </div>

                        {/* Status / Error Message */}
                        {status === 'error' && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 border border-red-100">
                                <AlertCircle size={18} />
                                <p className="text-[10px] font-bold uppercase tracking-wide">{errorMessage}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status !== 'idle' && status !== 'error'}
                            className={`btn-pill w-full py-6 text-sm flex justify-center items-center gap-3 shadow-xl transition-all ${status === 'mining' || status === 'syncing' ? 'bg-zinc-100 text-zinc-400 cursor-wait' : 'btn-pill-lime hover:translate-y-[-2px] hover:shadow-2xl'}`}
                        >
                            {status === 'mining' ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span className="uppercase tracking-widest text-[10px]">Awaiting Blockchain Confirmation...</span>
                                </>
                            ) : status === 'syncing' ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span className="uppercase tracking-widest text-[10px]">Syncing Database...</span>
                                </>
                            ) : (
                                <>
                                    <Smartphone size={18} /> Mint on Blockchain
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
