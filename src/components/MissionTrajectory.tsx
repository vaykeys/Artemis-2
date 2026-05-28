import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FLIGHT_PHASES } from "../data.ts";
import { FlightPhase } from "../types.ts";
import { CheckCircle2, Clock, Globe2, Compass, Moon, Download, Flame } from "lucide-react";

export default function MissionTrajectory() {
  const [activeStep, setActiveStep] = useState<FlightPhase>(FLIGHT_PHASES[0]);

  // Dynamic Icon mapping for trajectory steps
  const getStepIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "launch":
        return <Flame className={colorClass} />;
      case "systems-check":
        return <CheckCircle2 className={colorClass} />;
      case "tli":
        return <Compass className={colorClass} />;
      case "outbound":
        return <Globe2 className={colorClass} />;
      case "lunar-reach":
        return <Moon className={colorClass} />;
      case "return":
        return <Compass className={colorClass} />;
      case "splashdown":
        return <Download className={colorClass} />;
      default:
        return <Globe2 className={colorClass} />;
    }
  };

  return (
    <div id="trajectory-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-850">
      <div className="mb-14">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 bg-neutral-900 px-4 py-2 border border-neutral-800">
          TRAJECTORY FLIGHT PROFILE
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-4 uppercase">
          MISSION HIGH-PATH BLUEPRINT
        </h2>
        <p className="mt-4 text-neutral-400 max-w-3xl font-serif italic text-base leading-relaxed">
          From full escape staging at Kennedy, high Earth orbit systems optimization, down to high-velocity Pacific Ocean splashdown. Track the continuous 10-day orbital flight path step-by-step.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Modular Timeline Stepper */}
        <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {FLIGHT_PHASES.map((phase) => {
            const isActive = activeStep.id === phase.id;
            return (
              <button
                key={phase.id}
                id={`trajectory-step-${phase.id}`}
                onClick={() => setActiveStep(phase)}
                className={`w-full flex items-start gap-4 p-4 border transition-all duration-200 focus:outline-none cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 border-red-650 text-white"
                    : "bg-neutral-950 border-neutral-900/60 text-neutral-400 hover:border-neutral-805 hover:text-white"
                }`}
              >
                {/* Phase Number & Status Indicator */}
                <div className="flex flex-col items-center mt-1">
                  <div
                    className={`w-7 h-7 flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "bg-neutral-905 border border-neutral-800 text-neutral-300"
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>
                  {phase.phaseNumber < FLIGHT_PHASES.length && (
                    <div className="w-[1px] h-10 bg-neutral-850 mt-1" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                      {phase.title}
                    </h4>
                    <span className="text-[9px] font-mono text-red-500 font-bold uppercase bg-neutral-950 px-2 py-0.5 border border-neutral-850">
                      PH-{phase.phaseNumber}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-450 mt-2 font-serif italic line-clamp-1">
                    {phase.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detailed Flight Stage Card */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              id="trajectory-detail-panel"
              className="bg-neutral-900/50 border-r-4 border-red-650 border-t border-b border-l border-neutral-850 p-6 md:p-8 relative overflow-hidden"
            >
              {/* Abstract decorative space background block */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full filter blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6 font-mono">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20">
                    {getStepIcon(activeStep.id, "w-6 h-6 text-red-500")}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase block">
                      ACTIVE FLIGHT PROFILE
                    </span>
                    <h3 className="text-xl font-display font-black text-white mt-0.5 uppercase tracking-wide">
                      {activeStep.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-300 bg-neutral-950 border border-neutral-800 px-3.5 py-1.5 uppercase font-semibold">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  STAGED: {activeStep.duration}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2.5">
                    STAGE OVERVIEW & FLIGHT DYNAMICS
                  </h4>
                  <p className="text-sm md:text-base text-neutral-300 font-serif italic leading-relaxed">
                    {activeStep.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-850">
                  <div className="p-4 bg-neutral-950 border border-neutral-800">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block">
                      TARGET FLIGHT ALTITUDE
                    </span>
                    <span className="text-sm font-sans font-bold text-white mt-1.5 block">
                      {activeStep.altitudeRange}
                    </span>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-900/30">
                    <span className="text-[9px] font-mono uppercase text-red-500 block font-bold">
                      VERIFICATION REQUIREMENT
                    </span>
                    <span className="text-xs font-mono text-neutral-305 mt-1 block leading-normal">
                      {activeStep.keyAction}
                    </span>
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
