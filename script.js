(function () {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const progressBar = document.getElementById("progressBar");
  const toast = document.getElementById("toastNotification");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const savedTheme = localStorage.getItem("portfolio-theme");

  const pages = {
    home: document.getElementById("home-page"),
    about: document.getElementById("about-page"),
    skills: document.getElementById("skills-page"),
    projects: document.getElementById("projects-page"),
    contact: document.getElementById("contact-page"),
  };

  const navLinks = document.querySelectorAll(".nav-link");
  const offcanvasNavLinks = document.querySelectorAll(".offcanvas-nav-link");
  const logoLinks = document.querySelectorAll('[data-nav="home"]');
  const logoHomeLinks = document.querySelectorAll('[data-nav-home="home"]');
  const menuToggle = document.getElementById("menu-toggle");
  const offcanvasMenu = document.getElementById("offcanvasMenu");
  const offcanvasOverlay = document.getElementById("offcanvasOverlay");
  const offcanvasClose = document.getElementById("offcanvasClose");
  const filterChips = document.querySelectorAll(".filter-chip");
  const projectCards = document.querySelectorAll(".project-card");
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const copyPhoneBtn = document.getElementById("copyPhoneBtn");
  const emailText = document.getElementById("emailText");
  const phoneText = document.getElementById("phoneText");
  const contactForm = document.getElementById("contactForm");
  const header = document.querySelector("header");
  const typingHighlight = document.getElementById("typingHighlight");
  const typingSuffix = document.getElementById("typingSuffix");
  const titleSpan = document.getElementById("typingSubtitle");

  let toastTimeout;
  let typingTimeout;

  function setTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);
    themeIcon?.classList.toggle("fa-sun", isLight);
    themeIcon?.classList.toggle("fa-moon", !isLight);
    themeToggle?.setAttribute("aria-pressed", String(isLight));
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  }

  function showToast(message) {
    if (!toast) return;

    window.clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function updateProgressBar() {
    if (!progressBar) return;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollableHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress =
      scrollableHeight > 0 ? Math.min((scrollTop / scrollableHeight) * 100, 100) : 0;

    progressBar.style.width = `${progress}%`;
  }

  async function copyText(value, successMessage) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "absolute";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
      }

      showToast(successMessage);
    } catch (error) {
      showToast("Copy failed. Please copy it manually.");
    }
  }

  function closeOffcanvas() {
    offcanvasMenu?.classList.remove("active");
    offcanvasOverlay?.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  function openOffcanvas() {
    offcanvasMenu?.classList.add("active");
    offcanvasOverlay?.classList.add("active");
    document.body.classList.add("menu-open");
    menuToggle?.setAttribute("aria-expanded", "true");
  }

  function animateSkillBars() {
    document
      .querySelectorAll("#about-page .skill-level, #skills-page .skill-level")
      .forEach((bar) => {
        const width = bar.getAttribute("data-width");
        if (width) {
          bar.style.width = `${width}%`;
        }
      });
  }

  function getHashPage() {
    const hashPage = window.location.hash.replace("#", "");
    return pages[hashPage] ? hashPage : "home";
  }

  function applyProjectFilter(filter) {
    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const matches = filter === "all" || category === filter;

      card.hidden = !matches;
    });

    filterChips.forEach((chip) => {
      const active = chip.getAttribute("data-filter") === filter;
      chip.classList.toggle("active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
  }

  function setLocationHash(pageId) {
    const nextHash = pageId === "home" ? "" : `#${pageId}`;
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;

    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, "", nextUrl);
    }
  }

  function showPage(pageId, options = {}) {
    const { updateHash = true, smoothScroll = true } = options;

    Object.entries(pages).forEach(([id, page]) => {
      page?.classList.toggle("active-page", id === pageId);
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-page") === pageId);
    });

    offcanvasNavLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-page") === pageId);
    });

    if (updateHash) {
      setLocationHash(pageId);
    }

    if (pageId === "about" || pageId === "skills") {
      window.setTimeout(animateSkillBars, 150);
    }

    window.scrollTo({
      top: 0,
      behavior: smoothScroll && !prefersReducedMotion ? "smooth" : "auto",
    });

    closeOffcanvas();
    updateProgressBar();
  }

  function startTypingAnimation() {
    const highlightedText = "Building Digital Experiences";
    const suffixText = " That Convert";
    const titles = [
      "Full-Stack Developer",
      "React Expert",
      "UI/UX Designer",
      "Performance Optimizer",
    ];

    if (!typingHighlight || !typingSuffix || !titleSpan) return;

    if (prefersReducedMotion) {
      typingHighlight.textContent = highlightedText;
      typingSuffix.textContent = suffixText;
      titleSpan.textContent = titles[0];
      return;
    }

    let highlightIndex = 0;
    let suffixIndex = 0;
    let titleIndex = 0;
    let currentTitle = 0;
    let erasingTitle = false;

    function typeHeadline() {
      if (highlightIndex < highlightedText.length) {
        typingHighlight.textContent = highlightedText.slice(0, highlightIndex + 1);
        highlightIndex += 1;
        typingTimeout = window.setTimeout(typeHeadline, 45);
        return;
      }

      if (suffixIndex < suffixText.length) {
        typingSuffix.textContent = suffixText.slice(0, suffixIndex + 1);
        suffixIndex += 1;
        typingTimeout = window.setTimeout(typeHeadline, 35);
        return;
      }

      typingTimeout = window.setTimeout(typeTitle, 250);
    }

    function typeTitle() {
      const activeTitle = titles[currentTitle];

      if (!erasingTitle && titleIndex < activeTitle.length) {
        titleSpan.textContent = activeTitle.slice(0, titleIndex + 1);
        titleIndex += 1;
        typingTimeout = window.setTimeout(typeTitle, 55);
        return;
      }

      if (!erasingTitle) {
        erasingTitle = true;
        typingTimeout = window.setTimeout(typeTitle, 1800);
        return;
      }

      if (titleIndex > 0) {
        titleSpan.textContent = activeTitle.slice(0, titleIndex - 1);
        titleIndex -= 1;
        typingTimeout = window.setTimeout(typeTitle, 35);
        return;
      }

      erasingTitle = false;
      currentTitle = (currentTitle + 1) % titles.length;
      typingTimeout = window.setTimeout(typeTitle, 220);
    }

    typeHeadline();
  }

  if (savedTheme === "light") setTheme("light");
  else if (savedTheme === "dark") setTheme("dark");
  else setTheme(prefersDark ? "dark" : "light");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    setTheme(nextTheme);
  });

  window.addEventListener("scroll", updateProgressBar);
  updateProgressBar();

  copyEmailBtn?.addEventListener("click", () => {
    if (emailText) {
      copyText(emailText.textContent.trim(), "Email copied to clipboard!");
    }
  });

  copyPhoneBtn?.addEventListener("click", () => {
    if (phoneText) {
      copyText(phoneText.textContent.trim(), "Phone number copied to clipboard!");
    }
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.getAttribute("data-filter") || "all";
      applyProjectFilter(filter);
    });
  });

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const pageId = link.getAttribute("data-page");

      if (pageId && pages[pageId]) {
        event.preventDefault();
        showPage(pageId);
      }
    });
  });

  logoLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPage("home");
    });
  });

  logoHomeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showPage("home");
    });
  });

  menuToggle?.addEventListener("click", openOffcanvas);
  offcanvasClose?.addEventListener("click", closeOffcanvas);
  offcanvasOverlay?.addEventListener("click", closeOffcanvas);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOffcanvas();
    }
  });

  if ("IntersectionObserver" in window) {
    const skillSections = [pages.about, pages.skills].filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    skillSections.forEach((section) => observer.observe(section));
  } else {
    animateSkillBars();
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "there";
      const email = document.getElementById("email")?.value.trim() || "";
      const subject = document.getElementById("subject")?.value.trim() || "Project inquiry";
      const message = document.getElementById("message")?.value.trim() || "";
      const mailtoUrl = `mailto:akanbiibrahimolatunde27@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`,
      )}`;

      window.location.href = mailtoUrl;
      showToast(`Thanks, ${name}. Opening your email app now.`);
      contactForm.reset();
    });
  }

  window.addEventListener("scroll", () => {
    if (!header) return;

    header.style.boxShadow =
      window.scrollY > 60
        ? "0 12px 30px rgba(0,0,0,0.5), 0 0 8px rgba(0,224,255,0.2)"
        : "none";
  });

  window.addEventListener("hashchange", () => {
    showPage(getHashPage(), { updateHash: false, smoothScroll: false });
  });

  startTypingAnimation();
  applyProjectFilter("all");
  showPage(getHashPage(), { updateHash: false, smoothScroll: false });

  window.addEventListener("beforeunload", () => {
    if (typingTimeout) {
      window.clearTimeout(typingTimeout);
    }
    if (toastTimeout) {
      window.clearTimeout(toastTimeout);
    }
  });
})();

