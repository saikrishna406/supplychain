
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { User } from '../types';
import { ethers } from 'ethers';
import { blockchainService } from '../services/blockchain';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowRightCircle, CheckCircle, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

interface TransferProps {
    user: User;
}

export const Transfer: React.FC<TransferProps> = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ imei: '', newOwner: '' });
    const [status, setStatus] = useState<'idle' | 'mining' | 'syncing' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [txHash, setTxHash] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Wallet Validation
        if (!ethers.isAddress(formData.newOwner)) {
            toast.error("Invalid Wallet Address format!");
            setErrorMessage("Please enter a valid Ethereum address (starts with 0x...).");
            return;
        }

        const toastId = toast.loading("Processing Transfer...");
        setStatus('mining');
        setErrorMessage('');

        try {
            // 1. Submit to Blockchain (The "Truth")
            const tx = await blockchainService.transferPhone(formData.imei, formData.newOwner);
            setTxHash(tx.hash);

            toast.loading("Transfer confirmed on-chain! Syncing DB...", { id: toastId });

            // 2. Transaction Confirmed, now Sync to Database
            setStatus('syncing');

            // Note: In a real app we would check currentOwner, but for now we trust the blockchain tx success.
            // We just update the status to 'Distributed' as a proxy for "Sold/Transferred"
            const { error } = await supabase
                .from('devices')
                .update({
                    status: 'Distributed'
                })
                .eq('imei', formData.imei);

            if (error) throw error; // Log warning but procced

            toast.success("Ownership Transferred Successfully!", { id: toastId });
            setStatus('success');

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);

        } catch (err: any) {
            console.error(err);
            setStatus('error');

            const msg = err.reason || err.message || "";
            if (msg.includes("Only owner")) {
                toast.error("You are not the owner of this device!", { id: toastId });
                setErrorMessage("Transfer Failed: You are not the owner of this device.");
            } else {
                toast.error("Transfer Failed", { id: toastId });
                setErrorMessage("Blockchain Transaction Failed. Check console.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
            <div className="max-w-xl w-full bg-white p-12 rounded-[48px] shadow-2xl border border-zinc-100 space-y-10 relative overflow-hidden">

                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-10 left-10 p-3 rounded-full hover:bg-zinc-50 text-zinc-400 hover:text-black transition-all"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="text-center space-y-4 pt-8">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">Transfer Ownership.</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest max-w-sm mx-auto">
                        Send digital rights of a unit to a Distributor or Retailer.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-[#4D5DFB] rounded-full flex items-center justify-center text-white">
                            <CheckCircle size={40} />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Ownership Transferred!</h3>
                            <p className="text-[10px] font-mono text-zinc-400 break-all max-w-xs">{txHash}</p>
                        </div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Updating Ledger...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">IMEI / Serial Number</label>
                                <input
                                    type="text"
                                    name="imei"
                                    placeholder="Device IMEI to transfer"
                                    className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.imei}
                                    onChange={handleChange}
                                    required
                                    disabled={status !== 'idle' && status !== 'error'}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">New Owner Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="newOwner"
                                        placeholder="0x..."
                                        className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB] font-mono"
                                        value={formData.newOwner}
                                        onChange={handleChange}
                                        required
                                        disabled={status !== 'idle' && status !== 'error'}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300"><UserPlus size={20} /></div>
                                </div>
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
                            className={`btn-pill w-full py-6 text-sm flex justify-center items-center gap-3 shadow-xl transition-all ${status === 'mining' || status === 'syncing' ? 'bg-zinc-100 text-zinc-400 cursor-wait' : 'btn-pill-indigo hover:translate-y-[-2px] hover:shadow-2xl'}`}
                        >
                            {status === 'mining' ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span className="uppercase tracking-widest text-[10px]">Confirming on Blockchain...</span>
                                </>
                            ) : status === 'syncing' ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span className="uppercase tracking-widest text-[10px]">Syncing Database...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowRightCircle size={18} /> Transfer Ownership
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
