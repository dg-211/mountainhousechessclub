// Authentication Modal Component

// Create and inject authentication modal
function createAuthModal() {
    const modalHTML = `
        <div id="auth-modal" class="modal">
            <div class="modal-content auth-modal-content">
                <span class="close" onclick="closeAuthModal()">&times;</span>
                
                <!-- Auth Tabs -->
                <div class="auth-tabs">
                    <button class="auth-tab active" onclick="switchAuthTab('signin')">Sign In</button>
                    <button class="auth-tab" onclick="switchAuthTab('signup')">Sign Up</button>
                </div>
                
                <!-- Sign In Form -->
                <div id="signin-form" class="auth-form">
                    <h2>Sign In</h2>
                    
                    <!-- Google Sign-In Button -->
                    <div class="google-signin">
                        <button class="btn btn-google" onclick="handleGoogleSignIn()">
                            <i class="fab fa-google"></i>
                            Sign in with Google
                        </button>
                    </div>
                    
                    <div class="auth-divider">
                        <span>or</span>
                    </div>
                    
                    <!-- Email/Password Sign In -->
                    <form id="email-signin-form">
                        <div class="form-group">
                            <label for="signin-email">Email Address</label>
                            <input type="email" id="signin-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signin-password">Password</label>
                            <input type="password" id="signin-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Sign In</button>
                    </form>
                </div>
                
                <!-- Sign Up Form -->
                <div id="signup-form" class="auth-form" style="display: none;">
                    <h2>Create Account</h2>
                    
                    <!-- Google Sign-Up Button -->
                    <div class="google-signin">
                        <button class="btn btn-google" onclick="handleGoogleSignIn()">
                            <i class="fab fa-google"></i>
                            Sign up with Google
                        </button>
                    </div>
                    
                    <div class="auth-divider">
                        <span>or</span>
                    </div>
                    
                    <!-- Email/Password Sign Up -->
                    <form id="email-signup-form">
                        <div class="form-group">
                            <label for="signup-name">Full Name *</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email">Email Address *</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Password *</label>
                            <input type="password" id="signup-password" required minlength="6">
                            <small>Password must be at least 6 characters long</small>
                        </div>
                        <div class="form-group">
                            <label for="signup-confirm-password">Confirm Password *</label>
                            <input type="password" id="signup-confirm-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set up form handlers
    setupAuthFormHandlers();
}

// Switch between sign in and sign up tabs
function switchAuthTab(tab) {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'signin') {
        signinForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signinForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Open authentication modal
function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close authentication modal
function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Set up form handlers
function setupAuthFormHandlers() {
    // Email sign in form
    const signinForm = document.getElementById('email-signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            if (window.auth && window.auth.signInWithEmail) {
                if (window.auth.signInWithEmail(email, password)) {
                    closeAuthModal();
                    this.reset();
                }
            }
        });
    }
    
    // Email sign up form
    const signupForm = document.getElementById('email-signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (window.auth && window.auth.signUpWithEmail) {
                if (window.auth.signUpWithEmail(email, password, name)) {
                    closeAuthModal();
                    this.reset();
                }
            }
        });
    }
}

// Initialize authentication modal
document.addEventListener('DOMContentLoaded', function() {
    createAuthModal();
});

// Add CSS for authentication modal
const authModalStyles = `
<style>
.auth-modal-content {
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
}

.auth-tabs {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 2px solid #eee;
}

.auth-tab {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.auth-tab.active {
    color: #e74c3c;
    border-bottom: 2px solid #e74c3c;
}

.auth-form h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.google-signin {
    margin-bottom: 2rem;
}

.btn-google {
    width: 100%;
    background: #4285f4;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-google:hover {
    background: #3367d6;
}

.auth-divider {
    text-align: center;
    margin: 2rem 0;
    position: relative;
}

.auth-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
}

.auth-divider span {
    background: white;
    padding: 0 1rem;
    color: #666;
    font-size: 0.9rem;
}

.auth-form .form-group {
    margin-bottom: 1.5rem;
}

.auth-form .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #2c3e50;
}

.auth-form .form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.auth-form .form-group input:focus {
    outline: none;
    border-color: #e74c3c;
}

.auth-form .form-group small {
    color: #666;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
}

.auth-form .btn {
    width: 100%;
    margin-top: 1rem;
}

.auth-container {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
}

.user-email {
    color: #666;
    font-size: 0.8rem;
}

@media (max-width: 768px) {
    .auth-modal-content {
        margin: 10% auto;
        width: 95%;
    }
    
    .user-profile {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', authModalStyles); 