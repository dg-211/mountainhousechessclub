// Admin functionality

// Check authentication and admin privileges on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated and is admin
    if (!window.auth || !window.auth.isAuthenticated() || !window.auth.isUserAdmin()) {
        alert('Access denied. Admin privileges required.');
        window.location.href = '../index.html';
        return;
    }
    
    // Initialize admin panel
    initializeAdminPanel();
    
    // Update user info display
    updateAdminUserInfo();
});

// Initialize admin panel
function initializeAdminPanel() {
    loadAdminStats();
    loadRecentActivity();
    setupAdminEventListeners();
}

// Update admin user info display
function updateAdminUserInfo() {
    const userInfo = document.getElementById('user-info');
    const currentUser = window.auth.currentUser();
    
    if (userInfo && currentUser) {
        userInfo.innerHTML = `
            <div class="user-profile">
                <img src="${currentUser.picture || '../images/default-avatar.png'}" alt="Profile" class="user-avatar">
                <div class="user-details">
                    <span class="user-name">${currentUser.name}</span>
                    <span class="user-email">${currentUser.email}</span>
                </div>
                <button onclick="window.auth.handleGoogleSignOut()" class="btn btn-secondary btn-small">Sign Out</button>
            </div>
        `;
    }
}

// Load admin statistics
function loadAdminStats() {
    // Load users count
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const totalUsers = Object.keys(users).length;
    document.getElementById('total-users').textContent = totalUsers;
    
    // Load tournaments count
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    document.getElementById('total-tournaments').textContent = tournaments.length;
    
    // Load blog posts count
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    document.getElementById('total-posts').textContent = blogPosts.length;
    
    // Load donations count
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    document.getElementById('total-donations').textContent = donations.length;
}

// Load recent activity
function loadRecentActivity() {
    const container = document.getElementById('recent-activity-list');
    if (!container) return;
    
    const activities = [];
    
    // Get recent user registrations
    const users = JSON.parse(localStorage.getItem('users')) || {};
    Object.values(users).forEach(user => {
        activities.push({
            type: 'user',
            icon: 'fas fa-user-plus',
            text: `New member registered: ${user.name}`,
            time: new Date(user.joinDate)
        });
    });
    
    // Get recent tournaments
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    tournaments.forEach(tournament => {
        activities.push({
            type: 'tournament',
            icon: 'fas fa-trophy',
            text: `Tournament created: ${tournament.name}`,
            time: new Date(tournament.createdDate || tournament.date)
        });
    });
    
    // Get recent blog posts
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    blogPosts.forEach(post => {
        activities.push({
            type: 'blog',
            icon: 'fas fa-newspaper',
            text: `Blog post published: ${post.title}`,
            time: new Date(post.publishDate)
        });
    });
    
    // Get recent donations
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.forEach(donation => {
        activities.push({
            type: 'donation',
            icon: 'fas fa-heart',
            text: `Donation received: $${donation.amount} from ${donation.name}`,
            time: new Date(donation.date)
        });
    });
    
    // Sort by time (newest first) and take top 10
    activities.sort((a, b) => b.time - a.time).slice(0, 10);
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span class="activity-time">${formatTimeAgo(activity.time)}</span>
            </div>
        </div>
    `).join('');
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Setup search functionality
    setupSearchFunctionality();
    
    // Setup form submissions
    setupFormSubmissions();
}

// Setup search functionality
function setupSearchFunctionality() {
    // User search
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
    
    // Tournament search
    const tournamentSearch = document.getElementById('tournament-search');
    if (tournamentSearch) {
        tournamentSearch.addEventListener('input', function() {
            filterTournaments(this.value);
        });
    }
    
    // Blog search
    const blogSearch = document.getElementById('blog-search');
    if (blogSearch) {
        blogSearch.addEventListener('input', function() {
            filterBlogPosts(this.value);
        });
    }
    
    // Donation search
    const donationSearch = document.getElementById('donation-search');
    if (donationSearch) {
        donationSearch.addEventListener('input', function() {
            filterDonations(this.value);
        });
    }
}

// Setup form submissions
function setupFormSubmissions() {
    // Announcement form
    const announcementForm = document.getElementById('announcement-form');
    if (announcementForm) {
        announcementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendAnnouncement(this);
        });
    }
    
    // Site settings form
    const siteSettingsForm = document.getElementById('site-settings-form');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSiteSettings(this);
        });
    }
}

// Load admin section
function loadAdminSection(section) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(s => s.style.display = 'none');
    
    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load section-specific data
    switch (section) {
        case 'users':
            loadUsersTable();
            break;
        case 'tournaments':
            loadTournamentsTable();
            break;
        case 'blog':
            loadBlogPostsTable();
            break;
        case 'donations':
            loadDonationsTable();
            break;
        case 'announcements':
            loadSentAnnouncements();
            break;
    }
}

// Load users table
function loadUsersTable() {
    const tbody = document.querySelector('#users-table tbody');
    if (!tbody) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const usersList = Object.values(users);
    
    if (usersList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = usersList.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.isAdmin ? 'Admin' : 'Member'}</td>
            <td>Active</td>
            <td>${formatDate(user.joinDate)}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editUser('${user.email}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteUser('${user.email}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load tournaments table
function loadTournamentsTable() {
    const tbody = document.querySelector('#tournaments-table tbody');
    if (!tbody) return;
    
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    
    if (tournaments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No tournaments found</td></tr>';
        return;
    }
    
    tbody.innerHTML = tournaments.map(tournament => `
        <tr>
            <td>${tournament.name}</td>
            <td>${formatDate(tournament.date)}</td>
            <td>${tournament.format}</td>
            <td>${tournament.location}</td>
            <td>${tournament.status}</td>
            <td>${tournament.maxParticipants || 'Unlimited'}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editTournament('${tournament.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteTournament('${tournament.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load blog posts table
function loadBlogPostsTable() {
    const tbody = document.querySelector('#blog-posts-table tbody');
    if (!tbody) return;
    
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    if (blogPosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No blog posts found</td></tr>';
        return;
    }
    
    tbody.innerHTML = blogPosts.map(post => `
        <tr>
            <td>${post.title}</td>
            <td>${post.author}</td>
            <td>${post.category}</td>
            <td>${post.status}</td>
            <td>${formatDate(post.publishDate)}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="editBlogPost('${post.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteBlogPost('${post.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load donations table
function loadDonationsTable() {
    const tbody = document.querySelector('#donations-table tbody');
    if (!tbody) return;
    
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    
    if (donations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No donations found</td></tr>';
        return;
    }
    
    tbody.innerHTML = donations.map(donation => `
        <tr>
            <td>${donation.name}</td>
            <td>$${donation.amount}</td>
            <td>${donation.tier}</td>
            <td>${formatDate(donation.date)}</td>
            <td>${donation.message || 'No message'}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="viewDonationDetails('${donation.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// Load sent announcements
function loadSentAnnouncements() {
    const container = document.getElementById('sent-announcements-list');
    if (!container) return;
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="no-announcements">No announcements sent yet</p>';
        return;
    }
    
    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <h4>${announcement.title}</h4>
            <p>${announcement.content}</p>
            <div class="announcement-meta">
                <span>Sent to: ${announcement.audience}</span>
                <span>Date: ${formatDate(announcement.date)}</span>
            </div>
        </div>
    `).join('');
}

// Filter functions
function filterUsers(searchTerm) {
    // Implementation for filtering users
    console.log('Filtering users:', searchTerm);
}

function filterTournaments(searchTerm) {
    // Implementation for filtering tournaments
    console.log('Filtering tournaments:', searchTerm);
}

function filterBlogPosts(searchTerm) {
    // Implementation for filtering blog posts
    console.log('Filtering blog posts:', searchTerm);
}

function filterDonations(searchTerm) {
    // Implementation for filtering donations
    console.log('Filtering donations:', searchTerm);
}

// Modal functions
function openAddUserModal() {
    alert('Add User Modal - Implementation needed');
}

function openAddTournamentModal() {
    alert('Add Tournament Modal - Implementation needed');
}

function openAddBlogPostModal() {
    alert('Add Blog Post Modal - Implementation needed');
}

function openAddAnnouncementModal() {
    alert('Add Announcement Modal - Implementation needed');
}

// Send announcement
function sendAnnouncement(form) {
    const title = form.querySelector('#announcement-title').value;
    const content = form.querySelector('#announcement-content').value;
    const audience = form.querySelector('#announcement-audience').value;
    
    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    const announcement = {
        id: Date.now().toString(),
        title,
        content,
        audience,
        date: new Date().toISOString(),
        sentBy: window.auth.currentUser().email
    };
    
    // Save announcement
    let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    announcements.push(announcement);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    
    alert('Announcement sent successfully!');
    form.reset();
    
    // Reload announcements
    loadSentAnnouncements();
}

// Save site settings
function saveSiteSettings(form) {
    const settings = {
        clubName: form.querySelector('#club-name').value,
        clubEmail: form.querySelector('#club-email').value,
        clubPhone: form.querySelector('#club-phone').value,
        clubAddress: form.querySelector('#club-address').value,
        clubDescription: form.querySelector('#club-description').value
    };
    
    // Save settings
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    alert('Settings saved successfully!');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Add CSS for admin panel
const adminStyles = `
<style>
.admin-container {
    display: flex;
    min-height: calc(100vh - 80px);
}

.admin-sidebar {
    width: 280px;
    background: #2c3e50;
    color: white;
    padding: 2rem 0;
    position: fixed;
    height: calc(100vh - 80px);
    overflow-y: auto;
}

.admin-sidebar-header {
    padding: 0 2rem 2rem;
    border-bottom: 1px solid #34495e;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.admin-sidebar-header h3 {
    margin: 0;
    color: white;
}

.admin-sidebar-toggle {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    display: none;
}

.admin-nav {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
}

.admin-nav li {
    margin: 0;
}

.admin-nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    color: #bdc3c7;
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
}

.admin-nav-link:hover,
.admin-nav-link.active {
    background: #34495e;
    color: white;
    border-left-color: #e74c3c;
}

.admin-nav-link i {
    width: 20px;
    text-align: center;
}

.admin-main {
    flex: 1;
    margin-left: 280px;
    padding: 2rem;
    background: #f8f9fa;
}

.admin-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
}

.admin-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #eee;
}

.admin-section-header h2 {
    margin: 0;
    color: #2c3e50;
}

.admin-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.admin-stat-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s ease;
}

.admin-stat-card:hover {
    transform: translateY(-5px);
}

.stat-icon {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 1rem;
}

.stat-content h3 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
}

.stat-content p {
    color: #666;
    margin: 0;
    font-weight: 600;
}

.admin-recent-activity {
    margin-top: 2rem;
}

.admin-recent-activity h3 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    width: 40px;
    height: 40px;
    background: #e74c3c;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.activity-content p {
    margin: 0;
    color: #2c3e50;
    font-weight: 600;
}

.activity-time {
    color: #666;
    font-size: 0.9rem;
}

.admin-search-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
}

.admin-search-bar input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}

.admin-search-bar select {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    min-width: 150px;
}

.admin-table-container {
    overflow-x: auto;
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.admin-table th,
.admin-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.admin-table th {
    background: #2c3e50;
    color: white;
    font-weight: 600;
}

.admin-table tr:hover {
    background: #f8f9fa;
}

.no-data {
    text-align: center;
    color: #666;
    font-style: italic;
}

.announcement-form {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.announcement-form h3 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.sent-announcements h3 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
}

.announcement-item {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.announcement-item h4 {
    color: #2c3e50;
    margin: 0 0 1rem 0;
}

.announcement-item p {
    color: #666;
    margin: 0 0 1rem 0;
    line-height: 1.6;
}

.announcement-meta {
    display: flex;
    gap: 2rem;
    color: #666;
    font-size: 0.9rem;
}

.settings-form {
    max-width: 800px;
}

.no-activity,
.no-announcements {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem;
}

@media (max-width: 1024px) {
    .admin-sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .admin-sidebar.active {
        transform: translateX(0);
    }
    
    .admin-sidebar-toggle {
        display: block;
    }
    
    .admin-main {
        margin-left: 0;
    }
    
    .admin-stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .admin-section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .admin-stats-grid {
        grid-template-columns: 1fr;
    }
    
    .admin-search-bar {
        flex-direction: column;
        align-items: stretch;
    }
    
    .admin-table {
        font-size: 0.9rem;
    }
    
    .admin-table th,
    .admin-table td {
        padding: 0.5rem;
    }
    
    .announcement-meta {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', adminStyles); 