// ---- Cycling hero word ----
  const words = ["websites","interfaces","features","products"];
  let wIdx = 0;
  const cycleEl = document.getElementById('cycleWord');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    setInterval(() => {
      wIdx = (wIdx + 1) % words.length;
      cycleEl.style.opacity = 0;
      setTimeout(() => {
        cycleEl.textContent = words[wIdx];
        cycleEl.style.opacity = 1;
      }, 180);
    }, 2400);
    cycleEl.style.transition = 'opacity 0.18s ease';
  }

  // ---- Coordinate readout in hero ----
  const hero = document.getElementById('hero');
  const readout = document.getElementById('coordReadout');
  if(!reduceMotion){
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      readout.textContent = `x: ${x}, y: ${y}`;
    });
  }

  // ---- Active layer highlight on scroll ----
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.layer-link');
  const skillFills = document.querySelectorAll('.skill-fill');
  skillFills.forEach(fill => {
    fill.style.setProperty('--skill-level', fill.style.width);
    if (reduceMotion) fill.classList.add('is-visible');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        links.forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`.layer-link[href="#${entry.target.id}"]`).forEach(l => l.classList.add('active'));
        if (entry.target.id === 'about' && !reduceMotion) {
          skillFills.forEach(fill => fill.classList.add('is-visible'));
        }
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));

  // ---- Dark/light canvas toggle (desktop panel + mobile bar, kept in sync) ----
  const toggle = document.getElementById('modeToggle');
  const toggleMobile = document.getElementById('modeToggleMobile');
  const modeLabel = document.getElementById('modeLabel');

  function setDarkMode(isDark){
    document.body.classList.toggle('dark', isDark);
    toggle.classList.toggle('on', isDark);
    toggleMobile.classList.toggle('on', isDark);
    modeLabel.textContent = isDark ? 'Dark' : 'Light';
  }

  toggle.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark'));
  });
  toggleMobile.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark'));
  });

  // ---- Work filter ----
  const tabs = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.proj-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      items.forEach(item => {
        item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
      });
    });
  });

  // ---- Contact form (Formspree, no page reload) ----
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Sending…';
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if(res.ok){
          formStatus.textContent = 'Message sent — We will Catch You soon Buddy😉';
          contactForm.reset();
        } else {
          formStatus.textContent = 'Something went wrong — try email instead.';
        }
      } catch (err) {
        formStatus.textContent = 'Something went wrong — try email instead.';
      }
    });
  }