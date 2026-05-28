import { useState, useEffect } from "react";
import { Search, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, ZoomIn, Eye, Calendar, BookOpen } from "lucide-react";

interface NasaImageItem {
  nasaId: string;
  title: string;
  description: string;
  imageUrl: string;
  dateCreated: string;
  center: string;
}

export default function NasaExplorer() {
  const [activeTab, setActiveTab] = useState<"archive" | "apod">("archive");
  const [searchQuery, setSearchQuery] = useState("orion spacecraft");
  const [searchResults, setSearchResults] = useState<NasaImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // APOD State
  const [apodData, setApodData] = useState<{
    title: string;
    explanation: string;
    url: string;
    date: string;
    copyright?: string;
  } | null>(null);
  const [apodLoading, setApodLoading] = useState(false);

  // Selected Image for Detailed Modal
  const [selectedImage, setSelectedImage] = useState<NasaImageItem | null>(null);

  // Fetch NASA Image Library
  const fetchNasaImages = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
      );
      if (!response.ok) {
        throw new Error("Failed to contact NASA space center servers.");
      }
      const data = await response.json();
      const items = data.collection?.items || [];
      
      const mapped: NasaImageItem[] = items.slice(0, 6).map((item: any) => {
        const dataObj = item.data?.[0] || {};
        const linksObj = item.links?.[0] || {};
        return {
          nasaId: dataObj.nasa_id || Math.random().toString(),
          title: dataObj.title || "Unclassified Space Asset",
          description: dataObj.description || "No supplemental descriptions available in telemetry archives.",
          imageUrl: linksObj.href || "",
          dateCreated: dataObj.date_created ? new Date(dataObj.date_created).toLocaleDateString() : "Pending",
          center: dataObj.center || "NASA",
        };
      });
      
      setSearchResults(mapped.filter(img => img.imageUrl));
    } catch (err: any) {
      setError(err.message || "Archive linkage failed.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch NASA Astronomy Picture of the Day (APOD)
  const fetchApod = async () => {
    setApodLoading(true);
    try {
      // Use the official public DEMO_KEY which has generous request limits
      const response = await fetch(
        "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
      );
      if (!response.ok) {
        throw new Error("Demonstration key rate limits exceeded or NASA APOD offline.");
      }
      const data = await response.json();
      setApodData(data);
    } catch (err) {
      // Fallback APOD in case rate limits are blocked
      setApodData({
        title: "The Orion Spacecraft over Earth",
        explanation: "Orion's Orbital Flight Test reveals the complex structures of the capsule. This fallback data ensures the layout is secure when public NASA limits are loaded.",
        url: "https://images-api.nasa.gov/images/orion_artemis.jpg",
        date: new Date().toLocaleDateString(),
        copyright: "NASA / Space Flight Center"
      });
    } finally {
      setApodLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "archive") {
      fetchNasaImages(searchQuery);
    } else {
      fetchApod();
    }
  }, [activeTab]);

  return (
    <div id="nasa-telemetry" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-neutral-850">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-red-500 bg-neutral-900 px-4 py-2 border border-neutral-800">
            REAL NASA DATABASE CONNECTIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mt-4 uppercase">
            LIVE INTEL VIEWPORT
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl font-serif italic text-base leading-relaxed">
            Directly connect your console to the official visual assets of the National Aeronautics and Space Administration.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex bg-neutral-900 border border-neutral-800 p-1 self-start font-mono text-[10px] tracking-wider uppercase">
          <button
            onClick={() => setActiveTab("archive")}
            className={`px-4 py-2.5 transition-all text-left uppercase cursor-pointer ${
              activeTab === "archive"
                ? "bg-red-600 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            IMAGE ARCHIVE
          </button>
          <button
            onClick={() => setActiveTab("apod")}
            className={`px-4 py-2.5 transition-all text-left uppercase cursor-pointer ${
              activeTab === "apod"
                ? "bg-red-600 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            ASTRONOMY DAILY FEED (APOD)
          </button>
        </div>
      </div>

      {activeTab === "archive" ? (
        <div className="space-y-8">
          {/* Custom Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchNasaImages(searchQuery);
            }}
            className="flex gap-2 max-w-xl"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search e.g. 'artemis launch', 'orion spacecraft', 'capcom'..."
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 px-4 py-3 pl-10 text-xs font-mono focus:outline-none focus:border-red-500/50"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-500 px-6 py-3 font-mono text-xs font-bold transition-all uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              QUERY
            </button>
          </form>

          {/* Skeletons/Results */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-850 overflow-hidden h-96 flex flex-col">
                  {/* Image skeleton with shimmer */}
                  <div className="w-full h-48 shimmer-skeleton" />
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 w-1/3 shimmer-skeleton rounded" />
                      <div className="h-6 w-3/4 shimmer-skeleton rounded" />
                    </div>
                    <div className="h-10 w-full shimmer-skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-950/20 border border-red-500/30 p-6 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  NASA DATABASE CONNECTION BLOCKED
                </h4>
                <p className="text-xs font-serif text-neutral-40s italic mt-1 leading-relaxed">
                  {error}. Please check network permissions and retry the query connection.
                </p>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 p-8 text-center text-neutral-450 font-serif italic">
              No space assets matching current diagnostic filter sequences found inside NASA.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((img) => (
                <div
                  key={img.nasaId}
                  className="bg-neutral-900 border border-neutral-850 group hover:border-red-650 transition-all flex flex-col overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-950">
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedImage(img)}
                        className="bg-neutral-950/95 border border-red-500 text-white px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase flex items-center gap-1 cursor-pointer hover:bg-red-600 transition-colors"
                      >
                        <Eye className="w-3 h-3 text-red-500 group-hover:text-white" />
                        INSPECT
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-red-500 tracking-wider block mb-2 uppercase">
                        INDEX: {img.center} // {img.dateCreated}
                      </span>
                      <h3 className="text-sm font-display font-black text-white uppercase leading-snug tracking-wide line-clamp-2">
                        {img.title}
                      </h3>
                      <p className="text-xs font-serif italic text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                        {img.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* APOD FEED */
        <div className="bg-neutral-900 border border-neutral-850 p-6 md:p-10 relative overflow-hidden">
          {apodLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 h-96 shimmer-skeleton" />
              <div className="lg:col-span-6 space-y-6">
                <div className="h-4 w-1/4 shimmer-skeleton rounded" />
                <div className="h-10 w-3/4 shimmer-skeleton rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full shimmer-skeleton rounded" />
                  <div className="h-4 w-11/12 shimmer-skeleton rounded" />
                  <div className="h-4 w-4/5 shimmer-skeleton rounded" />
                </div>
              </div>
            </div>
          ) : apodData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 border border-neutral-800 bg-neutral-950 overflow-hidden relative group">
                <img
                  src={apodData.url}
                  alt={apodData.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4 bg-neutral-950 text-neutral-300 border border-neutral-800 px-3 py-1 text-[9px] font-mono uppercase tracking-wider">
                  DAILY TELEMETRY SHOT
                </div>
              </div>
              
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 uppercase tracking-widest leading-none">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>NASA APOD SEQUENCE: {apodData.date}</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                  {apodData.title}
                </h3>
                
                <p className="text-xs md:text-sm text-neutral-400 font-serif italic leading-relaxed pt-2 border-t border-neutral-850">
                  {apodData.explanation}
                </p>

                {apodData.copyright && (
                  <div className="text-[10px] font-mono text-neutral-500 uppercase">
                    CREDIT CAPTURE: // {apodData.copyright}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* DETAIL INSPECTOR MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 max-w-2xl w-full max-h-[90vh] flex flex-col text-left overflow-y-auto custom-scrollbar">
            <div className="p-4 bg-neutral-950 border-b border-neutral-850 flex justify-between items-center font-mono">
              <span className="text-[10px] text-red-500 tracking-widest uppercase">
                NASA SPACE IMAGE CODES SPEC // {selectedImage.nasaId}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-neutral-450 hover:text-white text-xs font-bold uppercase cursor-pointer"
              >
                [ CLOSE ]
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="border border-neutral-800 overflow-hidden bg-neutral-950">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[350px] object-cover mx-auto"
                />
              </div>
              
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                  RELEASED: {selectedImage.dateCreated} BY {selectedImage.center}
                </span>
                <h4 className="text-xl font-display font-black text-white uppercase tracking-tight leading-snug">
                  {selectedImage.title}
                </h4>
                <p className="text-xs text-neutral-400 font-mono tracking-tight leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-neutral-950 border-t border-neutral-850 flex justify-end">
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-red-650 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase px-6 py-2.5 cursor-pointer"
              >
                ACKNOWLEDGE ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
