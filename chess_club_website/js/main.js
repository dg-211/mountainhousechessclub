// Main JavaScript functionality for Chess Club Website

// Global variables
let tournaments = [];
let blogPosts = [];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    
    // Check authentication status
    if (window.auth) {
        window.auth.updateAuthUI();
    }
});

// Load data from localStorage or create initial data
function loadData() {
    // Load tournaments
    const savedTournaments = localStorage.getItem('tournaments');
    if (savedTournaments) {
        tournaments = JSON.parse(savedTournaments);
    } else {
        // Create initial empty tournaments
        tournaments = [];
        localStorage.setItem('tournaments', JSON.stringify(tournaments));
    }
    
    // Load blog posts
    const savedBlogPosts = localStorage.getItem('blogPosts');
    if (savedBlogPosts) {
        blogPosts = JSON.parse(savedBlogPosts);
    } else {
        // Create initial empty blog posts
        blogPosts = [];
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    }
    
    // Load upcoming events and latest posts
    loadUpcomingEvents();
    loadLatestPosts();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load upcoming events on homepage
function loadUpcomingEvents() {
    const eventsContainer = document.getElementById('upcoming-events');
    if (!eventsContainer) return;
    
    const upcomingTournaments = tournaments.filter(t => 
        new Date(t.date) > new Date() && t.status === 'upcoming'
    ).slice(0, 3);
    
    if (upcomingTournaments.length === 0) {
        eventsContainer.innerHTML = `
            <div class="no-events">
                <p>No upcoming tournaments scheduled yet.</p>
                <a href="tournaments.html" class="btn btn-primary">Check Back Later</a>
            </div>
        `;
        return;
    }
    
    eventsContainer.innerHTML = upcomingTournaments.map(tournament => `
        <div class="event-card">
            <div class="event-date">
                <span class="day">${formatDate(tournament.date).day}</span>
                <span class="month">${formatDate(tournament.date).month}</span>
            </div>
            <div class="event-details">
                <h3>${tournament.name}</h3>
                <p class="event-time"><i class="fas fa-clock"></i> ${formatTime(tournament.date)}</p>
                <p class="event-format"><i class="fas fa-chess"></i> ${tournament.format}</p>
                <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${tournament.location}</p>
                <a href="tournaments.html" class="btn btn-primary btn-small">View Details</a>
            </div>
        </div>
    `).join('');
}

// Load latest blog posts on homepage
function loadLatestPosts() {
    const postsContainer = document.getElementById('latest-posts');
    if (!postsContainer) return;
    
    const latestPosts = blogPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
        .slice(0, 3);
    
    if (latestPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <p>No blog posts available yet.</p>
                <a href="blog.html" class="btn btn-secondary">Check Back Later</a>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = latestPosts.map(post => `
        <div class="post-card">
            <div class="post-image">
                <img src="${post.featuredImage || 'images/default-post.jpg'}" alt="${post.title}">
            </div>
            <div class="post-content">
                <h3>${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date"><i class="fas fa-calendar"></i> ${formatDate(post.publishDate).full}</span>
                    <span class="post-author"><i class="fas fa-user"></i> ${post.author}</span>
                </div>
                <a href="blog.html#${post.id}" class="btn btn-secondary btn-small">Read More</a>
            </div>
        </div>
    `).join('');
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
        day: date.getDate(),
        month: months[date.getMonth()],
        full: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };
}

// Format time for display
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Generic form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

// Clear field error
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

// Utility functions
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Export functions for use in other scripts
window.mainUtils = {
    openModal,
    closeModal,
    validateForm,
    showFieldError,
    clearFieldError,
    formatDate,
    formatTime,
    formatDateTime
}; 