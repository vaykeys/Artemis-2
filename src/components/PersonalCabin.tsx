import React, { useState, useEffect } from "react";
import { 
  Shield, 
  User, 
  LogIn, 
  LogOut, 
  CheckSquare, 
  Square, 
  Users, 
  Cpu, 
  Sliders, 
  Compass, 
  Moon, 
  Save, 
  FileText, 
  Layout, 
  Sparkles,
  Award,
  Edit2,
  Check,
  RefreshCw
} from "lucide-react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged, 
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";

// Pre-defined aerospace roles for flight briefing personalization
interface AstronautRole {
  id: string;
  codename: string;
  fullname: string;
  biography: string;
  badge: string;
}

const ROLES: AstronautRole[] = [
  {
    id: "commander",
    codename: "CDR // WISMAN",
    fullname: "REID WISEMAN (NASA, CDR)",
    biography: "U.S. Navy Captain and experienced space explorer. Reid commanded Expedition 41 and will direct the flight path of Artemis II, piloting SLS stages during initial HEO tests.",
    badge: "FLIGHT DIRECTOR"
  },
  {
    id: "pilot",
    codename: "PLT // GLOVER",
    fullname: "VICTOR GLOVER (NASA, PLT)",
    biography: "Flew as pilot on SpaceX Crew-1 (Expedition 64). He is the first Black astronaut to launch on a lunar trajectory. Victor will manage spacecraft navigation and secondary stage staging.",
    badge: "PROPULSION CONTROLLER"
  },
  {
    id: "specialist_koch",
    codename: "MS1 // KOCH",
    fullname: "CHRISTINA KOCH (NASA, MS-1)",
    biography: "Engineer and holder of the record for longest single spaceflight by a woman (328 days). Christina will coordinate deep space life support parameters and Orion ESM interfaces.",
    badge: "LIFE SUPPORT CHIEF"
  },
  {
    id: "specialist_hansen",
    codename: "MS2 // HANSEN",
    fullname: "JEREMY HANSEN (CSA, MS-2)",
    biography: "Canadian Space Agency Colonel and fighter pilot. Jeremy is the first non-American astronaut selected for a deep moon flyby. He represents international orbital staging coordination.",
    badge: "COMMS INTERLINK"
  }
];

const INITIAL_CHECKLIST = [
  { id: "align_sls", text: "Validate SLS Solid Rocket booster gimbal alignments.", completed: false },
  { id: "orion_esm", text: "Check Orion European Service Module pressure & coolant manifolds.", completed: false },
  { id: "capcom_sync", text: "Test AI CAPCOM telemetry interface links and echo responses.", completed: false },
  { id: "radiation_shields", text: "Enable secondary passive radiation shield integrity scans.", completed: false },
  { id: "high_earth_orbit", text: "Calibrate High Earth Orbit (HEO) trajectory flyby flight calculators.", completed: false },
  { id: "splashdown_pacific", text: "Configure telemetry recovery signals for raw splashdown in California.", completed: false }
];

interface UserProfile {
  username: string;
  selectedRole: string;
  items: { id: string; text: string; completed: boolean }[];
  savedLogs: string[];
  userId: string;
  updatedAt: any;
}

export default function PersonalCabin() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState("commander");
  const [savedLogs, setSavedLogs] = useState<string[]>([]);
  
  // UI Loading/Transition states
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Monitor Auth Changes and sync with cloud Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        setLoading(true);
        setErrorLocal(null);
        try {
          const profileDoc = await getDoc(doc(db, "profiles", u.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data() as UserProfile;
            setProfile(data);
            setActiveRole(data.selectedRole || "commander");
            setSavedLogs(data.savedLogs || []);
            setEditorValue(data.username);
          } else {
            // Setup a default profile for the newly registered capsule pilot
            const initialName = u.displayName?.toUpperCase() || u.email?.split("@")[0].toUpperCase() || "CADET";
            const newProfile: UserProfile = {
              username: initialName,
              selectedRole: "commander",
              items: INITIAL_CHECKLIST,
              savedLogs: [],
              userId: u.uid,
              updatedAt: new Date()
            };
            
            // Write to Firestore database
            await setDoc(doc(db, "profiles", u.uid), {
              ...newProfile,
              updatedAt: serverTimestamp()
            });

            setProfile(newProfile);
            setActiveRole("commander");
            setSavedLogs([]);
            setEditorValue(initialName);
          }
        } catch (err: any) {
          setErrorLocal("Could not load flight cabin metadata from NASA database.");
          handleFirestoreError(err, OperationType.GET, `profiles/${u.uid}`);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setSavedLogs([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync checklist state changes
  const handleToggleChecklist = async (id: string) => {
    if (!firebaseUser || !profile) return;
    setSyncing(true);
    const updatedItems = profile.items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    const updatedProfile = { ...profile, items: updatedItems };
    setProfile(updatedProfile);

    try {
      await setDoc(doc(db, "profiles", firebaseUser.uid), {
        ...updatedProfile,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setErrorLocal("Checklist updates synchronization failed.");
      handleFirestoreError(err, OperationType.WRITE, `profiles/${firebaseUser.uid}`);
    } finally {
      setSyncing(false);
    }
  };

  // Sync astronaut role allocation
  const handleChangeRole = async (roleId: string) => {
    if (!firebaseUser || !profile) return;
    setSyncing(true);
    setActiveRole(roleId);
    const updatedProfile = { ...profile, selectedRole: roleId };
    setProfile(updatedProfile);

    try {
      await setDoc(doc(db, "profiles", firebaseUser.uid), {
        ...updatedProfile,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setErrorLocal("Role assignment synchronization failed.");
      handleFirestoreError(err, OperationType.WRITE, `profiles/${firebaseUser.uid}`);
    } finally {
      setSyncing(false);
    }
  };

  // Sync custom Callsign / Username edits
  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !profile || !editorValue.trim()) return;
    setSyncing(true);
    setEditorOpen(false);
    const updatedProfile = { ...profile, username: editorValue.trim().toUpperCase() };
    setProfile(updatedProfile);

    try {
      await setDoc(doc(db, "profiles", firebaseUser.uid), {
        ...updatedProfile,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setErrorLocal("Callsign modifications synchronization failed.");
      handleFirestoreError(err, OperationType.WRITE, `profiles/${firebaseUser.uid}`);
    } finally {
      setSyncing(false);
    }
  };

  // Trigger Google interactive sign-in popup
  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setErrorLocal(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Auth Failure:", err);
      setErrorLocal(err.message || "Failed to establish flight credentials link.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Trigger standard sign-out
  const handleGoogleLogout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      setErrorLocal("Failed to safely sign-out pilot session.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Poll LocalStorage to ingest Capcom saved transcripts asynchronously
  useEffect(() => {
    if (!firebaseUser || !profile) return;
    const handleSavedLogsUpdate = async () => {
      const logs = localStorage.getItem("artemis_saved_terminal_logs");
      if (logs) {
        try {
          const parsed = JSON.parse(logs) as string[];
          const hasDivergence = parsed.length !== (profile.savedLogs?.length || 0) || 
                                parsed.some((l, index) => l !== profile.savedLogs?.[index]);
          if (hasDivergence) {
            setSyncing(true);
            const updatedProfile = { ...profile, savedLogs: parsed };
            setProfile(updatedProfile);
            setSavedLogs(parsed);

            await setDoc(doc(db, "profiles", firebaseUser.uid), {
              ...updatedProfile,
              updatedAt: serverTimestamp()
            });
            setSyncing(false);
          }
        } catch (_) {
          setSyncing(false);
        }
      }
    };

    const logInterval = setInterval(handleSavedLogsUpdate, 2500);
    return () => clearInterval(logInterval);
  }, [firebaseUser, profile]);

  // Handle deletions of log transcripts 
  const handleDeleteLog = async (idx: number) => {
    if (!firebaseUser || !profile) return;
    setSyncing(true);
    const nextLogs = savedLogs.filter((_, i) => i !== idx);
    setSavedLogs(nextLogs);
    localStorage.setItem("artemis_saved_terminal_logs", JSON.stringify(nextLogs));
    
    // Attempt tracking ID deletion to keep Chat button accurate
    try {
      const idsStr = localStorage.getItem("artemis_saved_terminal_log_ids") || "[]";
      const ids = JSON.parse(idsStr) as string[];
      if (ids[idx]) {
        const nextIds = ids.filter((_, i) => i !== idx);
        localStorage.setItem("artemis_saved_terminal_log_ids", JSON.stringify(nextIds));
      }
    } catch (_) {}

    const updatedProfile = { ...profile, savedLogs: nextLogs };
    setProfile(updatedProfile);

    try {
      await setDoc(doc(db, "profiles", firebaseUser.uid), {
        ...updatedProfile,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setErrorLocal("Log deletion synchronization failed.");
      handleFirestoreError(err, OperationType.WRITE, `profiles/${firebaseUser.uid}`);
    } finally {
      setSyncing(false);
    }
  };

  const currentRoleDetails = ROLES.find(r => r.id === activeRole) || ROLES[0];

  return (
    <div id="personalized-dashboard" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-850">
      <div className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 bg-neutral-900 px-4 py-2 border border-neutral-800">
            SECURE CLOUD-LINKED COCKPIT
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-4 uppercase">
            FLIGHT STATS MODULE
          </h2>
          <p className="mt-4 text-neutral-400 max-w-3xl font-serif italic text-base leading-relaxed">
            Link your real Google credentials with the command deck securely. Coordinate Solid Rocket Staging checklists, allocate pilot cadre specialties, and verify mission targets with real-time Firestore persistence.
          </p>
        </div>

        {/* Sync loading flag */}
        {syncing && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-red-550/20 bg-neutral-900 font-mono text-[9px] text-red-555 uppercase tracking-wider animate-pulse self-start">
            <RefreshCw className="w-3 h-3 animate-spin text-red-500" />
            SYNCHRONIZING SECURE FIRESTORE
          </div>
        )}
      </div>

      {errorLocal && (
        <div className="mb-6 bg-red-950/25 border border-red-500/30 p-4 max-w-md mx-auto text-left flex gap-3 items-center">
          <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs font-mono text-neutral-350">{errorLocal}</span>
        </div>
      )}

      {loading ? (
        /* LOADING SKELETON */
        <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-850 p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-red-650 animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
            TUNING TELEMETRY STACK...
          </p>
        </div>
      ) : !profile ? (
        /* LOCKSCREEN SIGNIN VIA GOOGLE POPUP (Mandated OAuth popup style in skill) */
        <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-850 p-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-655/5 rounded-full filter blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
            <div className="p-2 bg-red-500/10 border border-red-500/20">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-display font-black text-white uppercase tracking-wider">
                FLIGHT VERIFICATION MATRIX
              </h4>
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                NASA ACCOUNT VERIFICATION PORT ACTIVE
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-serif text-neutral-400 italic leading-relaxed">
              Artemis flight telemetry requires an authorized mission coordinator profile to persist command logs and checklist checks on servers.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase py-3.5 flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              AUTHORIZE ACCESS WITH GOOGLE
            </button>
          </div>

          <p className="text-[9px] font-mono text-neutral-500 uppercase text-center mt-6 tracking-wide leading-relaxed border-t border-neutral-850 pt-4">
            INTEGRATED SECURELY WITH GOOGLE IDENTITY VERDICT
          </p>
        </div>
      ) : (
        /* AUTHORIZED COCKPIT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Briefing Control Card & Astronaut selection */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 border border-neutral-850 p-6 text-left space-y-6">
              
              {/* Profile Badge with Callsign Editor */}
              <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center text-white font-mono font-bold text-sm">
                    {profile.username.slice(0, 2)}
                  </div>
                  
                  {editorOpen ? (
                    <form onSubmit={handleSaveUsername} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={editorValue}
                        onChange={(e) => setEditorValue(e.target.value)}
                        className="bg-neutral-950 border border-neutral-750 text-white font-mono text-xs px-2 py-1 max-w-[120px] focus:outline-none focus:border-red-500"
                        maxLength={16}
                        required
                      />
                      <button type="submit" className="p-1 hover:text-red-500" title="Save Callsign">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex-grow">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider block">
                          {profile.username}
                        </h4>
                        <button 
                          onClick={() => setEditorOpen(true)} 
                          className="text-neutral-500 hover:text-white transition-colors"
                          title="Edit Callsign"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block font-bold mt-0.5">
                        {currentRoleDetails.badge}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGoogleLogout}
                  disabled={authLoading}
                  className="text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
                  title="Disconnect telemetry link"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Astronaut Role Interactive Tabs */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block tracking-widest font-bold">
                  ASSIGN COMMAND CADRE ROLE
                </span>
                
                <div className="grid grid-cols-1 gap-2">
                  {ROLES.map((role) => {
                    const isSelected = activeRole === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleChangeRole(role.id)}
                        className={`p-3.5 border text-left flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-neutral-950 border-red-600 text-white shadow-md"
                            : "bg-neutral-950/40 border-neutral-850 text-neutral-400 hover:border-neutral-800 hover:text-white"
                        }`}
                      >
                        <div className="font-mono text-xs font-bold uppercase tracking-wider">
                          {role.codename}
                        </div>
                        {isSelected && <Award className="w-4 h-4 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status checklist metrics */}
              <div className="pt-4 border-t border-neutral-850 font-mono text-[10px] space-y-1 text-neutral-400 uppercase">
                <div className="flex justify-between">
                  <span>CHECKLIST COMPLETION</span>
                  <span className="text-white font-bold">
                    {profile.items.filter(i => i.completed).length} / {profile.items.length}
                  </span>
                </div>
                <div className="w-full bg-neutral-950 h-1.5 border border-neutral-850 overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{
                      width: `${(profile.items.filter(i => i.completed).length / profile.items.length) * 100}%`
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Checkpoints & Dynamic Command Briefing */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Staging Checkmarks */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 text-left space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                <CheckSquare className="w-4 h-4 text-red-500" />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                  STAGING CHECKLIST
                </h4>
              </div>

              <div className="space-y-3">
                {profile.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className="w-full flex items-start gap-3 p-3.5 bg-neutral-950/70 border border-neutral-850 hover:border-neutral-700 transition-colors text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-red-500" />
                      ) : (
                        <div className="w-4 h-4 border border-neutral-750" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-mono transition-transform ${item.completed ? "line-through text-neutral-500" : "text-neutral-300"}`}>
                        {item.text}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated AI Briefing Cabin Output */}
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-850 p-6 text-left space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                  <Cpu className="w-4 h-4 text-red-500" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                    PERSONALIZED DIRECT BRIEFING
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                      ASTRONAUT ASSIGNED
                    </span>
                    <span className="text-base font-display font-black text-white uppercase tracking-wide block mt-1">
                      {currentRoleDetails.fullname}
                    </span>
                  </div>

                  <p className="text-xs font-serif italic text-neutral-400 leading-relaxed bg-neutral-950 p-4 border border-neutral-850">
                    "{currentRoleDetails.biography}"
                  </p>

                  <div className="text-[9px] font-mono text-neutral-500 uppercase leading-normal pt-2 border-t border-neutral-850">
                    <span className="text-red-500 font-bold">WARNING Checkpoint:</span> Always coordinate with AI CapCom assistant in the communication matrix below to query exact orbit constraints for this role.
                  </div>
                </div>
              </div>

              {/* Saved CapCom logs dashboard */}
              {savedLogs.length > 0 && (
                <div className="bg-neutral-900 border border-neutral-850 p-6 text-left space-y-4">
                  <div className="flex items-center gap-2 border-b border-neutral-850 pb-3">
                    <FileText className="w-4 h-4 text-red-500" />
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                      SAVED FLIGHT TRANSCRIPTS ({savedLogs.length})
                    </h4>
                  </div>

                  <div className="max-h-[220px] overflow-y-auto space-y-2.5 custom-scrollbar">
                    {savedLogs.map((logText, idx) => (
                      <div key={idx} className="bg-neutral-955 p-3 border border-neutral-850 text-left text-[10px] font-mono text-neutral-300 relative group pr-10">
                        <p className="line-clamp-2 leading-relaxed italic animate-fade-in">"{logText}"</p>
                        <button
                          onClick={() => handleDeleteLog(idx)}
                          className="absolute right-3 top-3 text-[10px] text-red-550 hover:text-red-500 font-bold uppercase transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          DELETE
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
