/**
 * ============================================================
 * Fernando José de Oliveira | Sociedade de Advogados
 * Script principal — Vanilla JS (ES6+)
 * ============================================================
 *
 * Índice:
 *  1.  Utilitários (debounce, throttle via rAF)
 *  2.  Efeito de scroll na Navbar
 *  3.  Navegação mobile (toggle)
 *  4.  Rolagem suave (smooth scroll)
 *  5.  Destaque da navegação ativa
 *  6.  Animações de revelação (scroll reveal)
 *  7.  Animação de contadores
 *  8.  Efeito de digitação (typing)
 *  9.  Efeito parallax
 * 10.  Formulário de contato
 * 11.  Animação do timeline
 * 12.  Lazy loading de imagens
 * 13.  Atualização automática do ano
 * 14.  Botão do WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // 1. UTILITÁRIOS
  // ============================================================

  /**
   * Debounce — atrasa a execução até que o evento pare
   * por pelo menos `delay` milissegundos.
   */
  function debounce(fn, delay = 100) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Throttle via requestAnimationFrame — limita a execução
   * a no máximo uma vez por frame de renderização.
   */
  function rafThrottle(fn) {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
      }
    };
  }

  // ============================================================
  // 2. EFEITO DE SCROLL NA NAVBAR
  // ============================================================

  const navbar = document.querySelector('.navbar');
  const SCROLL_THRESHOLD = 80;

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Listener passivo para melhor desempenho
  window.addEventListener('scroll', rafThrottle(handleNavbarScroll), { passive: true });
  // Estado inicial
  handleNavbarScroll();

  // ============================================================
  // 3. NAVEGAÇÃO MOBILE (TOGGLE)
  // ============================================================

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  function openMobileMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.add('active');
    navLinks.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  function toggleMobileMenu() {
    if (!navToggle) return;
    navToggle.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Fechar menu ao clicar em um link de navegação
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMobileMenu());
    });
  }

  // Fechar menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (
      navLinks &&
      navLinks.classList.contains('active') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Fechar menu com tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ============================================================
  // 4. ROLAGEM SUAVE (SMOOTH SCROLL)
  // ============================================================

  const NAVBAR_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      // Ignorar links vazios ou "#"
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  // ============================================================
  // 5. DESTAQUE DA NAVEGAÇÃO ATIVA
  // ============================================================

  const sections    = document.querySelectorAll('section[id]');
  const navLinkList = document.querySelectorAll('.nav-links a[href^="#"]');

  /**
   * Atualiza a classe .active no link de navegação
   * correspondente à seção atualmente visível.
   */
  function updateActiveNavLink() {
    const scrollPos = window.scrollY + NAVBAR_OFFSET + 60; // margem extra

    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinkList.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', rafThrottle(updateActiveNavLink), { passive: true });
  // Estado inicial
  updateActiveNavLink();

  // ============================================================
  // 6. ANIMAÇÕES DE REVELAÇÃO (SCROLL REVEAL)
  // ============================================================

  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            // Verificar classes de atraso (.reveal-delay-1 a .reveal-delay-5)
            let delay = 0;
            for (let i = 1; i <= 5; i++) {
              if (el.classList.contains(`reveal-delay-${i}`)) {
                delay = i * 200; // 200ms de incremento
                break;
              }
            }

            // Aplicar com o atraso calculado
            if (delay > 0) {
              setTimeout(() => el.classList.add('active'), delay);
            } else {
              el.classList.add('active');
            }

            // Deixar de observar — animação ocorre apenas uma vez
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ============================================================
  // 7. ANIMAÇÃO DE CONTADORES
  // ============================================================

  const statNumbers   = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  /**
   * Easing: easeOutQuart — desaceleração suave no final.
   * t varia de 0 a 1.
   */
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * Anima um único contador de 0 até `target` ao longo de `duration` ms.
   */
  function animateCounter(el, target, duration = 2000) {
    const start = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutQuart(progress) * target);

      el.textContent = value + '+';

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + '+';
      }
    }

    requestAnimationFrame(step);
  }

  // Observador para iniciar contadores quando a seção entra na viewport
  const statsSection = document.querySelector('.about-stats');

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;

            statNumbers.forEach((el) => {
              const target = parseInt(el.getAttribute('data-target'), 10);
              if (!isNaN(target)) {
                animateCounter(el, target);
              }
            });

            // Animação dispara apenas uma vez
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    statsObserver.observe(statsSection);
  }

  // ============================================================
  // 8. EFEITO DE DIGITAÇÃO (TYPING)
  // ============================================================

  const typingElement = document.querySelector('.typing-text');

  if (typingElement) {
    const typingStrings = [
      'Direito Trabalhista',
      'Direito de Família',
      'Inventário e Partilha',
      'Testamentos',
      'Regularização de Imóveis',
    ];

    const TYPING_SPEED  = 80;   // ms por caractere ao digitar
    const DELETING_SPEED = 40;  // ms por caractere ao apagar
    const PAUSE_AFTER_TYPE  = 2000; // ms de pausa após concluir a digitação
    const PAUSE_AFTER_DELETE = 500; // ms de pausa após apagar tudo

    let stringIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;

    /**
     * Controla o efeito de cursor piscante adicionando/removendo
     * a classe .typing no elemento pai.
     */
    function setCursorTyping(typing) {
      if (typing) {
        typingElement.classList.add('typing');
      } else {
        typingElement.classList.remove('typing');
      }
    }

    function typeStep() {
      const currentString = typingStrings[stringIndex];

      if (isDeleting) {
        // Apagando caractere por caractere
        setCursorTyping(true);
        charIndex--;
        typingElement.textContent = currentString.substring(0, charIndex);

        if (charIndex <= 0) {
          isDeleting = false;
          stringIndex = (stringIndex + 1) % typingStrings.length;
          setCursorTyping(false);
          setTimeout(typeStep, PAUSE_AFTER_DELETE);
        } else {
          setTimeout(typeStep, DELETING_SPEED);
        }
      } else {
        // Digitando caractere por caractere
        setCursorTyping(true);
        charIndex++;
        typingElement.textContent = currentString.substring(0, charIndex);

        if (charIndex >= currentString.length) {
          // String completa — pausar antes de apagar
          setCursorTyping(false);
          isDeleting = true;
          setTimeout(typeStep, PAUSE_AFTER_TYPE);
        } else {
          setTimeout(typeStep, TYPING_SPEED);
        }
      }
    }

    // Iniciar efeito de digitação
    setTimeout(typeStep, PAUSE_AFTER_DELETE);
  }

  // ============================================================
  // 9. EFEITO PARALLAX
  // ============================================================

  const quoteSection = document.querySelector('.quote-section');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');

  function handleParallax() {
    if (!quoteSection || !prefersReducedMotion.matches) return;

    const scrolled = window.scrollY;
    const sectionTop = quoteSection.offsetTop;
    const sectionHeight = quoteSection.offsetHeight;

    // Só aplicar quando a seção está visível na viewport
    if (
      scrolled + window.innerHeight > sectionTop &&
      scrolled < sectionTop + sectionHeight
    ) {
      const offset = (scrolled - sectionTop) * 0.5;
      quoteSection.style.backgroundPositionY = `${offset}px`;
    }
  }

  window.addEventListener('scroll', rafThrottle(handleParallax), { passive: true });

  // ============================================================
  // 10. FORMULÁRIO DE CONTATO
  // ============================================================

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    /**
     * Expressão regular para validação de e-mail.
     */
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Aceita formatos brasileiros de telefone:
     * (XX) XXXXX-XXXX, (XX) XXXX-XXXX, XX XXXXX-XXXX,
     * XXXXXXXXXXX, +55 XX XXXXX-XXXX, etc.
     */
    const PHONE_REGEX = /^(\+?55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-\s]?\d{4}$/;

    /**
     * Exibe mensagem de erro inline para um campo específico.
     */
    function showError(field, message) {
      const container = field.closest('.form-group') || field.parentElement;
      let errorEl = container.querySelector('.error-msg');

      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.classList.add('error-msg');
        container.appendChild(errorEl);
      }

      errorEl.textContent = message;
      errorEl.style.display = 'block';
      field.classList.add('input-error');
    }

    /**
     * Remove mensagem de erro de um campo.
     */
    function clearError(field) {
      const container = field.closest('.form-group') || field.parentElement;
      const errorEl = container.querySelector('.error-msg');

      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }

      field.classList.remove('input-error');
    }

    /**
     * Limpa erros ao digitar no campo.
     */
    contactForm.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', () => clearError(input));
    });

    /**
     * Valida todos os campos do formulário.
     * Retorna true se todos estiverem válidos.
     */
    function validateForm() {
      let isValid = true;

      const name    = contactForm.querySelector('[name="name"]');
      const email   = contactForm.querySelector('[name="email"]');
      const phone   = contactForm.querySelector('[name="phone"]');
      const message = contactForm.querySelector('[name="message"]');

      // Nome obrigatório
      if (name) {
        if (!name.value.trim()) {
          showError(name, 'Por favor, informe seu nome.');
          isValid = false;
        } else {
          clearError(name);
        }
      }

      // E-mail obrigatório e formato válido
      if (email) {
        if (!email.value.trim()) {
          showError(email, 'Por favor, informe seu e-mail.');
          isValid = false;
        } else if (!EMAIL_REGEX.test(email.value.trim())) {
          showError(email, 'Por favor, informe um e-mail válido.');
          isValid = false;
        } else {
          clearError(email);
        }
      }

      // Telefone obrigatório e formato brasileiro
      if (phone) {
        const phoneClean = phone.value.trim();
        if (!phoneClean) {
          showError(phone, 'Por favor, informe seu telefone.');
          isValid = false;
        } else if (!PHONE_REGEX.test(phoneClean)) {
          showError(phone, 'Formato inválido. Use (XX) XXXXX-XXXX.');
          isValid = false;
        } else {
          clearError(phone);
        }
      }

      // Mensagem obrigatória
      if (message) {
        if (!message.value.trim()) {
          showError(message, 'Por favor, escreva sua mensagem.');
          isValid = false;
        } else {
          clearError(message);
        }
      }

      return isValid;
    }

    /**
     * Exibe mensagem de sucesso após envio.
     */
    function showSuccessMessage() {
      // Verificar se já existe uma mensagem de sucesso
      let successEl = contactForm.querySelector('.form-success-msg');

      if (!successEl) {
        successEl = document.createElement('div');
        successEl.classList.add('form-success-msg');
        contactForm.appendChild(successEl);
      }

      successEl.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
      successEl.style.display = 'block';

      // Esconder a mensagem após 5 segundos
      setTimeout(() => {
        successEl.style.display = 'none';
      }, 5000);
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Estado de carregamento no botão
      const submitBtn = contactForm.querySelector('button[type="submit"], input[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent || submitBtn.value : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtn.tagName === 'BUTTON') {
          submitBtn.textContent = 'Enviando...';
        } else {
          submitBtn.value = 'Enviando...';
        }
        submitBtn.classList.add('loading');
      }

      // Obter dados do formulário
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      // Enviar os dados para a API Serverless local/Vercel
      fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha ao enviar e-mail');
        }
        return response.json();
      })
      .then(data => {
        showSuccessMessage();
        contactForm.reset();
      })
      .catch(error => {
        console.error(error);
        alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
      })
      .finally(() => {
        // Restaurar botão
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.tagName === 'BUTTON') {
            submitBtn.textContent = originalText;
          } else {
            submitBtn.value = originalText;
          }
          submitBtn.classList.remove('loading');
        }
      });
    });
  }

  // ============================================================
  // 11. ANIMAÇÃO DO TIMELINE
  // ============================================================

  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Escalonar animação com base na posição do item
            const staggerDelay = index * 200;

            setTimeout(() => {
              entry.target.classList.add('active');
            }, staggerDelay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    timelineItems.forEach((item) => timelineObserver.observe(item));
  }

  // ============================================================
  // 12. LAZY LOADING DE IMAGENS
  // ============================================================

  /**
   * Verifica suporte nativo a loading="lazy".
   * Se não houver suporte, usa Intersection Observer como fallback.
   */
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0) {
    if ('loading' in HTMLImageElement.prototype) {
      // Navegador suporta lazy loading nativo
      lazyImages.forEach((img) => {
        img.src = img.getAttribute('data-src');
        img.loading = 'lazy';
        img.removeAttribute('data-src');
      });
    } else {
      // Fallback com Intersection Observer
      const lazyObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.getAttribute('data-src');
              img.removeAttribute('data-src');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '100px' } // Carregar um pouco antes de aparecer
      );

      lazyImages.forEach((img) => lazyObserver.observe(img));
    }
  }

  // ============================================================
  // 13. ATUALIZAÇÃO AUTOMÁTICA DO ANO
  // ============================================================

  const yearElement = document.getElementById('current-year');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================================
  // 14. BOTÃO DO WHATSAPP
  // ============================================================

  const whatsappButton = document.querySelector('.whatsapp-float');

  if (whatsappButton) {
    whatsappButton.addEventListener('click', (e) => {
      e.preventDefault();

      const phoneNumber = '5531994310909';
      const message = encodeURIComponent(
        'Olá! Vim através do site do Dr. Fernando José de Oliveira e gostaria de solicitar um atendimento.'
      );

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    });
  }

  // ============================================================
  // LOG DE INICIALIZAÇÃO (apenas em desenvolvimento)
  // ============================================================

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(
      '%c✓ Fernando José de Oliveira — Scripts carregados com sucesso.',
      'color: #b8860b; font-weight: bold; font-size: 12px;'
    );
  }
});
