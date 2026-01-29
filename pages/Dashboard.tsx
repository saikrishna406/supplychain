
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, User } from '../types';
import { PlusCircle, ArrowRightCircle, Search, ShieldCheck, Smartphone, Activity, Globe, Loader2, Cpu, Hash, Info } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (state: AppState) => void;
}

const INITIAL_LEDGER = [
  { id: '0x3a...12f', time: '2m ago', type: 'Transfer' },
  { id: '0x8b...45e', time: '5m ago', type: 'Mint' },
  { id: '0xfe...90a', time: '12m ago', type: 'Verify' },
  { id: '0x12...56b', time: '24m ago', type: 'Transfer' },
  { id: '0x99...cc2', time: '1h ago', type: 'Transfer' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [ledgerItems, setLedgerItems] = useState(INITIAL_LEDGER);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.classList.add('active');
    }
  }, []);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading]);

  const loadMoreItems = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const newItems = [
      { id: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 5)}`, time: 'Earlier', type: ['Transfer', 'Mint', 'Verify'][Math.floor(Math.random() * 3)] },
      { id: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 5)}`, time: 'Earlier', type: ['Transfer', 'Mint', 'Verify'][Math.floor(Math.random() * 3)] },
    ];
    
    setLedgerItems(prev => [...prev, ...newItems]);
    setIsLoading(false);
  };

  return (
    <div ref={dashboardRef} className="reveal flex flex-col min-h-screen">
      {/* Dynamic Header Section with High Contrast Typography */}
      <section className="bg-white py-16 px-6 border-b-2 border-black overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full bg-chorke-green border-2 border-black animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">System Monitoring Live</span>
                </div>
                <h1 className="font-space text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-none">
                  CORE_OPS
                </h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest bg-black text-white px-2 py-1 inline-block">
                  SESSION: {user.address?.slice(0, 16).toUpperCase()}_0xZ
                </p>
            </div>
            <div className="flex gap-4 mb-2">
                <button className="brutal-btn-pill bg-chorke-yellow text-[11px] uppercase italic">Download Ledger v.03</button>
                <button className="brutal-btn-pill bg-white text-[11px] uppercase italic">Sync Topology</button>
            </div>
        </div>
      </section>

      {/* Kinetic Stats Section */}
      <section className="bg-[#f8f8f8] py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Active Assets', value: '1,240,311', icon: <Smartphone />, color: 'bg-chorke-green' },
              { label: 'Global Nodes', value: '45,219', icon: <Globe />, color: 'bg-chorke-blue' },
              { label: 'Total Volume', value: '25.8M+', icon: <Activity />, color: 'bg-chorke-pink' },
              { label: 'Security Grade', value: 'AAA+', icon: <ShieldCheck />, color: 'bg-chorke-yellow' }
            ].map((stat, idx) => (
              <div key={idx} className="group relative flex flex-col items-start cursor-pointer transition-transform hover:-translate-y-2">
                <div className={`w-16 h-16 ${stat.color} border-2 border-black flex items-center justify-center mb-6 shadow-[6px_6px_0px_#000] group-hover:shadow-none transition-all`}>
                    {stat.icon}
                </div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2 italic"> {stat.label} </p>
                <p className="text-5xl font-space font-black group-hover:text-[#00f090] transition-colors tracking-tighter"> {stat.value} </p>
                <div className="mt-4 w-full h-1 bg-black/10 rounded-full overflow-hidden">
                    <div className={`h-full w-2/3 ${stat.color} transition-all duration-1000 group-hover:w-full`}></div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Action Modules */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-20 overflow-hidden">
                <div className="p-4 bg-black text-white">
                    <Cpu size={32} />
                </div>
                <h2 className="font-space text-5xl md:text-7xl font-black uppercase italic tracking-tighter">PROTO_MODULES</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <OperationCard 
                    title="Initialize" 
                    desc="MINT HARDWARE NFT TO GENESIS BLOCK." 
                    tooltip="Securely generate a unique cryptographic ID for a new hardware unit on the Ethereum Layer 2 genesis block."
                    icon={<PlusCircle size={24} />} 
                    color="bg-chorke-green"
                    onClick={() => onNavigate(AppState.ADD_PHONE)}
                />
                <OperationCard 
                    title="Handoff" 
                    desc="MUTATE OWNERSHIP CUSTODY STATES." 
                    tooltip="Update the immutable ownership state as the device moves between manufacturer, distributor, and retailer."
                    icon={<ArrowRightCircle size={24} />} 
                    color="bg-chorke-blue"
                    onClick={() => onNavigate(AppState.TRANSFER)}
                />
                <OperationCard 
                    title="Inspect" 
                    desc="QUERY CUSTODY PROVENANCE HISTORY." 
                    tooltip="Retrieve the full, tamper-proof audit trail of this device's journey from factory floor to end-user."
                    icon={<Search size={24} />} 
                    color="bg-chorke-pink"
                    onClick={() => onNavigate(AppState.TRACK)}
                />
                <OperationCard 
                    title="Audit" 
                    desc="PERFORM CRYPTOGRAPHIC TRUTH AUDIT." 
                    tooltip="Execute a multi-point cryptographic check to ensure device authenticity and verify anti-counterfeit signatures."
                    icon={<ShieldCheck size={24} />} 
                    color="bg-chorke-yellow"
                    onClick={() => onNavigate(AppState.VERIFY)}
                />
            </div>
        </div>
      </section>

      {/* Infinite Ledger with Kinetic UI */}
      <section className="bg-chorke-blue py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
             <div className="bg-white border-4 border-black rounded-none overflow-hidden shadow-[20px_20px_0px_#000]">
                <div className="p-10 border-b-4 border-black bg-black text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="font-space font-black uppercase tracking-tighter text-3xl italic">LEDGER_STREAM</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f090]">Sync Status: Normal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-zinc-900 p-3 border-2 border-white/10">
                        <Hash size={16} className="text-[#00f090]" />
                        <span className="font-mono text-xs uppercase tracking-widest">CHAIN_HT: 19842031</span>
                    </div>
                </div>
                
                <div className="max-h-[700px] overflow-y-auto scrollbar-hide">
                    <div className="divide-y-4 divide-black">
                        {ledgerItems.map((tx, idx) => (
                          <div 
                            key={idx} 
                            ref={idx === ledgerItems.length - 1 ? lastElementRef : null}
                            className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:bg-[#f8f8f8] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-8">
                                <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center font-space font-black text-xl group-hover:bg-[#00f090] transition-colors shadow-[6px_6px_0px_#000] group-hover:shadow-none">
                                    {idx + 1}
                                </div>
                                <div>
                                    <p className="font-space font-black text-2xl uppercase tracking-tight italic">{tx.type}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <p className="text-[11px] text-gray-400 font-mono tracking-widest uppercase truncate max-w-[150px]">SIG: {tx.id}</p>
                                        <div className="w-2 h-2 rounded-full bg-chorke-green"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end gap-6 md:gap-2 w-full md:w-auto">
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">{tx.time}</span>
                                <div className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest italic border-2 border-black">VERIFIED_TX</div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {isLoading && (
                        <div className="p-16 flex flex-col items-center justify-center gap-6 bg-[#f8f8f8] border-t-4 border-black">
                            <Loader2 className="animate-spin text-black" size={48} />
                            <p className="text-xs font-black uppercase tracking-[0.5em] animate-pulse">READING_NEW_BLOCKS...</p>
                        </div>
                    )}
                </div>
             </div>
             
             <div className="mt-16 text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.8em]">End of Protocol Access</p>
             </div>
        </div>
      </section>
    </div>
  );
};

const OperationCard: React.FC<{ 
  title: string; 
  desc: string; 
  tooltip: string;
  icon: React.ReactNode; 
  color: string;
  onClick: () => void;
}> = ({ title, desc, tooltip, icon, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col p-12 border-4 border-black rounded-none bg-white hover:bg-[#f8f8f8] transition-all text-left shadow-[12px_12px_0px_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 relative overflow-hidden h-[400px]"
    >
      <div className={`w-16 h-16 ${color} border-4 border-black flex items-center justify-center mb-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-[6px_6px_0px_#000] group-hover:shadow-none`}>
        <div className={`${isHovered ? 'animate-bounce' : ''}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-space text-3xl font-black mb-4 uppercase tracking-tighter italic group-hover:text-black">{title}</h3>
        
        {/* Normal Description */}
        <p className={`text-[10px] font-bold text-gray-400 uppercase leading-loose tracking-[0.2em] transition-all duration-500 ${isHovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          {desc}
        </p>
        
        {/* Tooltip Detailed Description - Slides in from bottom */}
        <div className={`absolute left-12 right-12 bottom-12 transition-all duration-500 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          <div className="bg-black text-white p-4 border-2 border-black flex items-start gap-3 shadow-[4px_4px_0px_#00f090]">
            <Info size={16} className="text-chorke-green shrink-0 mt-1" />
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
              {tooltip}
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 text-[10px] font-black opacity-10 uppercase tracking-widest">PRTC_MOD_0{Math.floor(Math.random() * 9)}</div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-8 h-8 bg-black transition-all duration-300 ${isHovered ? 'translate-x-0 translate-y-0' : 'translate-x-8 -translate-y-8'}`} style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
    </button>
  );
};
