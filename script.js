
// Form handling
document.addEventListener('DOMContentLoaded', () => {
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
