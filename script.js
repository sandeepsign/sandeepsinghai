
document.addEventListener('DOMContentLoaded', () => {
    // Image Carousel
    initCarousel();
    
    // Initialize neural network animation
    initNeuralNetworkAnimation();
    
    // Initialize navigation effects
    initNavAnimations();
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Create a mailto link
            const mailtoLink = `mailto:sandeep.sign@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            
            // Open the email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('Thank you for your message! Your email client will open to send a message to Sandeep.');
            
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
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Mouse position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
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
    
    // Create nodes - more nodes for a denser graph
    const nodeCount = Math.min(150, Math.round(window.innerWidth * window.innerHeight / 8000));
    const nodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
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


// Initialize navigation animations
function initNavAnimations() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (!navContainer) return;
    
    // Create mouse follower element
    const mouseFollower = document.createElement('div');
    mouseFollower.className = 'nav-mouse-follower';
    navContainer.appendChild(mouseFollower);
    
    // Add animation to navigation on mouse move
    navContainer.addEventListener('mousemove', (e) => {
        const navRect = navContainer.getBoundingClientRect();
        const followerX = e.clientX - navRect.left;
        const followerY = e.clientY - navRect.top;
        
        // Move the follower with slight delay for smooth effect
        mouseFollower.style.opacity = '1';
        mouseFollower.style.transform = `translate(${followerX}px, ${followerY}px) scale(1)`;
        
        // Add subtle glow effect to links near the mouse
        navLinks.forEach(link => {
            const linkRect = link.getBoundingClientRect();
            const linkCenterX = linkRect.left + linkRect.width / 2 - navRect.left;
            const linkCenterY = linkRect.top + linkRect.height / 2 - navRect.top;
            
            // Calculate distance between mouse and link center
            const distance = Math.sqrt(
                Math.pow(followerX - linkCenterX, 2) + 
                Math.pow(followerY - linkCenterY, 2)
            );
            
            // Apply glow effect based on proximity
            if (distance < 100) {
                const intensity = 1 - (distance / 100);
                link.style.textShadow = `0 0 ${intensity * 10}px rgba(255, 255, 255, ${intensity * 0.8})`;
                link.style.transform = `translateY(-${intensity * 3}px)`;
            } else {
                link.style.textShadow = 'none';
                link.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Reset effects when mouse leaves the nav
    navContainer.addEventListener('mouseleave', () => {
        mouseFollower.style.opacity = '0';
        navLinks.forEach(link => {
            link.style.textShadow = 'none';
            link.style.transform = 'translateY(0)';
        });
    });
    
    // Add click ripple effect
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.className = 'nav-ripple';
            ripple.style.position = 'absolute';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.pointerEvents = 'none';
            
            // Position ripple at click point
            const x = e.offsetX;
            const y = e.offsetY;
            const size = Math.max(link.offsetWidth, link.offsetHeight) * 2;
            
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${x - size/2}px`;
            ripple.style.top = `${y - size/2}px`;
            
            link.appendChild(ripple);
            
            // Animate and remove ripple
            ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            ripple.style.transform = 'scale(1)';
            ripple.style.opacity = '0';
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Set active link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const scrollPosition = window.scrollY + 100; // Offset for better activation
    
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
}

    
    // Initialize first slide
    updateCarousel();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
}
