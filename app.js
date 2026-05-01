/* ============================================
   Melanie Martinez – Hades Tour Countdown
   Main application logic
   ============================================ */

// ---- Event target: August 14, 2026, 8:00 PM Pacific Time ----
// Using a fixed UTC offset for PDT (UTC-7) so it works offline
// and doesn't depend on the Intl API for the target conversion.
const EVENT_UTC = Date.UTC(2026, 7, 15, 3, 0, 0); // Aug 14 8PM PDT = Aug 15 3AM UTC

// ---- DOM references ----
const daysEl    = document.getElementById('days');
const hoursEl   = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const finaleEl  = document.getElementById('finale');
const greetingEl = document.getElementById('greeting');

// ---- Countdown logic ----
function updateCountdown() {
  const now  = Date.now();
  const diff = EVENT_UTC - now;

  if (diff <= 0) {
    // Event has arrived!
    countdownEl.hidden = true;
    finaleEl.hidden = false;
    launchConfetti();
    return; // Stop updating
  }

  const totalSeconds = Math.floor(diff / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  daysEl.textContent    = String(d).padStart(3, '0');
  hoursEl.textContent   = String(h).padStart(2, '0');
  minutesEl.textContent = String(m).padStart(2, '0');
  secondsEl.textContent = String(s).padStart(2, '0');

  requestAnimationFrame(updateCountdown);
}

// Kick off countdown
requestAnimationFrame(updateCountdown);

// ---- Personalized greeting ----
function loadGreeting() {
  const name = localStorage.getItem('melanie_name');
  if (name) {
    greetingEl.textContent = `Hi ${name} 🖤 you're almost there`;
  }
}
loadGreeting();

// Name button toggle
const nameBtn      = document.getElementById('nameBtn');
const nameInputWrap = document.getElementById('nameInputWrap');
const nameInput    = document.getElementById('nameInput');
const nameSave     = document.getElementById('nameSave');

nameBtn.addEventListener('click', () => {
  nameInputWrap.hidden = !nameInputWrap.hidden;
  if (!nameInputWrap.hidden) {
    nameInput.value = localStorage.getItem('melanie_name') || '';
    nameInput.focus();
  }
});

function saveName() {
  const name = nameInput.value.trim();
  if (name) {
    localStorage.setItem('melanie_name', name);
    greetingEl.textContent = `Hi ${name} 🖤 you're almost there`;
  } else {
    localStorage.removeItem('melanie_name');
    greetingEl.textContent = '';
  }
  nameInputWrap.hidden = true;
}

nameSave.addEventListener('click', saveName);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveName();
});

// ---- Share button ----
document.getElementById('shareBtn').addEventListener('click', async () => {
  const shareData = {
    title: 'Countdown to Melanie 💕',
    text: 'Counting down to the Hades Tour – August 14, 2026!',
    url: window.location.href,
  };

  if (navigator.share) {
    try { await navigator.share(shareData); } catch { /* user cancelled */ }
  } else {
    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      const btn = document.getElementById('shareBtn');
      btn.textContent = 'Copied! ✓';
      setTimeout(() => { btn.textContent = 'Share 🔗'; }, 2000);
    } catch {
      alert('Copy this link:\n' + window.location.href);
    }
  }
});

// ---- Confetti animation (fires when countdown hits zero) ----
let confettiLaunched = false;

function launchConfetti() {
  if (confettiLaunched) return;
  confettiLaunched = true;

  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#e8a0bf', '#f5e6d3', '#c97bb6', '#8b6f5e', '#ffffff', '#1a0a1a'];
  const pieces = [];

  // Create confetti pieces
  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 8,
    });
  }

  let frame = 0;
  const maxFrames = 300; // ~5 seconds at 60fps

  function draw() {
    if (frame > maxFrames) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.vy += 0.04; // gravity
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ---- Register service worker ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      // Service worker registration failed – app still works fine
    });
  });
}
