
import React, { useEffect, useRef } from 'react';
import { AppState } from '../types';
import { Smartphone, Play, ArrowRight, Activity, ShieldCheck, Database, Globe, Star, Search } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onVerify: () => void;
  onNavigate: (state: AppState) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onVerify, onNavigate }) => {
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const parallaxRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15 });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxRefs.current.forEach((ref, index) => {
        if (ref) {
          const speed = (index + 1) * 0.05;
          ref.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addToReveal = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const addToParallax = (el: HTMLDivElement | null) => {
    if (el && !parallaxRefs.current.includes(el)) parallaxRefs.current.push(el);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-black text-white py-4 border-b-2 border-black overflow-hidden font-bold text-[10px] tracking-[0.4em] uppercase">
        <div className="marquee">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-3">
              <Star size={12} className="text-[#fde047] fill-[#fde047] animate-spin" /> 
              GENESIS PROTOCOL ACTIVE 
              <span className="opacity-20 mx-4">///</span> 
              ETHEREUM L2 SYNCED 
              <span className="opacity-20 mx-4">///</span> 
              VERIFIED ORIGIN 
            </span>
          ))}
        </div>
      </div>

      <section className="bg-white py-32 px-6 relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div ref={addToReveal} className="reveal reveal-stagger space-y-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-chorke-blue border-2 border-black text-[11px] font-black uppercase shadow-[4px_4px_0px_#000]">
              <Globe size={14} /> CHAIN CUSTODY PROTOCOL v4
            </div>
            
            <div className="space-y-2">
              <h1 className="font-space text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] text-black italic">
                <span className="text-reveal-wrapper">
                  <span className="text-reveal-content">DON'T JUST</span>
                </span>
                <span className="text-reveal-wrapper">
                  <span className="text-reveal-content text-[#00f090]">TRUST.</span>
                </span>
                <span className="text-reveal-wrapper">
                  <span className="text-reveal-content">VERIFY IT.</span>
                </span>
              </h1>
            </div>

            <p className="text-gray-600 font-bold uppercase text-sm tracking-widest max-w-sm leading-relaxed border-l-4 border-black pl-6">
                Promoting the responsible institutional adoption of digital assets and blockchains since 2016.
            </p>

            <div className="flex flex-wrap gap-6">
              <button onClick={onVerify} className="brutal-btn-pill bg-chorke-green uppercase text-xs">
                <Search size={14} /> Verify My Device
              </button>
              <button onClick={onStart} className="brutal-btn-pill bg-white uppercase text-xs group">
                Institutional Login <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div ref={addToParallax} className="w-full aspect-[4/5] bg-chorke-yellow mask-organic-1 overflow-hidden border-4 border-black group transition-all duration-1000 hover:rotate-2 shadow-[20px_20px_0px_#000]">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                alt="Verification" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute top-6 left-6 p-4 bg-white border-2 border-black font-space font-black text-xl italic uppercase -rotate-6">
                TRUSTLESS
              </div>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-chorke-pink border-4 border-black rounded-full flex items-center justify-center -rotate-12 floating shadow-[8px_8px_0px_#000] z-20">
                <div className="text-center">
                    <div className="font-space font-black text-4xl text-black">99%</div>
                    <div className="font-bold text-[10px] uppercase">Accuracy</div>
                </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-0 w-full font-space font-black text-[20vw] text-black opacity-[0.03] pointer-events-none select-none whitespace-nowrap overflow-hidden translate-y-[-50%] italic">
          SUPPLY CHAIN CUSTODY
        </div>
      </section>

      <section className="bg-chorke-green py-32 px-6">
        <div ref={addToReveal} className="reveal max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
                <h2 className="font-space text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
                    WHY<br/>CHAINTRACK?
                </h2>
                <p className="text-black font-bold uppercase text-xs tracking-widest max-w-lg leading-loose border-t-2 border-black pt-8">
                    WE ARE REDEFINING THE LOGISTICS ECOSYSTEM WITH CRYPTOGRAPHIC PROOFS. NO MORE DISPUTES, JUST THE TRUTH.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative brutal-card-light p-12 overflow-hidden group h-[500px] flex flex-col justify-end shadow-[16px_16px_0px_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
                    <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        alt="Network"
                    />
                    <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center group-hover:bg-[#00f090] transition-colors">
                            <Play fill="currentColor" size={24} />
                        </div>
                        <h3 className="font-space text-4xl font-black uppercase italic italic">Watch The Protocol</h3>
                        <p className="font-bold text-xs uppercase tracking-widest leading-relaxed">SEE HOW OUR NODES VALIDATE EVERY HANDOFF IN REAL-TIME.</p>
                    </div>
                </div>

                <div className="grid grid-rows-2 gap-12">
                    <div className="bg-chorke-pink border-4 border-black p-10 flex flex-col justify-between hover:rotate-1 transition-transform shadow-[12px_12px_0px_#000]">
                        <Smartphone size={32} />
                        <div>
                            <h4 className="font-space text-2xl font-black uppercase">Genesis Mint</h4>
                            <p className="text-[10px] font-bold uppercase mt-2">Every device is minted as an asset on-chain at point of assembly.</p>
                        </div>
                    </div>
                    <div className="bg-chorke-blue border-4 border-black p-10 flex flex-col justify-between hover:-rotate-1 transition-transform shadow-[12px_12px_0px_#000]">
                        <Activity size={32} />
                        <div>
                            <h4 className="font-space text-2xl font-black uppercase">Live Telemetry</h4>
                            <p className="text-[10px] font-bold uppercase mt-2">Real-time GPS and ownership pings captured via L2 rollup.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="bg-white py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div ref={addToReveal} className="reveal reveal-stagger space-y-12">
                <h2 className="font-space text-7xl md:text-9xl font-black leading-[0.8] tracking-tighter uppercase italic">
                    TOWARD A<br/>
                    <span className="text-[#00f090]">TRUSTLESS</span><br/>
                    FUTURE
                </h2>
                <div className="bg-black text-white p-8 border-4 border-black shadow-[12px_12px_0px_#bae6fd] hover:translate-x-2 hover:translate-y-2 transition-transform">
                    <p className="text-xs font-bold uppercase tracking-widest leading-loose italic">
                        "THE CHAINTRACK ECOSYSTEM ELIMINATES 98% OF LOGISTICS DISPUTES BY INTRODUCING CRYPTOGRAPHIC VERIFICATION AT EVERY LAYER."
                    </p>
                    <p className="mt-4 text-[10px] font-black text-[#bae6fd]">— THE CORE PROTOCOL TEAM</p>
                </div>
                <button className="brutal-btn-pill uppercase text-sm px-10">Read The Whitepaper</button>
            </div>
            
            <div ref={addToReveal} className="reveal relative flex justify-center">
                <div className="w-[450px] aspect-[4/5] mask-flower border-4 border-black overflow-hidden bg-[#f8f8f8] group shadow-[20px_20px_0px_#fbcfe8]">
                    <img 
                        src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" 
                        alt="Collaboration" 
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2"
                    />
                </div>
                <div className="absolute top-0 right-0 p-6 bg-chorke-green border-2 border-black rotate-12 z-20 font-space font-black uppercase text-xl animate-bounce">
                    SYNCED
                </div>
            </div>
        </div>
      </section>

      <section className="bg-chorke-yellow py-48 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none flex items-center overflow-hidden">
            <div className="marquee font-space font-black text-[25vh] whitespace-nowrap italic">
                JOIN THE NETWORK JOIN THE NETWORK JOIN THE NETWORK JOIN THE NETWORK JOIN THE NETWORK
            </div>
        </div>
        
        <div ref={addToReveal} className="reveal max-w-5xl mx-auto text-center space-y-12 relative z-10">
            <div className="inline-block p-6 bg-white border-4 border-black rounded-full animate-pulse shadow-[8px_8px_0px_#000]">
                <ShieldCheck size={50} className="text-[#00f090]" />
            </div>
            <h2 className="font-space text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic">
                READY TO<br/>UPGRADE?
            </h2>
            <p className="text-black font-bold uppercase text-xs tracking-[0.3em] max-w-2xl mx-auto border-t-2 border-black pt-8">
                ONBOARD YOUR ENTIRE SUPPLY CHAIN IN UNDER 48 HOURS. START THE REVOLUTION.
            </p>
            <div className="pt-10 flex flex-wrap justify-center gap-6">
              <button 
                  onClick={onVerify}
                  className="brutal-btn-pill bg-white text-black px-16 py-6 uppercase text-lg border-2 border-black shadow-[12px_12px_0px_#00f090] hover:shadow-none transition-all"
              >
                  Verify Device
              </button>
              <button 
                  onClick={onStart}
                  className="brutal-btn-pill bg-black text-white px-16 py-6 uppercase text-lg border-2 border-black shadow-[12px_12px_0px_#00f090] hover:shadow-none hover:bg-[#00f090] hover:text-black transition-all"
              >
                  Initialize Custody
              </button>
            </div>
        </div>
      </section>
    </div>
  );
};
