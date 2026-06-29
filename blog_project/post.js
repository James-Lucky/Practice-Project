document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    const postType = urlParams.get('type');

    let posts = [];
    if (postType === 'api') {
        posts = JSON.parse(localStorage.getItem('api_posts')) || [];
    } else {
        posts = JSON.parse(localStorage.getItem('earthhow_posts')) || [];
    }
    
    // Fallback: If not found in primary source, check the other one just in case
    let post = posts.find(p => p.id === postId);
    if (!post) {
        const otherPosts = JSON.parse(localStorage.getItem(postType === 'api' ? 'earthhow_posts' : 'api_posts')) || [];
        post = otherPosts.find(p => p.id === postId);
    }

    const container = document.getElementById('single-post-container');

    if (!post) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2 style="margin-bottom: 20px;">Post Not Found</h2>
                <p>Sorry, the post you are looking for does not exist.</p>
                <a href="index.html" class="btn" style="display: inline-block; margin-top: 20px; text-decoration: none;">Return Home</a>
            </div>
        `;
        return;
    }

    // Set page title
    document.title = `${post.title} - EarthHow`;

    // Render post content
    container.innerHTML = `
        <div class="post-header">
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                <span class="post-category-badge">${post.category}</span>
                <span><i class="far fa-calendar-alt"></i> ${new Date().toLocaleDateString()}</span>
            </div>
        </div>
        <div class="post-image-container">
            <img src="${post.image}" alt="${post.title}">
        </div>
        <div class="post-content-body">
            <!-- If we had full markdown or HTML content, we'd render it here. For now we just use the description but expand it slightly to look like a post -->
            <p style="font-size: 22px; margin-bottom: 30px;"><strong>${post.content || post.title}</strong></p>
            ${post.sourceUrl ? `<a href="${post.sourceUrl}" target="_blank" class="btn" style="display: inline-block; text-decoration: none; margin-bottom: 20px;">Read Original Article <i class="fas fa-external-link-alt"></i></a>` : ''}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 20px;">
            <a href="index.html" style="color: var(--primary-blue); font-weight: 600; text-decoration: none;">&larr; Back to all posts</a>
        </div>
    `;
});
