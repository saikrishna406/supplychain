
import React from 'react';
import { LOGO } from '../constants';
import { User, AppState } from '../types';
import { Wallet, LogOut, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onConnect: () => void;
  onNavigate: (state: AppState) => void;
  activeTab: AppState;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onConnect, onNavigate, activeTab }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-[#00f090] selection:text-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate(AppState.LANDING)}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {LOGO}
            </div>
            <span className="font-space text-2xl font-bold tracking-tight uppercase">
              ChainTrack
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-wider">
            <button onClick={() => onNavigate(AppState.LANDING)} className="hover:underline">Home</button>
            <button onClick={() => onNavigate(AppState.DASHBOARD)} className="hover:underline">Dashboard</button>
            <button className="hover:underline">Pricing</button>
            <button className="hover:underline">About</button>
          </div>

          <div className="flex items-center gap-4">
            {user.isConnected ? (
              <button 
                onClick={onConnect} 
                className="brutal-btn-pill bg-black text-white text-xs flex items-center gap-2"
              >
                {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
                <LogOut size={14} />
              </button>
            ) : (
              <button 
                onClick={onConnect}
                className="brutal-btn-pill text-sm"
              >
                Learn More
              </button>
            )}
            <div className="md:hidden">
              <Menu />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="py-16 px-6 bg-[#f8f8f8] border-t-2 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    {LOGO}
                    <span className="font-space text-2xl font-bold uppercase">ChainTrack</span>
                </div>
                <p className="text-sm text-gray-500 max-w-xs uppercase font-bold leading-relaxed">
                    Promoting the responsible institutional adoption of digital assets and blockchains since 2016.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Who We Serve</h4>
                <ul className="space-y-2 text-xs font-bold uppercase">
                    <li>Institutional Investors</li>
                    <li>Web3 Entrepreneurs</li>
                    <li>Banks</li>
                    <li>Traders</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Research</h4>
                <ul className="space-y-2 text-xs font-bold uppercase">
                    <li>Explore All</li>
                    <li>Articles</li>
                    <li>Whitepapers</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Investors</h4>
                <ul className="space-y-2 text-xs font-bold uppercase">
                    <li>Investor Relations</li>
                    <li>Newsroom</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/10 flex justify-between items-center text-[10px] font-bold uppercase text-gray-400">
            <p>© ChainTrack 2024. All rights reserved.</p>
            <div className="flex gap-4">
                <span>FB</span>
                <span>TW</span>
                <span>LI</span>
            </div>
        </div>
      </footer>
    </div>
  );
};
