// Theme toggle + year
(function(){
  const root = document.documentElement;
  const key = 'theme';
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem(key);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  function apply(theme){
    if(theme === 'light'){ root.classList.add('light'); }
    else{ root.classList.remove('light'); }
    localStorage.setItem(key, theme);
  }

  apply(stored || (prefersLight ? 'light' : 'dark'));

  btn?.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    apply(next);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

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


  // --- i18n (NO / EN) ---
  const dict = {
    no: {
      title: "Ole Frøiland — CV",
      skip: "Hopp til innhold",
      role: "Regnskapskonsulent",
      contact: "Kontakt",
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
  const applyLang = (lang)=>{
    const d = dict[lang] || dict.no;
    document.documentElement.lang = (lang === 'en') ? 'en' : 'no';
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(d[key]) el.textContent = d[key];
    });
    localStorage.setItem(langKey, lang);
    langBtn.textContent = (lang === 'en') ? 'EN / NO' : 'NO / EN';
  };
  applyLang(localStorage.getItem(langKey) || (navigator.language?.startsWith('en') ? 'en' : 'no'));
  langBtn?.addEventListener('click', ()=>{
    const current = localStorage.getItem(langKey) || 'no';
    applyLang(current === 'no' ? 'en' : 'no');
  });

})();