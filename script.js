/**
 * BRAINEATH - SITE VITRINE
 * JavaScript pour animations et interactions
 */

// Utilitaires
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// State Management
const state = {
  currentSection: 'hero',
  theme: 'auto',
  isScrolling: false,
  animations: {
    breathing: null,
    floating: null,
    parallax: null
  }
};

// Configuration
const config = {
  animationDuration: 300,
  scrollThreshold: 100,
  breathingCycle: 4000, // 4 secondes
  floatingSpeed: 6000,
  parallaxFactor: 0.5
};

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeNavigation();
  initializeAnimations();
  initializeIntersectionObserver();
  initializeScrollEffects();
  initializeForms();
  initializeAccessibility();
});

// ===========================
// THEME MANAGEMENT
// ===========================

function initializeTheme() {
  const themeToggle = $('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Charge le thème sauvegardé ou utilise la préférence système
  const savedTheme = localStorage.getItem('braineath-theme');
  if (savedTheme && savedTheme !== 'auto') {
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    state.theme = 'auto';
    updateSystemTheme(prefersDark.matches);
  }

  // Event listeners
  themeToggle?.addEventListener('click', toggleTheme);
  prefersDark.addEventListener('change', (e) => {
    if (state.theme === 'auto') {
      updateSystemTheme(e.matches);
    }
  });
}

function toggleTheme() {
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

  // Feedback haptique (si supporté)
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }

  // Animation du toggle
  animateThemeToggle();
}

function updateSystemTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

function animateThemeToggle() {
  const toggle = $('.theme-toggle');

  if (toggle) {
    // Animation simple et élégante
    toggle.style.transform = 'scale(0.95)';

    setTimeout(() => {
      toggle.style.transform = 'scale(1)';
    }, 150);
  }

  // Feedback haptique
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

// ===========================
// NAVIGATION PILL
// ===========================

function initializeNavigation() {
  const navItems = $$('.nav-item');
  const navSlider = $('#navSlider');

  if (!navSlider || !navItems.length) return;

  // Position initiale du slider
  updateNavSlider(navItems[0], navSlider);

  // Event listeners pour la navigation
  navItems.forEach(item => {
    item.addEventListener('click', (e) => handleNavClick(e, navSlider));
    item.addEventListener('mouseenter', (e) => handleNavHover(e, navSlider));
  });

  // Retour à la position active au mouseleave
  $('.nav-pill')?.addEventListener('mouseleave', () => {
    const activeItem = $('.nav-item.active');
    if (activeItem) updateNavSlider(activeItem, navSlider);
  });
}

function handleNavClick(e, navSlider) {
  e.preventDefault();
  const item = e.currentTarget;
  const targetSection = item.getAttribute('data-section');

  // Met à jour l'état de navigation
  $$('.nav-item').forEach(navItem => navItem.classList.remove('active'));
  item.classList.add('active');
  state.currentSection = targetSection;

  // Animation du slider
  updateNavSlider(item, navSlider);

  // Scroll vers la section
  scrollToSection(targetSection);

  // Feedback haptique
  if ('vibrate' in navigator) {
    navigator.vibrate(15);
  }
}

function handleNavHover(e, navSlider) {
  updateNavSlider(e.currentTarget, navSlider);
}

function updateNavSlider(targetItem, slider) {
  const itemRect = targetItem.getBoundingClientRect();
  const containerRect = targetItem.parentElement.getBoundingClientRect();

  const left = itemRect.left - containerRect.left - 4;
  const width = itemRect.width;

  // Animation fluide Apple-style
  slider.style.transform = `translateX(${left}px)`;
  slider.style.width = `${width}px`;

  // Feedback haptique subtil
  if ('vibrate' in navigator) {
    navigator.vibrate(5);
  }

  // Animation douce des autres items
  const navItems = targetItem.parentElement.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    if (item !== targetItem) {
      item.style.opacity = '0.7';
      setTimeout(() => {
        item.style.opacity = '';
      }, 200);
    }
  });
}

function scrollToSection(sectionId) {
  const section = $(`#${sectionId}`);
  if (section) {
    const headerHeight = 80; // Hauteur du header
    const targetPosition = section.offsetTop - headerHeight;

    smoothScrollTo(targetPosition);
  }
}

function smoothScrollTo(targetPosition) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = Math.min(800, Math.abs(distance) * 0.5);
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function (ease-out)
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startPosition + distance * easeOutProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// ===========================
// ANIMATIONS PRINCIPALES
// ===========================

function initializeAnimations() {
  initializeBreathingAnimation();
  initializeFloatingCards();
  initializeParallaxEffects();
  initializeScrollAnimations();
}

// Animation de respiration dans le Hero
function initializeBreathingAnimation() {
  const breathText = $('.breath-text');
  const breathCircles = $$('.breath-circle');
  const breathCenter = $('.breath-center');

  if (!breathText || !breathCircles.length) return;

  const phases = [
    { text: 'Inspirez', duration: 4000, scale: 1.3, color: 'rgba(0, 122, 255, 0.8)' },
    { text: 'Retenez', duration: 2000, scale: 1.3, color: 'rgba(88, 86, 214, 0.8)' },
    { text: 'Expirez', duration: 6000, scale: 0.7, color: 'rgba(48, 209, 88, 0.8)' },
    { text: 'Retenez', duration: 2000, scale: 0.7, color: 'rgba(255, 149, 0, 0.8)' }
  ];

  let currentPhase = 0;

  function updateBreathingPhase() {
    const phase = phases[currentPhase];

    // Animation de texte avec effet morphing
    if (breathText) {
      breathText.style.transform = 'scale(0.8)';
      breathText.style.opacity = '0';
      setTimeout(() => {
        breathText.textContent = phase.text;
        breathText.style.transform = 'scale(1)';
        breathText.style.opacity = '1';
      }, 300);
    }

    // Animation des cercles avec effet de vague
    breathCircles.forEach((circle, index) => {
      const delay = index * 150;
      const baseScale = phase.scale;
      const circleScale = baseScale + (index * 0.08);
      const rotation = currentPhase * 90 + (index * 30);

      setTimeout(() => {
        circle.style.transform = `scale(${circleScale}) rotate(${rotation}deg)`;
        circle.style.borderColor = phase.color;
        circle.style.opacity = phase.scale > 1 ? (0.6 + index * 0.1) : (0.3 + index * 0.1);
        circle.style.filter = `blur(${phase.scale > 1 ? 0 : 2}px) brightness(${phase.scale > 1 ? 1.2 : 0.8})`;
      }, delay);
    });

    // Animation du centre avec pulsation
    if (breathCenter) {
      breathCenter.style.transform = `scale(${phase.scale * 0.8})`;
      breathCenter.style.boxShadow = `0 0 ${phase.scale * 20}px ${phase.color}, inset 0 1px 1px rgba(255, 255, 255, 0.3)`;
    }

    currentPhase = (currentPhase + 1) % phases.length;
  }

  // Lance l'animation avec timing précis
  state.animations.breathing = setInterval(updateBreathingPhase, 3500);
  updateBreathingPhase();
}

// Animation des cartes flottantes
function initializeFloatingCards() {
  const floatingCards = $$('.floating-card');

  floatingCards.forEach((card, index) => {
    animateFloatingCard(card, index * 1000);
  });
}

function animateFloatingCard(card, delay) {
  setTimeout(() => {
    const randomX = Math.random() * 20 - 10; // -10 à +10px
    const randomY = Math.random() * 15 - 7.5; // -7.5 à +7.5px
    const randomRotation = Math.random() * 4 - 2; // -2° à +2°

    card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;

    setTimeout(() => animateFloatingCard(card, 0), config.floatingSpeed + Math.random() * 2000);
  }, delay);
}

// Effets parallax Triple A Apple-style
function initializeParallaxEffects() {
  const parallaxElements = $$('.gradient-orb, .floating-card, .hero-content, .breathing-animation');
  const heroSection = $('.hero-section');
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    const scrollProgress = Math.min(scrolled / heroHeight, 1);

    // Effet de parallaxe principal
    if (heroSection) {
      heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;

      // Effet de flou progressif
      const blurAmount = scrollProgress * 10;
      heroSection.classList.toggle('parallax-active', scrollProgress > 0.2);
    }

    // Parallaxe multi-couches
    parallaxElements.forEach((element, index) => {
      if (!element) return;

      const speed = [0.2, 0.4, 0.6, 0.8][index % 4];
      const yPos = -(scrolled * speed);
      const rotateAmount = scrolled * 0.02;
      const scaleAmount = 1 - (scrollProgress * 0.1);

      // Transformation complexe avec rotation et scale
      element.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotateAmount}deg) scale(${scaleAmount})`;

      // Effet d'opácité progressif
      if (element.classList.contains('gradient-orb')) {
        element.style.opacity = 0.4 - (scrollProgress * 0.2);
      }
    });

    // Effet de morphing sur l'animation de respiration
    const breathingAnimation = $('.breathing-animation');
    if (breathingAnimation) {
      const morphAmount = scrollProgress * 20;
      breathingAnimation.style.filter = `blur(${morphAmount}px) brightness(${1 + scrollProgress * 0.3})`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Effet de parallaxe au mouvement de la souris (comme sur apple.com)
  initializeMouseParallax();
}

function initializeMouseParallax() {
  const heroSection = $('.hero-section');
  const parallaxElements = $$('.gradient-orb, .breathing-animation');

  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = heroSection;

    const xPercent = (clientX / offsetWidth - 0.5) * 2;
    const yPercent = (clientY / offsetHeight - 0.5) * 2;

    parallaxElements.forEach((element, index) => {
      if (!element) return;

      const intensity = [0.5, 0.3, 0.7, 0.4][index % 4];
      const xMove = xPercent * 20 * intensity;
      const yMove = yPercent * 15 * intensity;

      element.style.transform += ` translate3d(${xMove}px, ${yMove}px, 0)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    parallaxElements.forEach(element => {
      if (element) {
        element.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => {
          element.style.transition = '';
        }, 800);
      }
    });
  });
}

// ===========================
// INTERSECTION OBSERVER
// ===========================

function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        handleSectionIntersection(entry.target);
      }
    });
  }, observerOptions);

  // Observer les sections
  const sections = $$('section[id]');
  sections.forEach(section => observer.observe(section));
}

function handleSectionIntersection(section) {
  const sectionId = section.id;

  // Met à jour la navigation
  updateActiveNavItem(sectionId);

  // Lance les animations de section
  animateSectionElements(section);
}

function updateActiveNavItem(sectionId) {
  const navItems = $$('.nav-item');
  const navSlider = $('#navSlider');

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
      if (navSlider) updateNavSlider(item, navSlider);
    }
  });

  state.currentSection = sectionId;
}

function animateSectionElements(section) {
  const animatableElements = section.querySelectorAll(
    '.feature-card, .phone-mockup, .benefit-item, .floating-card'
  );

  animatableElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// ===========================
// SCROLL EFFECTS
// ===========================

function initializeScrollEffects() {
  let lastScrollY = window.pageYOffset;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll(lastScrollY, window.pageYOffset);
        lastScrollY = window.pageYOffset;
        ticking = false;
      });
      ticking = true;
    }
  });
}

function handleScroll(lastY, currentY) {
  const scrollDirection = currentY > lastY ? 'down' : 'up';
  const scrollPercentage = currentY / (document.body.scrollHeight - window.innerHeight);
  const scrollSpeed = Math.abs(currentY - lastY);

  // Animation du header selon le scroll
  animateHeaderOnScroll(currentY, scrollDirection, scrollSpeed);

  // Animation de l'indicateur de scroll
  updateScrollIndicator(scrollPercentage);

  // Effects de parallax custom
  updateParallaxElements(currentY);

  // Ajout d'effets basés sur la vitesse de scroll
  updateScrollBasedEffects(scrollSpeed, scrollDirection);
}

function animateHeaderOnScroll(scrollY, direction, speed) {
  const header = $('.header-pill');
  const navPill = $('.nav-pill');
  if (!header) return;

  // Effet Apple authentique
  if (scrollY > 80) {
    header.classList.add('scrolled');
    if (navPill) {
      navPill.style.background = 'rgba(255, 255, 255, 0.15)';
      navPill.style.backdropFilter = 'blur(50px)';
      navPill.style.webkitBackdropFilter = 'blur(50px)';
    }
  } else {
    header.classList.remove('scrolled');
    if (navPill) {
      navPill.style.background = 'rgba(255, 255, 255, 0.08)';
      navPill.style.backdropFilter = 'blur(40px)';
      navPill.style.webkitBackdropFilter = 'blur(40px)';
    }
  }

  // Cache intelligemment comme sur les sites Apple
  if (direction === 'down' && speed > 15 && scrollY > 300) {
    header.classList.add('hidden');
  } else if (direction === 'up' || scrollY < 100) {
    header.classList.remove('hidden');
  }
}

function updateScrollIndicator(percentage) {
  const indicator = $('.scroll-indicator');
  if (indicator) {
    indicator.style.opacity = percentage > 0.1 ? '0' : '1';
  }
}

function updateParallaxElements(scrollY) {
  const heroVisual = $('.hero-visual');
  if (heroVisual) {
    const parallaxOffset = scrollY * 0.3;
    heroVisual.style.transform = `translateY(${parallaxOffset}px)`;
  }
}

// ===========================
// ANIMATIONS SCROLL
// ===========================

function initializeScrollAnimations() {
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Éléments à animer au scroll
  const elementsToAnimate = $$(`
    .feature-card,
    .phone-mockup,
    .benefit-item,
    .hero-content > *
  `);

  elementsToAnimate.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    animationObserver.observe(element);
  });
}

// Ajoute la classe CSS pour l'animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(styleSheet);

// ===========================
// FORMS & INTERACTIONS
// ===========================

function initializeForms() {
  const newsletterForm = $('.form-container');
  const emailInput = $('.email-input');
  const submitBtn = $('.submit-btn');

  if (!newsletterForm || !emailInput || !submitBtn) return;

  // Validation en temps réel
  emailInput.addEventListener('input', () => {
    const isValid = validateEmail(emailInput.value);
    updateSubmitButton(isValid, submitBtn);
  });

  // Soumission du formulaire
  submitBtn.addEventListener('click', handleNewsletterSubmit);
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleNewsletterSubmit(e);
  });
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function updateSubmitButton(isValid, button) {
  if (isValid) {
    button.disabled = false;
    button.style.opacity = '1';
    button.style.transform = 'scale(1)';
  } else {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.transform = 'scale(0.98)';
  }
}

function handleNewsletterSubmit(e) {
  e.preventDefault();

  const emailInput = $('.email-input');
  const submitBtn = $('.submit-btn');

  if (!validateEmail(emailInput.value)) {
    showFeedback('Veuillez entrer une adresse email valide', 'error');
    return;
  }

  // Animation de chargement
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Inscription...</span>';
  submitBtn.disabled = true;

  // Simulation d'envoi (remplacer par vraie logique)
  setTimeout(() => {
    submitBtn.innerHTML = '<span>✓ Inscrit</span>';
    emailInput.value = '';
    showFeedback('Merci ! Vous êtes inscrit à notre newsletter.', 'success');

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }, 1500);
}

function showFeedback(message, type) {
  // Crée un élément de feedback
  const feedback = document.createElement('div');
  feedback.className = `feedback feedback-${type}`;
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: ${type === 'success' ? 'var(--primary-green)' : 'var(--primary-red)'};
    color: white;
    padding: 12px 24px;
    border-radius: 24px;
    font-weight: 500;
    box-shadow: var(--shadow-large);
    z-index: 10000;
    opacity: 0;
    transition: all 0.3s ease;
  `;

  document.body.appendChild(feedback);

  // Animation d'entrée
  requestAnimationFrame(() => {
    feedback.style.opacity = '1';
    feedback.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Suppression automatique
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
}

// ===========================
// ACCESSIBILITÉ
// ===========================

function initializeAccessibility() {
  // Gestion du focus clavier
  initializeKeyboardNavigation();

  // Support des préférences utilisateur
  handleMotionPreferences();

  // ARIA labels dynamiques
  updateAriaLabels();
}

function initializeKeyboardNavigation() {
  const focusableElements = $$(`
    a[href], button:not([disabled]), input:not([disabled]),
    select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])
  `);

  focusableElements.forEach(element => {
    element.addEventListener('keydown', handleKeyboardNavigation);
  });

  // Navigation avec les flèches dans le menu
  const navItems = $$('.nav-item');
  navItems.forEach((item, index) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextIndex = e.key === 'ArrowRight'
          ? (index + 1) % navItems.length
          : (index - 1 + navItems.length) % navItems.length;
        navItems[nextIndex].focus();
      }
    });
  });
}

function handleKeyboardNavigation(e) {
  // Activation avec Entrée ou Espace
  if (e.key === 'Enter' || e.key === ' ') {
    if (e.target.tagName === 'BUTTON' && !e.target.disabled) {
      e.target.click();
    }
  }

  // Échap pour fermer les modales (si implémentées plus tard)
  if (e.key === 'Escape') {
    const activeModal = $('.modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
    }
  }
}

function handleMotionPreferences() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    // Arrête les animations en boucle
    clearInterval(state.animations.breathing);

    // Réduit les durées d'animation
    document.documentElement.style.setProperty('--transition-fast', '0.1s');
    document.documentElement.style.setProperty('--transition-medium', '0.2s');
    document.documentElement.style.setProperty('--transition-slow', '0.3s');
  }
}

function updateAriaLabels() {
  // Met à jour les labels selon l'état actuel
  const themeToggle = $('.theme-toggle');
  if (themeToggle) {
    const currentTheme = state.theme === 'auto' ? 'automatique' : state.theme === 'dark' ? 'sombre' : 'clair';
    themeToggle.setAttribute('aria-label', `Thème actuel: ${currentTheme}. Cliquer pour changer.`);
  }

  const navItems = $$('.nav-item');
  navItems.forEach(item => {
    const isActive = item.classList.contains('active');
    const sectionName = item.textContent;
    item.setAttribute('aria-label', `${sectionName}${isActive ? ' (section actuelle)' : ''}`);
  });
}

// ===========================
// UTILITAIRES DE PERFORMANCE
// ===========================

// Debounce function pour optimiser les events
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function pour le scroll
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// ===========================
// CLEANUP ET ERROR HANDLING
// ===========================

// Nettoyage des ressources
window.addEventListener('beforeunload', () => {
  // Arrête les animations
  Object.values(state.animations).forEach(animation => {
    if (animation) clearInterval(animation);
  });

  // Supprime les event listeners
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
  console.warn('Erreur Braineath:', e.error);
  // En production, envoyer à un service de monitoring
});

// Nouvelle fonction pour les effets basés sur la vitesse de scroll
function updateScrollBasedEffects(speed, direction) {
  const navPill = $('.nav-pill');

  if (navPill && speed > 15) {
    // Effet de tremblement léger lors de scroll rapide
    navPill.style.transform = `translateY(${Math.sin(Date.now() * 0.01) * (speed * 0.1)}px)`;

    setTimeout(() => {
      navPill.style.transform = '';
    }, 200);
  }
}

// Gestion responsive améliorée
const handleResize = debounce(() => {
  // Recalcule les positions de navigation
  const activeItem = $('.nav-item.active');
  const navSlider = $('#navSlider');
  if (activeItem && navSlider) {
    updateNavSlider(activeItem, navSlider);
  }

  // Remet à jour les animations si nécessaire
  if (window.innerWidth <= 768) {
    // Mode mobile
    document.body.classList.add('mobile-mode');
    // Réduit les effets sur mobile pour les performances
    document.documentElement.style.setProperty('--glass-backdrop', 'blur(10px)');
  } else {
    document.body.classList.remove('mobile-mode');
    document.documentElement.style.setProperty('--glass-backdrop', 'blur(20px)');
  }
}, 250);

window.addEventListener('resize', handleResize);

// ===========================
// API PUBLIQUE (si nécessaire)
// ===========================

// Expose certaines fonctions pour usage externe
window.BraineathSite = {
  scrollToSection,
  toggleTheme,
  getCurrentSection: () => state.currentSection,
  updateTheme: (theme) => {
    state.theme = theme;
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateSystemTheme(prefersDark);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
};

// Initialise les nouveaux effets après le chargement
document.addEventListener('DOMContentLoaded', () => {
  // Ajoute des particules flottantes pour l'ambiance
  createFloatingParticles();

  // Initialise les micro-interactions
  initializeMicroInteractions();

  // Initialise le slider de fonctionnalités
  initializeFeatureSlider();

  // Initialise les effets Apple avancés
  initializeAppleEffects();
});

// Crée des particules flottantes subtiles
function createFloatingParticles() {
  const particleCount = window.innerWidth > 768 ? 15 : 8;
  const container = document.body;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, rgba(0, 122, 255, 0.3), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: floatParticle ${10 + Math.random() * 20}s ease-in-out infinite;
      animation-delay: ${Math.random() * 10}s;
    `;

    container.appendChild(particle);
  }

  // CSS pour l'animation des particules
  if (!$('#particleStyles')) {
    const particleStyles = document.createElement('style');
    particleStyles.id = 'particleStyles';
    particleStyles.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(20px, -30px) scale(1.2); opacity: 0.6; }
        50% { transform: translate(-15px, -60px) scale(0.8); opacity: 0.4; }
        75% { transform: translate(25px, -30px) scale(1.1); opacity: 0.5; }
      }

      @media (prefers-reduced-motion: reduce) {
        .floating-particle { display: none; }
      }
    `;
    document.head.appendChild(particleStyles);
  }
}

// Micro-interactions avancées
function initializeMicroInteractions() {
  // Effet de vague sur les boutons
  const buttons = $$('button, .cta-primary, .cta-secondary');

  buttons.forEach(button => {
    button.addEventListener('click', createRippleEffect);
  });

  // Effet de survol amélioré sur les cartes
  const cards = $$('.feature-card, .floating-card, .phone-mockup');

  cards.forEach(card => {
    card.addEventListener('mouseenter', enhancedHoverEffect);
    card.addEventListener('mouseleave', resetHoverEffect);
  });
}

function createRippleEffect(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    z-index: 1;
  `;

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);

  if (!$('#rippleStyles')) {
    const rippleStyles = document.createElement('style');
    rippleStyles.id = 'rippleStyles';
    rippleStyles.textContent = `
      @keyframes ripple {
        to { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(rippleStyles);
  }
}

function enhancedHoverEffect(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Effet de suivi de la souris
  card.style.transform = `
    perspective(1000px)
    rotateX(${(y - rect.height / 2) / 10}deg)
    rotateY(${(x - rect.width / 2) / 10}deg)
    translateZ(10px)
  `;
}

function resetHoverEffect(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
}

// ===========================
// FEATURE SLIDER INTERACTIF
// ===========================

let currentSlide = 0;
let slideInterval;

function initializeFeatureSlider() {
  const sliderTrack = $('#featureSliderTrack');
  const slides = $$('.slide');
  const prevBtn = $('#prevSlide');
  const nextBtn = $('#nextSlide');
  const dotsContainer = $('#sliderDots');

  if (!sliderTrack || !slides.length) return;

  // Crée les dots de navigation
  createSliderDots(slides.length, dotsContainer);

  // Event listeners pour les contrôles
  prevBtn?.addEventListener('click', () => {
    changeSlide(currentSlide - 1);
    resetAutoSlide();
  });

  nextBtn?.addEventListener('click', () => {
    changeSlide(currentSlide + 1);
    resetAutoSlide();
  });

  // Navigation par les dots
  const dots = $$('.slider-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      changeSlide(index);
      resetAutoSlide();
    });
  });

  // Auto-slide toutes les 4 secondes
  startAutoSlide();

  // Pause auto-slide au survol
  const sliderContainer = $('.feature-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Support des touches clavier
  document.addEventListener('keydown', handleSliderKeyboard);
}

function createSliderDots(count, container) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.setAttribute('data-slide', i);
    container.appendChild(dot);
  }
}

function changeSlide(newIndex) {
  const slides = $$('.slide');
  const dots = $$('.slider-dot');
  const sliderTrack = $('#featureSliderTrack');

  if (!slides.length) return;

  // Gestion du bouclage
  if (newIndex >= slides.length) newIndex = 0;
  if (newIndex < 0) newIndex = slides.length - 1;

  currentSlide = newIndex;

  // Animation du slider
  if (sliderTrack) {
    const translateX = -currentSlide * 25; // 25% par slide
    sliderTrack.style.transform = `translateX(${translateX}%)`;

    // Effet de tremblement léger
    sliderTrack.style.filter = 'blur(1px)';
    setTimeout(() => {
      sliderTrack.style.filter = 'blur(0px)';
    }, 300);
  }

  // Met à jour les classes actives
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });

  // Feedback haptique
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }

  // Animation particulière pour l'icône active
  const activeSlide = slides[currentSlide];
  if (activeSlide) {
    const icon = activeSlide.querySelector('.slide-icon');
    if (icon) {
      icon.style.transform = 'scale(0.8) rotate(-10deg)';
      setTimeout(() => {
        icon.style.transform = 'scale(1.1) rotate(0deg)';
      }, 200);
    }
  }
}

function startAutoSlide() {
  stopAutoSlide();
  slideInterval = setInterval(() => {
    changeSlide(currentSlide + 1);
  }, 4000);
}

function stopAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function resetAutoSlide() {
  stopAutoSlide();
  setTimeout(startAutoSlide, 2000); // Redémarre après 2s
}

function handleSliderKeyboard(e) {
  const sliderContainer = $('.feature-slider-container');
  if (!sliderContainer) return;

  // Vérifie si l'utilisateur interact avec le slider
  const isSliderFocused = sliderContainer.contains(document.activeElement) ||
                         sliderContainer === document.activeElement;

  if (isSliderFocused) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        changeSlide(currentSlide - 1);
        resetAutoSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        changeSlide(currentSlide + 1);
        resetAutoSlide();
        break;
      case ' ': // Espace pour pause/play
        e.preventDefault();
        if (slideInterval) {
          stopAutoSlide();
        } else {
          startAutoSlide();
        }
        break;
    }
  }
}

// Initialise les effets Apple-like avancés
function initializeAppleEffects() {
  // Effet de reveal au scroll (comme sur apple.com)
  initializeScrollReveal();

  // Magnetic hover effects sur les boutons
  initializeMagneticEffects();

  // Loading sequence Apple-like
  initializeLoadingSequence();
}

function initializeScrollReveal() {
  const revealElements = $$('.feature-card, .phone-mockup, .benefit-item, .section-title');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Effet en cascade pour les éléments similaires
        const siblings = entry.target.parentElement?.children;
        if (siblings) {
          Array.from(siblings).forEach((sibling, index) => {
            if (sibling !== entry.target && sibling.classList.contains(entry.target.classList[0])) {
              setTimeout(() => {
                sibling.classList.add('revealed');
              }, index * 100);
            }
          });
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(element => {
    element.classList.add('reveal-element');
    revealObserver.observe(element);
  });
}

function initializeMagneticEffects() {
  const magneticElements = $$('.cta-primary, .cta-secondary, .theme-toggle');

  magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });
}

function initializeLoadingSequence() {
  // Séquence de chargement Apple-like
  const elements = $$('.hero-content > *, .breathing-animation, .nav-pill');

  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';

    setTimeout(() => {
      element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 200 + index * 100);
  });
}

// Styles CSS pour les effets reveal
const revealStyles = document.createElement('style');
revealStyles.textContent = `
  .reveal-element {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .reveal-element.revealed {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .cta-primary, .cta-secondary, .theme-toggle {
    transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;
document.head.appendChild(revealStyles);

// Lance tous les effets Apple
initializeAppleEffects();

console.log('🍎 Braineath site loaded with Triple A Apple effects!');