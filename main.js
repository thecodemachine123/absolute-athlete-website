document.addEventListener('DOMContentLoaded', function(){
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

function showPage(pageId) {
  const targetPage = document.getElementById('page-' + pageId);
  if (!targetPage) return false;

  document.querySelectorAll('.page').forEach(page => {
    const isActive = page === targetPage;
    page.classList.toggle('active', isActive);
    page.setAttribute('aria-hidden', String(!isActive));
  });

  document.querySelectorAll('.nav-link, .mnav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  aaMenu(false);
  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  return true;
}

function scrollToContact() {
  setTimeout(() => {
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, 80);
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = (window.location.hash || '').replace('#', '');
  const hashToPage = {
    'page-home': 'home',
    'page-how-it-works': 'how-it-works',
    'page-for-clubs': 'for-clubs',
    'page-for-athletes': 'for-athletes',
    'page-our-story': 'our-story',
    'contact': 'for-clubs'
  };
  if (hashToPage[hash]) {
    showPage(hashToPage[hash]);
    if (hash === 'contact') scrollToContact();
  }
});

async function handleSubmit(event) {
  if (event) event.preventDefault();

  const form = document.getElementById('partnerForm');
  if (!form) return false;

  const btn = form.querySelector('.form-submit');
  const status = document.getElementById('formStatus');
  const name = form.elements.name.value.trim();
  const club = form.elements.club.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function setStatus(text, color) {
    if (status) status.textContent = text;
    if (color && btn) btn.style.background = color;
  }

  if (!name || !email || !emailLooksValid) {
    setStatus('Please enter your name and a valid email address.', '#dc2626');
    return false;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
    btn.style.background = '';
  }

  try {
    const res = await fetch('https://formspree.io/f/xgobvnzo', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({name, club, email, message})
    });

    if (!res.ok) throw new Error('Form submission failed');

    if (btn) btn.textContent = "Sent! We'll be in touch.";
    setStatus("Sent. We'll be in touch soon.", '#16a34a');
    form.reset();
  } catch (error) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Send Inquiry';
    }
    setStatus('Message did not send. Please email info@myabsoluteathlete.com directly.', '#dc2626');
    setTimeout(() => {
      if (btn) btn.style.background = '';
    }, 3000);
  }

  return false;
}

// Hero stat count-up animation
function animateCount(el, start, end, duration, decimals, suffix, delay) {
  function run() {
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (end - start) * eased;
      el.textContent = value.toFixed(decimals) + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  setTimeout(run, delay || 0);
}

(() => {
  document.querySelectorAll('.page').forEach(page => {
    page.setAttribute('aria-hidden', String(!page.classList.contains('active')));
  });

  const ageEl = document.getElementById('statAthAge');
  const compEl = document.getElementById('statCompletion');
  if (ageEl) ageEl.textContent = '11.8';
  if (compEl) compEl.textContent = '82%';
})();

(function(){
  if (!('IntersectionObserver' in window)) return;
  var sel = ['.step','.stat','.club-value-card','.story-card','.club-pilot-step',
             '.ws-body','.aa-explainer','.contact-box','.founder-photo-card',
             '.section-headline','.ws-headline'];
  var nodes = document.querySelectorAll(sel.join(','));
  nodes.forEach(function(el){
    el.classList.add('rv');
    var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function(c){return c.classList.contains('rv');}) : [];
    var idx = sibs.indexOf(el);
    if (idx === 1) el.classList.add('rv-d1');
    else if (idx === 2) el.classList.add('rv-d2');
    else if (idx >= 3) el.classList.add('rv-d3');
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -6% 0px'});
  nodes.forEach(function(el){
    // anything already in view on load shows immediately
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) { el.classList.add('in'); }
    else io.observe(el);
  });
  // re-run visibility when switching pages
  var origShow = window.showPage;
  window.showPage = function(id){
    var ok = origShow(id);
    requestAnimationFrame(function(){
      document.querySelectorAll('.page.active .rv:not(.in)').forEach(function(el){
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) el.classList.add('in');
        else io.observe(el);
      });
    });
    return ok;
  };
})();

function aaMenu(open){
  var m = document.getElementById('aaMnav');
  var b = document.querySelector('.nav-burger');
  if (!m) return;
  var wasOpen = m.classList.contains('open');
  m.classList.toggle('open', open);
  m.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    var c = m.querySelector('.mnav-close');
    if (c) c.focus();
  } else if (wasOpen && b) {
    b.focus();
  }
}
function aaGo(id){ aaMenu(false); showPage(id); }
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') aaMenu(false); });
matchMedia('(min-width:1101px)').addEventListener('change', function(e){ if (e.matches) aaMenu(false); });
