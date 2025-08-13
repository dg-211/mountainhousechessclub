// Tournaments page functionality

let currentTournaments = [];
let selectedTournament = null;

// Initialize tournaments page
document.addEventListener('DOMContentLoaded', function() {
    loadTournaments();
    setupTournamentFormHandlers();
    
    // Check authentication status
    if (window.auth) {
        window.auth.updateAuthUI();
    }
});

// Load tournaments from localStorage
function loadTournaments() {
    const savedTournaments = localStorage.getItem('tournaments');
    if (savedTournaments) {
        currentTournaments = JSON.parse(savedTournaments);
    } else {
        currentTournaments = [];
    }
    
    loadUpcomingTournaments();
    loadPastTournaments();
}

// Load upcoming tournaments
function loadUpcomingTournaments() {
    const container = document.getElementById('upcoming-tournaments');
    if (!container) return;
    
    const upcoming = currentTournaments.filter(t => 
        new Date(t.date) > new Date() && t.status === 'upcoming'
    );
    
    if (upcoming.length === 0) {
        container.innerHTML = `
            <div class="no-tournaments">
                <p>No upcoming tournaments scheduled yet.</p>
                <p>Check back later or contact us to suggest tournament dates.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = upcoming.map(tournament => `
        <div class="tournament-card" data-id="${tournament.id}" data-status="${tournament.status}" data-format="${tournament.format}">
            <div class="tournament-header">
                <h3>${tournament.name}</h3>
                <span class="tournament-status ${tournament.status}">${tournament.status}</span>
            </div>
            <div class="tournament-details">
                <p><i class="fas fa-calendar"></i> ${formatDate(tournament.date)}</p>
                <p><i class="fas fa-clock"></i> ${formatTime(tournament.date)}</p>
                <p><i class="fas fa-chess"></i> ${tournament.format}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${tournament.location}</p>
                <p><i class="fas fa-users"></i> ${tournament.maxParticipants || 'Unlimited'} participants</p>
                <p><i class="fas fa-dollar-sign"></i> Entry Fee: $${tournament.entryFee || 'Free'}</p>
            </div>
            <div class="tournament-description">
                <p>${tournament.description}</p>
            </div>
            <div class="tournament-actions">
                <button class="btn btn-primary" onclick="openRegistrationModal('${tournament.id}')">Register Now</button>
                <button class="btn btn-secondary" onclick="showTournamentDetails('${tournament.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

// Load past tournaments
function loadPastTournaments() {
    const tbody = document.querySelector('#past-tournaments-table tbody');
    if (!tbody) return;
    
    const past = currentTournaments.filter(t => 
        new Date(t.date) <= new Date() || t.status === 'completed'
    );
    
    if (past.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No past tournaments available yet.</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = past.map(tournament => `
        <tr data-id="${tournament.id}">
            <td>${tournament.name}</td>
            <td>${formatDate(tournament.date)}</td>
            <td>${tournament.format}</td>
            <td>${tournament.winner || 'Not available'}</td>
            <td>
                <button class="btn btn-small btn-secondary" onclick="showTournamentResults('${tournament.id}')">View Results</button>
                ${tournament.pgnFile ? `<button class="btn btn-small btn-primary" onclick="downloadPGN('${tournament.pgnFile}')">Download PGN</button>` : ''}
            </td>
        </tr>
    `).join('');
}

// Filter tournaments
function filterTournaments(filter) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const tournamentCards = document.querySelectorAll('.tournament-card');
    
    tournamentCards.forEach(card => {
        const status = card.dataset.status;
        const format = card.dataset.format;
        
        let show = false;
        
        switch (filter) {
            case 'all':
                show = true;
                break;
            case 'upcoming':
                show = status === 'upcoming';
                break;
            case 'past':
                show = status === 'completed' || status === 'past';
                break;
            case 'blitz':
                show = format === 'blitz';
                break;
            case 'rapid':
                show = format === 'rapid';
                break;
            case 'classical':
                show = format === 'classical';
                break;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Open registration modal
function openRegistrationModal(tournamentId) {
    selectedTournament = currentTournaments.find(t => t.id === tournamentId);
    if (!selectedTournament) return;
    
    // Pre-fill form if user is signed in
    if (window.auth && window.auth.currentUser()) {
        const user = window.auth.currentUser();
        document.getElementById('player-name').value = user.name;
        document.getElementById('player-email').value = user.email;
    }
    
    openModal('registration-modal');
}

// Show tournament details
function showTournamentDetails(tournamentId) {
    const tournament = currentTournaments.find(t => t.id === tournamentId);
    if (!tournament) return;
    
    const modal = document.getElementById('tournament-details-modal');
    const content = document.getElementById('tournament-details-content');
    
    content.innerHTML = `
        <h2>${tournament.name}</h2>
        <div class="tournament-details-full">
            <div class="detail-row">
                <strong>Date:</strong> ${formatDate(tournament.date)}
            </div>
            <div class="detail-row">
                <strong>Time:</strong> ${formatTime(tournament.date)}
            </div>
            <div class="detail-row">
                <strong>Format:</strong> ${tournament.format}
            </div>
            <div class="detail-row">
                <strong>Location:</strong> ${tournament.location}
            </div>
            <div class="detail-row">
                <strong>Entry Fee:</strong> $${tournament.entryFee || 'Free'}
            </div>
            <div class="detail-row">
                <strong>Max Participants:</strong> ${tournament.maxParticipants || 'Unlimited'}
            </div>
            <div class="detail-row">
                <strong>Registration Deadline:</strong> ${formatDate(tournament.registrationDeadline)}
            </div>
            <div class="detail-row">
                <strong>Description:</strong>
                <p>${tournament.description}</p>
            </div>
            ${tournament.rules ? `
                <div class="detail-row">
                    <strong>Tournament Rules:</strong>
                    <p>${tournament.rules}</p>
                </div>
            ` : ''}
        </div>
        <div class="tournament-actions">
            <button class="btn btn-primary" onclick="openRegistrationModal('${tournament.id}')">Register Now</button>
            <button class="btn btn-secondary" onclick="closeModal('tournament-details-modal')">Close</button>
        </div>
    `;
    
    openModal('tournament-details-modal');
}

// Show tournament results
function showTournamentResults(tournamentId) {
    const tournament = currentTournaments.find(t => t.id === tournamentId);
    if (!tournament) return;
    
    const modal = document.getElementById('tournament-details-modal');
    const content = document.getElementById('tournament-details-content');
    
    content.innerHTML = `
        <h2>${tournament.name} - Results</h2>
        <div class="tournament-results">
            ${tournament.results ? `
                <div class="results-content">
                    ${tournament.results}
                </div>
            ` : `
                <p>Results are not available yet for this tournament.</p>
            `}
        </div>
        <div class="tournament-actions">
            <button class="btn btn-secondary" onclick="closeModal('tournament-details-modal')">Close</button>
        </div>
    `;
    
    openModal('tournament-details-modal');
}

// Download PGN file
function downloadPGN(filename) {
    // Simulate PGN download
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent('Sample PGN content - replace with actual PGN data')}`;
    link.download = filename;
    link.click();
}

// Setup tournament form handlers
function setupTournamentFormHandlers() {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processRegistration(this);
        });
    }
}

// Process tournament registration
function processRegistration(form) {
    if (!selectedTournament) {
        alert('No tournament selected');
        return;
    }
    
    if (!window.mainUtils.validateForm(form)) {
        return;
    }
    
    const formData = {
        tournamentId: selectedTournament.id,
        tournamentName: selectedTournament.name,
        playerName: form.querySelector('#player-name').value,
        playerEmail: form.querySelector('#player-email').value,
        playerSection: form.querySelector('#player-section').value,
        playerPhone: form.querySelector('#player-phone').value,
        playerNotes: form.querySelector('#player-notes').value,
        agreeTerms: form.querySelector('#agree-terms').checked,
        registrationDate: new Date().toISOString()
    };
    
    // Save registration to localStorage
    saveRegistration(formData);
    
    // Update user's tournament history if signed in
    if (window.auth && window.auth.currentUser()) {
        updateUserTournaments(formData);
    }
    
    // Show success message
    alert(`Registration successful for ${selectedTournament.name}! You will receive a confirmation email shortly.`);
    
    // Close modal and reset form
    closeModal('registration-modal');
    form.reset();
    selectedTournament = null;
}

// Save registration to localStorage
function saveRegistration(registration) {
    let registrations = JSON.parse(localStorage.getItem('tournamentRegistrations')) || [];
    registrations.push(registration);
    localStorage.setItem('tournamentRegistrations', JSON.stringify(registrations));
}

// Update user's tournament history
function updateUserTournaments(registration) {
    const user = window.auth.currentUser();
    if (!user) return;
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[user.email]) {
        if (!users[user.email].tournaments) {
            users[user.email].tournaments = [];
        }
        users[user.email].tournaments.push(registration);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

// Add CSS for tournaments page
const tournamentStyles = `
<style>
.tournament-filters {
    padding: 2rem 0;
    background: #f8f9fa;
}

.filter-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #e74c3c;
    background: white;
    color: #e74c3c;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.filter-btn:hover,
.filter-btn.active {
    background: #e74c3c;
    color: white;
}

.tournaments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.tournament-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.tournament-card:hover {
    transform: translateY(-5px);
}

.tournament-header {
    background: #2c3e50;
    color: white;
    padding: 1.5rem;
    position: relative;
}

.tournament-header h3 {
    margin: 0;
    font-size: 1.3rem;
}

.tournament-status {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.tournament-status.upcoming {
    background: #27ae60;
    color: white;
}

.tournament-status.completed {
    background: #95a5a6;
    color: white;
}

.tournament-details {
    padding: 1.5rem;
}

.tournament-details p {
    margin: 0.5rem 0;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tournament-details i {
    width: 20px;
    color: #e74c3c;
}

.tournament-description {
    padding: 0 1.5rem;
    margin-bottom: 1rem;
}

.tournament-description p {
    color: #666;
    line-height: 1.6;
}

.tournament-actions {
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    border-top: 1px solid #eee;
}

.tournament-actions .btn {
    flex: 1;
}

.past-tournaments {
    padding: 4rem 0;
    background: #f8f9fa;
}

.tournaments-table-container {
    overflow-x: auto;
    margin-top: 2rem;
}

.tournaments-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tournaments-table th,
.tournaments-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.tournaments-table th {
    background: #2c3e50;
    color: white;
    font-weight: 600;
}

.tournaments-table tr:hover {
    background: #f8f9fa;
}

.no-tournaments,
.no-data {
    text-align: center;
    color: #666;
    padding: 2rem;
}

.registration-form {
    max-width: 600px;
    margin: 0 auto;
}

.tournament-details-full {
    margin: 2rem 0;
}

.detail-row {
    margin: 1rem 0;
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.detail-row strong {
    color: #2c3e50;
    display: inline-block;
    width: 150px;
}

.tournament-results {
    margin: 2rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.tournament-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .filter-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .tournaments-grid {
        grid-template-columns: 1fr;
    }
    
    .tournament-actions {
        flex-direction: column;
    }
    
    .tournaments-table {
        font-size: 0.9rem;
    }
    
    .tournaments-table th,
    .tournaments-table td {
        padding: 0.5rem;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', tournamentStyles); 