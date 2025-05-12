// Add this helper function at the top
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
    const animatableElements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .stat-box');

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
  
    mobileMenuBtn.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      
      // Toggle icon between bars and X
      if (mobileMenuIcon.classList.contains('fa-bars')) {
        mobileMenuIcon.classList.remove('fa-bars');
        mobileMenuIcon.classList.add('fa-xmark');
      } else {
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
      }
    });

    // Add touch events for mobile menu
    mobileMenuBtn.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent ghost clicks
        this.click();
    });
  
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideMenu = mobileNav.contains(event.target);
      const isClickOnMenuButton = mobileMenuBtn.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnMenuButton && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
      }
    });
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        ['click', 'touchend'].forEach(eventType => {
            anchor.addEventListener(eventType, function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(targetId);
                if (target) {
                    // Close mobile menu if open
                    if (mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                        mobileMenuIcon.classList.remove('fa-xmark');
                        mobileMenuIcon.classList.add('fa-bars');
                    }
                    
                    // Scroll to target
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });
    });
  
    // Add active class to nav links based on scroll position
    function highlightNavLink() {
      const scrollPosition = window.scrollY + 200; // Offset for better UX
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
      
      // Handle home/top case
      if (scrollPosition < 200) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#') {
            link.classList.add('active');
          }
        });
      }
    }
    
    const throttledHighlightNavLink = throttle(highlightNavLink, 100);
    window.addEventListener('scroll', throttledHighlightNavLink, { passive: true });
    throttledHighlightNavLink(); // Call once on page load
    
    // Update copyright year
    const currentYearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    currentYearElements.forEach(element => {
      element.textContent = currentYear;
    });
  
    // Image hover effects for projects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.querySelector('.project-overlay').style.opacity = '1';
      });
      
      card.addEventListener('mouseleave', () => {
        card.querySelector('.project-overlay').style.opacity = '0';
      });
    });
  
    // Add scroll animation for elements
    function animateElements() {
        requestAnimationFrame(() => {
            const windowHeight = window.innerHeight;
            
            animatableElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                
                if (elementPosition < windowHeight - 100) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });
    }
    
    const throttledAnimateElements = throttle(animateElements, 100);

    // Set initial state for animatable elements
    animatableElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', throttledAnimateElements, { passive: true });
    window.addEventListener('resize', throttledAnimateElements);
    
    // Call once on page load
    throttledAnimateElements();
  });