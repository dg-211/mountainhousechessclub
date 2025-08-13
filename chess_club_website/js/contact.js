// Contact page functionality

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    
    // Check authentication status
    if (window.auth) {
        window.auth.updateAuthUI();
    }
});

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processContactForm(this);
        });
    }
}

// Process contact form submission
function processContactForm(form) {
    // Validate form
    if (!validateContactForm(form)) {
        return;
    }
    
    // Collect form data
    const formData = {
        name: form.querySelector('#contact-name').value.trim(),
        email: form.querySelector('#contact-email').value.trim(),
        subject: form.querySelector('#contact-subject').value.trim(),
        message: form.querySelector('#contact-message').value.trim(),
        date: new Date().toISOString(),
        ip: '127.0.0.1' // In production, this would be the actual IP
    };
    
    // Save contact message to localStorage
    saveContactMessage(formData);
    
    // Show success message
    showSuccessMessage(form);
    
    // Reset form
    form.reset();
}

// Validate contact form
function validateContactForm(form) {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate name
    const nameField = form.querySelector('#contact-name');
    if (!nameField.value.trim()) {
        showFieldError(nameField, 'Name is required');
        isValid = false;
    } else if (nameField.value.trim().length < 2) {
        showFieldError(nameField, 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailField = form.querySelector('#contact-email');
    if (!emailField.value.trim()) {
        showFieldError(emailField, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    const messageField = form.querySelector('#contact-message');
    if (!messageField.value.trim()) {
        showFieldError(messageField, 'Message is required');
        isValid = false;
    } else if (messageField.value.trim().length < 10) {
        showFieldError(messageField, 'Message must be at least 10 characters long');
        isValid = false;
    }
    
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
    errorDiv.style.fontWeight = '500';
    
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

// Clear all errors
function clearAllErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('.contact-form input, .contact-form textarea');
    fields.forEach(field => field.style.borderColor = '');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Save contact message
function saveContactMessage(message) {
    let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    message.id = Date.now().toString();
    contactMessages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
}

// Show success message
function showSuccessMessage(form) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
        </div>
    `;
    
    // Insert after form
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Add CSS for contact page
const contactStyles = `
<style>
.contact-content {
    padding: 4rem 0;
    background: #f8f9fa;
}

.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
}

.contact-form-section,
.contact-info-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.contact-form-section h2,
.contact-info-section h2 {
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

.contact-form {
    max-width: 100%;
}

.contact-form .form-group {
    margin-bottom: 1.5rem;
}

.contact-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.contact-form input,
.contact-form textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: #e74c3c;
}

.contact-form button {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.contact-item:hover {
    transform: translateY(-2px);
}

.contact-item i {
    font-size: 1.5rem;
    color: #e74c3c;
    margin-top: 0.25rem;
    width: 24px;
    text-align: center;
}

.contact-item h3 {
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.contact-item p {
    color: #666;
    margin: 0;
    line-height: 1.6;
}

.contact-item a {
    color: #e74c3c;
    text-decoration: none;
    font-weight: 600;
}

.contact-item a:hover {
    text-decoration: underline;
}

.map-section {
    padding: 4rem 0;
    background: white;
}

.map-section h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.map-container {
    max-width: 800px;
    margin: 0 auto;
}

.map-placeholder {
    background: #f8f9fa;
    padding: 4rem 2rem;
    text-align: center;
    border-radius: 12px;
    border: 2px dashed #ddd;
}

.map-placeholder i {
    font-size: 4rem;
    color: #95a5a6;
    margin-bottom: 1rem;
}

.map-placeholder h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.map-placeholder p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.social-section {
    padding: 4rem 0;
    background: #f8f9fa;
}

.social-section h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 1rem;
}

.social-section p {
    text-align: center;
    color: #666;
    margin-bottom: 3rem;
    font-size: 1.1rem;
}

.social-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.social-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    text-decoration: none;
    color: inherit;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: 3px solid transparent;
}

.social-card:hover {
    transform: translateY(-5px);
    text-decoration: none;
    color: inherit;
}

.social-card.facebook:hover {
    border-color: #1877f2;
}

.social-card.instagram:hover {
    border-color: #e4405f;
}

.social-card.twitter:hover {
    border-color: #1da1f2;
}

.social-card.youtube:hover {
    border-color: #ff0000;
}

.social-card i {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.social-card.facebook i {
    color: #1877f2;
}

.social-card.instagram i {
    color: #e4405f;
}

.social-card.twitter i {
    color: #1da1f2;
}

.social-card.youtube i {
    color: #ff0000;
}

.social-card h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.social-card p {
    color: #666;
    margin: 0;
    line-height: 1.6;
}

.success-message {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
    text-align: center;
}

.success-content i {
    font-size: 3rem;
    color: #28a745;
    margin-bottom: 1rem;
}

.success-content h3 {
    color: #155724;
    margin: 0 0 1rem 0;
}

.success-content p {
    color: #155724;
    margin: 0;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .contact-form-section,
    .contact-info-section {
        padding: 1.5rem;
    }
    
    .social-grid {
        grid-template-columns: 1fr;
    }
    
    .map-placeholder {
        padding: 2rem 1rem;
    }
    
    .map-placeholder i {
        font-size: 3rem;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', contactStyles); 