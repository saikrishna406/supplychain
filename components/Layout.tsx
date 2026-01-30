
import React from 'react';
import { User } from '../types';
import { ArrowUpRight, Github, Twitter, Linkedin, Activity, Globe, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onConnect: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onConnect }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2EB]">
      {/* Navigation */}
      <nav className="w-full px-8 md:px-16 py-10 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          <div className="flex gap-12">
            <button onClick={() => navigate('/')} className={`hover:text-black transition-colors ${isActive('/') ? 'text-black' : ''}`}>Home</button>
            <button onClick={() => navigate('/verify')} className={`hover:text-black transition-colors ${isActive('/verify') ? 'text-black' : ''}`}>Verify</button>
          </div>

          <div className="flex gap-12 items-center">
            {user.isConnected && (
              <button
                onClick={() => navigate('/dashboard')}
                className={`hover:text-black transition-colors ${isActive('/dashboard') ? 'text-black' : ''}`}
              >
                Dashboard
              </button>
            )}

            <button
              onClick={onConnect}
              className="btn-pill px-8 py-3 shadow-xl flex items-center gap-2"
            >
              {user.isConnected ? (
                <span className="text-[#4D5DFB]">ID: {user.address?.slice(0, 6)}...</span>
              ) : (
                <>
                  Login / Connect <ArrowUpRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Expanded Footer */}
      <footer className="w-full bg-[#1A1A1A] text-white py-32 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4D5DFB] rounded-2xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rotate-45"></div>
                </div>
                <span className="text-3xl font-black tracking-tighter uppercase italic">ChainTrack</span>
              </div>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm uppercase tracking-wider">
                Blockchain-powered mobile phone supply chain tracking. Anti-counterfeit protocol v1.0. Prevents fake devices using Ethereum technology.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Github size={20} />} />
                <SocialIcon icon={<Linkedin size={20} />} />
              </div>
            </div>

            <div className="md:col-span-2 space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-ultra text-[#C6F052]">Platform</h4>
              <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/verify')} className="hover:text-white transition-colors">Verify Device</button></li>
                <li><button className="hover:text-white transition-colors">API Docs</button></li>
              </ul>
            </div>

            <div className="md:col-span-5 space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-ultra text-[#C6F052]">System Status</h4>
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-[#C6F052] animate-pulse" />
                    <span className="text-[10px] font-black uppercase">Ethereum Mainnet</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#C6F052]">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-[#4D5DFB]" />
                    <span className="text-[10px] font-black uppercase">Nodes Online</span>
                  </div>
                  <span className="text-[10px] font-black uppercase">1,248</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-zinc-500" />
                    <span className="text-[10px] font-black uppercase">Contract Hash</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-zinc-500 truncate max-w-[100px]">0x71...976f</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            <p>© 2024 CHAINTRACK PROTOCOL • IMMUTABLE LEDGER</p>
            <div className="flex justify-center gap-12">
              <a href="#" className="hover:text-white transition-colors">Whitepaper</a>
              <a href="#" className="hover:text-white transition-colors">Governance</a>
              <a href="#" className="hover:text-white transition-colors">Security Audit</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
    {icon}
  </a>
);
