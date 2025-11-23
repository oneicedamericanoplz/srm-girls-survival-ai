import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// shadcn/ui and lucide-react components assumed available in the environment
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Menu } from "lucide-react";

/*
  SRM Girls Survival — Multi-Page Single-File App (Option B simulation)
  - Multi-page (Home, AI Chat, Mess Game, Guide, Map) via client-side routing (tabs)
  - Light-spring pastel palette, comic halftone textures, cel-shade effect
  - 3D parallax/tilt on main card and mascot
  - Animated sarcastic mascot with voice (Web Speech) + loading states
  - Working AI hook to /api/ask (placeholder) with example fetch
  - Mess scoring mini-game, map shortcuts, safety alerts
  NOTE: This is a single-file representation of a multi-page site (use in Next.js or Vite by splitting files as needed)
*/

const PASTEL = {
  bgFrom: "#fef8f2",
  bgTo: "#fcefe9",
  blush: "#ffd9df",
  cream: "#fff7f2",
  peach: "#ffe6c7",
  aqua: "#c8e2ff",
};

const MOCK_QA = [
  { q: "mess today", a: "Paneer? Maybe. Mystery curry: 3/5. Bring snacks." },
  { q: "potheri safety", a: "Lovely in daytime. Nighttime: take a friend and your brain." },
  { q: "dress code", a: "Comfort + dignity. Dupatta optional but powerful." },
];

function useVoice() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  return (text) => {
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-IN';
    utter.rate = 1;
    synth.cancel();
    synth.speak(utter);
  };
}

export default function SRMMultiSite() {
  const [route, setRoute] = useState("home");
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(MOCK_QA.slice(0, 3));
  const [popUp, setPopUp] = useState(null);
  const [messScore, setMessScore] = useState(3);
  const [day, setDay] = useState(1);
  const [stamina, setStamina] = useState(80);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [mascotMood, setMascotMood] = useState("idle");
  const speak = useVoice();
  const mascotRef = useRef(null);

  useEffect(() => {
    if (popUp) {
      const id = setTimeout(() => setPopUp(null), 3000);
      return () => clearTimeout(id);
    }
  }, [popUp]);

  function burstPop(text) {
    setPopUp(text);
    setMascotMood('talk');
    speak(text);
    setTimeout(() => setMascotMood('idle'), 1400);
  }

  async function askAI(q) {
    if (!q.trim()) return burstPop("Ask me something, warrior.");
    setAiLoading(true);
    setAiError(null);
    setMascotMood('thinking');

    try {
      // --- Attempt real AI call to /api/ask ---
      // Your backend should proxy to OpenAI and return JSON: { answer: string }
      // Example fetch (works when /api/ask exists and is configured):
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) throw new Error('AI endpoint error');
      const json = await res.json();
      const answer = json.answer || json.result || "No answer from AI";
      setHistory(h => [{ q, a: answer }, ...h].slice(0, 8));
      burstPop(answer);
    } catch (err) {
      // fallback to local canned answers
      const canned = MOCK_QA.find(m => q.toLowerCase().includes(m.q));
      const fallback = canned ? canned.a : "Hmm — can't reach the network. Ask the warden?";
      setHistory(h => [{ q, a: fallback }, ...h].slice(0, 8));
      setAiError(err.message);
      burstPop(fallback);
    } finally {
      setAiLoading(false);
      setMascotMood('idle');
    }
  }

  function randomSarcastic() {
    const lines = [
      "Oof. That sounds like a mood.",
      "I'll allow it — with one eye closed.",
      "Report filed in the Department of Common Sense.",
      "A+ for effort, C- for logic.",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  // Mess mini-game logic
  function submitMessScore(s) {
    setMessScore(s);
    burstPop(`Noted — you gave the mess a ${s}/5. Revenge? Optional.`);
  }

  // Simple map shortcuts
  const shortcuts = [
    { name: 'Canteen Shortcut', info: 'Cut through the west gate at 8:30 AM to avoid queues.' },
    { name: 'Safe Route Home', info: 'Well-lit path near admin building. Walk with buddies after 8 PM.' },
    { name: 'Laundry Drop', info: 'Use the ground floor vendor between 10–5.' },
  ];

  // comic halftone background (CSS inline)
  const halftoneStyle = {
    backgroundImage: `radial-gradient(circle at 10% 10%, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(45deg, ${PASTEL.blush}, ${PASTEL.peach})`,
    backgroundSize: '8px 8px, 100% 100%',
  };

  return (
    <div className="min-h-screen p-6" style={{ background: `linear-gradient(180deg, ${PASTEL.bgFrom}, ${PASTEL.bgTo})` }}>
      {/* Header / Nav */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full w-12 h-12 flex items-center justify-center shadow-md" style={{ background: PASTEL.blush }}>
            <img src="https://m.media-amazon.com/images/M/MV5BNzBjYWUyYjYtZmQ1Mi00NzhkLWJmNGEtZjI3OGM1NzcxMWU2XkEyXkFqcGc@._V1_.jpg" alt="comic" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#4a2c2f' }}>SRM Girls Survival</h1>
            <div className="text-xs opacity-70">Comic-guide · pastel spring · sarcastic AI</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {['home','chat','mess','guide','map'].map(r => (
            <button key={r} onClick={() => setRoute(r)} className={`px-3 py-2 rounded-md text-sm font-medium ${route===r? 'ring-2 ring-offset-2':'opacity-80'}`}>
              {r.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Mascot + Player Card (3D tilt) */}
        <motion.div whileHover={{ rotateX: 6, rotateY: -6 }} transition={{ type: 'spring', stiffness: 180 }} className="lg:col-span-1">
          <Card className="rounded-3xl p-4 shadow-2xl" style={{ background: PASTEL.cream }}>
            <CardContent className="flex flex-col items-center gap-3">
              <div ref={mascotRef} className="w-36 h-36 rounded-2xl overflow-hidden shadow-inner" style={{ transformStyle: 'preserve-3d' }}>
                {/* Mascot with simple animation */}
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=60" alt="mascot" className={`w-full h-full object-cover ${mascotMood==='talk'? 'animate-pulse':''}`} />
              </div>

              <h2 className="text-lg font-bold">Sumi — Your Sarcastic Guide</h2>
              <p className="text-sm opacity-80 text-center">I answer campus drama, mess trauma, and fashion crimes. Ask away.</p>

              <div className="w-full mt-2">
                <div className="text-sm">Day <strong>{day}</strong> · Stamina <strong>{stamina}%</strong></div>
                <div className="mt-2 flex gap-2">
                  <Button onClick={() => { setDay(d=>d+1); setStamina(s=>Math.max(10,s-10)); burstPop('Next day! Hope you survived the mess.'); }}>Next Day</Button>
                  <Button onClick={() => { setStamina(s=>Math.min(100,s+12)); burstPop('Snack boost!'); }}>Snack</Button>
                </div>
              </div>

              <div className="w-full mt-3 text-xs opacity-70">Voice enabled — I will speak answers aloud.</div>
            </CardContent>
          </Card>

          {/* Halftone panel */}
          <div className="mt-4 rounded-2xl p-3" style={{ ...halftoneStyle }}>
            <div className="text-sm font-semibold">Quick Cheats</div>
            <ul className="mt-2 text-xs opacity-80">
              <li>Beat queues: Canteen shortcut at 8:30 AM.</li>
              <li>Safety: Group walks after 8 PM.</li>
              <li>Weather: Carry a raincoat in monsoon.</li>
            </ul>
          </div>
        </motion.div>

        {/* Right / Main: pages */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {route === 'home' && (
              <motion.section key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="p-4 rounded-2xl" style={{ background: PASTEL.cream }}>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">Welcome to SRM Survival — Game Mode</h2>
                        <p className="mt-2 text-sm opacity-80">This is a playful, comic-style guide built for girls at SRM. Use the chat for live help, play the mess game, and check the map for safe shortcuts.</p>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl border" style={{ borderColor: PASTEL.blush }}>
                            <h4 className="font-semibold">Mess Game</h4>
                            <p className="text-xs opacity-80 mt-1">Rate the mess and win stamina points.</p>
                            <div className="mt-2">
                              <Button onClick={() => setRoute('mess')}>Play Mess Game</Button>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl border" style={{ borderColor: PASTEL.blush }}>
                            <h4 className="font-semibold">AI Chat</h4>
                            <p className="text-xs opacity-80 mt-1">Ask Sumi campus questions with sarcasm enabled.</p>
                            <div className="mt-2">
                              <Button onClick={() => setRoute('chat')}>Talk to Sumi</Button>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl border" style={{ borderColor: PASTEL.blush }}>
                            <h4 className="font-semibold">Map Shortcuts</h4>
                            <p className="text-xs opacity-80 mt-1">Quick safe routes and points of interest.</p>
                            <div className="mt-2">
                              <Button onClick={() => setRoute('map')}>Open Map</Button>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="w-64">
                        <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 10px 30px rgba(74,44,47,0.08)' }}>
                          <img src="https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200&q=60" alt="potheri" className="w-full h-40 object-cover" />
                          <div className="p-3 bg-white">
                            <h4 className="font-semibold">Potheri Lake</h4>
                            <p className="text-xs opacity-70">Daytime strolls = yes. Nighttime dares = no.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {route === 'chat' && (
              <motion.section key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="p-4 rounded-2xl" style={{ background: PASTEL.cream }}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Ask Sumi (AI Chat)</h2>
                      <div className="flex items-center gap-2">
                        <Search />
                        <span className="text-xs opacity-80">Sarcasm: ON</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex gap-3">
                          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask about mess, lake, maps, dress code..." className="flex-1 p-3 rounded-xl bg-white border" />
                          <Button onClick={()=>{ askAI(query); setQuery(''); }}>{aiLoading? 'Thinking...':'Ask'}</Button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {history.map((h, idx)=> (
                            <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-white border">
                              <div className="text-sm opacity-70">Q: {h.q}</div>
                              <div className="mt-1 text-base">A: <span className="font-semibold">{h.a}</span></div>
                            </motion.div>
                          ))}
                        </div>

                        {aiError && <div className="mt-3 text-sm text-red-600">AI Error: {aiError}</div>}
                      </div>

                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Sumi's Shortcuts</h4>
                        <ul className="text-xs mt-2 opacity-80 space-y-2">
                          <li>Ask the mess manager for today's special — they love compliments.</li>
                          <li>Carry a powerbank for long campus days.</li>
                          <li>Hold a friend's hand if crossing lonely paths after dusk (metaphorically!).</li>
                        </ul>

                        <div className="mt-3">
                          <Button onClick={()=>{ burstPop(randomSarcastic()); }}>Surprise Me</Button>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.section>
            )}

            {route === 'mess' && (
              <motion.section key="mess" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="p-4 rounded-2xl" style={{ background: PASTEL.cream }}>
                  <CardContent>
                    <h2 className="text-xl font-bold">Mess Menu — Rate & Win</h2>
                    <p className="text-sm opacity-80 mt-1">Rate today's food. High ratings earn you a virtual 'Snack Token' to boost stamina.</p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Today's Menu</h4>
                        <ul className="text-sm mt-2 opacity-80">
                          <li>Roti, Mystery Curry, Salad</li>
                          <li>Evening: Samosa & Chai</li>
                        </ul>

                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            {[1,2,3,4,5].map(n => (
                              <button key={n} onClick={()=> submitMessScore(n)} className={`w-8 h-8 rounded-full ${messScore===n? 'ring-2':''}`}>{n}</button>
                            ))}
                          </div>
                          <div className="mt-2 text-xs opacity-70">Score saved locally.</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Rewards</h4>
                        <p className="text-sm opacity-80 mt-1">Collect 4+ ratings to unlock a Snack Token (+15 stamina).</p>
                        <div className="mt-3">
                          <Button onClick={()=>{ if (messScore>=4) { setStamina(s=>Math.min(100,s+15)); burstPop('Snack token used! +15 stamina'); } else { burstPop('Need 4+ rating to redeem.'); } }}>Redeem Token</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {route === 'guide' && (
              <motion.section key="guide" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="p-4 rounded-2xl" style={{ background: PASTEL.cream }}>
                  <CardContent>
                    <h2 className="text-xl font-bold">Hostel Girl Survival Guide</h2>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Wardrobe</h4>
                        <p className="text-sm opacity-80 mt-1">Keep a comfortable dupatta, 2 sneakers, one pair of sandals. Raincoat for monsoon.</p>
                      </div>

                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Safety</h4>
                        <p className="text-sm opacity-80 mt-1">Always walk in groups after dark, keep emergency contacts, and use campus security apps.</p>
                      </div>

                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Food Tips</h4>
                        <p className="text-sm opacity-80 mt-1">Carry simple snacks, electrolytes, and a small cutlery set for mess upgrades.</p>
                      </div>

                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Social</h4>
                        <p className="text-sm opacity-80 mt-1">Make two reliable friends — they'll save you from most campus catastrophes.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

            {route === 'map' && (
              <motion.section key="map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="p-4 rounded-2xl" style={{ background: PASTEL.cream }}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Potheri Map & Safe Shortcuts</h2>
                      <div className="text-xs opacity-70">Tap a shortcut for details</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Campus Map (comic)</h4>
                        <div className="mt-2">
                          <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800" alt="campus" className="w-full h-48 object-cover rounded-md" />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border bg-white">
                        <h4 className="font-semibold">Shortcuts</h4>
                        <ul className="mt-2 text-sm opacity-80 space-y-2">
                          {shortcuts.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <MapPin className="w-4 h-4" />
                              <div>
                                <div className="font-semibold">{s.name}</div>
                                <div className="text-xs opacity-70">{s.info}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            )}

          </AnimatePresence>

          {/* Popout comic speech bubble */}
          <AnimatePresence>
            {popUp && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed right-8 bottom-8 z-50">
                <div className="p-4 rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(135deg,#fff,#ffecec)', border: '2px solid #ffd9df', width: 320 }}>
                  <div className="font-semibold">{popUp}</div>
                  <div className="text-xs opacity-70 mt-1">— Sumi</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-4 text-xs opacity-60 text-center">Built with love, sarcasm, and bubble tea. Deploy with Next.js + Vercel for best results.</div>
        </div>
      </main>

      {/* Notes / Deployment instructions rendered below so developer sees it in canvas */}
      <div className="max-w-6xl mx-auto mt-6 p-4 rounded-lg bg-white text-sm">
        <h3 className="font-semibold">Developer Notes</h3>
        <ul className="mt-2 list-disc list-inside text-xs">
          <li>Split this single-file into pages if using Next.js: pages/index.js, pages/chat.js, pages/mess.js, pages/guide.js, pages/map.js</li>
          <li>Create API route <code>/api/ask</code> that proxies requests to OpenAI. Example payload: { '{ query }' }. Return JSON: { '{ answer }' }.</li>
          <li>Store OpenAI key in server env: <code>OPENAI_API_KEY</code>. Do NOT expose it to the client.</li>
          <li>Recommended model: <code>gpt-4o-mini</code> or <code>gpt-4o</code>. Tune system prompt for sarcasm level.</li>
          <li>Voice: Browser SpeechSynthesis used for quick TTS. This requires user gesture to activate on some browsers.</li>
          <li>Halftone & cel-shade: implemented via background layers and image filters; for stronger effect convert mascot to SVG and add stroke/halftone assets.</li>
        </ul>
      </div>
    </div>
  );
}
