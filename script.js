/* ===== The Night Hope Found Sapphire — script ===== */

/* ---- Editable opening lines: [text, delay in ms] ---- */
const OPENING = [
  ["Some journeys begin with a destination.", 2500],
  ["Ours began with a coincidence.", 3500],
  ["15 September 2025.", 3000],
  ["A night train.<br>Kerala → Bangalore", 3000],
];
const box = document.getElementById('introLines');
let t = 1200;
OPENING.forEach(([txt, wait]) => {
  const p = document.createElement('p'); p.innerHTML = txt; box.appendChild(p);
  setTimeout(() => p.classList.add('show'), t); t += wait;
});
setTimeout(() => document.getElementById('begin').classList.add('show'), t);

/* ---- Music ---- */
const audio = document.getElementById('audio'), musicBtn = document.getElementById('music');
function setMusic(on){
  if(on) audio.play().then(() => musicBtn.textContent = '♪ music on').catch(() => {});
  else { audio.pause(); musicBtn.textContent = '♪ music off'; }
}
musicBtn.onclick = () => setMusic(audio.paused);
document.getElementById('begin').onclick = () => {
  setMusic(true);
  document.querySelectorAll('.scene')[1].scrollIntoView({behavior:'smooth'});
};

/* ---- Scroll reveals ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), {threshold:.25});
document.querySelectorAll('.r').forEach((el, i) => { el.style.transitionDelay = (i % 3) * .2 + 's'; io.observe(el); });

/* ---- Sky colour follows the journey: sunset → dusk → night → dawn → sapphire ---- */
const STOPS = [ // [progress, top, bottom]
  [0,   '#3b2a6b', '#f09a5a'],   // sunset
  [.18, '#2a2560', '#b3606f'],   // dusk
  [.38, '#0F1E4A', '#1a2456'],   // night
  [.58, '#060B22', '#0F1E4A'],   // deep night (1 AM)
  [.72, '#2f3470', '#f2a672'],   // dawn
  [.84, '#0F1E4A', '#1c2c68'],   // sapphire
  [1,   '#060B22', '#0F1E4A'],
];
const hex = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16));
const mix = (a, b, k) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k).toString(16).padStart(2, '0')).join('');
const mini = document.getElementById('mini'), root = document.documentElement;
function onScroll(){
  const max = document.body.scrollHeight - innerHeight, p = max > 0 ? Math.min(1, scrollY / max) : 0;
  let i = STOPS.findIndex((s, n) => p <= STOPS[n+1]?.[0]); if(i < 0) i = STOPS.length - 2;
  const [p0, t0, b0] = STOPS[i], [p1, t1, b1] = STOPS[i+1], k = (p - p0) / (p1 - p0);
  root.style.setProperty('--top', mix(t0, t1, k)); root.style.setProperty('--bot', mix(b0, b1, k));
  mini.style.left = `calc(${p * 100}% - ${p * 84}px)`;         // little train travels the rail
  starsAlpha = Math.min(1, Math.max(.15, (p - .15) * 2.5));    // stars fade in as night falls
}
let starsAlpha = .15;
addEventListener('scroll', onScroll, {passive:true}); onScroll();

/* ---- Canvas: twinkling stars + floating dust ---- */
const cv = document.getElementById('sky'), ctx = cv.getContext('2d');
let W, H, stars = [], dust = [];
function resize(){
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  stars = Array.from({length:110}, () => ({x:Math.random()*W, y:Math.random()*H*.75, r:Math.random()*1.3+.2, p:Math.random()*6}));
  dust  = Array.from({length:35},  () => ({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.8+.6, v:Math.random()*.25+.05}));
}
addEventListener('resize', resize); resize();
(function draw(ts){
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => { ctx.globalAlpha = starsAlpha * (.4 + .5*Math.sin(ts/1000 + s.p)); ctx.fillStyle = '#F7F5EF'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); });
  dust.forEach(d => {
    d.y -= d.v; d.x += Math.sin(ts/2500 + d.y/80) * .15;
    if(d.y < -5){ d.y = H + 5; d.x = Math.random() * W; }
    ctx.globalAlpha = .2; ctx.fillStyle = '#E9BE72'; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
  });
  requestAnimationFrame(draw);
})(0);

/* ---- Secret ending (double-click to close) ---- */
const secret = document.getElementById('secret');
document.getElementById('heart').onclick = () => { secret.classList.add('open'); secret.setAttribute('aria-hidden', 'false'); };
secret.ondblclick = () => secret.classList.remove('open');
