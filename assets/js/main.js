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
    
    // --- Lightbox Gallery Implementation ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const spaceImages = document.querySelectorAll('.space-scroll-container img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImgIndex = 0;

    if (lightbox && lightboxImg && spaceImages.length > 0) {
        // Open lightbox
        spaceImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImgIndex = index;
                showImage(currentImgIndex);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock scroll
            });
        });

        const showImage = (index) => {
            const imgSrc = spaceImages[index].src;
            // Use the high res version if available (removing thumbnail suffix if any)
            // In this specific case, the URLs seem to be direct FB CDN links, so we'll use them as is.
            lightboxImg.src = imgSrc;
        };

        // Navigation
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImgIndex = (currentImgIndex > 0) ? currentImgIndex - 1 : spaceImages.length - 1;
            showImage(currentImgIndex);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImgIndex = (currentImgIndex < spaceImages.length - 1) ? currentImgIndex + 1 : 0;
            showImage(currentImgIndex);
        });

        // Close logic
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scroll
        };

        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }
});
