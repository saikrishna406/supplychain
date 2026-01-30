
import React, { useEffect, useRef } from 'react';
import { AppState } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Smartphone, ShieldCheck, Box,
  Zap, MousePointer2, Layers, PenTool, Type,
  Cpu, Database, Search, Lock, Link as LinkIcon, Star
} from 'lucide-react';

interface LandingPageProps {
  onStart?: () => void;
  onVerify?: () => void;
  onNavigate?: (state: AppState) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll('.reveal-text, .reveal-stagger');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-40 px-8 md:px-16 text-center relative overflow-hidden">
        <div className="absolute top-10 left-20 text-[#4D5DFB] asterisk animate-pulse opacity-20">✱</div>
        <div className="absolute top-10 right-40 text-[#C6F052] asterisk rotate-45 opacity-20">✦</div>

        <div className="max-w-6xl mx-auto space-y-20">
          <h1 className="hero-title text-6xl md:text-[8rem] text-[#1A1A1A] reveal-text">
            <span className="text-outline">CHAIN</span><span className="text-[#4D5DFB]">TRACK</span> <br />
            <span className="flex items-center justify-center gap-4">
              <span className="italic font-normal">Secure</span> <span className="arrow-pill text-white">➔</span> Supply
            </span>
            <span className="text-[#1A1A1A]">Blockchain</span> Protocol
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:items-end reveal-stagger">
            <div className="text-left space-y-2">
              <p className="text-[10px] font-black uppercase tracking-ultra text-zinc-400">Network Statistics</p>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-black tracking-tighter">1.2M<span className="text-[#4D5DFB]">+</span></p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Devices Tracked</p>
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tighter">0%<span className="text-[#C6F052]">+</span></p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Counterfeit Rate</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="btn-pill btn-pill-lime px-12 py-7 text-xs shadow-2xl hover:brightness-95"
              >
                Connect Wallet <ArrowUpRight size={18} />
              </button>
              <button
                onClick={() => navigate('/verify')}
                className="btn-pill px-12 py-7 text-xs border-2 border-[#1A1A1A]"
              >
                Verify Phone <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 3D-Style Illustration Cards Row */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mt-32 reveal-stagger">
          <div className="illu-card bg-[#4D5DFB] text-white">
            <Smartphone size={80} strokeWidth={1} />
          </div>
          <div className="illu-card bg-[#2C2C2C] text-white">
            <ShieldCheck size={80} strokeWidth={1} className="text-[#4D5DFB]" />
          </div>
          <div className="illu-card bg-[#4D5DFB] text-white scale-110 shadow-2xl z-10 border-[6px] border-white">
            <div className="flex flex-col items-center gap-6">
              <Box size={100} strokeWidth={0.5} />
              <span className="text-[9px] font-black uppercase tracking-ultra bg-white text-black px-6 py-2 rounded-full">Ethereum V1.0</span>
            </div>
          </div>
          <div className="illu-card bg-[#2C2C2C] text-white">
            <LinkIcon size={80} strokeWidth={1} className="text-[#C6F052]" />
          </div>
          <div className="illu-card bg-[#4D5DFB] text-white">
            <Zap size={80} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-40 px-8 md:px-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-32 reveal-text">
            <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
              How it <br /> <span className="text-outline">Works.</span>
            </h2>
            <p className="max-w-sm text-[12px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest md:ml-auto">
              A transparent, tamper-proof system tracking mobile phones from manufacturer to customer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 reveal-stagger">
            <StepCard
              icon={<Cpu size={56} strokeWidth={1} />}
              number="01"
              title="MINTING"
              desc="Manufacturers register phone IMEI and model on the blockchain during production."
              bg="#4D5DFB"
            />
            <StepCard
              icon={<Database size={56} strokeWidth={1} />}
              number="02"
              title="TRANSFER"
              desc="Distributors and retailers transfer ownership cryptographically as units move."
              bg="#C6F052"
              textColor="#1A1A1A"
            />
            <StepCard
              icon={<Search size={56} strokeWidth={1} />}
              number="03"
              title="VERIFY"
              desc="Customers instantly verify authenticity using the public IMEI audit tool."
              bg="#1A1A1A"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-40 px-8 md:px-16 bg-[#1A1A1A] text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
          <span className="text-[30rem] font-black uppercase tracking-ultra rotate-12">CHAINTRACK</span>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
          <div className="space-y-12 reveal-text">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase text-[#C6F052] tracking-ultra border border-white/10">
              Why Blockchain?
            </div>
            <h2 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
              The New <br /> <span className="text-[#4D5DFB]">Standard</span> <br />
              <span className="text-outline-white">Of Truth.</span>
            </h2>
            <p className="text-zinc-500 font-bold uppercase text-[12px] tracking-widest max-w-sm leading-relaxed">
              Legacy supply chains are vulnerable to counterfeit devices. ChainTrack provides a decentralized, immutable ledger for absolute certainty.
            </p>
            <button onClick={() => navigate('/login')} className="btn-pill btn-pill-lime px-12 py-5 text-xs">Join Protocol</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 reveal-stagger">
            <BenefitCard icon={<Lock />} title="Immunity" desc="Tamper-proof records on the Ethereum blockchain." />
            <BenefitCard icon={<LinkIcon />} title="Traceability" desc="Full ownership history from factory to pocket." />
            <BenefitCard icon={<ShieldCheck />} title="Anti-Fake" desc="Invalid IMEI checks instantly alert users of clones." />
            <BenefitCard icon={<Zap />} title="Real-time" desc="Global state updates with sub-second finality." />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 px-8 md:px-16 bg-[#F2F2EB]">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-24">
          <div className="text-center space-y-6 reveal-text">
            <h2 className="text-6xl font-black uppercase tracking-tighter italic">Testimonials.</h2>
            <p className="text-zinc-400 font-black text-[10px] uppercase tracking-ultra">Voices from the ecosystem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 reveal-stagger">
            <TestimonialCard quote="We eliminated counterfeit units across our entire distributor network in 3 months." author="ELENA V." role="CEO @ TECH-LOGISTICS" />
            <TestimonialCard quote="The most transparent system we have ever integrated. Our customers feel completely secure." author="MARCUS W." role="CTO @ MOBILE-GIANT" />
            <TestimonialCard quote="Blockchain is no longer a buzzword for us; it is our primary security layer." author="SARAH C." role="VP @ RETAIL-CORP" />
          </div>
        </div>
      </section>

      {/* Final Movement Section */}
      <section className="py-40 px-8 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto class-container bg-[#1A1A1A] text-white p-20 md:p-32 text-center space-y-16 reveal-text">
          <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none">
            Start your <br /> <span className="text-[#C6F052] text-outline-white">Provenance.</span>
          </h2>
          <p className="text-zinc-500 font-black uppercase text-[11px] tracking-ultra max-w-xl mx-auto leading-loose">
            Deploy your manufacturer node or verify your personal device today. Join the standard of tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <button onClick={() => navigate('/login')} className="btn-pill btn-pill-lime px-20 py-7 text-sm">Open Dashboard</button>
            <button onClick={() => navigate('/verify')} className="btn-pill bg-transparent border-2 border-white/20 text-white px-16 py-7 text-sm hover:border-white">Verify Phone</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const StepCard: React.FC<{ icon: React.ReactNode; number: string; title: string; desc: string; bg: string; textColor?: string }> = ({ icon, number, title, desc, bg, textColor = 'white' }) => (
  <div className="flex flex-col items-start space-y-10 group relative">
    <div className="absolute -top-10 -left-6 text-[6rem] font-black opacity-5 pointer-events-none">{number}</div>
    <div className="w-20 h-20 rounded-[28px] flex items-center justify-center shadow-xl transition-all group-hover:-translate-y-3" style={{ backgroundColor: bg, color: textColor }}>
      {icon}
    </div>
    <div className="space-y-4">
      <h4 className="text-3xl font-black uppercase italic tracking-tighter">{title}</h4>
      <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest leading-loose max-w-[240px]">{desc}</p>
    </div>
  </div>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[40px] space-y-6 hover:border-zinc-500 transition-colors group">
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#4D5DFB] transition-transform group-hover:scale-110">
      {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 1.5 })}
    </div>
    <div className="space-y-2">
      <h5 className="text-xl font-black uppercase italic tracking-tighter">{title}</h5>
      <p className="text-zinc-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest">{desc}</p>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string; role: string }> = ({ quote, author, role }) => (
  <div className="bg-white p-14 rounded-[48px] space-y-12 border border-zinc-50 shadow-sm">
    <div className="flex gap-1 text-[#C6F052]">
      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
    </div>
    <p className="text-2xl font-black italic leading-[1.2] tracking-tighter text-[#1A1A1A]">"{quote}"</p>
    <div className="flex items-center gap-5 pt-6 border-t border-zinc-50">
      <div className="w-14 h-14 rounded-2xl bg-[#F2F2EB] flex items-center justify-center text-[#4D5DFB] font-black uppercase text-lg">
        {author.charAt(0)}
      </div>
      <div>
        <p className="text-[12px] font-black tracking-tight">{author}</p>
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-ultra">{role}</p>
      </div>
    </div>
  </div>
);
