// Theme toggle + year
(function(){
  const root = document.documentElement;
  const key = 'theme';
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem(key);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const body = document.body;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function apply(theme){
    if(theme === 'light'){ root.classList.add('light'); }
    else{ root.classList.remove('light'); }
    localStorage.setItem(key, theme);
  }

  apply(stored || (prefersLight ? 'light' : 'dark'));

  btn?.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    // Instant toggle for snappy UX (like language switch)
    apply(next);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  // Mark page as loaded for subtle entrance
  window.addEventListener('DOMContentLoaded', ()=>{
    body.classList.add('loaded');
  });

  // Scroll reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        // Stagger siblings that are reveal elements within the same parent
        const siblings = Array.from(el.parentElement?.children || []).filter(n=>n.hasAttribute && n.hasAttribute('data-reveal'));
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx * 60) + 'ms'; // 60ms stagger
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -10% 0px'});

  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));


  // --- Scroll progress bar ---
  const progressEl = document.querySelector('.progress');
  if(progressEl){
    let ticking = false;
    let max = 1;
    const recalc = () => {
      const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const clientHeight = document.documentElement.clientHeight;
      max = Math.max(1, scrollHeight - clientHeight);
    };
    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const p = Math.min(1, Math.max(0, y / max));
      progressEl.style.transform = `scaleX(${p})`;
      ticking = false;
    };
    window.addEventListener('resize', ()=>{ recalc(); update(); });
    window.addEventListener('orientationchange', ()=>{ recalc(); update(); });
    window.addEventListener('scroll', ()=>{
      if(!ticking){
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, {passive:true});
    recalc();
    update();
  }

  // --- Parallax images ---
  if(!prefersReduced){
    const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
    if(parallaxEls.length){
      let ticking = false;
      const step = ()=>{
        parallaxEls.forEach(el=>{
          const r = el.getBoundingClientRect();
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const center = r.top + r.height/2 - vh/2;
          const offset = Math.max(-40, Math.min(40, -center * 0.06));
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      };
      const onScroll = ()=>{ if(!ticking){ ticking = true; requestAnimationFrame(step); } };
      window.addEventListener('scroll', onScroll, {passive:true});
      window.addEventListener('resize', step);
      step();
    }
  }

  // --- Chapter HUD: show current section ---
  const chapterEl = document.querySelector('.chapter');
  if(chapterEl){
    const sections = Array.from(document.querySelectorAll('section[data-chapter]'));
    const sectionObserver = new IntersectionObserver((entries)=>{
      // find the most visible entry
      let best = null; let area = 0;
      entries.forEach(e=>{
        if(e.isIntersecting){
          const r = e.target.getBoundingClientRect();
          const visible = Math.max(0, Math.min(window.innerHeight, r.bottom) - Math.max(0, r.top));
          if(visible > area){ area = visible; best = e.target; }
        }
      });
      if(best){
        const t = best.getAttribute('data-chapter');
        if(t) chapterEl.textContent = t;
      }
    }, {threshold:[0.2,0.5,0.8]});
    sections.forEach(s=>sectionObserver.observe(s));
  }


  // --- i18n (NO / EN) ---
  const dict = {
    no: {
      title: "Ole Frøiland — CV",
      skip: "Hopp til innhold",
      role: "Regnskapskonsulent",
      contact: "Kontakt",
      hero_h: "Hvem er jeg?",
      hero_p: "Jeg er Ole — en nysgjerrig, løsningsorientert og strukturert regnskapskonsulent som liker tall like godt som mennesker. Her er reisen min",
      about_h: "Profil",
      about_p: "Regnskapskonsulent i Azets (SMB). Erfaring med bokføring, rapportering og controlling. Utdannet ved Oslomet. Trening, fotball og reise på fritiden.",
      exp_h: "Erfaring",
      exp1_desc: "Ledet 8–10 personer. Bemanning, opplæring og rapportering.",
      exp1_k1: "Ledelse", exp1_k2: "Bemanning", exp1_k3: "Opplæring",
      exp2_h: "Regnskapskonsulent — Azets",
      exp2_desc: "Bokføring, rapportering, controlling og kundeoppfølging.",
      exp3_desc: "Kundeservice og bestillinger. Fokus på mersalg.",
      exp3_k1: "Kundeservice", exp3_k2: "Mersalg",
      edu_h: "Utdanning",
      edu1_desc: "Bachelor i økonomi og administrasjon. Snitt 4,46.",
      edu2_desc: "Realfag og økonomifag.",
      skills_h: "Kompetanse"
    },
    en: {
      title: "Ole Frøiland — Resume",
      skip: "Skip to content",
      role: "Accounting Consultant",
      contact: "Contact",
      hero_h: "Who am I?",
      hero_p: "I'm Ole — a curious, solution‑oriented and structured accounting consultant who enjoys numbers as much as people. Here's my journey.",
      about_h: "Profile",
      about_p: "Accounting consultant at Azets (SMB). Experience in bookkeeping, reporting and controlling. BSc from Oslomet. Enjoys training, football and travel.",
      exp_h: "Experience",
      exp1_desc: "Led a team of 8–10. Staffing, onboarding and reporting.",
      exp1_k1: "Leadership", exp1_k2: "Staffing", exp1_k3: "Training",
      exp2_h: "Accounting Consultant — Azets",
      exp2_desc: "Bookkeeping, reporting, controlling and client follow-up.",
      exp3_desc: "Customer support and orders with upselling focus.",
      exp3_k1: "Customer Service", exp3_k2: "Upselling",
      edu_h: "Education",
      edu1_desc: "BSc in Business Administration. GPA 4.46/5.",
      edu2_desc: "STEM and economics courses.",
      skills_h: "Skills"
    }
  };

  const langKey = 'lang';
  const langBtn = document.getElementById('langToggle');
  let typeRaf = null;
  let currentLang = 'no';
  const applyLang = (lang)=>{
    const d = dict[lang] || dict.no;
    document.documentElement.lang = (lang === 'en') ? 'en' : 'no';
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(d[key]) el.textContent = d[key];
    });
    localStorage.setItem(langKey, lang);
    langBtn.textContent = (lang === 'en') ? 'EN / NO' : 'NO / EN';
    currentLang = (lang === 'en') ? 'en' : 'no';
    // retype hero after language change
    typeHero();
  };
  applyLang(localStorage.getItem(langKey) || (navigator.language?.startsWith('en') ? 'en' : 'no'));
  langBtn?.addEventListener('click', ()=>{
    const current = localStorage.getItem(langKey) || 'no';
    applyLang(current === 'no' ? 'en' : 'no');
  });

  // --- Cinematic interactions ---

  // Magnetic buttons
  if(!prefersReduced && matchMedia('(pointer:fine)').matches){
    const magnets = document.querySelectorAll('.btn');
    magnets.forEach(btnEl => {
      let rafId = 0;
      const onMove = (e)=>{
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(()=>{
          const r = btnEl.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width/2);
          const dy = e.clientY - (r.top + r.height/2);
          btnEl.style.transform = `translate(${dx*0.08}px, ${dy*0.08}px) scale(1.03)`;
        });
      };
      const onLeave = ()=>{
        btnEl.style.transform = '';
      };
      btnEl.addEventListener('mousemove', onMove);
      btnEl.addEventListener('mouseleave', onLeave);
    });
  }

  // 3D tilt for panels
  if(!prefersReduced && matchMedia('(pointer:fine)').matches){
    const tilts = document.querySelectorAll('[data-tilt]');
    tilts.forEach(el=>{
      let rafId = 0;
      const move = (e)=>{
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(()=>{
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          const rx = (py) * 8;   // degrees
          const ry = -(px) * 10; // degrees
          el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      };
      const leave = ()=>{ el.style.transform = ''; };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
    });
  }

  // --- Hero typewriter (robust, single instance) ---
  function typeHero(){
    const el = document.querySelector('.hero-type');
    if(!el) return;
    const full = el.textContent.trim();
    if(!full) return;
    if(prefersReduced){ el.textContent = full; el.classList.remove('typing'); highlightHero(el); return; }
    if(typeRaf) cancelAnimationFrame(typeRaf);
    el.textContent = '';
    el.classList.add('typing');
    let i = 0;
    const chunk = 3; // type 3 chars per frame for speed
    const step = ()=>{
      el.textContent += full.slice(i, i + chunk);
      i += chunk;
      if(i < full.length){ typeRaf = requestAnimationFrame(step); }
      else { el.classList.remove('typing'); typeRaf = null; highlightHero(el); }
    };
    typeRaf = requestAnimationFrame(step);
  }
  function highlightHero(el){
    const txt = el.textContent;
    // words to emphasize (excluding 'min' which we treat specially)
    const words = (currentLang === 'en')
      ? ["curious","solution‑oriented","solution-oriented","structured","numbers","people"]
      : ["nysgjerrig","løsningsorientert","strukturert","tall","mennesker"];
    const esc = s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const re = new RegExp(`(${words.map(esc).join('|')})`,'gi');
    let html = txt.replace(re, '<span class="em">$1</span>');
    // Special highlight for first 'min' (NO only) as anchor at the word's last letter 'n'
    if(currentLang === 'no'){
      let anchored = false;
      html = html.replace(/\bmin\b/g, (m)=>{
        if(!anchored){ anchored = true; return '<span id="min-anchor" class="em">min</span>'; }
        return '<span class="em">min</span>';
      });
    }
    el.innerHTML = html;
    // draw curve from 'min'
    drawHeroCurve();
  }

  function drawHeroCurve(){
    // remove previous connector(s)
    document.querySelectorAll('#hero .connector').forEach(n=>n.remove());
    const anchor = document.getElementById('min-anchor');
    if(!anchor) return;
    // Find precise rect of the last character 'n' in 'min'
    const textNode = anchor.firstChild;
    if(!(textNode && textNode.nodeType === 3)) return;
    const t = textNode.textContent || '';
    const nIdx = Math.max(0, t.length - 1);
    const range = document.createRange();
    range.setStart(textNode, nIdx);
    range.setEnd(textNode, nIdx + 1);
    const r = range.getClientRects()[0] || anchor.getBoundingClientRect();
    const startX = Math.round(r.right);
    const startY = Math.round(r.bottom + 5); // slightly below baseline
    const container = document.querySelector('main.container');
    if(!container) return;
    const cRect = container.getBoundingClientRect();
    const contW = Math.round(cRect.width);
    const contLeft = cRect.left;
    // Place inside hero; compute points in hero-local coords, but SVG uses viewport box
    const hero = document.getElementById('hero');
    if(!hero) return;
    const heroRect = hero.getBoundingClientRect();
    const W = Math.max(1, Math.round(heroRect.width));
    // Start after 'min': +14px right, +6px down
    const sxViewport = Math.round(r.right + 14);
    const syViewport = Math.round(r.bottom + 6);
    // Measure Info and Avatar
    const infoEl = document.getElementById('info');
    const infoRect = infoEl?.getBoundingClientRect();
    if(!infoRect) return;
    const avatar = document.querySelector('.hero-avatar');
    const avatarRect = avatar?.getBoundingClientRect();
    // Right-edge routing control near avatar but safely away
    let cxViewport = avatarRect ? Math.round(avatarRect.left - 40) : Math.round(infoRect.right + 16);
    let cyViewport = Math.round(Math.min(infoRect.top - 12, avatarRect ? (avatarRect.top + avatarRect.height * 0.15) : infoRect.top));
    // End under Info
    const exViewport = Math.round(infoRect.left + infoRect.width * 0.85);
    const eyViewport = Math.round(infoRect.bottom + 28);
    // Local SVG box anchored at syViewport (top of SVG aligns with start y)
    const topOffset = syViewport - heroRect.top;
    const H = Math.max(60, eyViewport - syViewport + 80);
    // Convert to hero-local SVG coords
    const sx = Math.round(sxViewport - heroRect.left);
    const sy = 0;
    let cx = Math.round(cxViewport - heroRect.left);
    let cy = Math.round(cyViewport - syViewport);
    const ex = Math.round(exViewport - heroRect.left);
    const ey = Math.round(eyViewport - syViewport);
    // First control: small forward glide from start
    let c1x = Math.round(sx + 120);
    let c1y = Math.round(sy + 12);
    // Safety: keep control points outside inflated avatar circle (r + 32px)
    if(avatarRect){
      const ax = avatarRect.left + avatarRect.width/2 - heroRect.left;
      const ay = avatarRect.top + avatarRect.height/2 - syViewport;
      const ar = (avatarRect.width/2) + 32;
      const keepAway = (px, py)=>{
        const dx = px - ax; const dy = py - ay; const d = Math.hypot(dx, dy) || 1;
        if(d < ar){ const s = ar / d; return [ax + dx*s, ay + dy*s]; }
        return [px, py];
      };
      [c1x, c1y] = keepAway(c1x, c1y);
      [cx, cy] = keepAway(cx, cy);
    }
    // Build path: M sx sy C (c1x c1y) (cx cy) (ex ey)
    const d = `M ${sx} ${sy} C ${c1x} ${c1y}, ${cx} ${cy}, ${ex} ${ey}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','connector');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', String(W));
    svg.setAttribute('height', String(H));
    svg.style.left = '0px';
    svg.style.top = `${topOffset}px`;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', d);
    path.setAttribute('fill','none');
    path.setAttribute('stroke','var(--accent-blue)');
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('stroke-width','3');
    path.setAttribute('class','curve-path');
    svg.appendChild(path);
    hero.appendChild(svg);
    // dash setup and animation (forward only)
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    if(prefersReduced){
      path.style.strokeDashoffset = '0';
      path.style.animation = 'none';
    } else {
      path.style.strokeDashoffset = String(len);
      path.style.setProperty('--plen', String(len));
      path.style.animation = 'curveDrawOnce 1.8s ease-in-out forwards';
    }
  }

  // Recompute curve only on width changes (avoid mobile toolbar scroll resizes)
  let lastW = window.innerWidth;
  window.addEventListener('resize', ()=>{
    const w = window.innerWidth;
    if(w !== lastW){
      lastW = w;
      drawHeroCurve();
    }
  });
  // initial typing handled via applyLang

  // --- Contact popover ---
  (function(){
    const toggle = document.getElementById('contactToggle');
    const menu = document.getElementById('contactMenu');
    if(!toggle || !menu) return;
    const position = ()=>{
      const r = toggle.getBoundingClientRect();
      // temporarily show to measure
      const prev = menu.style.visibility;
      menu.style.visibility = 'hidden';
      menu.classList.add('open');
      const mw = menu.offsetWidth;
      const mh = menu.offsetHeight;
      let left = Math.min(window.innerWidth - 12 - mw, Math.max(12, r.right - mw));
      let top = r.bottom + 8;
      if(top + mh > window.innerHeight - 12){
        top = Math.max(12, r.top - 8 - mh);
      }
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      menu.classList.remove('open');
      menu.style.visibility = prev || '';
    };
    const open = ()=>{
      position();
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      const first = menu.querySelector('a');
      first && first.focus({preventScroll:true});
      document.addEventListener('pointerdown', onDocDown, true);
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onResize, {passive:true});
    };
    const close = ()=>{
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      document.removeEventListener('pointerdown', onDocDown, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
    const onDocDown = (e)=>{
      if(menu.contains(e.target) || toggle.contains(e.target)) return;
      close();
    };
    const onKey = (e)=>{
      if(e.key === 'Escape') { close(); toggle.focus({preventScroll:true}); }
    };
    const onResize = ()=>{ if(menu.classList.contains('open')) position(); };
    toggle.addEventListener('click', ()=>{
      const isOpen = menu.classList.contains('open');
      isOpen ? close() : open();
    });
  })();

})();
