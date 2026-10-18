/**
 * Happy Birthday Ananya! 💕
 * Interactive 3D Friends & Pink Theme Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. PROCEDURAL 3D CELESTIAL CANVAS (Stars, Volumetric Clouds & Meteors)
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let celestialStars = [];
  let driftingClouds = [];
  let shootingStars = [];
  let goldenStardust = [];
  let extraSparkles = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => {
    resizeCanvas();
    initCelestialScene();
  });
  resizeCanvas();

  // Multi-Depth Twinkling Celestial Star
  class CelestialStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseSize = Math.random() * 2.5 + 0.8;
      this.isDiamond = Math.random() < 0.22; // 22% are glowing diamond stars
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.015;
      
      const colors = ['#ffffff', '#fff3b0', '#ffd56b', '#d8b9e8', '#c0d4ff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.depth = Math.random() * 0.7 + 0.3; // depth parallax
    }
    update() {
      this.twinklePhase += this.twinkleSpeed;
    }
    draw() {
      const alpha = 0.35 + 0.65 * (Math.sin(this.twinklePhase) * 0.5 + 0.5);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = alpha;

      if (this.isDiamond) {
        const sz = this.baseSize * 1.8;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        // 4-pointed diamond starlight flare
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          ctx.lineTo(Math.cos(angle) * sz, Math.sin(angle) * sz);
          ctx.lineTo(Math.cos(angle + Math.PI / 4) * (sz * 0.22), Math.sin(angle + Math.PI / 4) * (sz * 0.22));
        }
        ctx.closePath();
        ctx.fill();

        // Core bright center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, sz * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Pinpoint realistic star with soft halo
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, this.baseSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Volumetric Moonlit Cloud Puffs (Drifting Softly across sky)
  class CelestialCloudPuff {
    constructor() {
      this.x = Math.random() * (canvas.width + 400) - 200;
      this.y = Math.random() * (canvas.height * 0.85);
      this.radiusX = Math.random() * 220 + 160;
      this.radiusY = Math.random() * 120 + 80;
      this.speedX = Math.random() * 0.18 + 0.08;
      this.phase = Math.random() * Math.PI * 2;
      this.colorType = Math.random() > 0.5 ? 'lavender' : 'periwinkle';
    }
    update() {
      this.x += this.speedX;
      this.phase += 0.005;
      if (this.x - this.radiusX > canvas.width) {
        this.x = -this.radiusX;
        this.y = Math.random() * (canvas.height * 0.85);
      }
    }
    draw() {
      ctx.save();
      const currentY = this.y + Math.sin(this.phase) * 15;
      const grad = ctx.createRadialGradient(
        this.x, currentY, 10,
        this.x, currentY, this.radiusX
      );

      if (this.colorType === 'lavender') {
        grad.addColorStop(0, 'rgba(217, 184, 230, 0.16)');
        grad.addColorStop(0.45, 'rgba(191, 163, 232, 0.10)');
        grad.addColorStop(1, 'rgba(49, 37, 90, 0)');
      } else {
        grad.addColorStop(0, 'rgba(157, 175, 246, 0.14)');
        grad.addColorStop(0.5, 'rgba(120, 140, 220, 0.08)');
        grad.addColorStop(1, 'rgba(16, 20, 56, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.x, currentY, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Realistic Shooting Star / Meteor
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      this.y = Math.random() * (canvas.height * 0.4);
      this.length = Math.random() * 120 + 80;
      this.speed = Math.random() * 10 + 12;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25; // around 45 degrees
      this.opacity = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.active = false;
    }
    trigger() {
      this.active = true;
      this.opacity = 1;
    }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= this.decay;
      if (this.opacity <= 0 || this.x > canvas.width + 100 || this.y > canvas.height + 100) {
        this.active = false;
        this.reset();
      }
    }
    draw() {
      if (!this.active || this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, 'rgba(255, 213, 107, 0)');
      grad.addColorStop(0.7, 'rgba(217, 184, 230, 0.6)');
      grad.addColorStop(1, '#ffffff');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ffd56b';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Meteor head flare
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Interactive Golden Stardust Trail (Trailing user mouse/touch)
  class GoldenStardust {
    constructor(x, y, vx = null, vy = null, color = null) {
      this.x = x;
      this.y = y;
      this.vx = vx !== null ? vx : (Math.random() - 0.5) * 1.6;
      this.vy = vy !== null ? vy : Math.random() * 1.4 + 0.4;
      this.size = Math.random() * 5 + 2.5;
      this.alpha = 1;
      this.decay = Math.random() * 0.025 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      const colors = ['#fff2a3', '#ffd56b', '#ffe894', '#ffffff', '#d8b9e8'];
      this.color = color || colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      this.size *= 0.965;
      this.rotation += 0.06;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;

      // 4-pointed shimmering stardust diamond
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
        ctx.lineTo(Math.cos(angle + Math.PI / 4) * (this.size * 0.28), Math.sin(angle + Math.PI / 4) * (this.size * 0.28));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnStardustAt(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      goldenStardust.push(new GoldenStardust(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10));
    }
    if (goldenStardust.length > 280) {
      goldenStardust.splice(0, goldenStardust.length - 280);
    }
  }

  window.addEventListener('mousemove', (e) => {
    spawnStardustAt(e.clientX, e.clientY, 2);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      spawnStardustAt(e.touches[0].clientX, e.touches[0].clientY, 2);
    }
  }, { passive: true });

  // Celestial Stardust Burst on Click
  window.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 / 20) * i;
      const speed = Math.random() * 3.5 + 1.8;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      goldenStardust.push(new GoldenStardust(e.clientX, e.clientY, vx, vy));
    }
  });

  function initCelestialScene() {
    celestialStars = [];
    driftingClouds = [];
    shootingStars = [];

    const starCount = extraSparkles ? 180 : 110;
    for (let i = 0; i < starCount; i++) {
      celestialStars.push(new CelestialStar());
    }
    for (let i = 0; i < 6; i++) {
      driftingClouds.push(new CelestialCloudPuff());
    }
    for (let i = 0; i < 4; i++) {
      shootingStars.push(new ShootingStar());
    }
  }
  initCelestialScene();

  // Periodic Shooting Star trigger
  setInterval(() => {
    const inactive = shootingStars.filter(s => !s.active);
    if (inactive.length > 0) {
      inactive[Math.floor(Math.random() * inactive.length)].trigger();
    }
  }, 4500);

  function animateCelestialScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Drifting Moonlit Clouds (Ambient Atmosphere)
    driftingClouds.forEach(cloud => {
      cloud.update();
      cloud.draw();
    });

    // 2. Multi-depth Twinkling Stars
    celestialStars.forEach(star => {
      star.update();
      star.draw();
    });

    // 3. Shooting Stars / Meteors
    shootingStars.forEach(meteor => {
      meteor.update();
      meteor.draw();
    });

    // 4. Golden Stardust Cursor Trail
    for (let i = goldenStardust.length - 1; i >= 0; i--) {
      const dust = goldenStardust[i];
      dust.update();
      dust.draw();
      if (dust.alpha <= 0 || dust.size <= 0.4) {
        goldenStardust.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCelestialScene);
  }
  animateCelestialScene();

  // Sparkle / Moonlit Mode Toggle
  const sparkleBtn = document.getElementById('sparkle-mode-btn');
  if (sparkleBtn) {
    sparkleBtn.addEventListener('click', () => {
      extraSparkles = !extraSparkles;
      initCelestialScene();
      sparkleBtn.style.background = extraSparkles ? 'var(--gold-metallic-gradient)' : 'rgba(18, 22, 58, 0.82)';
      sparkleBtn.style.color = extraSparkles ? '#2b1800' : 'inherit';
      playMagicalChime();
    });
  }

  // =========================================================================
  // 1B. 3D INTERACTIVE MOUSE PARALLAX TILT FOR HERO CELESTIAL MOON MODEL
  // =========================================================================
  const heroSection = document.getElementById('intro-section');
  const moonWrapper = document.getElementById('barbie-wrapper');
  const moonCard = document.getElementById('barbie-card');
  const cloudBack = document.querySelector('.cloud-layer-back');
  const cloudFront = document.querySelector('.cloud-layer-front');

  if (heroSection && moonWrapper) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const rotateY = (x / (rect.width / 2)) * 14;
      const rotateX = -(y / (rect.height / 2)) * 14;

      if (moonCard) {
        moonCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      }
      if (cloudBack) {
        cloudBack.style.transform = `translate(${x * -0.04}px, ${y * -0.04}px) scale(1.03)`;
      }
      if (cloudFront) {
        cloudFront.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.05)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (moonCard) {
        moonCard.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
      if (cloudBack) cloudBack.style.transform = `translate(0px, 0px) scale(1)`;
      if (cloudFront) cloudFront.style.transform = `translate(0px, 0px) scale(1)`;
    });
  }

  // =========================================================================
  // 2. WEB AUDIO SYNTHESIZER (Birthday Music Box Melody)
  // =========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimeouts = [];

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration = 0.4, type = 'sine', gainVal = 0.2) {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Sweet bell-like envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone play issue:', e);
    }
  }

  // Chime chord on special achievements
  function playMagicalChime() {
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 0.8, 'triangle', 0.15);
      }, idx * 100);
    });
  }

  // Happy Birthday Notes (in Hz)
  const birthdayMelody = [
    { note: 261.63, dur: 0.35 }, // C4
    { note: 261.63, dur: 0.25 }, // C4
    { note: 293.66, dur: 0.6 },  // D4
    { note: 261.63, dur: 0.6 },  // C4
    { note: 349.23, dur: 0.6 },  // F4
    { note: 329.63, dur: 1.0 },  // E4

    { note: 261.63, dur: 0.35 }, // C4
    { note: 261.63, dur: 0.25 }, // C4
    { note: 293.66, dur: 0.6 },  // D4
    { note: 261.63, dur: 0.6 },  // C4
    { note: 392.00, dur: 0.6 },  // G4
    { note: 349.23, dur: 1.0 },  // F4

    { note: 261.63, dur: 0.35 }, // C4
    { note: 261.63, dur: 0.25 }, // C4
    { note: 523.25, dur: 0.6 },  // C5
    { note: 440.00, dur: 0.6 },  // A4
    { note: 349.23, dur: 0.6 },  // F4
    { note: 329.63, dur: 0.6 },  // E4
    { note: 293.66, dur: 1.0 },  // D4

    { note: 466.16, dur: 0.35 }, // Bb4
    { note: 466.16, dur: 0.25 }, // Bb4
    { note: 440.00, dur: 0.6 },  // A4
    { note: 349.23, dur: 0.6 },  // F4
    { note: 392.00, dur: 0.6 },  // G4
    { note: 349.23, dur: 1.2 }   // F4
  ];

  function playBirthdaySongLoop() {
    if (!isPlayingMusic) return;
    let accumulatedTime = 0;

    birthdayMelody.forEach(({ note, dur }) => {
      const t = setTimeout(() => {
        if (isPlayingMusic) {
          playTone(note, dur, 'triangle', 0.22);
          playTone(note * 2, dur * 0.8, 'sine', 0.08); // Sweet octave overtone
        }
      }, accumulatedTime * 1000);
      melodyTimeouts.push(t);
      accumulatedTime += dur * 0.95;
    });

    const loopTimeout = setTimeout(() => {
      if (isPlayingMusic) {
        playBirthdaySongLoop();
      }
    }, (accumulatedTime + 1.5) * 1000);
    melodyTimeouts.push(loopTimeout);
  }

  function stopMusic() {
    isPlayingMusic = false;
    melodyTimeouts.forEach(t => clearTimeout(t));
    melodyTimeouts = [];
    document.getElementById('eq-waves').classList.add('paused');
  }

  function startMusic() {
    stopMusic();
    isPlayingMusic = true;
    document.getElementById('eq-waves').classList.remove('paused');
    playBirthdaySongLoop();
  }

  const musicBtn = document.getElementById('music-btn');
  musicBtn.addEventListener('click', () => {
    if (isPlayingMusic) {
      stopMusic();
      musicBtn.classList.remove('active');
    } else {
      startMusic();
      musicBtn.classList.add('active');
    }
  });

  // =========================================================================
  // 3. BARBIE INTERACTION (Sparkle Chime Only - Voice Removed)
  // =========================================================================
  const barbieCard = document.getElementById('barbie-card');
  if (barbieCard) {
    barbieCard.addEventListener('click', () => {
      playMagicalChime();
    });
  }

  // =========================================================================
  // 4. PASSWORD GATE (23/09/2006)
  // =========================================================================
  const passwordInput = document.getElementById('password-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const pwdFeedback = document.getElementById('pwd-feedback');
  const celebrationArea = document.getElementById('celebration-area');

  // Auto-format DD/MM/YYYY
  passwordInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2 && val.length <= 4) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    } else if (val.length > 4) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4, 8);
    }
    e.target.value = val;
  });

  function validatePassword() {
    const rawVal = passwordInput.value.trim();
    // Sanitize
    const cleaned = rawVal.replace(/[-.\s]/g, '/');

    // Valid formats: 23/09/2006 or 23092006
    if (cleaned === '23/09/2006' || cleaned === '23/9/2006' || rawVal === '23092006') {
      pwdFeedback.className = 'pwd-feedback success';
      pwdFeedback.textContent = '✨ Correct! Welcome to your surprise, Ani! 💕';

      playMagicalChime();
      startMusic();

      // Trigger Confetti
      launchConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);

      // Unlock celebration section
      setTimeout(() => {
        celebrationArea.classList.remove('locked-content');
        celebrationArea.classList.add('unlocked-content');
        
        // Smooth scroll to celebration
        celebrationArea.scrollIntoView({ behavior: 'smooth' });
      }, 700);

    } else {
      pwdFeedback.className = 'pwd-feedback error';
      pwdFeedback.textContent = 'Oops! Try Ani\'s birthday date: 23/09/2006 💕';
      playTone(220, 0.25, 'sawtooth', 0.1);
    }
  }

  unlockBtn.addEventListener('click', validatePassword);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validatePassword();
    }
  });

  // =========================================================================
  // 5. 3D TILT EFFECT & DYNAMIC PHOTO GALLERY WITH DESIGNER FRAMES
  // =========================================================================
  
  function spawnFloatingHeart(btn) {
    const rect = btn.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'floating-like-heart';
    const emojis = ['💖', '💕', '✨', '🌸', '👑', '💛'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top}px`;
    heart.style.position = 'fixed';
    heart.style.setProperty('--rx', `${(Math.random() - 0.5) * 60}px`);
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  function initCardInteractions(card) {
    // 3D Tilt
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      const inner = card.querySelector('.card-inner');
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.card-inner');
      if (inner) {
        inner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
    });

    // Touch support for mobile devices
    card.addEventListener('touchstart', () => {
      const bar = card.querySelector('.frame-action-bar');
      if (bar) bar.classList.add('touch-active');
    }, { passive: true });

    // Lightbox click on card (ignore clicks on action bar, buttons, or file input)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.frame-action-bar') || e.target.closest('input') || e.target.closest('label') || e.target.closest('button')) {
        return;
      }
      const img = card.querySelector('.polaroid-img');
      const badge = card.querySelector('.frame-top-badge');
      const title = badge ? badge.textContent.trim() : 'Cherished Memory of Ani 💕';
      if (img) {
        openLightbox(img.src, title);
      }
    });

    // Zoom Button in Action Bar
    const zoomBtn = card.querySelector('.zoom-frame-btn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const img = card.querySelector('.polaroid-img');
        const badge = card.querySelector('.frame-top-badge');
        const title = badge ? badge.textContent.trim() : 'Cherished Memory of Ani 💕';
        if (img) {
          openLightbox(img.src, title);
        }
      });
    }

    // Heart / Like Button
    const heartBtn = card.querySelector('.heart-frame-btn');
    if (heartBtn) {
      heartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const countSpan = heartBtn.querySelector('.like-count');
        if (countSpan) {
          let count = parseInt(countSpan.textContent, 10) || 0;
          countSpan.textContent = count + 1;
        }
        heartBtn.classList.remove('liked');
        void heartBtn.offsetWidth;
        heartBtn.classList.add('liked');

        // Spawn multiple floating hearts
        for (let i = 0; i < 4; i++) {
          setTimeout(() => spawnFloatingHeart(heartBtn), i * 100);
        }
        playTone(784, 0.18, 'sine', 0.12); // G5 cheerful pop
      });
    }
  }

  // Initialize all existing cards
  document.querySelectorAll('.polaroid-3d-card').forEach(initCardInteractions);

  // Lightbox Modal Handling
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
  }

  lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  // =========================================================================
  // 6. POP-UP WAX SEAL ENVELOPE LETTER & PERSONALIZE NOTE MODAL
  // =========================================================================
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const editLetterBtn = document.getElementById('edit-letter-btn');
  const openNoteModalBtnGallery = document.getElementById('open-note-modal-btn-gallery');
  const displayLetterHeading = document.getElementById('display-letter-heading');
  const letterBodyContent = document.getElementById('letter-body-content');
  const displayLetterSign = document.getElementById('display-letter-sign');

  const noteModal = document.getElementById('note-modal');
  const closeNoteModalBtn = document.getElementById('close-note-modal-btn');
  const personalizeNoteForm = document.getElementById('personalize-note-form');
  const noteRecipientInput = document.getElementById('note-recipient-input');
  const noteMessageInput = document.getElementById('note-message-input');
  const noteSignoffInput = document.getElementById('note-signoff-input');
  const resetNoteBtn = document.getElementById('reset-note-btn');

  const defaultBirthdayNote = {
    recipient: "Happy Birthday Ananya! 💕🎉",
    message: "The first impression when I saw u was... mothamm POSH BATCH! Asalu Telugu raadhu anukunna! 😭💅 (Full sophisticated vibes, dialogue delivery zero Telugu anukoni bayapadda haha!)\n\nFirst time I talked with u in that club room... ala rapport build aindi! It was such a good vibe, and frequency motham instant ga set aindi! ☕✨ From awkward hellos to non-stop kaburlu!\n\nAnd plzzzz inkosare CJP protest ki maatram velaku ra babu! 💀🚩 Kaavalante BJP protest ki veluuuu hehehe! 😭😂 (Chaalu maaku ee revolution stunts!)\n\nOn a real note though... u have a damn good fashion sense! Maintain chesaiiiiii dani boiiiiiiiiiii! 👗🔥 Never stop slaying, keep glowing, and have the most fabulous birthday!",
    signoff: "Forever your bestie & partner-in-crime,\n\"Could you BE any more iconic?!\" 🌸💖"
  };

  function renderLetter(note) {
    if (displayLetterHeading) {
      displayLetterHeading.textContent = note.recipient || defaultBirthdayNote.recipient;
    }
    if (letterBodyContent) {
      letterBodyContent.innerHTML = '';
      const paragraphs = (note.message || defaultBirthdayNote.message).split(/\n\s*\n|\n/);
      paragraphs.forEach((pText) => {
        const trimmed = pText.trim();
        if (trimmed) {
          const p = document.createElement('p');
          p.textContent = trimmed;
          letterBodyContent.appendChild(p);
        }
      });
    }
    if (displayLetterSign) {
      const signLines = (note.signoff || defaultBirthdayNote.signoff).split('\n');
      if (signLines.length > 1) {
        displayLetterSign.innerHTML = `${signLines[0]}<br><span>${signLines.slice(1).join(' ')}</span>`;
      } else {
        displayLetterSign.innerHTML = `<span>${note.signoff}</span>`;
      }
    }
  }

  function getStoredNote() {
    try {
      const saved = localStorage.getItem('ananya_personalized_note_v2');
      if (saved) return JSON.parse(saved);
      // Clean up legacy default note
      localStorage.removeItem('ananya_personalized_note');
    } catch (e) {
      console.warn("Could not read stored note", e);
    }
    return defaultBirthdayNote;
  }

  // Initial render
  renderLetter(getStoredNote());

  function openEnvelope() {
    if (!envelope.classList.contains('open')) {
      envelope.classList.add('open');
      playTone(440, 0.4, 'triangle', 0.12);
      playMagicalChime();
    }
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      envelope.classList.remove('open');
    });
  }

  function openNoteModal() {
    const note = getStoredNote();
    if (noteRecipientInput) noteRecipientInput.value = note.recipient || defaultBirthdayNote.recipient;
    if (noteMessageInput) noteMessageInput.value = note.message || defaultBirthdayNote.message;
    if (noteSignoffInput) noteSignoffInput.value = note.signoff || defaultBirthdayNote.signoff;
    if (noteModal) noteModal.classList.add('active');
    playTone(523.25, 0.2, 'sine', 0.12);
  }

  function closeNoteModal() {
    if (noteModal) noteModal.classList.remove('active');
  }

  if (editLetterBtn) {
    editLetterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openNoteModal();
    });
  }

  if (openNoteModalBtnGallery) {
    openNoteModalBtnGallery.addEventListener('click', (e) => {
      e.preventDefault();
      openNoteModal();
    });
  }

  if (closeNoteModalBtn) {
    closeNoteModalBtn.addEventListener('click', closeNoteModal);
  }

  if (noteModal) {
    noteModal.addEventListener('click', (e) => {
      if (e.target === noteModal) closeNoteModal();
    });
  }

  if (resetNoteBtn) {
    resetNoteBtn.addEventListener('click', () => {
      if (noteRecipientInput) noteRecipientInput.value = defaultBirthdayNote.recipient;
      if (noteMessageInput) noteMessageInput.value = defaultBirthdayNote.message;
      if (noteSignoffInput) noteSignoffInput.value = defaultBirthdayNote.signoff;
      playTone(392, 0.2, 'sine', 0.1);
    });
  }

  if (personalizeNoteForm) {
    personalizeNoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedNote = {
        recipient: noteRecipientInput.value.trim() || defaultBirthdayNote.recipient,
        message: noteMessageInput.value.trim() || defaultBirthdayNote.message,
        signoff: noteSignoffInput.value.trim() || defaultBirthdayNote.signoff
      };

      try {
        localStorage.setItem('ananya_personalized_note_v2', JSON.stringify(updatedNote));
      } catch (err) {
        console.warn("Storage save failed", err);
      }

      renderLetter(updatedNote);
      closeNoteModal();
      playTone(659.25, 0.2, 'triangle', 0.15);
      setTimeout(() => playTone(880, 0.35, 'sine', 0.15), 120);

      // Scroll smoothly to letter & open envelope so user sees their personalized note!
      const letterSec = document.getElementById('letter-section');
      if (letterSec) {
        letterSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => openEnvelope(), 600);
      }
    });
  }

  // =========================================================================
  // 7. 3D CAKE & BLOW THE CANDLE (Mic & Button Detection)
  // =========================================================================
  const flames = document.querySelectorAll('.flame');
  const smokeLayer = document.getElementById('smoke-layer');
  const cakeGlowBackdrop = document.querySelector('.cake-glow-backdrop');
  const cakeStatus = document.getElementById('cake-status');
  const blowBtn = document.getElementById('blow-btn');
  const micBlowBtn = document.getElementById('mic-blow-btn');
  const relightBtn = document.getElementById('relight-btn');
  const micStatusText = document.getElementById('mic-status-text');
  const celebrationModal = document.getElementById('celebration-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cakeCountdownOverlay = document.getElementById('cake-countdown-overlay');
  const countdownNum = document.getElementById('countdown-num');
  const countdownTagline = document.getElementById('countdown-tagline');

  let candlesBlown = false;
  let isCountingDown = false;
  let countdownTimer = null;
  let micStream = null;
  let micAudioContext = null;

  function startCandleCountdown() {
    if (isCountingDown || candlesBlown) return;
    isCountingDown = true;
    blowBtn.disabled = true;
    micBlowBtn.disabled = true;
    stopMicListening();

    cakeCountdownOverlay.classList.add('active');

    const steps = [
      { num: '3', text: 'Close your eyes & make a wish! 💖', freq: 440 },
      { num: '2', text: 'Take a deep breath... 🌬️', freq: 523.25 },
      { num: '1', text: 'Get ready to blow! ✨', freq: 659.25 },
      { num: '🎂', text: 'BLOW! 🥳✨', freq: 880 }
    ];

    let currentStep = 0;

    function nextStep() {
      if (currentStep < steps.length) {
        const item = steps[currentStep];
        countdownNum.textContent = item.num;
        countdownTagline.textContent = item.text;

        // Re-trigger animation
        countdownNum.style.animation = 'none';
        void countdownNum.offsetWidth; // trigger reflow
        countdownNum.style.animation = 'numPop 0.8s ease-out';

        playTone(item.freq, 0.35, 'triangle', 0.25);
        currentStep++;

        if (currentStep < steps.length) {
          countdownTimer = setTimeout(nextStep, 1000);
        } else {
          // Final blow moment
          setTimeout(() => {
            extinguishCandles();
            setTimeout(() => {
              cakeCountdownOverlay.classList.remove('active');
              isCountingDown = false;
              blowBtn.disabled = false;
              micBlowBtn.disabled = false;
            }, 600);
          }, 700);
        }
      }
    }

    nextStep();
  }

  function extinguishCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    // Extinguish flames
    flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add('extinguished');
      }, index * 80);
    });

    if (cakeGlowBackdrop) {
      cakeGlowBackdrop.classList.add('extinguished');
    }

    // Spawn realistic smoke particles
    createSmokePuff();

    // Update Status
    cakeStatus.classList.add('blown');
    cakeStatus.innerHTML = '✨ Happy Birthday Ani! Your Wish Has Been Made! 💖';

    // Show relight option
    blowBtn.style.display = 'none';
    micBlowBtn.style.display = 'none';
    relightBtn.style.display = 'inline-flex';

    if (micStatusText) micStatusText.textContent = '';
    stopMicListening();

    // Sound of puff
    playTone(160, 0.5, 'triangle', 0.2);

    // Blast celebration confetti & modal
    setTimeout(() => {
      playMagicalChime();
      startMusic();
      launchMassiveCelebration();
      celebrationModal.classList.add('show');
    }, 600);
  }

  function relightCandles() {
    candlesBlown = false;
    isCountingDown = false;
    clearTimeout(countdownTimer);
    if (cakeCountdownOverlay) cakeCountdownOverlay.classList.remove('active');
    flames.forEach(flame => flame.classList.remove('extinguished'));
    if (cakeGlowBackdrop) cakeGlowBackdrop.classList.remove('extinguished');
    cakeStatus.classList.remove('blown');
    cakeStatus.innerHTML = '🔥 The Candles Are Burning Bright!';

    blowBtn.disabled = false;
    micBlowBtn.disabled = false;
    blowBtn.style.display = 'inline-flex';
    micBlowBtn.style.display = 'inline-flex';
    relightBtn.style.display = 'none';
    playTone(659.25, 0.3, 'sine', 0.1);
  }

  function createSmokePuff() {
    smokeLayer.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'smoke-particle';
      p.style.left = `${Math.random() * 80 + 10}%`;
      p.style.animationDelay = `${Math.random() * 0.4}s`;
      p.style.width = `${Math.random() * 12 + 8}px`;
      p.style.height = p.style.width;
      smokeLayer.appendChild(p);
    }
  }

  blowBtn.addEventListener('click', () => {
    if (!isCountingDown && !candlesBlown) {
      startCandleCountdown();
    }
  });
  relightBtn.addEventListener('click', relightCandles);
  closeModalBtn.addEventListener('click', () => {
    celebrationModal.classList.remove('show');
  });

  // Microphone Blow Detection
  async function startMicListening() {
    if (candlesBlown) return;

    try {
      micBlowBtn.classList.add('listening');
      micStatusText.textContent = 'Listening... Blow gently into your microphone!';

      micAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const micSource = micAudioContext.createMediaStreamSource(micStream);
      const analyser = micAudioContext.createAnalyser();
      analyser.fftSize = 256;
      micSource.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        if (candlesBlown) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // Visual flickering based on mic sound
        if (average > 15) {
          flames.forEach(flame => {
            flame.style.transform = `scale(${1 - average / 140}) rotate(${Math.random() * 8 - 4}deg)`;
          });
        }

        // Blow threshold
        if (average > 42) {
          extinguishCandles();
        } else {
          requestAnimationFrame(detectBlow);
        }
      }

      detectBlow();
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      micStatusText.textContent = 'Mic access not granted. Use the "Make a Wish & Blow" button!';
      micBlowBtn.classList.remove('listening');
    }
  }

  function stopMicListening() {
    micBlowBtn.classList.remove('listening');
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }
    if (micAudioContext) {
      micAudioContext.close();
      micAudioContext = null;
    }
  }

  micBlowBtn.addEventListener('click', startMicListening);

  // =========================================================================
  // 8. 3D CONFETTI & CELEBRATION CANNON ENGINE
  // =========================================================================
  function launchConfettiBurst(x, y) {
    for (let i = 0; i < 60; i++) {
      createConfettiPiece(x, y);
    }
  }

  function launchMassiveCelebration() {
    const bursts = [
      { x: window.innerWidth * 0.2, y: window.innerHeight * 0.4 },
      { x: window.innerWidth * 0.5, y: window.innerHeight * 0.3 },
      { x: window.innerWidth * 0.8, y: window.innerHeight * 0.4 },
    ];

    bursts.forEach((pos, idx) => {
      setTimeout(() => {
        launchConfettiBurst(pos.x, pos.y);
      }, idx * 250);
    });
  }

  function createConfettiPiece(originX, originY) {
    const el = document.createElement('div');
    const colors = ['#ff477e', '#ff758c', '#ffd166', '#ea2b48', '#0088cc', '#f5b300', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isCircle = Math.random() > 0.5;

    el.style.position = 'fixed';
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.width = `${Math.random() * 10 + 6}px`;
    el.style.height = `${Math.random() * 14 + 6}px`;
    el.style.backgroundColor = color;
    el.style.borderRadius = isCircle ? '50%' : '2px';
    el.style.zIndex = '999';
    el.style.pointerEvents = 'none';

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 18 + 8;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 6;
    let rotX = Math.random() * 360;
    let rotY = Math.random() * 360;
    let opacity = 1;

    let posX = originX;
    let posY = originY;

    function step() {
      posX += vx;
      posY += vy;
      vy += 0.5; // gravity
      vx *= 0.98; // air resistance
      rotX += 8;
      rotY += 10;
      opacity -= 0.015;

      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;
      el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      el.style.opacity = opacity;

      if (opacity > 0 && posY < window.innerHeight) {
        requestAnimationFrame(step);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(step);
  }
});
