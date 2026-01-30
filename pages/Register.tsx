
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, AppState } from '../types';
import { Loader2, Zap, Wallet, AlertCircle, User as UserIcon, Building2, Lock, Mail } from 'lucide-react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
    onLoginSuccess: (user: User) => void;
    onNavigate?: (state: AppState) => void; // Deprecated
}

export const Register: React.FC<RegisterProps> = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError("MetaMask not found. Please install it.");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to connect wallet.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (!walletAddress) {
            setError("Manufacturers must connect a wallet to verify identity.");
            return;
        }

        setLoading(true);

        try {
            // 1. Sign up with Supabase Auth
            const { data, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        company_name: formData.companyName
                    }
                }
            });

            if (authError) throw authError;
            if (!data.user) throw new Error("Registration failed.");

            // 2. Create Profile in DB
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        role: 'Manufacturer',
                        wallet_address: walletAddress,
                        full_name: formData.fullName,
                        company_name: formData.companyName,
                        email: formData.email
                    }
                ]);

            if (profileError) throw profileError;

            // Success
            onLoginSuccess({
                address: walletAddress,
                isConnected: !!walletAddress,
                role: 'Manufacturer'
            });

        } catch (err: any) {
            setError(err.message || "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white p-12 rounded-[48px] shadow-2xl border border-zinc-100 space-y-10">
                <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#1A1A1A]">Join Protocol.</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest max-w-sm mx-auto">
                        Register your manufacturing node on the ChainTrack supply network.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Full Name</label>
                            <div className="relative">
                                <UserIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    className="w-full bg-[#F2F2EB] rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Company ID</label>
                            <div className="relative">
                                <Building2 size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Tech Corp Ltd."
                                    className="w-full bg-[#F2F2EB] rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    autoComplete="organization"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Corporate Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@techcorp.com"
                                className="w-full bg-[#F2F2EB] rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#F2F2EB] rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Confirm Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="w-full bg-[#F2F2EB] rounded-2xl pl-14 pr-6 py-4 text-sm font-bold placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 ml-4">Web3 Identity</label>
                        <div className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer hover:bg-zinc-50 ${walletAddress ? 'border-[#C6F052] bg-[#C6F052]/5' : 'border-zinc-200'}`} onClick={!walletAddress ? connectWallet : undefined}>
                            {walletAddress ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[#1A1A1A]">
                                        <div className="w-10 h-10 rounded-full bg-[#C6F052] flex items-center justify-center text-black">
                                            <Wallet size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-ultra">Connected Wallet</p>
                                            <p className="text-xs font-black font-mono">{walletAddress}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-[#C6F052] rounded-full text-[9px] font-black uppercase">Verified</div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 py-2 text-center">
                                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                                        <Zap size={20} />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-[#4D5DFB]">Link Ethereum Wallet</p>
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-ultra">Required for cryptographic signing</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 text-red-500 bg-red-50 p-5 rounded-2xl border border-red-100">
                            <AlertCircle size={18} />
                            <p className="text-[10px] font-bold uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-pill btn-pill-lime w-full py-6 text-sm flex justify-center items-center gap-3 shadow-xl hover:translate-y-[-2px] hover:shadow-2xl transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Initialize Account Access'}
                        </button>
                    </div>

                    <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-[#4D5DFB]" onClick={() => navigate('/login')}>
                        Already have access? <span className="text-[#1A1A1A] underline decoration-2 decoration-[#C6F052]">Login here</span>
                    </p>
                </form>
            </div>
        </div>
    );
};
