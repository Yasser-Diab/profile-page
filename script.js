document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = themeToggle?.querySelector(".theme-toggle__icon");
  const themeText = themeToggle?.querySelector(".theme-toggle__text");
  const sections = [...document.querySelectorAll("[data-section]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];

  function getStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      return;
    }
  }

  function updateThemeToggle(theme) {
    if (!themeToggle || !themeIcon || !themeText) {
      return;
    }

    const isLight = theme === "light";
    themeIcon.innerHTML = isLight
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    themeText.textContent = isLight ? "Light mode" : "Dark mode";
    themeToggle.setAttribute(
      "aria-label",
      isLight
        ? "Light mode active. Switch to dark mode."
        : "Dark mode active. Switch to light mode.",
    );
  }

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }

    updateThemeToggle(theme);
    setStoredTheme(theme);
  }

  const initialTheme =
    getStoredTheme() ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");
  applyTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const nextTheme =
      root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href")?.replace("#", "");
      if (targetId) {
        setActiveLink(targetId);
      }
    });
  });

  if (!sections.length) {
    return;
  }

  sections[0].classList.add("is-visible");
  setActiveLink(sections[0].id);

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));

    const syncActiveLink = () => {
      let currentSection = sections[0];

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - window.innerHeight * 0.45) {
          currentSection = section;
        }
      });

      setActiveLink(currentSection.id);
    };

    window.addEventListener("scroll", syncActiveLink, { passive: true });
    syncActiveLink();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  sections.forEach((section) => {
    revealObserver.observe(section);
  });

  const activeObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (!visibleEntries.length) {
        return;
      }

      const bestMatch = visibleEntries.reduce((best, entry) => {
        if (!best) {
          return entry;
        }

        return entry.intersectionRatio > best.intersectionRatio ? entry : best;
      }, null);

      if (bestMatch?.target?.id) {
        setActiveLink(bestMatch.target.id);
      }
    },
    {
      threshold: [0.2, 0.35, 0.55, 0.75],
      rootMargin: "-30% 0px -45% 0px",
    },
  );

  sections.forEach((section) => {
    activeObserver.observe(section);
  });
});

const yearElement = document.getElementById("year");

yearElement.textContent = String(new Date().getFullYear());
