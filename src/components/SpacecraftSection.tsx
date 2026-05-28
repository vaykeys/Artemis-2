import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SPACECRAFT_PARTS } from "../data.ts";
import { SpacecraftPart } from "../types.ts";
import { Rocket, ShieldAlert, Cpu, Zap, Settings, ShieldCheck, Gauge, HelpCircle } from "lucide-react";

export default function SpacecraftSection() {
  const [selectedPart, setSelectedPart] = useState<SpacecraftPart>(SPACECRAFT_PARTS[0]);

  // Map icons dynamically to parts
  const getIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "orion":
        return <ShieldCheck className={colorClass} />;
      case "esm":
        return <Zap className={colorClass} />;
      case "sls":
        return <Rocket className={colorClass} />;
      case "boosters":
        return <Gauge className={colorClass} />;
      case "las":
        return <ShieldAlert className={colorClass} />;
      default:
        return <Settings className={colorClass} />;
    }
  };

  return (
    <div id="spacecraft-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-850">
      <div className="mb-14">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 bg-neutral-900 px-4 py-2 border border-neutral-800">
          HARDWARE & AEROSPACE STAGING
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-4 uppercase">
          THE LAUNCHER & SYSTEMS ASSEMBLY
        </h2>
        <p className="mt-4 text-neutral-400 max-w-3xl font-serif italic text-base leading-relaxed">
          The heavy engineering systems propelling the Artemis astronauts into deep lunar space. Click on any launch block or vessel system below to query active telemetry parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Modular Navigation List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="p-3 bg-neutral-900 border border-neutral-800 text-[10px] font-mono tracking-widest text-neutral-400 uppercase select-none">
            INTEGRATION STRUCTURE BLUEPRINT // SLS
          </div>

          {SPACECRAFT_PARTS.map((part) => {
            const isSelected = selectedPart.id === part.id;
            return (
              <button
                key={part.id}
                id={`part-nav-${part.id}`}
                onClick={() => setSelectedPart(part)}
                className={`w-full flex items-center justify-between p-4 border transition-all duration-200 focus:outline-none cursor-pointer ${
                  isSelected
                    ? "bg-neutral-900 border-red-650 text-white shadow-xl"
                    : "bg-neutral-950 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${isSelected ? "bg-red-500/10 border border-red-500/20" : "bg-neutral-900"}`}>
                    {getIcon(part.id, `w-5 h-5 ${isSelected ? "text-red-500" : "text-neutral-500"}`)}
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold uppercase tracking-wide text-white">
                      {part.name}
                    </h4>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block mt-0.5">
                      CLASSIF: TRL-M-{part.id.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="w-2.5 h-2.5 bg-red-600 rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Immersive Tech Blueprint Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPart.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              id="specifications-panel"
              className="bg-neutral-900/50 border border-neutral-850 overflow-hidden"
            >
              {/* Header Box */}
              <div className="p-6 border-b border-neutral-850 bg-neutral-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-650/10 border border-red-650/20">
                    {getIcon(selectedPart.id, "w-6 h-6 text-red-500")}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                      {selectedPart.name}
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-red-555">
                      ACTIVE HARDWARE TELEMETRY SPEC — VERIFIED COMPONENT
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-900 text-neutral-300 border border-neutral-800 px-3 py-1.5 text-[9px] font-mono self-start md:self-auto uppercase tracking-wider">
                  SYSTEM READY
                </div>
              </div>

              {/* Body Box */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Description and Key Highlights */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">
                      OVERVIEW DESCRIPTION
                    </h4>
                    <p className="text-sm md:text-base text-neutral-300 font-serif italic leading-relaxed">
                      {selectedPart.description}
                    </p>
                  </div>

                  <div className="bg-neutral-950 p-5 border border-neutral-800">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-red-505" />
                      <h5 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                        OPERATIONAL PROFILE
                      </h5>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono tracking-tight leading-relaxed">
                      {selectedPart.highlight}
                    </p>
                  </div>
                </div>

                {/* Detailed Tech Spec Grid */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    TELEMETRY & HARDWARE METRICS
                  </h4>
                  
                  <div className="space-y-2">
                    {selectedPart.specifications.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col p-3 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 transition-colors"
                      >
                        <span className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase">
                          {spec.label}
                        </span>
                        <span className="text-sm font-sans font-bold text-white mt-1">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[9px] font-mono text-neutral-600 text-right uppercase">
                    System Specifications derived: NASA HEAVY SLS BLUEPRINT v2
                  </div>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
