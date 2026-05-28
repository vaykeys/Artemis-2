import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ASTRONAUTS } from "../data.ts";
import { Astronaut } from "../types.ts";
import { Briefcase, Flag, Sparkles, User, Info, Award } from "lucide-react";

export default function CrewSection() {
  const [selectedCrew, setSelectedCrew] = useState<Astronaut>(ASTRONAUTS[0]);

  return (
    <div id="crew-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-850">
      <div className="mb-14">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 bg-neutral-900 px-4 py-2 border border-neutral-800">
          THE MISSION CREW RASTER
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-4 uppercase">
          MEET THE HISTORIC FOUR
        </h2>
        <p className="mt-4 text-neutral-400 max-w-3xl font-serif italic text-base leading-relaxed">
          Four dedicated astronauts represent Canada and the United States on this milestone trajectory around the Moon—the first crewed exploration vehicle to journey beyond low Earth orbit since the Apollo era in 1972.
        </p>
      </div>

      {/* Grid of Crew Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {ASTRONAUTS.map((astronaut) => {
          const isSelected = selectedCrew.id === astronaut.id;
          return (
            <button
              key={astronaut.id}
              id={`crew-card-${astronaut.id}`}
              onClick={() => setSelectedCrew(astronaut)}
              className={`relative flex flex-col text-left overflow-hidden border transition-all duration-300 focus:outline-none cursor-pointer ${
                isSelected
                  ? "border-red-650 bg-neutral-900 shadow-xl"
                  : "border-neutral-850 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/80"
              }`}
            >
              {/* Image Box */}
              <div className="relative w-full aspect-[4/3] bg-neutral-950 overflow-hidden">
                <img
                  src={astronaut.imageUrl}
                  alt={astronaut.name}
                  className="w-full h-full object-cover grayscale contrast-[1.1] transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                
                {/* Agency Badge */}
                <div className="absolute top-3 right-3 flex gap-1.5 items-center bg-neutral-950 text-white px-2.5 py-1 border border-neutral-800 text-[9px] font-mono tracking-wider">
                  <Flag className="w-3 h-3 text-red-500" />
                  {astronaut.agency}
                </div>
              </div>

              {/* Text Padding */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                    {astronaut.name}
                  </h3>
                  <p className="text-[10px] font-mono text-red-505 mt-1 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                    <Briefcase className="w-3.5 h-3.5 text-red-500" />
                    {astronaut.role}
                  </p>
                  <p className="text-xs text-neutral-400 mt-4 font-serif italic leading-relaxed line-clamp-2">
                    {astronaut.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-850 flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-neutral-500">Origin // {astronaut.country}</span>
                  <span className="text-red-500 font-bold flex items-center">
                    DOSSIER <span className="ml-1">→</span>
                  </span>
                </div>
              </div>

              {/* Selected highlight line */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-650" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Dossier Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCrew.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          id="crew-dossier"
          className="bg-neutral-900/50 p-6 md:p-8 border-l-4 border-red-650 border-t border-b border-r border-neutral-850"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Bio Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight">
                      {selectedCrew.name}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-red-500 mt-1 uppercase tracking-widest font-semibold">
                    {selectedCrew.role} — {selectedCrew.agency} Flight Corps
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-950 text-neutral-300 px-4 py-2 border border-neutral-800 text-[10px] font-mono tracking-widest">
                  <User className="w-4 h-4 text-red-500" />
                  STATUS: SECURED FOR FLIGHT
                </div>
              </div>

              {/* Multi-paragraph bio is styled beautifully in serif */}
              <div className="space-y-4 text-neutral-300 font-serif italic leading-relaxed text-sm sm:text-base">
                {selectedCrew.extendedBio.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Red-themed block for fun facts/significance */}
              <div className="bg-neutral-950 border border-neutral-800 p-4 md:p-6 flex items-start gap-4">
                <div className="bg-red-500/10 p-2.5 border border-red-900/40">
                  <Sparkles className="w-5 h-5 text-red-505" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-red-500 tracking-widest uppercase">
                    Historic Flight Milestone
                  </h4>
                  <p className="text-xs text-neutral-300 font-mono tracking-tight mt-1.5 leading-relaxed">
                    {selectedCrew.funFact}
                  </p>
                </div>
              </div>
            </div>

            {/* Facts and Details Column */}
            <div className="lg:col-span-5 space-y-6 bg-neutral-950/80 p-6 border border-neutral-850">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Info className="w-4 h-4 text-red-505" />
                <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                  FLIGHT SPECIFICATION REQUISITIONS
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900">
                  <span className="text-neutral-450 uppercase text-[9px] tracking-wider">Candidate Name</span>
                  <span className="text-white font-mono font-semibold text-[11px]">{selectedCrew.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900">
                  <span className="text-neutral-450 uppercase text-[9px] tracking-wider">Assigned Agency</span>
                  <span className="text-white font-mono font-semibold text-[11px]">{selectedCrew.agency}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900">
                  <span className="text-neutral-450 uppercase text-[9px] tracking-wider">Country of Service</span>
                  <span className="text-white font-mono font-semibold text-[11px]">{selectedCrew.country}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900">
                  <span className="text-neutral-450 uppercase text-[9px] tracking-wider">Mission Segment</span>
                  <span className="text-white font-mono font-semibold text-[11px]">Artemis II Lunar Loop</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 border-b border-neutral-900">
                  <span className="text-neutral-450 uppercase text-[9px] tracking-wider font-sans">Flight Path Max</span>
                  <span className="text-white font-mono font-semibold text-[11px]">Free Lunar Return (Flyby)</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-neutral-900 border border-neutral-800 flex gap-3.5 items-center">
                <div className="bg-red-650/10 p-2.5 border border-red-650/20 flex-shrink-0">
                  <Award className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-wider uppercase text-red-405 block font-semibold">
                    Assigned Lunar Vessel
                  </span>
                  <span className="text-xs font-mono text-neutral-300 font-bold block mt-0.5">
                    Orion Crew Module CM-002
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
