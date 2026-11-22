import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';


const secrets = [
  { id: 'heart', name: 'Heart', message: 'Miss na kita, wala nang debate.', icon: '♡' },
  { id: 'star', name: 'Star', message: 'Okay, official announcement: miss na miss na kita, tsonggi.', icon: '✦' },
  { id: 'flower', name: 'Flower', message: 'Wala, gusto lang talaga kita makita ulit.', icon: '✿' },
  { id: 'letter', name: 'Envelope', message: 'Reminder: welcome ka dito kahit biglaan.', icon: '✉' },
  { id: 'house', name: 'Little house', message: 'Tsonggi privileges never expire. Your seat here is still reserved.', icon: '⌂' },
  { id: 'corner', name: 'Hidden corner', message: 'Pumunta ka na kasi HAHAHA.', icon: '☁' },
  { id: 'pop', name: 'Tiny surprise', message: "Okay, last na 'to. Miss na kita.", icon: '♡' },
];
const reasons = [
  ['01', 'Para hindi puro online na lang ang friendship natin.'],
  ['02', 'May bahay naman, may tao naman, ikaw na lang kulang.'],
  ['03', 'Hindi valid ang “busy ako” forever HAHAHA.'],
  ['04', 'Libre naman mangulit dito.'],
  ['05', 'Miss na kita, ayan na, nasabi ko na.'],
];
const popLines = [
  'Certified tsonggi behavior. Approved. ♡',
  'Reminder: may reserved tambay slot ka dito.',
  'Psst… miss ka na namin dito. (Ako lang pala.)',
  'No pressure. Pero sana soon. HAHAHA',
];
function App() {
  const [page, setPage] = useState(0);
  const [reason, setReason] = useState(0);
  const [found, setFound] = useState([]);
  const [modal, setModal] = useState(null);
  const [heartClicks, setHeartClicks] = useState(0);
  const [starClicks, setStarClicks] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [burst, setBurst] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);

  const playTone = (freq = 660) => {
    if (!soundOn) return;
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ctx.currentTime); gain.gain.setValueAtTime(0.045, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.17); osc.onended = () => ctx.close(); } catch {}
  };

  const discover = (id) => {
    if (found.includes(id)) return;
    const item = secrets.find(s => s.id === id);
    if (!item) return;
    const next = [...found, id];
    setFound(next);
    playTone(760);
    if (id !== 'letter') setModal({ title: `Secret found: ${item.name}`, message: item.message, icon: item.icon });
    if (next.length === secrets.length) {
      setTimeout(() => setModal({ title: 'TSONGGI LEVEL: MAXIMUM ♡', message: 'Congratulations! You found all the kalokohan. Final reward: libre kang tambay dito. HAHAHA.', icon: '✧' }), 700);
    }
  };
  const clickHeart = () => {
    const n = heartClicks + 1;
    setHeartClicks(n);
    setBurst(true);
    setTimeout(() => setBurst(false), 650);
    if (n >= 3) discover('heart');
  };
  const clickStar = () => {
    const n = starClicks + 1;
    setStarClicks(n);
    if (n >= 5) discover('star');
    else setModal({ title: 'A suspicious little star…', message: `Hmm. Something might happen after ${5 - n} more ${5 - n === 1 ? 'click' : 'clicks'}.`, icon: '✦' });
  };
  const showPop = () => {
    const nextIndex = (randomIndex + 1) % popLines.length;
    setRandomIndex(nextIndex);
    if (!found.includes('pop')) discover('pop');
    setModal({ title: 'Random tsonggi thought', message: popLines[nextIndex], icon: '♡' });
  };
  const toggleSound = () => {
    setSoundOn(v => { if (!v) setTimeout(() => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.frequency.value = 740; gain.gain.setValueAtTime(.035, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .13); osc.onended = () => ctx.close(); } catch {} } , 0); return !v; });
  };
  const nextPage = () => setPage(p => Math.min(5, p + 1));
  const prevPage = () => setPage(p => Math.max(0, p - 1));

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
      <div className="grain" aria-hidden="true"/>
      <header className="topbar">
        <div className="brand"><span className="brand-dot">♡</span><span>for lea, tsonggi</span></div>
        <div className="top-actions">
          <button className="sound-button" onClick={toggleSound} aria-label="Toggle sound effects">{soundOn ? '♫ sound on' : '♫ sound off'}</button>
          <div className="secret-count" title="Find the hidden little things"><span>✧</span> {found.length}/{secrets.length}</div>
        </div>
      </header>
      <div className="floating-decor" aria-hidden="false">
        <button className={`float-heart ${burst ? 'burst' : ''}`} onClick={clickHeart} aria-label="Click the floating heart three times">♡</button>
        <button className="float-star" onClick={clickStar} aria-label="Click the star five times">✦</button>
        <button className="float-cloud" onClick={() => discover('corner')} aria-label="Secret cloud">☁</button>
      </div>
      <div className="page-progress"><span style={{ width: `${((page + 1) / 6) * 100}%` }} /></div>

      {page === 0 && <section className="screen intro-screen">
        <div className="tiny-label"><span className="pulse-dot"/> A VERY IMPORTANT ANNOUNCEMENT</div>
        <div className="intro-art"><div className="orb orb-pink"/><div className="orb orb-lilac"/><div className="envelope"><div className="env-flap"/><span>♡</span></div><span className="art-star star-a">✦</span><span className="art-star star-b">✧</span><span className="art-star star-c">✦</span></div>
        <p className="eyebrow">psst… Lea, sandali</p>
        <h1>May sasabihin<br/><em>ako sa'yo.</em></h1>
        <p className="subtitle">Don't panic. Hindi 'to assignment.<br/>Promise, HAHAHA.</p>
        <button className="primary-button" onClick={nextPage}>Ano na naman 'to? <span>↗</span></button>
        <div className="scroll-note">MADE WITH A LITTLE KALOKOHAN <span>✿</span></div>
      </section>}


      {page === 1 && <section className="screen verify-screen">
        <div className="terminal-card">
          <div className="terminal-head"><span/><span/><span/><b>LEA.EXE</b></div>
          <div className="terminal-content"><p className="terminal-label">FRIENDSHIP VERIFICATION</p><h2>Scanning visitor...</h2>
            <div className="terminal-line"><span>›</span> Checking identity <b>✓</b></div><div className="terminal-line"><span>›</span> Lea detected <b>✓</b></div><div className="terminal-line"><span>›</span> Certified tsonggi <b>✓</b></div><div className="terminal-line"><span>›</span> Authorized to enter this house <b>✓</b></div>
            <div className="access-granted">ACCESS GRANTED <span>♡</span></div>
          </div>
        </div>
        <p className="subtitle">Wala namang security dito, gusto ko lang OA.</p>
        <button className="primary-button" onClick={nextPage}>Pasok ka, tsonggi <span>↗</span></button>
      </section>}


      {page === 2 && <section className="screen reasons-screen">
        <p className="eyebrow">A totally unbiased list</p><h1>Reasons why you<br/><em>should visit again.</em></h1>
        <div className="reason-card" key={reason}><div className="reason-number">{reasons[reason][0]}</div><div className="reason-copy">{reasons[reason][1]}</div><div className="reason-sticker">✿</div></div>
        <div className="reason-controls"><button className="round-button" onClick={() => setReason(r => (r + reasons.length - 1) % reasons.length)} aria-label="Previous reason">←</button><span>{reason + 1} <i>/</i> {reasons.length}</span><button className="round-button" onClick={() => setReason(r => (r + 1) % reasons.length)} aria-label="Next reason">→</button></div>
        <p className="reason-footnote">Swipe your brain to the next reason. HAHAHA.</p>
        <button className="primary-button" onClick={nextPage}>Okay, gets ko na <span>↗</span></button>
      </section>}


      {page === 3 && <section className="screen letter-screen">
        <div className="letter-wrap"><div className="letter-top"><span>JUST A LITTLE NOTE</span><span>♡</span></div>
          <div className="letter-paper"><div className="letter-lines"/><div className="letter-content"><p className="letter-greeting">Hi tsong HAHAHA,</p>
            <p>I don't really know how to say this without sounding dramatic, but I kinda miss you. Wag mo na kasi ako i-reto sa pinsan mo, sa'yo na lang kasi. HAHAHA.</p>
            <p>It's been a while since you last came over, and honestly, I wish you would again.</p>
            <p>So, I made this little website just to remind you that you're always welcome here. No special occasion, no reason needed. I just miss my tsonggi.</p>
            <p className="letter-sign">— from your favorite mangungulit <span>♡</span></p>
          </div></div>
        </div>
        <button className="primary-button" onClick={nextPage}>Sige, last na <span>↗</span></button>
      </section>}


      {page === 4 && <section className="screen invite-screen">
        <div className="house-scene">
          <div className="moon"/>
          <div className="cloud cloud-one">☁</div>
          <div className="cloud cloud-two">☁</div>
          <div className="pixel-house">
            <div className="roof"/>
            <div className="house-body">
              <div className="window window-left"><i/></div>
              <div className="door"><i/></div>
              <div className="window window-right"><i/></div>
            </div>
            <div className="house-shadow"/>
            <div className="garden-flower flower-one">✿</div>
            <div className="garden-flower flower-two">✾</div>
            <div className="garden-flower flower-three">✿</div>
          </div>
        </div>
        <p className="eyebrow">okay, serious question (konti)</p><h1>So, tsonggi…</h1><p className="subtitle">Kailan ka ulit pupunta dito? <span>🏡</span></p>
        <div className="invite-buttons"><button className="invite-choice choice-main" onClick={() => setModal({title:'ETO NA OH! ♡',message:'Eto na oh, may schedule na tayo HAHAHA 😭💗 I shall await your arrival, tsonggi.',icon:'♡'})}>Sige, punta ako soon! ♡</button><button className="invite-choice" onClick={() => setModal({title:'No pressure, tsonggi.',message:'Okay lang naman HAHAHA. Basta kapag free ka, alam mo na kung saan ka pwede pumunta. 🫶',icon:'✿'})}>Tingnan ko muna schedule ko</button><button className="invite-choice choice-third" onClick={() => setModal({title:'Grabe ka naman 😭',message:'Wala naman. Miss lang kita, gago. HAHAHA.',icon:'☁'})}>Bakit ba ako pinapapunta?</button></div>
        <p className="no-pressure">No pressure, promise. Just a little invite. ♡</p>
      </section>}


      {page === 5 && <section className="screen ending-screen">
        <div className="ending-house">
          <div className="end-moon"/>
          <div className="end-house">
            <div className="end-roof"/>
            <div className="end-body"><span/><span/><i/></div>
          </div>
          <div className="end-stars">✦　·　✧　·　✦</div>
          <div className="end-heart">♡</div>
        </div>
        <p className="eyebrow">one last thing, tsonggi</p><h1>You're always<br/><em>welcome here.</em></h1><p className="ending-text">Kahit walang ganap. Kahit tambay lang.<br/>Kahit kwentuhan lang. Kahit biglaan.</p><p className="ending-bold">Miss na kita, tsonggi. ♡</p>
        <div className="final-reward">FINAL REWARD <span>✦</span> libre kang tambay dito. HAHAHA.</div>
        {found.length === secrets.length && <div className="all-found">TSONGGI LEVEL: MAXIMUM unlocked ✧</div>}
        <button className="primary-button" onClick={() => { setPage(0); setReason(0); }}>Balik sa kalokohan ↻</button>
      </section>}


      <div className="secret-objects">
        <button className="secret-flower" onClick={() => discover('flower')} aria-label="Secret flower">✿</button>
        <button className="secret-envelope" onClick={() => { setLetterOpen(v => !v); discover('letter'); }} aria-label="Secret envelope">✉</button>
        <button className="secret-house" onClick={() => discover('house')} aria-label="Secret little house">⌂</button>
        <button className="secret-pop" onClick={showPop} aria-label="Secret surprise">· · ·</button>
      </div>
      {letterOpen && <div className="mini-note" onClick={() => setLetterOpen(false)}><button className="mini-close">×</button><span>PSST…</span><p>Wala, gusto ko lang talaga makapag-tambay ulit tayo. Miss na kita, tsonggi. ♡</p><small>tap to close</small></div>}
      {modal && <div className="modal-backdrop" onClick={() => setModal(null)}><div className="secret-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon">{modal.icon || '♡'}</div><p className="eyebrow">A LITTLE SECRET</p><h2>{modal.title}</h2><p className="modal-message">{modal.message}</p><button className="modal-ok" onClick={() => setModal(null)}>Hehe, okay ♡</button></div></div>}
      <footer className="site-footer"><span>tiny website, big tsonggi energy</span><span>made with ♡ and kalokohan</span></footer>
      <nav className="bottom-nav" aria-label="Page navigation"><button onClick={prevPage} disabled={page === 0}>←</button><span>{['HELLO','VERIFY','REASONS','LETTER','INVITE','BYE'][page]} <small>{page + 1}/6</small></span><button onClick={nextPage} disabled={page === 5}>→</button></nav>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
