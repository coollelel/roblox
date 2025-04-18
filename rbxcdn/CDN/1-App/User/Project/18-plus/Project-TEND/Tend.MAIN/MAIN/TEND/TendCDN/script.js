document.addEventListener('DOMContentLoaded', () => {
    // Page navigation
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.querySelector(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showPage(targetId);

            // Update active state in navigation
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Show home page by default
    showPage('#home');

    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Only scroll if the target element exists
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation and notification to CTA button
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(ctaButton => {
        ctaButton.addEventListener('click', async () => {
            // Show alert
            window.alert("Press OK to continue.");
            
            // Handle notifications
            if ("Notification" in window) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        new Notification("Welcome to TEND!", {
                            body: "Thank you for joining our dating community!",
                            icon: "https://rbxcdn.vercel.app/rbxcdn/CDN/media/TEND.png"
                        });
                    }
                } catch (err) {
                    console.error("Error with notification:", err);
                }
            }

            // Button animation
            ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ctaButton.style.transform = 'scale(1)';
                // Redirect to Discord after the animation
                if (ctaButton.innerText === "Get Started") {
                    window.location.href = "https://discord.gg/GurwBWdUyD";
                }
            }, 200);
        });
    });

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = '#2a2a2a';
        });
        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = 'var(--surface)';
        });
    });

    // Handle "Start Matching" button in messages
    document.querySelector('.no-messages .cta-button').addEventListener('click', () => {
        showPage('#matches');
    });
});
