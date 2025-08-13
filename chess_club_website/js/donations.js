// Donations functionality

let selectedTier = null;
let selectedAmount = 0;

// Select donation tier
function selectDonationTier(tier, amount) {
    selectedTier = tier;
    selectedAmount = amount;
    
    // Populate donation form
    document.getElementById('donation-amount').value = `$${amount}`;
    document.getElementById('donation-tier').value = tier.charAt(0).toUpperCase() + tier.slice(1) + ' Patron';
    
    // Pre-fill donor info if user is signed in
    if (window.auth && window.auth.currentUser()) {
        const user = window.auth.currentUser();
        document.getElementById('donor-name').value = user.name;
        document.getElementById('donor-email').value = user.email;
    }
    
    openModal('donation-modal');
}

// Select custom donation amount
function selectCustomDonation() {
    const amount = document.getElementById('custom-amount').value;
    if (!amount || amount < 1) {
        alert('Please enter a valid amount');
        return;
    }
    
    selectedTier = 'custom';
    selectedAmount = parseInt(amount);
    
    // Populate donation form
    document.getElementById('donation-amount').value = `$${amount}`;
    document.getElementById('donation-tier').value = 'Custom Donation';
    
    // Pre-fill donor info if user is signed in
    if (window.auth && window.auth.currentUser()) {
        const user = window.auth.currentUser();
        document.getElementById('donor-name').value = user.name;
        document.getElementById('donor-email').value = user.email;
    }
    
    openModal('donation-modal');
}

// Handle donation form submission
document.addEventListener('DOMContentLoaded', function() {
    const donationForm = document.getElementById('donation-form');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processDonation(this);
        });
    }
    
    // Load current patrons
    loadCurrentPatrons();
});

// Process donation
function processDonation(form) {
    const formData = {
        name: form.querySelector('#donor-name').value,
        email: form.querySelector('#donor-email').value,
        amount: selectedAmount,
        tier: selectedTier,
        message: form.querySelector('#donation-message').value,
        anonymous: form.querySelector('#anonymous-donation').checked,
        date: new Date().toISOString()
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.amount) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Save donation to local storage
    saveDonation(formData);
    
    // Update user's donation history if signed in
    if (window.auth && window.auth.currentUser()) {
        updateUserDonations(formData);
    }
    
    // Show success message
    alert(`Thank you for your donation of $${formData.amount}! You are now a ${formData.tier} patron of our chess club.`);
    
    // Close modal and reset form
    closeModal('donation-modal');
    form.reset();
    
    // Refresh patrons display
    loadCurrentPatrons();
}

// Save donation to local storage
function saveDonation(donation) {
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.push(donation);
    localStorage.setItem('donations', JSON.stringify(donations));
}

// Update user's donation history
function updateUserDonations(donation) {
    const user = window.auth.currentUser();
    if (!user) return;
    
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[user.email]) {
        if (!users[user.email].donations) {
            users[user.email].donations = [];
        }
        users[user.email].donations.push(donation);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Load current patrons
function loadCurrentPatrons() {
    const patronsGrid = document.getElementById('patrons-grid');
    if (!patronsGrid) return;
    
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Group donations by email to avoid duplicates
    const uniquePatrons = {};
    donations.forEach(donation => {
        if (!uniquePatrons[donation.email]) {
            uniquePatrons[donation.email] = {
                name: donation.anonymous ? 'Anonymous Patron' : donation.name,
                email: donation.email,
                totalAmount: 0,
                highestTier: 'none',
                lastDonation: donation.date
            };
        }
        
        uniquePatrons[donation.email].totalAmount += donation.amount;
        
        // Determine highest tier
        const tierOrder = { 'bronze': 1, 'silver': 2, 'gold': 3, 'custom': 0 };
        if (tierOrder[donation.tier] > tierOrder[uniquePatrons[donation.email].highestTier]) {
            uniquePatrons[donation.email].highestTier = donation.tier;
        }
    });
    
    // Convert to array and sort by total amount
    const patronsList = Object.values(uniquePatrons)
        .filter(patron => patron.totalAmount > 0)
        .sort((a, b) => b.totalAmount - a.totalAmount);
    
    if (patronsList.length === 0) {
        patronsGrid.innerHTML = '<p class="no-patrons">Be the first to become a patron! Your support will help us grow our chess community.</p>';
        return;
    }
    
    patronsGrid.innerHTML = patronsList.map(patron => `
        <div class="patron-card">
            <div class="patron-info">
                <h4>${patron.name}</h4>
                <p class="patron-tier">${getTierDisplayName(patron.highestTier)} Patron</p>
                <p class="patron-amount">Total: $${patron.totalAmount}</p>
                <p class="patron-date">Since: ${formatDate(patron.lastDonation)}</p>
            </div>
        </div>
    `).join('');
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add CSS for donations page
const donationStyles = `
<style>
.donation-options {
    padding: 80px 0;
    background: #f8f9fa;
}

.donation-intro {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
    font-size: 1.1rem;
    color: #666;
    line-height: 1.6;
}

.patronage-tiers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
}

.tier-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
    position: relative;
    transition: transform 0.3s ease;
}

.tier-card:hover {
    transform: translateY(-5px);
}

.tier-card.featured {
    border: 3px solid #e74c3c;
    transform: scale(1.05);
}

.tier-badge {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: #e74c3c;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

.tier-header h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.tier-price {
    font-size: 2.5rem;
    font-weight: 700;
    color: #e74c3c;
    margin-bottom: 2rem;
}

.tier-benefits {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
    text-align: left;
}

.tier-benefits li {
    padding: 0.5rem 0;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tier-benefits i {
    color: #27ae60;
    font-size: 1.1rem;
}

.custom-donation {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
}

.custom-donation h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.custom-amount-form {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}

.custom-amount-form input {
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    width: 150px;
}

.impact-section {
    padding: 80px 0;
    background: white;
}

.impact-section h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.impact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.impact-item {
    text-align: center;
    padding: 2rem;
}

.impact-item i {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 1rem;
}

.impact-item h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.impact-item p {
    color: #666;
    line-height: 1.6;
}

.patrons-section {
    padding: 80px 0;
    background: #f8f9fa;
}

.patrons-section h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 3rem;
}

.patrons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.patron-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
}

.patron-info h4 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.patron-tier {
    color: #e74c3c;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.patron-amount {
    color: #27ae60;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.patron-date {
    color: #666;
    font-size: 0.9rem;
}

.no-patrons {
    text-align: center;
    color: #666;
    font-style: italic;
    grid-column: 1 / -1;
    padding: 2rem;
}

.donation-form {
    max-width: 500px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .patronage-tiers {
        grid-template-columns: 1fr;
    }
    
    .tier-card.featured {
        transform: none;
    }
    
    .custom-amount-form {
        flex-direction: column;
    }
    
    .impact-grid {
        grid-template-columns: 1fr;
    }
    
    .patrons-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', donationStyles); 