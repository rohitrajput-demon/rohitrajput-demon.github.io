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
            if (!targetId || targetId === '#' || targetId === '#email-modal') return;

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

    // 7. Email Client Chooser Modal Logic
    const emailModal = document.getElementById('email-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const emailTriggerBtns = document.querySelectorAll('.email-trigger-btn');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');
    const copyCheckIcon = document.getElementById('copy-check-icon');

    const optGmail = document.getElementById('modal-opt-gmail');
    const optDefault = document.getElementById('modal-opt-default');

    const openEmailModal = (customSubject, customBody) => {
        if (!emailModal) return;

        const subject = customSubject || 'Portfolio Inquiry - Rohit Pardeshi';
        const body = customBody || 'Hi Rohit,\n\nI came across your portfolio and would like to connect.\n\nBest regards,';

        if (optGmail) {
            optGmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=rohitrajput14359@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        if (optDefault) {
            optDefault.href = `mailto:rohitrajput14359@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }

        emailModal.classList.add('active');
        emailModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeEmailModal = () => {
        if (!emailModal) return;
        emailModal.classList.remove('active');
        emailModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    emailTriggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openEmailModal();
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeEmailModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeEmailModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailModal && emailModal.classList.contains('active')) {
            closeEmailModal();
        }
    });

    // Copy Email to Clipboard
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailAddress = 'rohitrajput14359@gmail.com';
            navigator.clipboard.writeText(emailAddress).then(() => {
                if (copyEmailText) copyEmailText.textContent = 'Copied to Clipboard!';
                if (copyCheckIcon) copyCheckIcon.style.display = 'inline-block';

                setTimeout(() => {
                    if (copyEmailText) copyEmailText.textContent = 'Copy Email Address';
                    if (copyCheckIcon) copyCheckIcon.style.display = 'none';
                }, 3000);
            }).catch(() => {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = emailAddress;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);

                if (copyEmailText) copyEmailText.textContent = 'Copied to Clipboard!';
                setTimeout(() => {
                    if (copyEmailText) copyEmailText.textContent = 'Copy Email Address';
                }, 3000);
            });
        });
    }

    // 8. Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            const formattedSubject = `[Portfolio] ${subject}`;
            const formattedBody = `Hi Rohit,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`;

            // Open the app chooser modal pre-loaded with the user's message
            openEmailModal(formattedSubject, formattedBody);

            if (formStatus) {
                formStatus.innerHTML =
                    '<i class="fas fa-check-circle"></i> Choose <strong>Gmail</strong> or your <strong>Default Mail App</strong> above to send your message!';
                formStatus.style.color = 'var(--accent)';
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 9000);
            }
        });
    }
});
