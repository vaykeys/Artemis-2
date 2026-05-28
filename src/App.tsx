import { useState, useEffect } from "react";
import CrewSection from "./components/CrewSection.tsx";
import SpacecraftSection from "./components/SpacecraftSection.tsx";
import MissionTrajectory from "./components/MissionTrajectory.tsx";
import ArtemisChat from "./components/ArtemisChat.tsx";
import { 
  Rocket, 
  Map, 
  Users, 
  MessageSquare, 
  ChevronDown, 
  Clock, 
  Moon, 
  Info,
  Calendar,
  Compass,
  ArrowUpRight
} from "lucide-react";

export default function App() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate live countdown to target Artemis II launch (estimated around November 25, 2026)
  useEffect(() => {
    const launchDate = new Date("2026-11-25T14:00:00Z").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-650 selection:text-white flex flex-col antialiased relative overflow-hidden art-grid-base">
      
      {/* Background Graphic Elements - Absolute Positions */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full opacity-30 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[400px] left-1/4 w-[600px] h-px bg-neutral-800 -rotate-45 pointer-events-none z-0" />
      <div className="absolute top-[650px] right-1/4 w-[400px] h-px bg-neutral-900 rotate-12 pointer-events-none z-0" />
      
      {/* Decorative Ghost Background Typography */}
      <div className="absolute top-96 -left-16 rotate-90 text-[140px] font-black text-white/[0.02] pointer-events-none uppercase tracking-tighter select-none z-0">
        ORION
      </div>

      {/* Sticky Avant-Garde Navigation Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900/85 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 border border-neutral-100 flex items-center justify-center rotate-45 flex-shrink-0">
              <div className="w-3.5 h-3.5 bg-red-600 -rotate-45" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-display font-black tracking-[0.3em] text-white uppercase block">
                NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
              </span>
              <span className="text-[9px] font-mono tracking-wider text-red-500 block">
                ARTEMIS II // FLIGHT PORTAL
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest">
            <button 
              onClick={() => scrollToSection("crew-section")}
              className="text-neutral-450 hover:text-red-500 font-bold transition-all focus:outline-none cursor-pointer"
            >
              MEMBERS
            </button>
            <button 
              onClick={() => scrollToSection("spacecraft-section")}
              className="text-neutral-450 hover:text-red-500 font-bold transition-all focus:outline-none cursor-pointer"
            >
              CRAFT SYSTEMS
            </button>
            <button 
              onClick={() => scrollToSection("trajectory-section")}
              className="text-neutral-450 hover:text-red-500 font-bold transition-all focus:outline-none cursor-pointer"
            >
              TRAJECTORY
            </button>
            <button 
              onClick={() => scrollToSection("artemis-chat-section")}
              className="text-white hover:text-red-500 font-extrabold bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 px-4 py-2 hover:border-red-655 transition-all focus:outline-none cursor-pointer"
            >
              CAPCOM CONSOLE
            </button>
          </nav>

          <div className="flex items-center gap-2 bg-neutral-900 text-neutral-300 border border-neutral-800 px-3 py-1 text-[9px] font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            SYSTEM STAGED
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-4 sm:px-8 max-w-7xl mx-auto z-10 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main textual hook: Massive Editorial Styling */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative">
              <span className="text-red-600 font-serif italic text-2xl lg:text-3xl block mb-2 select-none">
                Project: Artemis
              </span>
              <h1 className="text-6xl sm:text-7xl md:text-[110px] leading-[0.85] font-black tracking-tighter uppercase text-white">
                Artemis<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 border-t-4 border-b-4 border-neutral-150 px-4 mt-4 inline-block">02</span>
              </h1>
              
              <p className="mt-8 text-neutral-400 font-serif italic leading-relaxed text-sm sm:text-base border-l border-red-600 pl-6 max-w-xl">
                The first crewed mission to the Moon in over half a century. A ten-day flight test paving the way for long-term lunar exploration and humanity's future on Mars.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => scrollToSection("artemis-chat-section")}
                className="bg-neutral-100 hover:bg-red-605 text-neutral-950 hover:text-white px-8 py-3.5 text-[10px] uppercase font-bold tracking-widest transition-colors flex items-center gap-2.5 shadow-md shadow-black/40 cursor-pointer"
              >
                Launch AI CapCom Console
                <ArrowUpRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => scrollToSection("trajectory-section")}
                className="bg-neutral-900 hover:bg-neutral-850 text-neutral-350 hover:text-white px-8 py-3.5 text-[10px] uppercase font-bold tracking-widest border border-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Inspect Flight Path
                <ChevronDown className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {/* Right Column: High-contrast Minimal Stats Widget */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900 border-r-4 border-red-600 p-6 md:p-8 relative overflow-hidden shadow-2xl">
              
              <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-405 font-bold">
                  ANTICIPATED LAUNCH T-MINUS
                </span>
              </div>

              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-2 text-center mb-6">
                <div className="bg-neutral-950 p-3 border border-neutral-850">
                  <span className="text-3xl font-mono font-bold text-white block">
                    {countdown.days.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1 block">
                    Days
                  </span>
                </div>
                <div className="bg-neutral-950 p-3 border border-neutral-850">
                  <span className="text-3xl font-mono font-bold text-white block">
                    {countdown.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1 block">
                    Hours
                  </span>
                </div>
                <div className="bg-neutral-950 p-3 border border-neutral-850">
                  <span className="text-3xl font-mono font-bold text-white block">
                    {countdown.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1 block">
                    Mins
                  </span>
                </div>
                <div className="bg-neutral-950 p-3 border border-neutral-850">
                  <span className="text-3xl font-mono font-bold text-red-500 block">
                    {countdown.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mt-1 block">
                    Secs
                  </span>
                </div>
              </div>

              {/* Target Data Details */}
              <div className="space-y-3 text-xs text-neutral-400 font-sans pt-2">
                <div className="flex justify-between items-center py-1 border-b border-neutral-850">
                  <span className="flex items-center gap-1.5 uppercase text-[9px] tracking-wider text-neutral-500">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Launch Target
                  </span>
                  <span className="text-white font-mono text-[10px]">NOV 2026</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-neutral-850">
                  <span className="flex items-center gap-1.5 uppercase text-[9px] tracking-wider text-neutral-500">
                    <Moon className="w-3.5 h-3.5 text-neutral-500" /> Trajectory Profile
                  </span>
                  <span className="text-white font-mono text-[10px]">FREE LUNAR RETURN</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-1.5 uppercase text-[9px] tracking-wider text-neutral-500">
                    <Info className="w-3.5 h-3.5 text-neutral-500" /> Flight Identifier
                  </span>
                  <span className="text-white font-mono text-[10px]">MPCV-02</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Unconventional Horizontal Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-20 border-t border-b border-neutral-800">
          <div className="p-6 md:p-8 border-r border-neutral-800">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] block font-bold">
              01 // FLIGHT TIME
            </span>
            <span className="text-2xl font-display font-black text-white mt-2 block uppercase">
              10 Days
            </span>
            <span className="text-[10px] font-serif italic text-neutral-400 mt-1 block">
              9.7 day splashdown recovery
            </span>
          </div>

          <div className="p-6 md:p-8 md:border-r border-neutral-800">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] block font-bold">
              02 // SCOPE
            </span>
            <span className="text-2xl font-display font-black text-white mt-2 block uppercase">
              600K+ MILES
            </span>
            <span className="text-[10px] font-serif italic text-neutral-400 mt-1 block">
              Trans-lunar gravity warp loop
            </span>
          </div>

          <div className="p-6 md:p-8 border-r border-neutral-800">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] block font-bold">
              03 // THRUST
            </span>
            <span className="text-2xl font-display font-black text-white mt-2 block uppercase">
              8.8M LBS
            </span>
            <span className="text-[10px] font-serif italic text-neutral-400 mt-1 block">
              NASA Solid Rocket power peak
            </span>
          </div>

          <div className="p-6 md:p-8">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] block font-bold">
              04 // ALTITUDE
            </span>
            <span className="text-2xl font-display font-black text-white mt-2 block uppercase">
              7.4K KM past
            </span>
            <span className="text-[10px] font-serif italic text-neutral-400 mt-1 block">
              Farthest deep deep space flight
            </span>
          </div>
        </div>

      </section>

      {/* Section Divider Block */}
      <div className="w-full bg-neutral-950">
        
        {/* Sub-sections */}
        <CrewSection />
        
        <SpacecraftSection />
        
        <MissionTrajectory />
        
        <ArtemisChat />

      </div>

      {/* Modern Aerospace Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-850 py-12 px-8 mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border border-neutral-100 flex items-center justify-center rotate-45 flex-shrink-0">
              <div className="w-3.5 h-3.5 bg-red-650 -rotate-45" />
            </div>
            <div>
              <p className="text-xs uppercase font-mono tracking-widest font-bold text-white">
                Artemis II Mission Command
              </p>
              <p className="text-[10px] text-neutral-500 font-mono tracking-tighter mt-0.5 uppercase">
                LATITUDE: 28.5721° N // LONGITUDE: 80.648° W
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            <span>© 2026 Space Flight Center</span>
            <span>•</span>
            <span className="text-red-500 font-bold uppercase select-none">
              LUNAR BOUND
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
