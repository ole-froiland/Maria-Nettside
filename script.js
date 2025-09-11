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
})();