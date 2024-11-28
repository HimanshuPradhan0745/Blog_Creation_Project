const blogsContainer = document.getElementById('blogs');
const toggleBlogsBtn = document.getElementById('toggle-blogs-btn');


toggleBlogsBtn.addEventListener('click', () => {
  if (blogsContainer.classList.contains('hidden')) {
    blogsContainer.classList.remove('hidden');
    toggleBlogsBtn.textContent = '- Close Blog List';
    fetchBlogs(); 
  } else {
    blogsContainer.classList.add('hidden');
    toggleBlogsBtn.textContent = '+ View All Blogs';
  }
});


async function fetchBlogs() {
  const res = await fetch('/blogs');
  const blogs = await res.json();

  blogsContainer.innerHTML = blogs
    .map(
      (blog) => `
      <div class="blog">
        <h2>${blog.title}</h2>
        <p><strong>${blog.author}</strong></p>
        <p>${blog.content}</p>
        <div class="comments">
          ${blog.comments
            .map(
              (comment) =>
                `<p>${comment.text} 
                  <button onclick="deleteComment('${blog.id}', '${comment.id}')">Delete</button>
                  <button onclick="editComment('${blog.id}', '${comment.id}')">Edit</button>
                </p>`
            )
            .join('')}
          <input type="text" id="comment-${blog.id}" placeholder="Add a comment">
          <button onclick="addComment('${blog.id}')">Comment</button>
        </div>
      </div>`
    )
    .join('');
}


async function addComment(blogId) {
  const commentInput = document.getElementById(`comment-${blogId}`);
  const text = commentInput.value;

  await fetch(`/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  commentInput.value = '';
  fetchBlogs();
}


async function deleteComment(blogId, commentId) {
  await fetch(`/blogs/${blogId}/comments/${commentId}`, {
    method: 'DELETE',
  });

  fetchBlogs();
}


async function editComment(blogId, commentId) {
  const newText = prompt('Edit your comment:');
  if (newText) {
    await fetch(`/blogs/${blogId}/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });

    fetchBlogs();
  }
}
