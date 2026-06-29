// Add your News API key here (e.g., 'YOUR_API_KEY')
const NEWS_API_KEY = 'dfe1d707e2ea4b95b7e8138aceb49e6a';

// Initial dummy data for demonstration (For Admin Posts)
const initialPosts = [
    {
        id: 1,
        title: "What Are Herpetologists?",
        category: "Biology",
        image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80",
        content: "Herpetologists are scientists who study reptiles and amphibians. They explore their behavior, genetics, and ecology in these creatures.",
        isFeatured: true,
        section: "latest"
    }
];

// Initialize local storage if empty
if (!localStorage.getItem('earthhow_posts')) {
    localStorage.setItem('earthhow_posts', JSON.stringify(initialPosts));
}

// Clean up old API posts from earthhow_posts to fix the dashboard clutter
let adminPosts = JSON.parse(localStorage.getItem('earthhow_posts')) || [];
const originalLength = adminPosts.length;
adminPosts = adminPosts.filter(p => !p.sourceUrl); // Remove posts fetched from API (they have sourceUrl)
if (adminPosts.length !== originalLength) {
    localStorage.setItem('earthhow_posts', JSON.stringify(adminPosts));
}

const getAdminPosts = () => JSON.parse(localStorage.getItem('earthhow_posts')) || [];
const getAPIPosts = () => JSON.parse(localStorage.getItem('api_posts')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if (NEWS_API_KEY) {
        fetchNewsFromAPI().then(() => renderAll());
    } else {
        renderAll();
    }
});

async function fetchNewsFromAPI() {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=science OR environment OR earth OR space&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
            const categories = ['Atmosphere', 'Biology', 'Geology', 'Space', 'Water', 'Nature'];
            let apiPosts = [];

            // Limit to 50 posts so we don't blow up localStorage
            data.articles.slice(0, 50).forEach((article, index) => { 
                if (article.title && article.urlToImage && article.title !== "[Removed]") {
                    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                    
                    let section = 'category';
                    if (index === 0) section = 'latest';
                    else if (index > 0 && index <= 4) section = 'latest';

                    apiPosts.push({
                        id: Date.now() + Math.floor(Math.random() * 10000) + index,
                        title: article.title,
                        category: randomCategory,
                        image: article.urlToImage,
                        content: article.description || "Click to read more...",
                        isFeatured: false,
                        section: section,
                        sourceUrl: article.url
                    });
                }
            });

            localStorage.setItem('api_posts', JSON.stringify(apiPosts));
        } else {
            console.error("News API Error:", data.message);
        }
    } catch (error) {
        console.error("Failed to fetch news:", error);
    }
}

function renderAll() {
    renderAdminPosts();
    
    const apiPosts = getAPIPosts();
    if(apiPosts.length > 0) {
        renderAPIPosts(apiPosts);
    }
}

function renderAdminPosts(page = 1) {
    const allAdminPosts = getAdminPosts().reverse();
    const bentoContainer = document.getElementById('admin-posts-bento');
    const featuredContainer = document.getElementById('admin-featured-post-container');
    const sideContainer = document.getElementById('admin-side-posts-container');
    const paginationContainer = document.getElementById('admin-pagination');
    
    if (!bentoContainer || !featuredContainer || !sideContainer || !paginationContainer) return;

    if (allAdminPosts.length === 0) {
        bentoContainer.innerHTML = `<p style="text-align: center; color: #666; font-size: 18px; width: 100%; grid-column: 1 / -1;">No blog posts yet. Go to the <a href="dashboard.html" style="color: var(--primary-blue); font-weight: bold;">Admin Dashboard</a> to create one!</p>`;
        bentoContainer.style.display = 'block'; // Remove grid layout for the message
        paginationContainer.innerHTML = '';
        return;
    } else {
        bentoContainer.style.display = 'grid'; // Restore grid
    }

    const postsPerPage = 5;
    const totalPages = Math.ceil(allAdminPosts.length / postsPerPage) || 1;
    
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    const startIndex = (page - 1) * postsPerPage;
    const currentPosts = allAdminPosts.slice(startIndex, startIndex + postsPerPage);
    
    const featured = currentPosts[0];
    featuredContainer.innerHTML = `
        <a href="post.html?id=${featured.id}" class="featured-card">
            <img src="${featured.image}" alt="${featured.title}" onerror="this.src='https://via.placeholder.com/800x400?text=No+Image'">
            <div class="featured-content">
                <div class="category-pill"><div class="category-dot"></div>${featured.category || 'General'}</div>
                <h2>${featured.title}</h2>
                <div class="post-meta-text">Today &bull; By Admin</div>
            </div>
        </a>
    `;

    const sidePosts = currentPosts.slice(1);
    sideContainer.innerHTML = sidePosts.map(post => `
        <a href="post.html?id=${post.id}" class="side-post-card">
            <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/200x150?text=No+Image'">
            <div>
                <h3>${post.title}</h3>
                <div class="meta">Today &bull; By Admin</div>
            </div>
        </a>
    `).join('');

    // Pagination
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    let paginationHTML = `<button class="arrow-btn" style="border: none;" onclick="window.changeAdminPage(${page - 1})"><i class="fas fa-arrow-left"></i></button>`;
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<span class="page-num ${i === page ? 'active' : ''}" onclick="window.changeAdminPage(${i})">${i}</span>`;
    }
    paginationHTML += `<button class="arrow-btn" style="border: none;" onclick="window.changeAdminPage(${page + 1})"><i class="fas fa-arrow-right"></i></button>`;
    
    paginationContainer.innerHTML = paginationHTML;
    
    window.changeAdminPage = function(newPage) {
        if (newPage >= 1 && newPage <= totalPages) {
            renderAdminPosts(newPage);
        }
    };
}

function renderAPIPosts(apiPosts) {
    // 1. Render Latest Section
    const featuredContainer = document.getElementById('featured-post-container');
    const sidePostsContainer = document.getElementById('side-posts-container');
    
    let latestPosts = apiPosts.slice(0, 5); // Newest 5 posts

    if (latestPosts.length > 0 && featuredContainer && sidePostsContainer) {
        const featured = latestPosts[0];
        
        featuredContainer.innerHTML = `
            <a href="post.html?id=${featured.id}&type=api" class="featured-card">
                <img src="${featured.image}" alt="${featured.title}">
                <div class="featured-content">
                    <div class="category-pill"><div class="category-dot"></div>${featured.category}</div>
                    <h2>${featured.title}</h2>
                    <div class="post-meta-text">Today &bull; News Source</div>
                </div>
            </a>
        `;

        const sidePosts = latestPosts.slice(1);
        sidePostsContainer.innerHTML = sidePosts.map(post => `
            <a href="post.html?id=${post.id}&type=api" class="side-post-card">
                <img src="${post.image}" alt="${post.title}">
                <div>
                    <h3>${post.title}</h3>
                    <div class="meta">Today &bull; News API</div>
                </div>
            </a>
        `).join('');
    }

    // 2. Render News Highlights Grid
    renderHighlightsGrid(1, apiPosts);
}

function renderHighlightsGrid(page, posts) {
    const highlightsGrid = document.getElementById('highlights-grid');
    const paginationContainer = document.getElementById('highlights-pagination');
    
    if (!highlightsGrid || !paginationContainer) return;
    
    // Total posts available for highlights (skip first 5 which are in latest)
    const highlightPostsAll = posts.slice(5);
    const postsPerPage = 10;
    const totalPages = Math.ceil(highlightPostsAll.length / postsPerPage) || 1;
    
    // Ensure page is within bounds
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    
    const startIndex = (page - 1) * postsPerPage;
    const highlightPosts = highlightPostsAll.slice(startIndex, startIndex + postsPerPage);
    
    highlightsGrid.innerHTML = highlightPosts.map(post => `
        <a href="post.html?id=${post.id}&type=api" class="news-card">
            <img src="${post.image}" alt="${post.title}">
            <div class="category-pill" style="box-shadow: 0 2px 5px rgba(0,0,0,0.1);"><div class="category-dot"></div>${post.category}</div>
            <h3>${post.title}</h3>
            <p>${post.content ? post.content.substring(0, 100) + '...' : 'Read more about this news topic inside.'}</p>
            <div class="meta" style="font-size: 13px; color: #999;">Today &bull; News</div>
        </a>
    `).join('');
    
    // Render Pagination Controls
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    let paginationHTML = `<button class="arrow-btn" style="border: none;" onclick="window.changePage(${page - 1})"><i class="fas fa-arrow-left"></i></button>`;
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<span class="page-num ${i === page ? 'active' : ''}" onclick="window.changePage(${i})">${i}</span>`;
    }
    
    paginationHTML += `<button class="arrow-btn" style="border: none;" onclick="window.changePage(${page + 1})"><i class="fas fa-arrow-right"></i></button>`;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Expose changePage function globally
    window.changePage = function(newPage) {
        if (newPage >= 1 && newPage <= totalPages) {
            renderHighlightsGrid(newPage, getAPIPosts());
        }
    };
}
