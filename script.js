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
  }, {threshold: 0.15, rootMargin: '0px 0px -5% 0px'});

  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));

})();