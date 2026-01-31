import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User } from '../types';
import { blockchainService } from '../services/blockchain';
import { Search, Loader2, ShieldCheck, User as UserIcon, Calendar, Smartphone, Box, AlertCircle, ArrowLeft } from 'lucide-react';

interface VerifyProps {
    user: User;
}

export const Verify: React.FC<VerifyProps> = ({ user }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Get URL Params

    const [imei, setImei] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any | null>(null);
    const [error, setError] = useState('');

    // Auto-search if IMEI is in URL (QR Code Scan)
    useEffect(() => {
        const paramImei = searchParams.get('imei');
        if (paramImei) {
            setImei(paramImei);
            verifyImei(paramImei);
        }
    }, [searchParams]);

    const [history, setHistory] = useState<any[]>([]);

    const verifyImei = async (targetImei: string) => {
        setLoading(true);
        setError('');
        setData(null);
        setHistory([]);

        try {
            console.log("Verifying on Blockchain...");
            const [result, historyResult] = await Promise.all([
                blockchainService.getPhone(targetImei),
                blockchainService.getPhoneHistory(targetImei)
            ]);

            if (result) {
                setData(result);
                setHistory(historyResult);
            } else {
                setError("Device not found on the registry.");
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to verify device. Check network connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imei) return;
        verifyImei(imei);
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center pt-20 px-8 pb-20">

            {/* Header */}
            <div className="max-w-3xl w-full flex justify-between items-center mb-12">
                <button
                    onClick={() => {
                        if (user.role === 'Manufacturer') {
                            navigate('/dashboard');
                        } else {
                            navigate('/');
                        }
                    }}
                    className="p-3 rounded-full hover:bg-white text-zinc-400 hover:text-black transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="text-right">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[#1A1A1A] mb-2">Verify Unit.</h1>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        Public Blockchain Registry Search
                    </p>
                </div>
            </div>

            {/* Search Box */}
            <div className="max-w-xl w-full bg-white p-2 rounded-full shadow-xl flex items-center border border-zinc-100 mb-16 hover:scale-[1.01] transition-transform">
                <input
                    type="text"
                    placeholder="ENTER IMEI / SERIAL NUMBER..."
                    className="flex-1 bg-transparent px-8 py-4 text-sm font-black uppercase tracking-widest outline-none placeholder:text-zinc-300"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading || !imei}
                    className="bg-[#C6F052] w-14 h-14 rounded-full flex items-center justify-center text-[#1A1A1A] hover:brightness-105 disabled:opacity-50 transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                </button>
            </div>

            {/* Results Area */}
            {error && (
                <div className="max-w-xl w-full bg-red-50 text-red-500 p-6 rounded-3xl flex items-center gap-4 border border-red-100 animate-in slide-in-from-bottom-2">
                    <AlertCircle size={24} />
                    <p className="text-xs font-black uppercase tracking-wide">{error}</p>
                </div>
            )}

            {data && (
                <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                    {/* Main Pass card */}
                    <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-zinc-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck size={120} />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="w-16 h-16 bg-[#C6F052] rounded-2xl flex items-center justify-center text-[#1A1A1A]">
                                <Smartphone size={32} />
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-ultra text-zinc-400 mb-2">Authenticity</p>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A1A1A]">Verified Genuine</h2>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-ultra text-zinc-300">Model Hash</p>
                                    <p className="font-mono text-xs truncate text-zinc-500">{data.modelHash}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-ultra text-zinc-300">IMEI Hash</p>
                                    <p className="font-mono text-xs truncate text-zinc-500">{data.imeiHash}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ownership & Timeline */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#1A1A1A] text-white p-8 rounded-[40px] flex-1 flex flex-col justify-between shadow-xl">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/10 rounded-xl"><UserIcon size={20} /></div>
                                <p className="text-[9px] font-black uppercase tracking-ultra opacity-50">Current Owner</p>
                            </div>
                            <p className="font-mono text-[10px] break-all mt-4 opacity-80">{data.currentOwner}</p>
                        </div>

                        <div className="bg-white border border-zinc-100 p-8 rounded-[40px] flex-1 flex flex-col justify-between shadow-lg max-h-[400px] overflow-y-auto">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-zinc-100 rounded-lg"><Calendar size={16} /></div>
                                <p className="text-[9px] font-black uppercase tracking-ultra text-zinc-400">Provenance Log</p>
                            </div>

                            <div className="space-y-6 relative border-l border-zinc-100 ml-2 pl-6">
                                {history.map((event, i) => (
                                    <div key={i} className="relative">
                                        <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white ${event.type === 'MINT' ? 'bg-[#C6F052]' : 'bg-[#4D5DFB]'}`}></div>
                                        <p className="text-[10px] font-black uppercase tracking-wide mb-1">
                                            {event.type === 'MINT' ? 'Device Manufactured' : 'Ownership Transfer'}
                                        </p>
                                        <p className="text-[9px] font-mono text-zinc-400 mb-2">
                                            {new Date(event.data.timestamp).toLocaleString()}
                                        </p>
                                        {event.type === 'TRANSFER' && (
                                            <div className="text-[9px] font-mono text-zinc-300 space-y-1">
                                                <p>From: {event.data.from.slice(0, 6)}...{event.data.from.slice(-4)}</p>
                                                <p>To: {event.data.to.slice(0, 6)}...{event.data.to.slice(-4)}</p>
                                            </div>
                                        )}
                                        {event.type === 'MINT' && (
                                            <p className="text-[9px] font-mono text-zinc-300">
                                                By: {event.data.manufacturer.slice(0, 6)}...{event.data.manufacturer.slice(-4)}
                                            </p>
                                        )}
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${event.txHash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block mt-2 text-[8px] uppercase font-bold text-[#4D5DFB] hover:underline"
                                        >
                                            View TX ↗
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
