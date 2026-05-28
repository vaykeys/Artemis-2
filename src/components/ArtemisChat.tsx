import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types.ts";
import { MessageSquare, Send, Sparkles, AlertTriangle, Play, RefreshCw, User, Database, Save, Check } from "lucide-react";

export default function ArtemisChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "model",
      text: "Hello! This is CapCom flight tracking. I am your Gemini-powered Artemis lunar flight assistant. Ask me anything about the Artemis II crew, the mighty SLS rocket, launch trajectories, flight timelines, or primary scientific payloads! How can I assist your lunar exploration research today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Track IDs of messages already logged to Cockpit logs
  const [savedMessageIds, setSavedMessageIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const loggedIds = localStorage.getItem("artemis_saved_terminal_log_ids") || "[]";
      setSavedMessageIds(JSON.parse(loggedIds));
    } catch (_) {}
  }, []);

  const handleSaveToLogs = (text: string, id: string) => {
    try {
      const logsStr = localStorage.getItem("artemis_saved_terminal_logs") || "[]";
      const logs = JSON.parse(logsStr);
      if (!logs.includes(text)) {
        logs.push(text);
        localStorage.setItem("artemis_saved_terminal_logs", JSON.stringify(logs));
        
        const idsStr = localStorage.getItem("artemis_saved_terminal_log_ids") || "[]";
        const ids = JSON.parse(idsStr);
        ids.push(id);
        localStorage.setItem("artemis_saved_terminal_log_ids", JSON.stringify(ids));
        
        setSavedMessageIds(ids);
      }
    } catch (_) {}
  };

  const sampleQuestions = [
    "Who is pilot Victor Glover?",
    "How does the Orion heat shield work?",
    "Why does the capsule fly behind the Moon?",
    "When will Artemis II launch?"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Map current messages to format expected by server including the new user message
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        text: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with Lunar Flight Control.");
      }

      const modelMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "model",
        text: data.reply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error: any) {
      console.error("CapCom Chat Error:", error);
      
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "model",
        text: error.message?.includes("GEMINI_API_KEY") 
          ? "⚠️ MISSION SECRET REQUIRED: The Gemini API Key is missing or not configured. To activate live Q&A responses, open Secrets under the Settings menu in AI Studio and declare: GEMINI_API_KEY to proceed! In the meantime, feel free to inspect our detailed offline trajectory charts, crew rosters, and craft systems above!" 
          : `⚠️ COMMUNICATION LOSS: ${error.message || "Could not reach CapCom. Check your connection and retry."}`,
        timestamp: new Date(),
        error: true
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "initial",
        role: "model",
        text: "System Reset complete. Connection to Lunar database re-established. How can I assist you with Artemis II specs?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div id="artemis-chat-section" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-850">
      <div className="mb-14 text-center">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 bg-neutral-900 px-4 py-2 border border-neutral-800">
          CAPCOM MISSION FLIGHT ASSISTANT
        </span>
        <h2 className="text-4xl font-display font-black tracking-tight text-white mt-4 uppercase">
          AI FLIGHT CONSOLE EXPERT
        </h2>
        <p className="mt-3 text-neutral-400 font-serif italic text-sm max-w-2xl mx-auto leading-relaxed">
          Query our high-fidelity flight console for technical specifications, spacecraft assemblies, astronaut service backgrounds, or flight timetables.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-850 overflow-hidden flex flex-col h-[550px] shadow-2xl">
        
        {/* Terminal Header */}
        <div className="bg-neutral-950 px-5 py-3.5 border-b border-neutral-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-600 animate-pulse" />
            <span className="text-[10px] font-mono text-neutral-305 font-bold tracking-widest uppercase">
              CAPCOM PORTAL // TELEMETRY LINK
            </span>
          </div>

          <button
            onClick={handleResetChat}
            className="text-neutral-450 hover:text-white text-[10px] font-mono flex items-center gap-1.5 transition-all focus:outline-none cursor-pointer"
            title="Reset Terminal Logs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-500" />
            RESET MODULE
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-[#0d0d0d] custom-scrollbar">
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isModel ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 flex items-center justify-center border font-mono text-xs flex-shrink-0 ${
                    isModel
                      ? msg.error
                        ? "bg-amber-950/40 border-amber-500/30 text-amber-400"
                        : "bg-red-950/40 border-red-500/30 text-red-500"
                      : "bg-neutral-950 border-neutral-850 text-neutral-300"
                  }`}
                >
                  {isModel ? (
                    msg.error ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Database className="w-4 h-4" />
                    )
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`p-3.5 text-sm leading-relaxed relative ${
                    isModel
                      ? msg.error
                        ? "bg-amber-950/20 border border-amber-500/10 text-amber-200/90"
                        : "bg-neutral-900 border border-neutral-850 text-neutral-200"
                      : "bg-red-500/10 border border-red-500/20 text-neutral-100 mr-0.5"
                  }`}
                >
                  <p className="whitespace-pre-line font-mono text-xs text-neutral-300">{msg.text}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/20">
                    <div>
                      {isModel && !msg.error && msg.id !== "initial" && (
                        <button
                          type="button"
                          onClick={() => handleSaveToLogs(msg.text, msg.id)}
                          className="text-[9px] font-mono font-bold text-red-500 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {savedMessageIds.includes(msg.id) ? (
                            <>
                              <Check className="w-3 h-3 text-red-500" />
                              LOGGED IN COCKPIT
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3 text-red-500" />
                              LOG TO COCKPIT
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <span className="text-[8px] font-mono text-neutral-550">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 flex items-center justify-center bg-red-950/40 border border-red-500/30 text-red-500 flex-shrink-0 animate-pulse">
                <Database className="w-4 h-4" />
              </div>
              <div className="bg-neutral-900 border border-neutral-850 p-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-650 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-red-650 rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-red-650 rounded-full animate-bounce delay-200" />
                <span className="text-[10px] font-mono text-neutral-450 ml-1">CONSOLE ANALYZING...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-5 py-2.5 bg-neutral-950 border-t border-neutral-850 flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar">
          {sampleQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(question)}
              disabled={isLoading}
              className="text-[10px] font-mono font-bold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-805 px-3 py-1.5 border border-neutral-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-red-500 animate-spin-slow" />
              {question}
            </button>
          ))}
        </div>

        {/* Input Dock */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="p-4 bg-neutral-950 border-t border-neutral-850 flex gap-2.5 items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type query sequence parameters, bios, or trajectory indices..."
            disabled={isLoading}
            className="flex-1 bg-[#0d0d0d] border border-neutral-850 text-neutral-100 placeholder-neutral-600 px-4 py-3 text-xs font-mono focus:outline-none focus:border-red-500/50 disabled:opacity-75"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-red-600 text-white hover:bg-red-500 p-3 font-mono text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
