import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Anchor, Ship, Skull, Compass, MessageSquare, Send, Loader2, Map as MapIcon, Coins, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('translator');

  const translateToPirate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following text into authentic, gritty pirate speak. Use plenty of "arrr", "matey", and nautical metaphors. Text: "${input}"`,
        config: {
          systemInstruction: "You are a grizzled pirate captain. Your translations should be immersive and flavorful.",
        },
      });
      setOutput(response.text || "The sea be silent, matey. Try again.");
    } catch (error) {
      console.error("Error translating:", error);
      setOutput("Arrr, the kraken got the message! (Error connecting to the deep)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0d8d0] font-serif selection:bg-[#f27d26] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Skull className="w-8 h-8 text-[#f27d26]" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic">The Pirate's Cove</h1>
        </div>
        <div className="flex gap-8 text-sm uppercase tracking-widest font-sans font-semibold">
          <button 
            onClick={() => setActiveTab('translator')}
            className={`hover:text-[#f27d26] transition-colors ${activeTab === 'translator' ? 'text-[#f27d26]' : 'text-white/60'}`}
          >
            Translator
          </button>
          <button 
            onClick={() => setActiveTab('map')}
            className={`hover:text-[#f27d26] transition-colors ${activeTab === 'map' ? 'text-[#f27d26]' : 'text-white/60'}`}
          >
            Treasure Map
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-8 pt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'translator' ? (
            <motion.div 
              key="translator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {/* Left Side: Input */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#f27d26] font-sans font-bold">Communication</span>
                  <h2 className="text-5xl font-light leading-none tracking-tight">Speak like a <span className="italic">Scallywag</span></h2>
                </div>
                
                <div className="relative group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your landlubber words here..."
                    className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-[#f27d26]/50 transition-all resize-none text-lg placeholder:text-white/20"
                  />
                  <button
                    onClick={translateToPirate}
                    disabled={loading || !input.trim()}
                    className="absolute bottom-6 right-6 bg-[#f27d26] text-black p-4 rounded-full hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  </button>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest font-sans">
                    <Anchor className="w-4 h-4" />
                    <span>Anchored in AI</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest font-sans">
                    <Compass className="w-4 h-4" />
                    <span>Charting the Deep</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Output */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f27d26]/10 to-transparent blur-3xl -z-10 opacity-30" />
                <div className="h-full bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f27d26]/20 flex items-center justify-center">
                        <Ship className="w-5 h-5 text-[#f27d26]" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-white/40 font-sans font-bold">The Captain's Reply</p>
                        <p className="text-sm italic">Grizzled & Salty</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto prose prose-invert prose-p:text-xl prose-p:leading-relaxed prose-p:italic prose-p:text-[#e0d8d0]/80">
                    {output ? (
                      <Markdown>{output}</Markdown>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                        <MessageSquare className="w-12 h-12" />
                        <p className="text-sm uppercase tracking-[0.2em] font-sans">Waiting for your signal, matey...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-[70vh] border border-white/10 rounded-3xl bg-white/5 relative overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-dashed border-white/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
              </div>
              
              <div className="text-center space-y-6 relative z-10">
                <MapIcon className="w-24 h-24 mx-auto text-[#f27d26] opacity-50" />
                <h2 className="text-4xl font-light italic">The map be hidden in the fog...</h2>
                <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-sans">Coming soon to a shore near you</p>
                
                <div className="flex justify-center gap-12 pt-8">
                  <div className="text-center">
                    <Coins className="w-6 h-6 mx-auto mb-2 text-[#f27d26]" />
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Gold Found</p>
                    <p className="text-2xl font-mono">0.00</p>
                  </div>
                  <div className="text-center">
                    <Wind className="w-6 h-6 mx-auto mb-2 text-[#f27d26]" />
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Wind Speed</p>
                    <p className="text-2xl font-mono">12kts</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t border-white/10 p-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-sans">
          Built for the high seas &bull; Powered by Gemini &bull; &copy; 2026
        </p>
      </footer>
    </div>
  );
}
