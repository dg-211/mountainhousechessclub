// Authentication System for Chess Club

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com'; // Replace with your actual Google OAuth client ID
const ADMIN_EMAILS = ['darshgoel11@gmail.com']; // List of admin emails

// User state
let currentUser = null;
let isAdmin = false;

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID
        }).then(function(auth2) {
            // Check if user is already signed in
            if (auth2.isSignedIn.get()) {
                handleGoogleSignIn(auth2.currentUser.get());
            }
        });
    });
}

// Handle Google Sign-In
function handleGoogleSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    
    // Check if user exists in local storage
    let user = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!user[email]) {
        // New user - create account
        user[email] = {
            id: Date.now().toString(),
            email: email,
            name: profile.getName(),
            picture: profile.getImageUrl(),
            joinDate: new Date().toISOString(),
            isAdmin: ADMIN_EMAILS.includes(email),
            donations: [],
            tournaments: []
        };
        localStorage.setItem('users', JSON.stringify(user));
    }
    
    // Set current user
    currentUser = user[email];
    isAdmin = currentUser.isAdmin;
    
    // Update UI
    updateAuthUI();
    
    // Redirect if needed
    if (window.location.pathname.includes('/admin') && !isAdmin) {
        window.location.href = '/';
        alert('Access denied. Admin privileges required.');
    }
}

// Handle Google Sign-Out
function handleGoogleSignOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        currentUser = null;
        isAdmin = false;
        updateAuthUI();
        window.location.href = '/';
    });
}

// Email/Password Sign Up
function signUpWithEmail(email, password, fullName) {
    // Simple validation
    if (!email || !password || !fullName) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email]) {
        alert('User already exists with this email');
        return false;
    }
    
    // Create new user
    users[email] = {
        id: Date.now().toString(),
        email: email,
        name: fullName,
        password: password, // In production, this should be hashed
        joinDate: new Date().toISOString(),
        isAdmin: ADMIN_EMAILS.includes(email),
        donations: [],
        tournaments: []
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login
    currentUser = users[email];
    isAdmin = currentUser.isAdmin;
    updateAuthUI();
    
    return true;
}

// Email/Password Sign In
function signInWithEmail(email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[email];
    
    if (!user || user.password !== password) {
        alert('Invalid email or password');
        return false;
    }
    
    currentUser = user;
    isAdmin = currentUser.isAdmin;
    updateAuthUI();
    
    return true;
}

// Update authentication UI
function updateAuthUI() {
    const authContainer = document.getElementById('auth-container');
    const userInfo = document.getElementById('user-info');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        // User is signed in
        if (authContainer) authContainer.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.innerHTML = `
                <div class="user-profile">
                    <img src="${currentUser.picture || 'images/default-avatar.png'}" alt="Profile" class="user-avatar">
                    <div class="user-details">
                        <span class="user-name">${currentUser.name}</span>
                        <span class="user-email">${currentUser.email}</span>
                    </div>
                    <button onclick="handleGoogleSignOut()" class="btn btn-secondary btn-small">Sign Out</button>
                </div>
            `;
        }
        
        // Show admin link if user is admin
        if (adminLink) {
            adminLink.style.display = isAdmin ? 'block' : 'none';
        }
        
        // Update navigation
        updateNavigation();
        
        // Load user-specific data
        loadUserData();
    } else {
        // User is signed out
        if (authContainer) authContainer.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        
        // Update navigation
        updateNavigation();
    }
}

// Update navigation based on auth state
function updateNavigation() {
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');
    if (dashboardLink) {
        dashboardLink.style.display = currentUser ? 'block' : 'none';
    }
}

// Load user-specific data
function loadUserData() {
    if (!currentUser) return;
    
    // Load user's tournament registrations
    loadUserTournaments();
    
    // Load user's donations
    loadUserDonations();
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Check if user is admin
function isUserAdmin() {
    return isAdmin;
}

// Protect admin routes
function protectAdminRoute() {
    if (!isAuthenticated() || !isUserAdmin()) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already signed in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAdmin = currentUser.isAdmin;
        updateAuthUI();
    }
    
    // Initialize Google Sign-In if available
    if (typeof gapi !== 'undefined') {
        initializeGoogleSignIn();
    }
});

// Export functions for use in other scripts
window.auth = {
    isAuthenticated,
    isUserAdmin,
    protectAdminRoute,
    currentUser: () => currentUser,
    signUpWithEmail,
    signInWithEmail,
    handleGoogleSignIn,
    handleGoogleSignOut
}; 