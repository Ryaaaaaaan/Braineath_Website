// ===========================
// BRAINEATH - SCRIPT RESEND STYLE
// Minimal, efficient, modern
// ===========================

// Utilitaires
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// State global
const state = {
  theme: 'auto'
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeScrollEffects();
  initializeAnimations();
  initializeNavSelector();
  console.log('🧘 Braineath loaded - Resend style');
});

// ===========================
// THEME MANAGEMENT - Style Resend
// ===========================

function initializeTheme() {
  const themeToggle = $('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Récupérer le thème sauvegardé
  const savedTheme = localStorage.getItem('braineath-theme');
  if (savedTheme && savedTheme !== 'auto') {
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    state.theme = 'auto';
    updateSystemTheme(prefersDark.matches);
  }

  updateThemeEmoji();

  // Event listeners
  themeToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    toggleTheme(e);
  });

  prefersDark.addEventListener('change', (e) => {
    if (state.theme === 'auto') {
      updateSystemTheme(e.matches);
      updateThemeEmoji();
    }
  });
}

function toggleTheme(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const themes = ['light', 'dark', 'auto'];
  const currentIndex = themes.indexOf(state.theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  state.theme = nextTheme;
  localStorage.setItem('braineath-theme', nextTheme);

  if (nextTheme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateSystemTheme(prefersDark);
  } else {
    document.documentElement.setAttribute('data-theme', nextTheme);
  }

  updateThemeEmoji();
  animateThemeToggle();
}

function updateSystemTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function updateThemeEmoji() {
  const emoji = $('.theme-emoji');
  if (emoji) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    emoji.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
  }
}

function animateThemeToggle() {
  const toggle = $('.theme-toggle');
  const emoji = $('.theme-emoji');

  if (toggle) {
    toggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
      toggle.style.transform = 'scale(1)';
    }, 150);
  }

  if (emoji) {
    emoji.style.transform = 'rotate(180deg) scale(1.1)';
    setTimeout(() => {
      emoji.style.transform = 'rotate(0deg) scale(1)';
    }, 300);
  }
}

// ===========================
// SCROLL EFFECTS - Minimal
// ===========================

function initializeScrollEffects() {
  const floatingHeader = $('.floating-header');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    // Header scroll effect
    if (floatingHeader) {
      if (currentScrollY > 100) {
        floatingHeader.classList.add('scrolled');
      } else {
        floatingHeader.classList.remove('scrolled');
      }
    }

    lastScrollY = currentScrollY;
  });
}

// ===========================
// ANIMATIONS - Style Resend
// ===========================

function initializeAnimations() {
  // Intersection Observer pour les animations d'entrée
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) rotate(0deg)';
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    // Observer les cartes de features avec effets plus dynamiques
    const featureCards = $$('.feature-card');
    featureCards.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = `translateY(50px) rotate(${(index % 2 === 0 ? 2 : -2)}deg)`;
      element.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
      observer.observe(element);
    });

    // Observer les autres éléments
    const otherElements = $$('.floating-stat, .benefit-card, .screenshot-card');
    otherElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `all 0.6s ease ${index * 0.1}s`;
      observer.observe(element);
    });
  }

  // Animation du code demo
  animateCodeDemo();

  // Animation des floating stats
  animateFloatingStats();

  // Animation de pulsation pour les cartes features
  animateFeaturesPulse();
}

function animateCodeDemo() {
  const codeLines = $$('.code-line');

  codeLines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-20px)';

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
      line.style.transition = 'all 0.4s ease';
    }, 1000 + index * 200);
  });
}

function animateFloatingStats() {
  const stats = $$('.floating-stat');

  stats.forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(50px) scale(0.8)';

    setTimeout(() => {
      stat.style.opacity = '1';
      stat.style.transform = 'translateY(0) scale(1)';
      stat.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 1500 + index * 300);
  });
}

// ===========================
// SMOOTH SCROLLING
// ===========================

// Smooth scroll pour les liens d'ancrage
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// ===========================
// ADAPTIVE ICONS
// ===========================

// Gestion des icônes adaptatives au thème
function updateAdaptiveIcons() {
  const icons = $$('.theme-adaptive-icon');
  const screenshots = $$('.theme-adaptive-screenshot');
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  icons.forEach(icon => {
    const lightSrc = icon.getAttribute('data-light');
    const darkSrc = icon.getAttribute('data-dark');

    if (lightSrc && darkSrc) {
      icon.src = currentTheme === 'dark' ? darkSrc : lightSrc;
    }
  });

  screenshots.forEach(screenshot => {
    const lightSrc = screenshot.getAttribute('data-light');
    const darkSrc = screenshot.getAttribute('data-dark');

    if (lightSrc && darkSrc) {
      screenshot.src = currentTheme === 'dark' ? darkSrc : lightSrc;
    }
  });
}

// Observer les changements de thème
const themeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
      updateAdaptiveIcons();
    }
  });
});

themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});

// Initialiser les icônes
updateAdaptiveIcons();

// ===========================
// NAVIGATION SELECTOR
// ===========================

function initializeNavSelector() {
  const navLinks = $$('.nav-link');
  const selector = $('.nav-selector');

  if (!selector || navLinks.length === 0) return;

  // Fonction pour mettre à jour le sélecteur
  function updateSelector(activeLink) {
    if (!activeLink) return;

    const rect = activeLink.getBoundingClientRect();
    const pillRect = activeLink.parentElement.getBoundingClientRect();

    selector.style.width = `${rect.width}px`;
    selector.style.transform = `translateX(${rect.left - pillRect.left - 8}px)`;
    selector.classList.add('active');

    // Mettre à jour les classes active
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  // Observer les sections pour mettre à jour automatiquement
  const sections = ['features', 'screenshots', 'contact'];
  const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);

  if (sectionElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const activeLink = $(`.nav-link[data-section="${entry.target.id}"]`);
          if (activeLink) {
            updateSelector(activeLink);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-20% 0px -20% 0px'
    });

    sectionElements.forEach(section => observer.observe(section));
  }

  // Gestion des clics
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      updateSelector(link);
    });

    link.addEventListener('mouseenter', () => {
      if (!link.classList.contains('active')) {
        const rect = link.getBoundingClientRect();
        const pillRect = link.parentElement.getBoundingClientRect();

        selector.style.opacity = '0.5';
        selector.style.width = `${rect.width}px`;
        selector.style.transform = `translateX(${rect.left - pillRect.left - 8}px)`;
      }
    });
  });

  // Restaurer l'état normal au survol de la pill
  $('.nav-pill')?.addEventListener('mouseleave', () => {
    const activeLink = $('.nav-link.active');
    if (activeLink) {
      selector.style.opacity = '1';
      updateSelector(activeLink);
    } else {
      selector.style.opacity = '0';
    }
  });

  // Initialiser avec le premier lien
  if (navLinks[0]) {
    setTimeout(() => updateSelector(navLinks[0]), 100);
  }
}

// ===========================
// ANIMATIONS FEATURES DYNAMIQUES
// ===========================

function animateFeaturesPulse() {
  const featureCards = $$('.feature-card');

  // Animation de pulsation subtile en boucle
  featureCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = `featurePulse 4s ease-in-out infinite ${index * 0.5}s`;
    }, 2000 + index * 200);
  });
}

// Ajouter les keyframes CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
  @keyframes featurePulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(139, 95, 191, 0);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(139, 95, 191, 0.1);
    }
  }

  .animate-in {
    animation: bounceIn 0.6s ease-out forwards;
  }

  @keyframes bounceIn {
    0% {
      transform: translateY(50px) scale(0.9);
      opacity: 0;
    }
    60% {
      transform: translateY(-10px) scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);