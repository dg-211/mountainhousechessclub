// Dashboard functionality

let currentUser = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!window.auth || !window.auth.isAuthenticated()) {
        window.location.href = '/';
        return;
    }
    
    currentUser = window.auth.currentUser();
    if (!currentUser) {
        window.location.href = '/';
        return;
    }
    
    loadMemberProfile();
    loadTournamentHistory();
    loadUpcomingEvents();
    loadPatronageInfo();
    setupDashboardForms();
    
    // Update authentication UI
    if (window.auth) {
        window.auth.updateAuthUI();
    }
});

// Load member profile
function loadMemberProfile() {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileStatus = document.getElementById('profile-avatar');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    
    // Set profile picture
    if (profileStatus && currentUser.picture) {
        profileStatus.src = currentUser.picture;
    }
    
    // Set status based on admin privileges
    const statusElement = document.getElementById('profile-status');
    if (statusElement) {
        if (currentUser.isAdmin) {
            statusElement.textContent = 'Admin Member';
            statusElement.className = 'admin-status';
        } else {
            statusElement.textContent = 'Club Member';
            statusElement.className = 'member-status';
        }
    }
    
    // Calculate days as member
    const joinDate = new Date(currentUser.joinDate);
    const today = new Date();
    const daysDiff = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
    
    const daysMemberElement = document.getElementById('days-member');
    if (daysMemberElement) {
        daysMemberElement.textContent = daysDiff;
    }
}

// Load tournament history
function loadTournamentHistory() {
    const tbody = document.querySelector('#tournament-history-table tbody');
    if (!tbody) return;
    
    const userTournaments = currentUser.tournaments || [];
    
    if (userTournaments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No tournament history available yet.</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = userTournaments.map(registration => `
        <tr>
            <td>${registration.tournamentName}</td>
            <td>${formatDate(registration.registrationDate)}</td>
            <td>${getTournamentFormat(registration.tournamentId)}</td>
            <td>${registration.result || 'Not played yet'}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="viewTournamentDetails('${registration.tournamentId}')">View Details</button>
            </td>
        </tr>
    `).join('');
    
    // Update tournaments played count
    const tournamentsPlayedElement = document.getElementById('tournaments-played');
    if (tournamentsPlayedElement) {
        tournamentsPlayedElement.textContent = userTournaments.length;
    }
}

// Load upcoming events
function loadUpcomingEvents() {
    const container = document.getElementById('upcoming-events-dashboard');
    if (!container) return;
    
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const upcoming = tournaments.filter(t => 
        new Date(t.date) > new Date() && t.status === 'upcoming'
    ).slice(0, 3);
    
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <p>No upcoming tournaments scheduled.</p>
                <a href="tournaments.html" class="btn btn-primary">View All Tournaments</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = upcoming.map(tournament => `
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

// Load patronage information
function loadPatronageInfo() {
    const container = document.getElementById('patronage-info');
    if (!container) return;
    
    const userDonations = currentUser.donations || [];
    
    if (userDonations.length === 0) {
        container.innerHTML = `
            <div class="no-patronage">
                <p>You haven't made any donations yet.</p>
                <p>Become a patron to support our chess club!</p>
            </div>
        `;
        
        // Update donations count
        const donationsMadeElement = document.getElementById('donations-made');
        if (donationsMadeElement) {
            donationsMadeElement.textContent = '0';
        }
        return;
    }
    
    // Calculate total donations and highest tier
    const totalAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
    const highestTier = getHighestTier(userDonations);
    
    container.innerHTML = `
        <div class="patronage-summary">
            <div class="patronage-tier">
                <h3>${getTierDisplayName(highestTier)} Patron</h3>
                <p>Your highest patronage level</p>
            </div>
            <div class="patronage-stats">
                <div class="stat">
                    <span class="stat-number">$${totalAmount}</span>
                    <span class="stat-label">Total Donated</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${userDonations.length}</span>
                    <span class="stat-label">Donations Made</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${formatDate(userDonations[userDonations.length - 1].date).full}</span>
                    <span class="stat-label">Last Donation</span>
                </div>
            </div>
        </div>
    `;
    
    // Update donations count
    const donationsMadeElement = document.getElementById('donations-made');
    if (donationsMadeElement) {
        donationsMadeElement.textContent = userDonations.length;
    }
}

// Setup dashboard forms
function setupDashboardForms() {
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges(this);
        });
    }
}

// Open edit profile modal
function openEditProfileModal() {
    // Pre-fill form with current user data
    const editName = document.getElementById('edit-name');
    const editPhone = document.getElementById('edit-phone');
    const editBio = document.getElementById('edit-bio');
    const editChessLevel = document.getElementById('edit-chess-level');
    
    if (editName) editName.value = currentUser.name || '';
    if (editPhone) editPhone.value = currentUser.phone || '';
    if (editBio) editBio.value = currentUser.bio || '';
    if (editChessLevel) editChessLevel.value = currentUser.chessLevel || 'beginner';
    
    openModal('edit-profile-modal');
}

// Save profile changes
function saveProfileChanges(form) {
    const formData = {
        name: form.querySelector('#edit-name').value,
        phone: form.querySelector('#edit-phone').value,
        bio: form.querySelector('#edit-bio').value,
        chessLevel: form.querySelector('#edit-chess-level').value
    };
    
    // Validate form
    if (!formData.name.trim()) {
        alert('Name is required');
        return;
    }
    
    // Update user data
    currentUser.name = formData.name;
    currentUser.phone = formData.phone;
    currentUser.bio = formData.bio;
    currentUser.chessLevel = formData.chessLevel;
    
    // Save to localStorage
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[currentUser.email]) {
        users[currentUser.email] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update UI
    loadMemberProfile();
    
    // Show success message
    alert('Profile updated successfully!');
    
    // Close modal
    closeModal('edit-profile-modal');
}

// Open donation history modal
function openRenewalModal() {
    const modal = document.getElementById('renewal-modal');
    const content = document.getElementById('donation-history-content');
    
    const userDonations = currentUser.donations || [];
    
    if (userDonations.length === 0) {
        content.innerHTML = `
            <div class="no-donations">
                <p>You haven't made any donations yet.</p>
                <a href="donations.html" class="btn btn-primary">Make Your First Donation</a>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="donation-history">
                <h3>Your Donation History</h3>
                <div class="donation-list">
                    ${userDonations.map(donation => `
                        <div class="donation-item">
                            <div class="donation-header">
                                <span class="donation-amount">$${donation.amount}</span>
                                <span class="donation-date">${formatDate(donation.date).full}</span>
                            </div>
                            <div class="donation-details">
                                <p><strong>Tournament:</strong> ${donation.tournamentName}</p>
                                <p><strong>Tier:</strong> ${getTierDisplayName(donation.tier)} Patron</p>
                                ${donation.message ? `<p><strong>Message:</strong> ${donation.message}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    openModal('renewal-modal');
}

// View tournament details
function viewTournamentDetails(tournamentId) {
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (tournament) {
        // Redirect to tournaments page with the specific tournament
        window.location.href = `tournaments.html#${tournamentId}`;
    } else {
        alert('Tournament details not available');
    }
}

// Get tournament format
function getTournamentFormat(tournamentId) {
    const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
    const tournament = tournaments.find(t => t.id === tournamentId);
    return tournament ? tournament.format : 'Unknown';
}

// Get highest tier from donations
function getHighestTier(donations) {
    const tierOrder = { 'bronze': 1, 'silver': 2, 'gold': 3, 'custom': 0 };
    let highest = 'none';
    
    donations.forEach(donation => {
        if (tierOrder[donation.tier] > tierOrder[highest]) {
            highest = donation.tier;
        }
    });
    
    return highest;
}

// Get tier display name
function getTierDisplayName(tier) {
    const tierNames = {
        'bronze': 'Bronze',
        'silver': 'Silver',
        'gold': 'Gold',
        'custom': 'Custom',
        'none': 'None'
    };
    return tierNames[tier] || 'Custom';
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

// Add CSS for dashboard
const dashboardStyles = `
<style>
.profile-section {
    padding: 4rem 0;
    background: #f8f9fa;
}

.profile-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #e74c3c;
}

.profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-info h2 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.profile-info p {
    color: #666;
    margin-bottom: 0.5rem;
}

.admin-status {
    color: #e74c3c;
    font-weight: 600;
}

.member-status {
    color: #27ae60;
    font-weight: 600;
}

.stats-section {
    padding: 4rem 0;
    background: white;
}

.stats-section h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.stat-card {
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 12px;
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-card i {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 1rem;
}

.stat-card h3 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.stat-card p {
    color: #666;
    font-weight: 600;
}

.patronage-section {
    padding: 4rem 0;
    background: #f8f9fa;
}

.patronage-section h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.patronage-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
    margin-bottom: 2rem;
}

.patronage-summary {
    text-align: center;
}

.patronage-tier h3 {
    color: #e74c3c;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.patronage-tier p {
    color: #666;
    margin-bottom: 2rem;
}

.patronage-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
}

.stat-label {
    color: #666;
    font-size: 0.9rem;
}

.patronage-actions {
    text-align: center;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.tournament-history {
    padding: 4rem 0;
    background: white;
}

.tournament-history h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.tournament-table-container {
    overflow-x: auto;
}

.tournament-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tournament-table th,
.tournament-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.tournament-table th {
    background: #2c3e50;
    color: white;
    font-weight: 600;
}

.tournament-table tr:hover {
    background: #f8f9fa;
}

.upcoming-events-dashboard {
    padding: 4rem 0;
    background: #f8f9fa;
}

.upcoming-events-dashboard h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.no-patronage,
.no-donations {
    text-align: center;
    color: #666;
    padding: 2rem;
}

.no-events {
    text-align: center;
    color: #666;
    padding: 2rem;
    grid-column: 1 / -1;
}

.profile-form {
    max-width: 600px;
    margin: 0 auto;
}

.donation-history {
    max-width: 800px;
    margin: 0 auto;
}

.donation-list {
    margin-top: 2rem;
}

.donation-item {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.donation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.donation-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #27ae60;
}

.donation-date {
    color: #666;
    font-size: 0.9rem;
}

.donation-details p {
    margin: 0.5rem 0;
    color: #2c3e50;
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .patronage-stats {
        grid-template-columns: 1fr;
    }
    
    .patronage-actions {
        flex-direction: column;
    }
    
    .events-grid {
        grid-template-columns: 1fr;
    }
    
    .donation-header {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', dashboardStyles); 