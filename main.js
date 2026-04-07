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
      else if (txt.includes('4+')) animCount(el, 4, '+');
      else if (txt.includes('100')) animCount(el, 100, '+');
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObs.observe(n));

/* ── CONTACT FORM → EMAIL API ── */

async function submitContactForm() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const number  = document.getElementById('cf-number').value.trim();
  const project = document.getElementById('cf-project').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const btn     = document.getElementById('cf-submit');
  const status  = document.getElementById('cf-status');

  if (!name || !email || !number || !message) {
    status.style.display = 'block';
    status.style.color = '#ff5c3a';
    status.textContent = 'Please fill in all required fields.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';
  status.style.display = 'none';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, number, project_type: project, message })
    });

    const data = await res.json();

    if (res.ok) {
      status.style.display = 'block';
      status.style.color = 'var(--accent)';
      status.textContent = '✓ Message sent! Check your email for confirmation.';
      document.getElementById('cf-name').value    = '';
      document.getElementById('cf-email').value   = '';
      document.getElementById('cf-number').value  = '';
      document.getElementById('cf-project').value = '';
      document.getElementById('cf-message').value = '';
      btn.textContent = 'Sent ✓';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message →';
      }, 3000);
    } else {
      throw new Error(data.message || 'Failed to send message');
    }
  } catch (e) {
    status.style.display = 'block';
    status.style.color = '#ff5c3a';
    status.textContent = e.message || 'Something went wrong. Please try again.';
    btn.disabled = false;
    btn.textContent = 'Send Message →';
  }
}

/* Expose to HTML onclick */
window.submitContactForm = submitContactForm;

/* ── VIDEO GALLERY ── */
console.log('✓ Video gallery loaded - 7 videos with external links');

