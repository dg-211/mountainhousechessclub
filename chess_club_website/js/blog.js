// Blog functionality

let currentBlogPosts = [];
let currentFilter = 'all';

// Initialize blog page
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    setupBlogSearch();
    
    // Check authentication status
    if (window.auth) {
        window.auth.updateAuthUI();
    }
    
    // Check for direct post link in URL hash
    const hash = window.location.hash;
    if (hash) {
        const postId = hash.substring(1);
        showBlogPost(postId);
    }
});

// Load blog posts from localStorage
function loadBlogPosts() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        currentBlogPosts = JSON.parse(savedPosts);
    } else {
        currentBlogPosts = [];
    }
    
    displayBlogPosts();
}

// Display blog posts
function displayBlogPosts() {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;
    
    let postsToShow = currentBlogPosts;
    
    // Apply filter
    if (currentFilter !== 'all') {
        postsToShow = currentBlogPosts.filter(post => post.category === currentFilter);
    }
    
    // Filter by published status
    postsToShow = postsToShow.filter(post => post.status === 'published');
    
    // Sort by publish date (newest first)
    postsToShow.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    
    if (postsToShow.length === 0) {
        grid.innerHTML = `
            <div class="no-posts">
                <p>No blog posts available yet.</p>
                <p>Check back later for updates!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = postsToShow.map(post => `
        <div class="post-card" data-category="${post.category}" data-id="${post.id}">
            <div class="post-image">
                <img src="${post.featuredImage || 'images/default-post.jpg'}" alt="${post.title}">
            </div>
            <div class="post-content">
                <div class="post-category">${getCategoryDisplayName(post.category)}</div>
                <h3>${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date"><i class="fas fa-calendar"></i> ${formatDate(post.publishDate)}</span>
                    <span class="post-author"><i class="fas fa-user"></i> ${post.author}</span>
                </div>
                <button class="btn btn-secondary btn-small" onclick="showBlogPost('${post.id}')">Read More</button>
            </div>
        </div>
    `).join('');
}

// Show full blog post
function showBlogPost(postId) {
    const post = currentBlogPosts.find(p => p.id === postId);
    if (!post) {
        alert('Blog post not found');
        return;
    }
    
    const modal = document.getElementById('blog-post-modal');
    const content = document.getElementById('blog-post-full');
    
    content.innerHTML = `
        <div class="blog-post-header">
            <div class="post-category">${getCategoryDisplayName(post.category)}</div>
            <h1>${post.title}</h1>
            <div class="post-meta-full">
                <span class="post-date"><i class="fas fa-calendar"></i> ${formatDate(post.publishDate)}</span>
                <span class="post-author"><i class="fas fa-user"></i> ${post.author}</span>
                ${post.readTime ? `<span class="post-read-time"><i class="fas fa-clock"></i> ${post.readTime} min read</span>` : ''}
            </div>
        </div>
        
        ${post.featuredImage ? `
            <div class="post-featured-image">
                <img src="${post.featuredImage}" alt="${post.title}">
            </div>
        ` : ''}
        
        <div class="post-content-full">
            ${post.content}
        </div>
        
        ${post.tags && post.tags.length > 0 ? `
            <div class="post-tags">
                <strong>Tags:</strong>
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
        
        <div class="post-actions">
            <button class="btn btn-secondary" onclick="closeModal('blog-post-modal')">Back to Blog</button>
            <button class="btn btn-primary" onclick="sharePost('${post.id}')">Share Post</button>
        </div>
    `;
    
    openModal('blog-post-modal');
    
    // Update URL hash for direct linking
    window.location.hash = postId;
}

// Filter blog posts by category
function filterBlogPosts(category) {
    currentFilter = category;
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayBlogPosts();
}

// Search blog posts
function searchPosts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayBlogPosts();
        return;
    }
    
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;
    
    const filteredPosts = currentBlogPosts.filter(post => 
        post.status === 'published' &&
        (post.title.toLowerCase().includes(searchTerm) ||
         post.excerpt.toLowerCase().includes(searchTerm) ||
         post.content.toLowerCase().includes(searchTerm) ||
         post.author.toLowerCase().includes(searchTerm))
    );
    
    if (filteredPosts.length === 0) {
        grid.innerHTML = `
            <div class="no-posts">
                <p>No posts found matching "${searchTerm}".</p>
                <p>Try different keywords or browse all posts.</p>
            </div>
        `;
        return;
    }
    
    // Sort by relevance (posts with search term in title first)
    filteredPosts.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(searchTerm);
        const bTitleMatch = b.title.toLowerCase().includes(searchTerm);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return new Date(b.publishDate) - new Date(a.publishDate);
    });
    
    grid.innerHTML = filteredPosts.map(post => `
        <div class="post-card" data-category="${post.category}" data-id="${post.id}">
            <div class="post-image">
                <img src="${post.featuredImage || 'images/default-post.jpg'}" alt="${post.title}">
            </div>
            <div class="post-content">
                <div class="post-category">${getCategoryDisplayName(post.category)}</div>
                <h3>${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span class="post-date"><i class="fas fa-calendar"></i> ${formatDate(post.publishDate)}</span>
                    <span class="post-author"><i class="fas fa-user"></i> ${post.author}</span>
                </div>
                <button class="btn btn-secondary btn-small" onclick="showBlogPost('${post.id}')">Read More</button>
            </div>
        </div>
    `).join('');
}

// Setup blog search functionality
function setupBlogSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        // Search as user types (with debouncing)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.trim()) {
                    searchPosts();
                } else {
                    displayBlogPosts();
                }
            }, 300);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPosts();
            }
        });
    }
}

// Get category display name
function getCategoryDisplayName(category) {
    const categoryNames = {
        'tournament-recaps': 'Tournament Recaps',
        'club-news': 'Club News',
        'member-spotlights': 'Member Spotlights',
        'strategy-tips': 'Strategy Tips'
    };
    return categoryNames[category] || category;
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

// Share post functionality
function sharePost(postId) {
    const post = currentBlogPosts.find(p => p.id === postId);
    if (!post) return;
    
    const url = `${window.location.origin}${window.location.pathname}#${postId}`;
    const title = post.title;
    const text = post.excerpt;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('Post link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Post link copied to clipboard!');
        });
    }
}

// Add CSS for blog page
const blogStyles = `
<style>
.blog-controls {
    padding: 2rem 0;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.blog-controls .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.blog-filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.blog-filter-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #e74c3c;
    background: white;
    color: #e74c3c;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 600;
}

.blog-filter-btn:hover,
.blog-filter-btn.active {
    background: #e74c3c;
    color: white;
}

.blog-search {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.blog-search input {
    padding: 0.5rem 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    min-width: 250px;
}

.blog-search input:focus {
    outline: none;
    border-color: #e74c3c;
}

.blog-posts {
    padding: 4rem 0;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
}

.post-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.post-card:hover {
    transform: translateY(-5px);
}

.post-image {
    height: 200px;
    overflow: hidden;
}

.post-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.post-card:hover .post-image img {
    transform: scale(1.05);
}

.post-content {
    padding: 1.5rem;
}

.post-category {
    display: inline-block;
    background: #e74c3c;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 1rem;
}

.post-content h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    line-height: 1.4;
}

.post-excerpt {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
}

.post-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #666;
}

.post-meta span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.post-meta i {
    color: #e74c3c;
}

.blog-post-content {
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
}

.blog-post-header {
    text-align: center;
    margin-bottom: 2rem;
}

.blog-post-header h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin: 1rem 0;
    line-height: 1.3;
}

.post-meta-full {
    display: flex;
    justify-content: center;
    gap: 2rem;
    color: #666;
    font-size: 0.9rem;
    flex-wrap: wrap;
}

.post-meta-full span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.post-featured-image {
    margin: 2rem 0;
    text-align: center;
}

.post-featured-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.post-content-full {
    line-height: 1.8;
    color: #2c3e50;
    font-size: 1.1rem;
}

.post-content-full p {
    margin-bottom: 1.5rem;
}

.post-content-full h2,
.post-content-full h3 {
    color: #2c3e50;
    margin: 2rem 0 1rem;
}

.post-tags {
    margin: 2rem 0;
    padding: 1rem 0;
    border-top: 1px solid #eee;
}

.post-tags strong {
    color: #2c3e50;
    margin-right: 1rem;
}

.tag {
    display: inline-block;
    background: #f8f9fa;
    color: #666;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    margin: 0.25rem;
}

.post-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.no-posts {
    text-align: center;
    color: #666;
    padding: 4rem 2rem;
    grid-column: 1 / -1;
}

.no-posts p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .blog-controls .container {
        flex-direction: column;
        align-items: stretch;
    }
    
    .blog-search input {
        min-width: auto;
        flex: 1;
    }
    
    .posts-grid {
        grid-template-columns: 1fr;
    }
    
    .blog-post-header h1 {
        font-size: 2rem;
    }
    
    .post-meta-full {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .post-actions {
        flex-direction: column;
    }
}
</style>
`;

// Inject styles into the page
document.head.insertAdjacentHTML('beforeend', blogStyles); 