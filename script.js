
// Form handling
document.addEventListener('DOMContentLoaded', () => {
    // Image Carousel
    initCarousel();
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, you would send this data to a server
            console.log({
                name,
                email,
                message
            });
            
            // Show success message (in a real app, this would happen after successful API response)
            alert('Thank you for your message! Sandeep will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all section elements
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
});

// Add functionality to update content (for admin use in the future)
// This is a simple placeholder function - in a real implementation,
// this would involve authentication and a backend API
function addUpdate(date, title, description) {
    const updatesContainer = document.querySelector('.updates-container');
    
    if (!updatesContainer) return;
    
    const updateCard = document.createElement('div');
    updateCard.className = 'update-card';
    
    updateCard.innerHTML = `
        <div class="update-date">${date}</div>
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    
    // Insert at the beginning to show newest first
    updatesContainer.insertBefore(updateCard, updatesContainer.firstChild);
}

// Function to add new accomplishment (for future use)
function addAccomplishment(icon, title, description) {
    const accomplishmentGrid = document.querySelector('.accomplishment-grid');
    
    if (!accomplishmentGrid) return;
    
    const card = document.createElement('div');
    card.className = 'accomplishment-card';
    
    card.innerHTML = `
        <div class="accomplishment-icon"><i class="fas fa-${icon}"></i></div>
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    
    accomplishmentGrid.appendChild(card);
}

// Initialize the image carousel
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = document.querySelector('.carousel-indicators');
    
    if (!carousel || !slides.length) return;
    
    let currentSlide = 0;
    
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        indicators.appendChild(indicator);
    });
    
    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });
    }
    
    // Auto-advance slides
    let intervalId = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    carousel.addEventListener('mouseleave', () => {
        intervalId = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }, 5000);
    });
    
    // Function to update carousel state
    function updateCarousel() {
        const slideWidth = slides[0].clientWidth;
        carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Go to a specific slide
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Initialize first slide
    updateCarousel();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
}
