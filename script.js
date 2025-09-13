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
    // Fjern tidligere linje
    document.querySelectorAll('#hero .connector').forEach(n=>n.remove());

    const anchor = document.getElementById('min-anchor');
    const hero   = document.getElementById('hero');
    const info   = document.getElementById('info');
    const avatar = document.querySelector('.hero-avatar');
    if(!anchor || !hero || !info) return;

    // Finn eksakt posisjon for siste bokstav "n" i "min"
    const node = anchor.firstChild;
    const range = document.createRange();
    range.setStart(node, Math.max(0, (node.textContent||'').length - 1));
    range.setEnd(node,   Math.max(1, (node.textContent||'').length));
    const nRect      = range.getClientRects()[0] || anchor.getBoundingClientRect();
    const heroRect   = hero.getBoundingClientRect();
    const infoRect   = info.getBoundingClientRect();
    const avatarRect = avatar?.getBoundingClientRect();

    // Start like etter "min"
    const sxV = nRect.right + 14;   // litt frem
    const syV = nRect.bottom + 6;   // litt ned

    // Mål for slutt: under info (midt mot høyre)
    const exV = infoRect.left + infoRect.width * 0.65;
    const eyV = infoRect.bottom + 32;

    // Waypoint for å styre rundt høyre kant av info
    const rxV = infoRect.right + 24;
    const ryV = infoRect.top + infoRect.height * 0.35;

    // Første kontrollpunkt: myk gli fremover fra start
    let c1xV = sxV + 120;
    let c1yV = syV + 12;

    // Andre kontrollpunkt: mot høyre kant av info
    let c2xV = rxV;
    let c2yV = ryV;

    // Hold trygg avstand til portrettet (sikkerhetsmargin)
    const SAFE = 36;
    if(avatarRect){
      const ax = avatarRect.left + avatarRect.width/2;
      const ay = avatarRect.top  + avatarRect.height/2;
      const ar = avatarRect.width/2 + SAFE;
      const pushAway = (px, py)=>{
        const dx = px - ax, dy = py - ay;
        const d  = Math.hypot(dx, dy) || 1;
        if(d < ar){ const s = ar / d; return [ax + dx*s, ay + dy*s]; }
        return [px, py];
      };
      [c1xV, c1yV] = pushAway(c1xV, c1yV);
      [c2xV, c2yV] = pushAway(c2xV, c2yV);
    }

    // Plasser SVG lokalt i hero
    const topOffset = syV - heroRect.top;
    const W = Math.max(1, Math.round(heroRect.width));
    const H = Math.max(80, Math.round((eyV - syV) + 80));

    // Konverter til hero-lokale koordinater
    const toLocalX = v => Math.round(v - heroRect.left);
    const toLocalY = v => Math.round(v - syV);

    const sx = toLocalX(sxV), sy = 0;
    const c1x = toLocalX(c1xV), c1y = toLocalY(c1yV);
    const c2x = toLocalX(c2xV), c2y = toLocalY(c2yV);
    const ex  = toLocalX(exV),  ey  = toLocalY(eyV);

    // Bygg fin S-kurve: M -> C(c1) -> (c2) -> end
    const d = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;

    const svg  = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.classList.add('connector');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width',  String(W));
    svg.setAttribute('height', String(H));
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top  = `${topOffset}px`;
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';

    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', d);
    path.setAttribute('fill','none');
    path.setAttribute('stroke','var(--accent-blue)');
    path.setAttribute('stroke-width','3');
    path.setAttribute('stroke-linecap','round');
    path.classList.add('curve-path');

    svg.appendChild(path);
    hero.appendChild(svg);

    // Tegn én gang fremover, stopp
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      path.style.strokeDashoffset = '0';
    }else{
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
