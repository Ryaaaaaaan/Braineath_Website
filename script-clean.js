/**
 * BRAINEATH - SITE VITRINE
 * JavaScript Clean et Optimisé
 */

// Utilitaires
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// State Management Simple
const state = {
  currentSection: 'hero',
  theme: 'auto',
  animations: {
    breathing: null,
  }
};

// ===========================
// INITIALISATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeNavigation();
  initializeBreathingAnimation();
  initializeScrollEffects();
  initializeForms();
  initializeFeatureSlider();
  initializeSpectacularAnimations();
});

// ===========================
// THEME MANAGEMENT
// ===========================

function initializeTheme() {
  const themeToggle = $('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const savedTheme = localStorage.getItem('braineath-theme');
  if (savedTheme && savedTheme !== 'auto') {
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    state.theme = 'auto';
    updateSystemTheme(prefersDark.matches);
  }

  // Initialiser l'emoji correct
  updateThemeEmoji();

  themeToggle?.addEventListener('click', toggleTheme);
  prefersDark.addEventListener('change', (e) => {
    if (state.theme === 'auto') {
      updateSystemTheme(e.matches);
      updateThemeEmoji();
    }
  });
}

function updateThemeEmoji() {
  const emoji = $('.theme-emoji');
  if (emoji) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    emoji.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
  }
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

  animateThemeToggle();
}

function updateSystemTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
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

  // Changer l'emoji selon le thème
  if (emoji) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    if (currentTheme === 'dark') {
      emoji.textContent = '🌙';
    } else {
      emoji.textContent = '☀️';
    }

    // Animation de rotation de l'emoji
    emoji.style.transform = 'rotate(180deg) scale(1.1)';
    setTimeout(() => {
      emoji.style.transform = 'rotate(0deg) scale(1)';
    }, 300);
  }

  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

// ===========================
// NAVIGATION
// ===========================

function initializeNavigation() {
  const navItems = $$('.nav-item');
  const navSlider = $('#navSlider');

  if (!navSlider || !navItems.length) return;

  updateNavSlider(navItems[0], navSlider);

  navItems.forEach(item => {
    item.addEventListener('click', (e) => handleNavClick(e, navSlider));
  });
}

function handleNavClick(e, navSlider) {
  e.preventDefault();
  const item = e.currentTarget;
  const targetSection = item.getAttribute('data-section');

  $$('.nav-item').forEach(navItem => navItem.classList.remove('active'));
  item.classList.add('active');
  state.currentSection = targetSection;

  updateNavSlider(item, navSlider);
  scrollToSection(targetSection);

  if ('vibrate' in navigator) {
    navigator.vibrate(5);
  }
}

function updateNavSlider(targetItem, slider) {
  const itemRect = targetItem.getBoundingClientRect();
  const containerRect = targetItem.parentElement.getBoundingClientRect();

  const left = itemRect.left - containerRect.left - 4;
  const width = itemRect.width;

  slider.style.transform = `translateX(${left}px)`;
  slider.style.width = `${width}px`;
}

function scrollToSection(sectionId) {
  const section = $(`#${sectionId}`);
  if (section) {
    const headerHeight = 100;
    const targetPosition = section.offsetTop - headerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ===========================
// ANIMATION DE RESPIRATION
// ===========================

function initializeBreathingAnimation() {
  const breathText = $('.breath-text');
  const breathCircles = $$('.breath-circle');

  if (!breathText || !breathCircles.length) return;

  const phases = [
    { text: 'Inspirez', scale: 1.2, color: '#007AFF', duration: 3000 },
    { text: 'Expirez', scale: 0.8, color: '#30D158', duration: 3000 }
  ];

  let currentPhase = 0;

  function updateBreathingPhase() {
    const phase = phases[currentPhase];

    // Animation du texte
    if (breathText) {
      breathText.textContent = phase.text;
      breathText.style.color = phase.color;
    }

    // Animation des cercles
    breathCircles.forEach((circle, index) => {
      const delay = index * 100;
      setTimeout(() => {
        circle.style.transform = `scale(${phase.scale})`;
        circle.style.borderColor = phase.color;
        circle.style.opacity = phase.scale > 1 ? '0.7' : '0.4';
      }, delay);
    });

    currentPhase = (currentPhase + 1) % phases.length;
  }

  state.animations.breathing = setInterval(updateBreathingPhase, 4000);
  updateBreathingPhase();
}

// ===========================
// EFFETS DE SCROLL
// ===========================

function initializeScrollEffects() {
  const header = $('.header-pill');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    // Animation simple du header
    if (header) {
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Cache/montre le header selon la direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    }

    lastScrollY = currentScrollY;
  });
}

// ===========================
// SLIDER FONCTIONNALITÉS
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

  createSliderDots(slides.length, dotsContainer);

  prevBtn?.addEventListener('click', () => changeSlide(currentSlide - 1));
  nextBtn?.addEventListener('click', () => changeSlide(currentSlide + 1));

  const dots = $$('.slider-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => changeSlide(index));
  });

  startAutoSlide();
}

function createSliderDots(count, container) {
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    container.appendChild(dot);
  }
}

function changeSlide(newIndex) {
  const slides = $$('.slide');
  const dots = $$('.slider-dot');
  const sliderTrack = $('#featureSliderTrack');

  if (!slides.length) return;

  if (newIndex >= slides.length) newIndex = 0;
  if (newIndex < 0) newIndex = slides.length - 1;

  currentSlide = newIndex;

  if (sliderTrack) {
    const translateX = -currentSlide * 25;
    sliderTrack.style.transform = `translateX(${translateX}%)`;
  }

  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    changeSlide(currentSlide + 1);
  }, 5000);
}

// ===========================
// ANIMATIONS BIEN-ÊTRE SPECTACULAIRES
// ===========================

function initializeSpectacularAnimations() {
  initializeWellnessFloating();
  initializeCalmHovers();
  initializeBreathingParticles();
  initializeSoftScrollEffects();
  initializeZenTransitions();
}

function initializeWellnessFloating() {
  // Orbes flottants bien-être
  const heroSection = $('#hero');
  if (!heroSection) return;

  // Créer des orbes zen flottants
  for (let i = 0; i < 6; i++) {
    const orb = document.createElement('div');
    orb.className = 'wellness-orb';
    orb.style.cssText = `
      position: absolute;
      width: ${60 + Math.random() * 40}px;
      height: ${60 + Math.random() * 40}px;
      background: radial-gradient(circle, rgba(167, 148, 249, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: wellnessFloat ${8 + Math.random() * 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      pointer-events: none;
      z-index: -1;
    `;
    heroSection.appendChild(orb);
  }
}

function initializeCalmHovers() {
  // Effets hover doux pour les cartes
  const featureCards = $$('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 40px rgba(167, 148, 249, 0.15)';
      card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
    });
  });

  // Effets hover pour les mockups
  const mockups = $$('.phone-mockup');
  mockups.forEach(mockup => {
    mockup.addEventListener('mouseenter', () => {
      mockup.style.transform = mockup.style.transform.replace('scale(0.9)', 'scale(0.95)') || 'scale(1.02)';
      mockup.style.filter = 'brightness(1.05) saturate(1.1)';
    });

    mockup.addEventListener('mouseleave', () => {
      mockup.style.transform = mockup.style.transform.replace('scale(0.95)', 'scale(0.9)') || 'scale(1)';
      mockup.style.filter = 'brightness(1) saturate(1)';
    });
  });
}

function initializeBreathingParticles() {
  // Particules inspirées par la respiration
  const heroSection = $('#hero');
  if (!heroSection) return;

  const particleCount = 12;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'breathing-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: linear-gradient(135deg, #A594F9 0%, #6C95E8 100%);
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: breathingFloat ${12 + Math.random() * 6}s linear infinite;
      animation-delay: ${Math.random() * 3}s;
      pointer-events: none;
      opacity: 0.6;
      filter: blur(0.5px);
      z-index: -1;
    `;
    heroSection.appendChild(particle);
  }
}

function initializeSoftScrollEffects() {
  // Effet de défilement en douceur avec intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'all 1.2s cubic-bezier(0.23, 1, 0.320, 1)';
      }
    });
  }, observerOptions);

  // Observer les éléments pour animation d'entrée
  const elementsToAnimate = $$('.feature-card, .phone-mockup, .section-title, .section-subtitle');
  elementsToAnimate.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    observer.observe(element);
  });
}

function initializeZenTransitions() {
  // Transitions zen pour les boutons
  const buttons = $$('.cta-primary, .cta-secondary');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px) scale(1.02)';
      button.style.boxShadow = '0 15px 30px rgba(167, 148, 249, 0.25)';
      button.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0) scale(1)';
      button.style.boxShadow = '0 8px 25px rgba(0, 122, 255, 0.3)';
    });
  });

  // Animation d'entrée douce pour le hero content
  const heroContent = $('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(40px)';

    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
      heroContent.style.transition = 'all 1.5s cubic-bezier(0.23, 1, 0.320, 1)';
    }, 300);
  }
}

// ===========================
// FORMS
// ===========================

function initializeForms() {
  const emailInput = $('.email-input');
  const submitBtn = $('.submit-btn');

  if (!emailInput || !submitBtn) return;

  emailInput.addEventListener('input', () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    submitBtn.disabled = !isValid;
    submitBtn.style.opacity = isValid ? '1' : '0.6';
  });

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      showFeedback('Veuillez entrer une adresse email valide', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading-spinner"></div>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '✓ Inscrit';
      emailInput.value = '';
      showFeedback('Merci ! Vous êtes inscrit.', 'success');

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }, 1500);
  });
}

function showFeedback(message, type) {
  const feedback = document.createElement('div');
  feedback.className = `feedback feedback-${type}`;
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#30D158' : '#FF3B30'};
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    opacity: 0;
    transition: all 0.3s ease;
  `;

  document.body.appendChild(feedback);

  requestAnimationFrame(() => {
    feedback.style.opacity = '1';
    feedback.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    feedback.style.opacity = '0';
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
}

console.log('🎉 Braineath site loaded - Clean & Spectacular!');