
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, User, PhoneRecord } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone, ShieldCheck, Activity, Layers, Zap,
  PlusCircle, ArrowRightCircle, Search, History,
  Loader2, Filter, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: User;
  onNavigate?: (state: AppState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const [devices, setDevices] = useState<Partial<PhoneRecord>[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [stats, setStats] = useState({
    activeAssets: 0,
    nodeCount: 0,
    myDevices: 0
  });

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Total Devices
        const { count: devicesCount } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true });

        // 2. Total Nodes (Profiles)
        const { count: nodesCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        setStats({
          activeAssets: devicesCount || 0,
          nodeCount: nodesCount || 0,
          myDevices: 0
        });

      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Fetch devices from Supabase
  const fetchDevices = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const from = page * 10;
      const to = from + 9;

      // Fetch paginated data
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching devices:', error);
        return;
      }

      if (data) {
        if (data.length < 10) {
          setHasMore(false);
        }

        setDevices(prev => {
          const newIds = new Set(data.map(d => d.id));
          return [...prev.filter(p => !newIds.has(p.id!)), ...data];
        });

        setPage(p => p + 1);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Initial load
  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.classList.add('active');
    }
    fetchDevices();
  }, []);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchDevices();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchDevices, hasMore, loading]);

  const SkeletonRow = () => (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-zinc-100 rounded-[32px] animate-pulse">
      <div className="flex items-center gap-8 w-full md:w-auto">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100"></div>
        <div className="space-y-2">
          <div className="h-3 w-20 bg-zinc-100 rounded-full"></div>
          <div className="h-4 w-40 bg-zinc-200 rounded-full"></div>
        </div>
      </div>
      <div className="hidden lg:block space-y-2">
        <div className="h-3 w-16 bg-zinc-100 rounded-full"></div>
        <div className="h-4 w-24 bg-zinc-200 rounded-full"></div>
      </div>
      <div className="hidden md:block space-y-2">
        <div className="h-3 w-16 bg-zinc-100 rounded-full"></div>
        <div className="h-4 w-24 bg-zinc-100 rounded-full"></div>
      </div>
      <div className="w-10 h-10 rounded-full bg-zinc-100"></div>
    </div>
  );

  return (
    <div ref={dashboardRef} className="reveal-text flex flex-col min-h-screen px-8 md:px-16 py-16">
      <div className="max-w-7xl mx-auto w-full space-y-24">

        {/* Header HUD */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-ultra text-[#4D5DFB]">
              <span className="w-2 h-2 bg-[#4D5DFB] rounded-full animate-ping"></span>
              Core Protocol : Online
            </div>
            <h1 className="text-6xl md:text-[6.3rem] font-black text-[#1A1A1A] tracking-tighter uppercase italic leading-[0.85]">
              Dashboard <br /> <span className="text-outline">Hub.</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest max-w-sm">
              Manage and track mobile phones on blockchain as {user.role}.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="bg-white border border-zinc-100 px-10 py-6 rounded-[32px] text-center shadow-lg">
              <span className="text-[9px] font-black uppercase tracking-ultra text-zinc-400 block mb-2">Network State</span>
              <span className="font-black text-2xl text-[#4D5DFB] tracking-tighter">Verified</span>
            </div>
            <div className="bg-[#C6F052] px-10 py-6 rounded-[32px] text-center shadow-xl">
              <span className="text-[9px] font-black uppercase tracking-ultra text-zinc-900/40 block mb-2">Account ID</span>
              <span className="font-black text-2xl uppercase tracking-tighter">{user.address?.slice(0, 4)}...{user.address?.slice(-4)}</span>
            </div>
          </div>
        </header>

        {/* Module Interface - 4 Actions from PRD */}
        <div className="class-container bg-white shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-ultra text-[#4D5DFB] mb-2">/ Operations</p>
              <h2 className="text-5xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Protocol Modules</h2>
            </div>
            <div className="bg-zinc-50 px-8 py-3 rounded-full border border-zinc-100 text-[10px] font-black uppercase tracking-ultra text-zinc-400">
              PRD Compliant v1.0
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <DashboardModule
              title="Add Phone"
              desc="Manufacturer: Register device IMEI and Model on-chain."
              icon={<PlusCircle size={32} strokeWidth={1.5} />}
              onClick={() => navigate('/add-phone')}
            />
            <DashboardModule
              title="Transfer"
              desc="Owner: Transfer ownership to new verified address."
              icon={<ArrowRightCircle size={32} strokeWidth={1.5} />}
              onClick={() => navigate('/transfer')}
            />
            <DashboardModule
              title="Track History"
              desc="View full cryptographic provenance and history."
              icon={<History size={32} strokeWidth={1.5} />}
              onClick={() => navigate('/track')}
            />
            <DashboardModule
              title="Verify Unit"
              desc="Public: Check authenticity of any IMEI instantly."
              icon={<Search size={32} strokeWidth={1.5} />}
              onClick={() => navigate('/verify')}
              color="#C6F052"
            />
          </div>
        </div>

        {/* Infinite Scroll Registry Ledger */}
        <div className="space-y-12">
          <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-ultra text-[#4D5DFB] mb-2">/ Ledger</p>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Global Registry Feed</h2>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-2 border border-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                <Filter size={14} /> Filter
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all">
                <Activity size={14} /> Real-time
              </button>
            </div>
          </div>

          {loading && devices.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest text-xs">
              No devices found on the registry.
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device, index) => (
                <div
                  key={`${device.id}-${index}`}
                  onClick={() => navigate(`/verify?imei=${device.imei}`)}
                  className="group flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-zinc-100 rounded-[32px] hover:shadow-xl hover:scale-[1.01] transition-all animate-in slide-in-from-bottom-4 fade-in duration-500 cursor-pointer"
                >
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${device.status === 'Manufactured' ? 'bg-[#4D5DFB]/10 text-[#4D5DFB]' : 'bg-[#C6F052]/20 text-[#1A1A1A]'}`}>
                      <Smartphone size={24} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-ultra">IMEI IDENTIFIER</p>
                      <p className="text-sm font-black font-mono tracking-widest">{device.imei}</p>
                    </div>
                  </div>

                  <div className="hidden lg:block space-y-1">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-ultra">MODEL</p>
                    <p className="text-sm font-bold uppercase">{device.model}</p>
                  </div>

                  <div className="hidden md:block space-y-1">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-ultra">STATUS</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${device.status === 'Manufactured' ? 'bg-[#4D5DFB]' : 'bg-[#C6F052]'}`}></span>
                      <p className="text-sm font-black italic uppercase text-zinc-500">{device.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-end">
                    <p className="text-[9px] font-black text-zinc-300 uppercase">
                      {device.timestamp ? new Date(device.timestamp).toLocaleTimeString() : 'Unknown'}
                    </p>
                    <button className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-[#4D5DFB] group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observer Target / Loading Indicator */}
          <div
            ref={observerTarget}
            className="py-10 flex flex-col items-center justify-center space-y-6"
          >
            {loading ? (
              <>
                <Loader2 size={32} className="animate-spin text-[#4D5DFB]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 animate-pulse">Syncing Blockchain Data...</p>
              </>
            ) : (
              hasMore && <div className="w-1.5 h-1.5 rounded-full bg-zinc-200"></div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-zinc-50 p-10 rounded-[48px] flex flex-col justify-between h-56 hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:text-[#4D5DFB] transition-colors"><Smartphone size={24} /></div>
              <div className="text-[9px] font-black uppercase tracking-ultra text-zinc-300 group-hover:text-zinc-500">Active Assets</div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-[#1A1A1A]">{stats.activeAssets}</div>
          </div>

          <div className="bg-white border border-zinc-50 p-10 rounded-[48px] flex flex-col justify-between h-56 hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:text-[#4D5DFB] transition-colors"><Layers size={24} /></div>
              <div className="text-[9px] font-black uppercase tracking-ultra text-zinc-300 group-hover:text-zinc-500">Node Count</div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-[#1A1A1A]">{stats.nodeCount}</div>
          </div>

          <div className="bg-white border border-zinc-50 p-10 rounded-[48px] flex flex-col justify-between h-56 hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:text-[#4D5DFB] transition-colors"><Activity size={24} /></div>
              <div className="text-[9px] font-black uppercase tracking-ultra text-zinc-300 group-hover:text-zinc-500">System Status</div>
            </div>
            <div className="text-5xl font-black tracking-tighter text-[#1A1A1A]">ONLINE</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardModule: React.FC<{ title: string; desc: string; icon: React.ReactNode; color?: string; onClick: () => void }> = ({ title, desc, icon, color = '#4D5DFB', onClick }) => (
  <button
    onClick={onClick}
    className="class-card group flex flex-col gap-8 text-left h-[300px] justify-between p-10 border-none shadow-sm hover:shadow-xl"
  >
    <div className="flex justify-between items-start">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:text-white group-hover:-rotate-6"
        style={{ backgroundColor: '#F2F2EB', color: '#1A1A1A' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color === '#C6F052' ? '#C6F052' : '#4D5DFB')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F2F2EB')}
      >
        {icon}
      </div>
      <div className="text-[9px] font-black uppercase tracking-ultra opacity-20 group-hover:opacity-100 transition-opacity">Active</div>
    </div>
    <div className="space-y-1">
      <h4 className="text-3xl font-black mb-1 tracking-tighter uppercase italic">{title}</h4>
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-ultra leading-relaxed">{desc}</p>
    </div>
  </button>
);
