
document.addEventListener('DOMContentLoaded', () => {
    // Image Carousel
    initCarousel();
    
    // Initialize neural network animation
    initNeuralNetworkAnimation();
    
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

// Neural Network Animation
function initNeuralNetworkAnimation() {
    const canvas = document.getElementById('neuralNetworkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to document dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Track mouse position considering scroll
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY;
    });
    
    // Node class
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = Math.random() * 2 + 1;
            this.vx = Math.random() * 1 - 0.5;
            this.vy = Math.random() * 1 - 0.5;
            this.initialX = x;
            this.initialY = y;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
        }
        
        update() {
            // Add stronger mouse influence - nodes move more dramatically towards mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Increased influence radius and strength
            if (distance < 300) {
                const strength = 0.15; // Increased from 0.05
                this.vx += dx / distance * strength;
                this.vy += dy / distance * strength;
                
                // Add ripple effect based on mouse movement
                const mouseFactor = 0.3;
                this.vx += (Math.random() - 0.5) * mouseFactor;
                this.vy += (Math.random() - 0.5) * mouseFactor;
            }
            
            // Weaker return to original position for more dynamic movement
            this.vx += (this.initialX - this.x) * 0.005; // Reduced from 0.01
            this.vy += (this.initialY - this.y) * 0.005;
            
            // Slower damping for more persistent movement
            this.vx *= 0.97; // Changed from 0.95
            this.vy *= 0.97;
            
            // Update position
            this.x += this.vx;
            this.y += this.vy;
            
            // Keep nodes within boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
    }
    
    // Create nodes - more nodes for a denser graph across the entire page
    const nodeCount = Math.min(200, Math.round(window.innerWidth * window.innerHeight / 6000));
    const nodes = [];
    
    // Create nodes distributed across the entire document height, not just viewport
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
    
    for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * documentHeight;
        nodes.push(new Node(x, y));
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw mouse trail effect
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
        gradient.addColorStop(0, 'rgba(120, 200, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(120, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
    // Draw connections between nodes with enhanced visual effects
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Increase connection distance for a more connected graph
                if (distance < 200) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    
                    // Add mouse proximity effect - connections closer to mouse are brighter
                    const midX = (nodes[i].x + nodes[j].x) / 2;
                    const midY = (nodes[i].y + nodes[j].y) / 2;
                    const mouseDistance = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
                    const mouseInfluence = Math.max(0, 1 - mouseDistance / 300);
                    
                    // Add gradient effect based on distance and mouse proximity
                    const baseOpacity = 1 - distance / 200;
                    const finalOpacity = baseOpacity * 0.5 + mouseInfluence * 0.5;
                    const color = mouseInfluence > 0.5 ? 
                        `rgba(160, 220, 255, ${finalOpacity})` : 
                        `rgba(100, 180, 255, ${finalOpacity})`;
                    
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.8 + mouseInfluence * 1.2; // Thicker lines near mouse
                    ctx.stroke();
                }
            }
        }
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

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
