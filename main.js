import { gsap } from 'gsap';

/* ==========================================================================
   1. LIVE COUNTDOWN TIMER
   Target: 27 September 2026, 12:30:00 PM IST
   ========================================================================== */
const targetDate = new Date('2026-09-27T12:30:00+05:30').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (distance < 0) {
    if (daysEl) daysEl.innerText = "00";
    if (hoursEl) hoursEl.innerText = "00";
    if (minsEl) minsEl.innerText = "00";
    if (secsEl) secsEl.innerText = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (daysEl) daysEl.innerText = days < 10 ? `0${days}` : days;
  if (hoursEl) hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
  if (minsEl) minsEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
  if (secsEl) secsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();


/* ==========================================================================
   2. DEVOTIONAL AUDIO PLAYER (JAI JAI GANESHA SONG) & EQUALIZER
   ========================================================================== */
const bgAudioPlayer = document.getElementById('bg-devotional-audio');
const audioToggleBtn = document.getElementById('audio-toggle');
let isAudioPlaying = false;
let userManuallyToggled = false;

function startAudio() {
  if (!bgAudioPlayer || isAudioPlaying || userManuallyToggled) return;
  bgAudioPlayer.play().then(() => {
    isAudioPlaying = true;
    if (audioToggleBtn) {
      audioToggleBtn.classList.add('active-toggle');
      audioToggleBtn.querySelector('.audio-text').innerText = 'MUSIC ON 🎵';
    }
  }).catch(err => {
    console.log("Autoplay waiting for first user interaction:", err);
  });
}

// Attempt immediate playback on load
startAudio();

// Also trigger playback on first user gesture anywhere on the document (click, tap, scroll, touch)
const autoPlayEvents = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
function handleFirstUserInteraction() {
  if (!isAudioPlaying && !userManuallyToggled) {
    startAudio();
  }
  autoPlayEvents.forEach(evt => document.removeEventListener(evt, handleFirstUserInteraction));
}
autoPlayEvents.forEach(evt => document.addEventListener(evt, handleFirstUserInteraction, { once: true }));

if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userManuallyToggled = true;
    if (!isAudioPlaying) {
      if (bgAudioPlayer) {
        bgAudioPlayer.play().then(() => {
          isAudioPlaying = true;
          audioToggleBtn.classList.add('active-toggle');
          audioToggleBtn.querySelector('.audio-text').innerText = 'MUSIC ON 🎵';
        }).catch(err => {
          console.error("Audio playback error:", err);
        });
      }
    } else {
      if (bgAudioPlayer) {
        bgAudioPlayer.pause();
      }
      isAudioPlaying = false;
      audioToggleBtn.classList.remove('active-toggle');
      audioToggleBtn.querySelector('.audio-text').innerText = 'MUSIC OFF';
    }
  });
}


/* ==========================================================================
   3. FALLING MARIGOLD PETALS (CANVAS ANIMATION)
   ========================================================================== */
const canvas = document.getElementById('petals-canvas');
let ctx = canvas ? canvas.getContext('2d') : null;
let petals = [];
let isPetalsActive = true;
let animationFrameId = null;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initPetals();
});
resizeCanvas();

// Rich Devotional Flower Palette (Marigold Orange, Saffron Yellow, Rose Pink, White)
const petalColors = ['#FF5A00', '#FF8C00', '#FFD700', '#FFA500', '#FF1493', '#FFFFFF'];

class Petal {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    const w = canvas ? canvas.width : window.innerWidth;
    const h = canvas ? canvas.height : window.innerHeight;
    this.x = Math.random() * w;
    this.y = initial ? Math.random() * h : -20 - Math.random() * 40;
    this.size = Math.random() * 10 + 7;
    this.speedY = Math.random() * 1.8 + 1.0;
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 3.0;
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.02) + this.speedX;
    this.rotation += this.rotationSpeed;

    const maxH = canvas ? canvas.height : window.innerHeight;
    if (this.y > maxH + 20) {
      this.reset(false);
    }
  }

  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    // Petal Shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-this.size, -this.size, -this.size * 1.1, this.size / 2, 0, this.size * 1.2);
    ctx.bezierCurveTo(this.size * 1.1, this.size / 2, this.size, -this.size, 0, 0);
    ctx.fill();

    // Central vein detail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.size * 0.8);
    ctx.stroke();

    ctx.restore();
  }
}

function initPetals() {
  petals = [];
  const petalCount = window.innerWidth < 768 ? 30 : 60;
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }
}

function animatePetals() {
  if (!ctx || !canvas) return;
  if (!isPetalsActive) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach(petal => {
    petal.update();
    petal.draw();
  });
  animationFrameId = requestAnimationFrame(animatePetals);
}

if (canvas) {
  resizeCanvas();
  initPetals();
  animatePetals();
}

const petalsToggleBtn = document.getElementById('petals-toggle');
if (petalsToggleBtn) {
  petalsToggleBtn.addEventListener('click', () => {
    isPetalsActive = !isPetalsActive;
    if (isPetalsActive) {
      petalsToggleBtn.classList.add('active-toggle');
      petalsToggleBtn.querySelector('.petal-text').innerText = 'PETALS ON';
      if (canvas) canvas.style.display = 'block';
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animatePetals();
    } else {
      petalsToggleBtn.classList.remove('active-toggle');
      petalsToggleBtn.querySelector('.petal-text').innerText = 'PETALS OFF';
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas) canvas.style.display = 'none';
    }
  });
}


/* ==========================================================================
   4. MOBILE FULLSCREEN MENU OVERLAY
   ========================================================================== */
const menuToggleBtn = document.getElementById('menu-toggle');
const menuCloseBtn = document.getElementById('menu-close');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuToggleBtn && mobileOverlay) {
  menuToggleBtn.addEventListener('click', () => {
    mobileOverlay.classList.add('active');
    mobileOverlay.setAttribute('aria-hidden', 'false');
  });
}

if (menuCloseBtn && mobileOverlay) {
  menuCloseBtn.addEventListener('click', () => {
    mobileOverlay.classList.remove('active');
    mobileOverlay.setAttribute('aria-hidden', 'true');
  });
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
      mobileOverlay.setAttribute('aria-hidden', 'true');
    }
  });
});


/* ==========================================================================
   5. COPY UPI NUMBER & TOAST NOTIFICATION
   ========================================================================== */
const copyUpiBtn = document.getElementById('copy-upi-btn');
const toastMsg = document.getElementById('toast-msg');

if (copyUpiBtn) {
  copyUpiBtn.addEventListener('click', () => {
    const upiNumber = '9052422614';
    navigator.clipboard.writeText(upiNumber).then(() => {
      showToast('UPI NUMBER 9052422614 COPIED TO CLIPBOARD!');
    }).catch(() => {
      showToast('UPI NUMBER: 90524 22614');
    });
  });
}

function showToast(message) {
  if (!toastMsg) return;
  toastMsg.innerText = message;
  toastMsg.classList.add('active');
  setTimeout(() => {
    toastMsg.classList.remove('active');
  }, 3000);
}


/* ==========================================================================
   6. DONATION AMOUNT CHIP SELECTION
   ========================================================================== */
const chipBtns = document.querySelectorAll('.chip-btn');
chipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    chipBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


/* ==========================================================================
   7. GALLERY CAROUSEL HORIZONTAL PROGRESS
   ========================================================================== */
const galleryCarousel = document.getElementById('gallery-carousel');
const galleryProgress = document.getElementById('gallery-progress');

if (galleryCarousel && galleryProgress) {
  galleryCarousel.addEventListener('scroll', () => {
    const maxScroll = galleryCarousel.scrollWidth - galleryCarousel.clientWidth;
    if (maxScroll > 0) {
      const scrollPercentage = (galleryCarousel.scrollLeft / maxScroll) * 100;
      galleryProgress.style.width = `${Math.max(10, scrollPercentage)}%`;
    }
  });
}


/* ==========================================================================
   8. GSAP SWISS ANIMATIONS & PARALLAX SCROLL
   ========================================================================== */
gsap.from('.headline-line', {
  duration: 1.2,
  y: 60,
  opacity: 0,
  stagger: 0.15,
  ease: 'power3.out'
});

const parallaxText = document.getElementById('parallax-text');
if (parallaxText) {
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    parallaxText.style.transform = `translateX(${-scrollPos * 0.15}px)`;
  });
}


/* ==========================================================================
   9. INTERACTIVE DEVOTIONAL OFFERINGS (AARTI, FLOWERS, TEMPLE BELL)
   ========================================================================== */
function playTempleBellSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const audioCtx = new AudioCtx();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(1180, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(2360, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 2.2);
    osc2.stop(audioCtx.currentTime + 2.2);
  } catch (err) {
    console.log("Temple bell sound error:", err);
  }
}

const aartiBtn = document.getElementById('aarti-btn');
const diyaGlow = document.getElementById('diya-glow');
const flowerOfferBtn = document.getElementById('flower-offer-btn');
const templeBellBtn = document.getElementById('temple-bell-btn');
const blessingCountEl = document.getElementById('blessing-count');

let isAartiLit = false;
let currentBlessingCount = 848;

if (aartiBtn) {
  aartiBtn.addEventListener('click', () => {
    isAartiLit = !isAartiLit;
    if (isAartiLit) {
      aartiBtn.classList.add('active');
      if (diyaGlow) diyaGlow.classList.add('active');
      showToast('🪔 VIRTUAL AARTI LIT! MAY LORD GANESHA BLESS YOU!');
      playTempleBellSound();
    } else {
      aartiBtn.classList.remove('active');
      if (diyaGlow) diyaGlow.classList.remove('active');
    }
  });
}

if (flowerOfferBtn) {
  flowerOfferBtn.addEventListener('click', () => {
    currentBlessingCount++;
    if (blessingCountEl) blessingCountEl.innerText = currentBlessingCount;
    showToast('🌺 FLOWERS OFFERED: ॥ ॐ गं गणपतये नमः ॥');
    initPetals();
    if (!isPetalsActive) {
      const petalsToggle = document.getElementById('petals-toggle');
      if (petalsToggle) petalsToggle.click();
    }
  });
}

if (templeBellBtn) {
  templeBellBtn.addEventListener('click', () => {
    playTempleBellSound();
    templeBellBtn.classList.add('active');
    setTimeout(() => templeBellBtn.classList.remove('active'), 600);
    showToast('🔔 TEMPLE BELL RANG! ॥ శ్రీ వరసిద్ధి వినాయక స్వామి ॥');
  });
}

/* Perform Pooja Handler */
const poojaBtn = document.getElementById('pooja-btn');
const pujaModal = document.getElementById('puja-modal');
const closePujaModalBtn = document.getElementById('close-puja-modal');
const modalHundiBtn = document.getElementById('modal-hundi-btn');

if (poojaBtn) {
  poojaBtn.addEventListener('click', () => {
    // 1. Play Ganapathi devotional audio track from public folder
    if (bgAudioPlayer) {
      bgAudioPlayer.currentTime = 0;
      bgAudioPlayer.play().then(() => {
        isAudioPlaying = true;
        if (audioToggleBtn) {
          audioToggleBtn.classList.add('active-toggle');
          audioToggleBtn.querySelector('.audio-text').innerText = 'MUSIC ON 🎵';
        }
      }).catch(err => console.log("Audio play error:", err));
    }

    // 2. Light Aarti aura & Ring temple bell chime
    if (diyaGlow) diyaGlow.classList.add('active');
    playTempleBellSound();

    // 3. Trigger flower shower & Increment blessing count
    initPetals();
    if (!isPetalsActive) {
      const petalsToggle = document.getElementById('petals-toggle');
      if (petalsToggle) petalsToggle.click();
    }
    currentBlessingCount++;
    if (blessingCountEl) blessingCountEl.innerText = currentBlessingCount;

    // 4. Show Devotional Maha Pooja Modal Popup with Hundi Seva suggestion
    if (pujaModal) {
      pujaModal.classList.add('active');
      pujaModal.setAttribute('aria-hidden', 'false');
    }
  });
}

if (closePujaModalBtn && pujaModal) {
  closePujaModalBtn.addEventListener('click', () => {
    pujaModal.classList.remove('active');
    pujaModal.setAttribute('aria-hidden', 'true');
  });
}

if (modalHundiBtn && pujaModal) {
  modalHundiBtn.addEventListener('click', () => {
    pujaModal.classList.remove('active');
    pujaModal.setAttribute('aria-hidden', 'true');
  });
}

const openUpiBtn = document.getElementById('open-upi-btn');
const upiBox = document.getElementById('upi-box');
if (openUpiBtn && upiBox) {
  openUpiBtn.addEventListener('click', () => {
    upiBox.scrollIntoView({ behavior: 'smooth' });
  });
}
