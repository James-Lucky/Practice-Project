document.addEventListener('DOMContentLoaded', () => {
    renderDashboardTable();

    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', handleAddPost);
    }
});

const getPosts = () => JSON.parse(localStorage.getItem('earthhow_posts')) || [];
const savePosts = (posts) => localStorage.setItem('earthhow_posts', JSON.stringify(posts));

function handleAddPost(e) {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const category = document.getElementById('post-category').value;
    const image = document.getElementById('post-image').value;
    const content = document.getElementById('post-content').value;
    const section = document.getElementById('post-section').value;

    const newPost = {
        id: Date.now(),
        title,
        category,
        image,
        content,
        section,
        isFeatured: false
    };

    const posts = getPosts();
    posts.push(newPost);
    savePosts(posts);

    // Reset form and re-render table
    e.target.reset();
    renderDashboardTable();
    alert('Post added successfully!');
}

function deletePost(id) {
    if(confirm('Are you sure you want to delete this post?')) {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== id);
        savePosts(posts);
        renderDashboardTable();
    }
}

function renderDashboardTable() {
    const posts = getPosts();
    const tableBody = document.getElementById('posts-table-body');
    
    if (!tableBody) return;

    if (posts.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="empty-state">No posts found. Create one above!</td></tr>`;
        return;
    }

    tableBody.innerHTML = posts.map(post => `
        <tr>
            <td><img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/60x40?text=Error'"></td>
            <td><strong>${post.title}</strong></td>
            <td>${post.category}</td>
            <td>${post.section || 'General'}</td>
            <td>
                <button class="btn btn-danger" onclick="deletePost(${post.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}
