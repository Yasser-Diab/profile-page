document.addEventListener("DOMContentLoaded", () => {
  console.log(`JavaScript loaded......`);
  const body = document.body;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY;
          body.classList.toggle("is-scrolled", scrollPos > 20);
          body.classList.toggle("is-scrolled-contact", scrollPos > 780);
          body.classList.toggle("is-scrolled-skills-html", scrollPos > 1150);
          body.classList.toggle("is-scrolled-skills-css", scrollPos > 1410);
          body.classList.toggle("is-scrolled-skills-js", scrollPos > 1730);
          body.classList.toggle("is-scrolled-skills-fd", scrollPos > 2050);

          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  const cursor = document.querySelector(".custom-cursor");

  document.addEventListener("mousemove", (e) => {
    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }
  });

  /* Theme toggle: looks for .theme-toggle button (or creates one), toggles html[data-theme] and saves preference
     Button shows current theme label + Font Awesome icon: "Light" + sun, "Dark" + moon
  */
  (function setupThemeToggle() {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const btnClass = 'theme-toggle';

    function iconHtml(name) {
      // uses Font Awesome 6 class names; falls back to plain text if FA not loaded
      const faClass = name === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      return `<span class="theme-label">${name === 'light' ? 'Light ' : 'Dark '}</span><i class="${faClass}" aria-hidden="true"></i>`;
    }

    function applyTheme(theme) {
      if (theme === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
      localStorage.setItem('theme', theme);
      if (toggleBtn) {
        toggleBtn.innerHTML = iconHtml(theme);
        toggleBtn.setAttribute('aria-pressed', theme === 'light');
        toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Light theme active. Click to switch to Dark.' : 'Dark theme active. Click to switch to Light.');
        toggleBtn.title = theme === 'light' ? 'Switch to Dark theme' : 'Switch to Light theme';
      }
    }

    let toggleBtn = document.querySelector('.' + btnClass);
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = btnClass;
      toggleBtn.type = 'button';
      document.body.appendChild(toggleBtn);
    }

    // set initial
    const initial = stored === 'light' ? 'light' : 'dark';
    applyTheme(initial);

    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  })();

});
