// Sample data for the chess club website

// Tournaments data
const tournaments = [
    {
        id: 1,
        name: "August Blitz Open",
        date: "2024-08-25T14:00:00",
        format: "Blitz",
        location: "Chess Club Hall",
        registrationDeadline: "2024-08-23T23:59:59",
        description: "Fast-paced blitz tournament with 5+0 time control. Open to all skill levels.",
        status: "open",
        maxParticipants: 32,
        entryFee: 25,
        registeredPlayers: 18,
        winner: null,
        results: null,
        pgnFile: null
    },
    {
        id: 2,
        name: "September Rapid Championship",
        date: "2024-09-15T10:00:00",
        format: "Rapid",
        location: "Community Center",
        registrationDeadline: "2024-09-13T23:59:59",
        description: "Rapid tournament with 15+10 time control. Swiss system with 5 rounds.",
        status: "open",
        maxParticipants: 24,
        entryFee: 35,
        registeredPlayers: 12,
        winner: null,
        results: null,
        pgnFile: null
    },
    {
        id: 3,
        name: "July Classical Tournament",
        date: "2024-07-20T09:00:00",
        format: "Classical",
        location: "Chess Club Hall",
        registrationDeadline: "2024-07-18T23:59:59",
        description: "Classical tournament with 90+30 time control. Round-robin format.",
        status: "completed",
        maxParticipants: 16,
        entryFee: 50,
        registeredPlayers: 16,
        winner: "John Smith",
        results: "1st: John Smith (5.5/7), 2nd: Sarah Johnson (5/7), 3rd: Mike Davis (4.5/7)",
        pgnFile: "july_classical_2024.pgn"
    },
    {
        id: 4,
        name: "June Blitz Championship",
        date: "2024-06-30T16:00:00",
        format: "Blitz",
        location: "Online - Lichess",
        registrationDeadline: "2024-06-29T23:59:59",
        description: "Online blitz tournament on Lichess. 3+2 time control.",
        status: "completed",
        maxParticipants: 50,
        entryFee: 0,
        registeredPlayers: 42,
        winner: "Alex Chen",
        results: "1st: Alex Chen, 2nd: Maria Garcia, 3rd: David Wilson",
        pgnFile: null
    }
];

// Blog posts data
const blogPosts = [
    {
        id: 1,
        title: "July Classical Tournament Results",
        author: "Chess Club Admin",
        publishDate: "2024-07-22T10:00:00",
        category: "Tournament Recaps",
        excerpt: "The July Classical Tournament was a great success with 16 participants competing in a round-robin format.",
        content: `
            <h2>July Classical Tournament Results</h2>
            <p>The July Classical Tournament concluded successfully with 16 participants competing in a round-robin format over 7 rounds. The tournament featured a 90+30 time control, providing players with plenty of time to think through their moves.</p>
            
            <h3>Final Standings</h3>
            <ol>
                <li><strong>John Smith</strong> - 5.5/7 points</li>
                <li><strong>Sarah Johnson</strong> - 5/7 points</li>
                <li><strong>Mike Davis</strong> - 4.5/7 points</li>
                <li>David Wilson - 4/7 points</li>
                <li>Maria Garcia - 3.5/7 points</li>
            </ol>
            
            <h3>Key Games</h3>
            <p>The tournament featured several exciting games, including a dramatic final round encounter between John Smith and Sarah Johnson that decided the tournament winner. John Smith's victory in this game secured him the championship with a half-point margin.</p>
            
            <h3>Looking Forward</h3>
            <p>We're already planning our next classical tournament for September. Stay tuned for more details!</p>
        `,
        featuredImage: "tournament-recap.jpg",
        tags: ["tournament", "classical", "results"]
    },
    {
        id: 2,
        title: "New Member Spotlight: Sarah Johnson",
        author: "Chess Club Admin",
        publishDate: "2024-07-15T14:00:00",
        category: "Member Spotlights",
        excerpt: "Meet Sarah Johnson, our newest club member who has quickly risen through the ranks.",
        content: `
            <h2>New Member Spotlight: Sarah Johnson</h2>
            <p>This month, we're excited to feature Sarah Johnson, who joined our club just six months ago and has already made a significant impact on our community.</p>
            
            <h3>Sarah's Chess Journey</h3>
            <p>Sarah discovered chess during the pandemic and quickly fell in love with the game. She started playing online and gradually improved her skills through daily practice and study.</p>
            
            <p>"I love the strategic depth of chess," Sarah says. "Every game is different, and there's always something new to learn. The chess club has been amazing for my development as a player."</p>
            
            <h3>Recent Achievements</h3>
            <p>In just six months, Sarah has:</p>
            <ul>
                <li>Improved her rating by 200 points</li>
                <li>Won the June Blitz Championship</li>
                <li>Finished second in the July Classical Tournament</li>
                <li>Become a mentor to newer players</li>
            </ul>
            
            <h3>Advice for New Players</h3>
            <p>"Don't be afraid to lose," Sarah advises. "Every loss is a learning opportunity. Focus on understanding why you lost and how you can improve. Also, don't hesitate to ask stronger players for advice - most are happy to help!"</p>
        `,
        featuredImage: "member-spotlight.jpg",
        tags: ["member", "spotlight", "achievement"]
    },
    {
        id: 3,
        title: "Club News: New Equipment and Facilities",
        author: "Chess Club Admin",
        publishDate: "2024-07-10T09:00:00",
        category: "Club News",
        excerpt: "We're excited to announce new equipment and improved facilities for our members.",
        content: `
            <h2>Club News: New Equipment and Facilities</h2>
            <p>We're thrilled to announce several improvements to our club facilities that will enhance your chess experience.</p>
            
            <h3>New Tournament Equipment</h3>
            <p>Thanks to generous donations from our members and local sponsors, we've acquired:</p>
            <ul>
                <li>20 new tournament-quality chess sets</li>
                <li>Digital chess clocks for all tournament games</li>
                <li>Large demonstration board for analysis sessions</li>
                <li>Improved lighting throughout the playing area</li>
            </ul>
            
            <h3>Facility Improvements</h3>
            <p>We've also made several improvements to our club space:</p>
            <ul>
                <li>New comfortable seating for players and spectators</li>
                <li>Dedicated analysis room with multiple chess sets</li>
                <li>Improved ventilation and climate control</li>
                <li>Better storage for equipment and materials</li>
            </ul>
            
            <h3>Thank You</h3>
            <p>We'd like to extend our gratitude to all members who contributed to these improvements. Your support helps make our club a better place for everyone.</p>
            
            <p>Come check out the new equipment at our next club meeting!</p>
        `,
        featuredImage: "new-equipment.jpg",
        tags: ["club", "equipment", "facilities"]
    },
    {
        id: 4,
        title: "Strategy Corner: Opening Principles",
        author: "Coach Mike",
        publishDate: "2024-07-05T16:00:00",
        category: "Strategy",
        excerpt: "Learn the fundamental opening principles that every chess player should know.",
        content: `
            <h2>Strategy Corner: Opening Principles</h2>
            <p>Welcome to our new Strategy Corner series! In this first installment, we'll cover the fundamental opening principles that every chess player should understand.</p>
            
            <h3>The Three Golden Rules</h3>
            <p>When starting a game of chess, remember these three essential principles:</p>
            
            <h4>1. Control the Center</h4>
            <p>The center of the board (d4, d5, e4, e5) is the most important area. Pieces placed in or controlling the center have more influence over the game.</p>
            
            <h4>2. Develop Your Pieces</h4>
            <p>Get your knights and bishops out early. Don't move the same piece multiple times in the opening unless necessary.</p>
            
            <h4>3. Castle Early</h4>
            <p>Protect your king by castling within the first 10 moves. This also helps connect your rooks.</p>
            
            <h3>Common Mistakes to Avoid</h3>
            <ul>
                <li>Moving pawns too much in the opening</li>
                <li>Bringing out the queen too early</li>
                <li>Neglecting king safety</li>
                <li>Moving pieces without a clear plan</li>
            </ul>
            
            <h3>Practice Exercise</h3>
            <p>Try this simple exercise: In your next few games, focus on following these three principles. Don't worry about winning - just practice good opening play.</p>
            
            <p>Next time, we'll look at some specific opening variations and how they relate to these principles.</p>
        `,
        featuredImage: "strategy-corner.jpg",
        tags: ["strategy", "opening", "principles"]
    }
];

// Users data
const users = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        role: "Member",
        membershipStatus: "Active",
        membershipExpiry: "2024-12-31",
        joinDate: "2023-01-15",
        rating: 1800,
        tournamentsPlayed: 12
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        role: "Member",
        membershipStatus: "Active",
        membershipExpiry: "2024-12-31",
        joinDate: "2024-01-20",
        rating: 1650,
        tournamentsPlayed: 8
    },
    {
        id: 3,
        name: "Mike Davis",
        email: "mike.davis@email.com",
        role: "Admin",
        membershipStatus: "Active",
        membershipExpiry: "2024-12-31",
        joinDate: "2022-06-10",
        rating: 1900,
        tournamentsPlayed: 25
    },
    {
        id: 4,
        name: "Maria Garcia",
        email: "maria.garcia@email.com",
        role: "Member",
        membershipStatus: "Active",
        membershipExpiry: "2024-12-31",
        joinDate: "2023-08-05",
        rating: 1550,
        tournamentsPlayed: 6
    },
    {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@email.com",
        role: "Member",
        membershipStatus: "Expired",
        membershipExpiry: "2024-06-30",
        joinDate: "2023-03-12",
        rating: 1700,
        tournamentsPlayed: 10
    }
];

// Club statistics
const clubStats = {
    totalMembers: 45,
    activeMembers: 38,
    upcomingTournaments: 2,
    tournamentsThisYear: 8,
    averageRating: 1650,
    totalGamesPlayed: 324
};

// Functions to load data
function loadUpcomingEvents() {
    const upcomingEvents = tournaments.filter(t => t.status === 'open');
    const container = document.getElementById('upcoming-events');
    
    if (container) {
        container.innerHTML = upcomingEvents.slice(0, 3).map(event => `
            <div class="event-card">
                <h3>${event.name}</h3>
                <div class="event-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(event.date)}</span>
                    <span><i class="fas fa-clock"></i> ${event.format}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-actions">
                    <a href="tournaments.html#register-${event.id}" class="btn btn-primary btn-small">Register</a>
                    <a href="tournaments.html#details-${event.id}" class="btn btn-secondary btn-small">Details</a>
                </div>
            </div>
        `).join('');
    }
}

function loadLatestPosts() {
    const container = document.getElementById('latest-posts');
    
    if (container) {
        container.innerHTML = blogPosts.slice(0, 3).map(post => `
            <div class="post-card" data-category="${post.category.toLowerCase().replace(' ', '-')}">
                <div class="post-image">
                    <i class="fas fa-newspaper"></i>
                </div>
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.publishDate)}</span>
                    </div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="blog.html#post-${post.id}" class="btn btn-secondary btn-small">Read More</a>
                </div>
            </div>
        `).join('');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUpcomingEvents();
    loadLatestPosts();
});

// Export data for use in other scripts
window.chessClubData = {
    tournaments,
    blogPosts,
    users,
    clubStats
}; 