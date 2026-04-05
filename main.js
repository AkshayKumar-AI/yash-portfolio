/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

/* ── SCROLL REVEAL ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => revealObs.observe(r));

/* ── STAT COUNTER ANIMATION ── */
function animCount(el, target, suffix = '') {
  let start = 0;
  const dur = 1800;
  const step = timestamp => {
    if (!start) start = timestamp;
    const prog = Math.min((timestamp - start) / dur, 1);
    const val = Math.floor(prog * target);
    el.textContent = val + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const txt = el.textContent;
      if (txt.includes('400')) animCount(el, 400, '+');
      else if (txt.includes('5')) animCount(el, 5, '+');
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObs.observe(n));

/* ── CONTACT FORM → N8N WEBHOOK ── */
const WEBHOOK_URL = 'https://n8n.srv965659.hstgr.cloud/webhook-test/df5030e2-c06a-4503-9841-72e34146baee';

async function submitContactForm() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const project = document.getElementById('cf-project').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const btn     = document.getElementById('cf-submit');
  const status  = document.getElementById('cf-status');

  if (!name || !email || !message) {
    status.style.display = 'block';
    status.style.color = '#ff5c3a';
    status.textContent = 'Please fill in your name, email, and message.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.style.display = 'none';

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, project_type: project, message })
    });

    if (res.ok) {
      status.style.display = 'block';
      status.style.color = 'var(--accent)';
      status.textContent = '✓ Message sent! Yash will get back to you soon.';
      document.getElementById('cf-name').value    = '';
      document.getElementById('cf-email').value   = '';
      document.getElementById('cf-project').value = '';
      document.getElementById('cf-message').value = '';
      btn.textContent = 'Sent ✓';
    } else {
      throw new Error('Server responded with ' + res.status);
    }
  } catch (e) {
    status.style.display = 'block';
    status.style.color = '#ff5c3a';
    status.textContent = 'Something went wrong. Please try again.';
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  }
}

/* Expose to HTML onclick */
window.submitContactForm = submitContactForm;

/* ── CAROUSEL ── */
let currentIndex = 0;
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.video-item');
const totalItems = items.length;

function scrollCarousel(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = totalItems - 1;
  if (currentIndex >= totalItems) currentIndex = 0;
  const translateX = -currentIndex * (800 + 16); // 800px width + 1rem gap
  track.style.transform = `translateX(${translateX}px)`;
}
