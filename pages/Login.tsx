
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, AppState } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onNavigate?: (state: AppState) => void; // Deprecated
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) throw authError;
            if (!data.user) throw new Error("Login failed.");

            // Fetch Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error("Profile fetch error:", profileError);
            }

            onLoginSuccess({
                address: profile?.wallet_address || null,
                isConnected: !!profile?.wallet_address,
                role: profile?.role || 'Guest'
            });

        } catch (err: any) {
            setError(err.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-xl border border-zinc-100 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Welcome Back.</h2>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sign in to your Dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-[#F2F2EB] rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-[#4D5DFB]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl">
                            <AlertCircle size={16} />
                            <p className="text-[10px] font-bold uppercase">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-pill btn-pill-lime w-full py-5 text-xs flex justify-center items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Login to Protocol'}
                    </button>

                    <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-[#4D5DFB]" onClick={() => navigate('/register')}>
                        New here? Create ID
                    </p>
                </form>
            </div>
        </div>
    );
};
