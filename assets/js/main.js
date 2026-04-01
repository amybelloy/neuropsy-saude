document.addEventListener('DOMContentLoaded', () => {
    // Menu responsivo
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if(toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        // Fechar menu ao clicar em link
        navLinks.querySelectorAll('a.link, a.btn').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Header fixo muda ao rolar a página
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Observer para animação reveladora de elementos (fade-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');

            // Fecha outros abertos
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                if(q.nextElementSibling) q.nextElementSibling.style.maxHeight = null;
            });

            // Se não estava aberto, abre o clicado
            if (!isOpen) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // Dropdown nav (mobile)
    const dropdowns = document.querySelectorAll('.nav-item-dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.link');
        if(trigger && window.innerWidth <= 768) {
            trigger.addEventListener('click', (e) => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if(menu) {
                    const isVisible = menu.style.display === 'block';
                    menu.style.display = isVisible ? 'none' : 'block';
                }
            });
        }
    });
});
