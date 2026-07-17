/* ---------------------------------------------------------
    Fernando José de Oliveira | Sociedade de Advogados
    Interações e Lógicas da Interface (JavaScript)
   --------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialização do Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Menu Mobile Hamburguer
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            
            // Troca o ícone de menu para fechar (X)
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons(); // Recria os ícones alterados dinamicamente
            }
        });
        
        // Fecha o menu ao clicar em qualquer link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 3. Efeito Header Sticky ao rolar a página
    const header = document.getElementById('header');
    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verifica no carregamento inicial

    // 4. ScrollSpy (Destacar link da seção atual na navegação)
    const sections = document.querySelectorAll('section[id]');
    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Compensação da altura do Header
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`) || 
                             document.querySelector(`.nav-list a[href*='${sectionId}']`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', scrollActive);

    // 5. Animação de Entrada ao Rolara Tela (Intersection Observer)
    const animatedElements = document.querySelectorAll('.bento-card, .partner-card, .founder-profile, .about-img-main-wrapper, .about-img-secondary-wrapper, .stats-item');
    
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Executa apenas uma vez
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Configura os elementos para o estado inicial antes da animação
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        animationObserver.observe(el);
    });

    // 6. Formulário de Contato Rápido & Confirmação de Agendamento
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    
    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de carregamento / envio
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processando solicitação...</span><i data-lucide="loader-2" class="animate-spin"></i>';
            lucide.createIcons();
            
            // Simula uma requisição HTTP de 1.5 segundos
            setTimeout(() => {
                // Recupera o nome do cliente para personalização
                const nameInput = document.getElementById('name').value;
                const firstName = nameInput.trim().split(' ')[0];
                
                // Mensagem de Sucesso
                formFeedback.className = 'form-feedback success';
                formFeedback.innerHTML = `
                    <strong>Agendamento Pré-Solicitado!</strong><br>
                    Olá, ${firstName}. Recebemos seu interesse. Nossa equipe entrará em contato pelo telefone informado em até 2 horas úteis para confirmar a sua consulta jurídica.
                `;
                formFeedback.classList.remove('hidden');
                
                // Limpa o formulário
                contactForm.reset();
                
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();
                
                // Rola suavemente até o feedback
                formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Oculta o feedback após 8 segundos
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 8000);
                
            }, 1500);
        });
    }
});
