document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // 3. Close mobile menu when a nav link is clicked
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger ? hamburger.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // 4. Smooth Scrolling with Fixed Header Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 76;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Navbar Scroll Effect & Active Section Highlighting
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    const updateNavOnScroll = () => {
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.7)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }

        const scrollPosition = window.scrollY + 140;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const matchingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (matchingLink && !matchingLink.classList.contains('nav-link-cta')) {
                if (scrollPosition >= top && scrollPosition < top + height) {
                    matchingLink.style.color = 'var(--accent)';
                } else {
                    matchingLink.style.color = '';
                }
            }
        });
    };

    window.addEventListener('scroll', updateNavOnScroll, { passive: true });
    updateNavOnScroll();

    // 6. Scroll Reveal Animations
    const revealElements = document.querySelectorAll(
        '.arch-card, .timeline-card, .skill-category, .project-card, .edu-card, .cert-banner'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease, border-color 0.25s ease, box-shadow 0.25s ease';
            observer.observe(el);
        });
    }

    // 7. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Email...';
            btn.disabled = true;

            const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
            const mailtoBody = encodeURIComponent(
                `Hi Rohit,\n\n${message}\n\nBest regards,\n${name}\n(${email})`
            );
            const mailtoUrl = `mailto:rohitrajput14359@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            setTimeout(() => {
                window.location.href = mailtoUrl;

                btn.innerHTML = originalHTML;
                btn.disabled = false;
                contactForm.reset();

                if (formStatus) {
                    formStatus.innerHTML =
                        '<i class="fas fa-check-circle"></i> Email client opened! You can also contact directly at <strong>rohitrajput14359@gmail.com</strong>.';
                    formStatus.style.color = 'var(--accent)';
                    setTimeout(() => {
                        formStatus.textContent = '';
                    }, 7000);
                }
            }, 600);
        });
    }
});
