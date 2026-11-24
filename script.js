/* =============================
   BUILT WITH NATURE — script.js
============================= */

// ── Animated Counter ──────────────────────────────────────────────
function animateCounter(el) {
  const rawTarget = el.dataset.target;
  const target = parseInt(rawTarget, 10);
  const hasPlus = rawTarget.includes('+');
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + (hasPlus && progress >= 1 ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (hasPlus ? '+' : '');
  }

  requestAnimationFrame(step);
}

// Trigger counters when hero stats are visible
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));


// ── FAQ Accordion ─────────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

    if (!isOpen) item.classList.add('open');
  });
});


// ── Mobile Nav ────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.style.display === 'flex';
  if (open) {
    navLinks.style.display = 'none';
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '60px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(247, 243, 236, 0.98)';
    navLinks.style.padding = '1.5rem 2rem';
    navLinks.style.gap = '1.2rem';
    navLinks.style.borderBottom = '1px solid #d4c9b8';
    navLinks.style.boxShadow = '0 8px 20px rgba(44,36,22,0.08)';
  }
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 600) navLinks.style.display = 'none';
  });
});


// ── Scroll-triggered section animations ───────────────────────────
const revealEls = document.querySelectorAll('.card, .rule-item, .timeline-item, .faq-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = (i * 0.06) + 's';
      entry.target.style.animation = 'fadeInUp 0.55s both';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  revealObserver.observe(el);
});


// ── Navbar shrink on scroll ───────────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.padding = '0.65rem 2.5rem';
    navbar.style.boxShadow = '0 4px 20px rgba(44,36,22,0.08)';
  } else {
    navbar.style.padding = '1rem 2.5rem';
    navbar.style.boxShadow = 'none';
  }
});


// ── Gallery: scroll-reveal + drag-to-scroll ───────────────────────
(function () {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.gallery-card');
  const wrap = track.parentElement;

  // ── Stagger-reveal on scroll ──
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...cards].indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.08) + 's';
        entry.target.classList.add('visible');
        galleryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => galleryObserver.observe(card));

  // ── Drag-to-scroll ──
  let isDown = false, startX, scrollLeft;

  wrap.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });

  document.addEventListener('mouseup', () => { isDown = false; });

  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // ── Auto-scroll slow drift ──
  let autoScroll = true;
  let scrollPos = 0;
  const totalWidth = () => wrap.scrollWidth - wrap.clientWidth;

  wrap.addEventListener('mouseenter', () => { autoScroll = false; });
  wrap.addEventListener('mouseleave', () => { autoScroll = true; });
  wrap.addEventListener('touchstart', () => { autoScroll = false; }, { passive: true });
  wrap.addEventListener('touchend',   () => { setTimeout(() => autoScroll = true, 2000); }, { passive: true });

  function drift() {
    if (autoScroll) {
      scrollPos += 0.4;
      if (scrollPos >= totalWidth()) scrollPos = 0;
      wrap.scrollLeft = scrollPos;
    } else {
      scrollPos = wrap.scrollLeft;
    }
    requestAnimationFrame(drift);
  }
  drift();
})();


// ── Floating leaf cursor trail ────────────────────────────────────
const LEAVES = ['🍃', '🌿', '🍂', '🌱', '🍁'];
const trail = [];
const TRAIL_LENGTH = 8;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const leaf = document.createElement('div');
  const size = 14 - i * 1;
  leaf.textContent = LEAVES[i % LEAVES.length];
  leaf.style.cssText = `
    position: fixed; pointer-events: none; z-index: 10000;
    font-size: ${size}px;
    opacity: ${0.55 - i * 0.06};
    transform: translate(-50%,-50%) rotate(${Math.random() * 60 - 30}deg);
    transition: opacity 0.2s;
    will-change: left, top;
    user-select: none;
  `;
  document.body.appendChild(leaf);
  trail.push({ el: leaf, x: -100, y: -100 });
}

let mouseX = -100, mouseY = -100;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateTrail() {
  trail.forEach((dot, i) => {
    const prev = trail[i - 1] || { x: mouseX, y: mouseY };
    dot.x += (prev.x - dot.x) * 0.35;
    dot.y += (prev.y - dot.y) * 0.35;
    dot.el.style.left = dot.x + 'px';
    dot.el.style.top  = dot.y + 'px';
  });
  requestAnimationFrame(animateTrail);
}

animateTrail();


// ── Form submit handler ───────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = '🌿 Application received! See you at the event.';
  btn.style.background = '#3d6b4a';
  btn.style.borderColor = '#3d6b4a';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}


// ── Subtle parallax on hero botanical decorations ─────────────────
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('mousemove', e => {
    const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
    hero.style.setProperty('--px', xPct * 10 + 'px');
    hero.style.setProperty('--py', yPct * 8 + 'px');
  });
}
