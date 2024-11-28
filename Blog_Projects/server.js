const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.static('public'));


const filePath = path.join(__dirname, 'data', 'blogs.json');

function readBlogs() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeBlogs(blogs) {
  fs.writeFileSync(filePath, JSON.stringify(blogs, null, 2), 'utf8');
}




app.post('/blogs', (req, res) => {
  const blogs = readBlogs();
  const { title, author, content } = req.body;

  const newBlog = {
    id: Date.now().toString(),
    title,
    author,
    content,
    comments: [],
    createdAt: new Date(),
  };

  blogs.push(newBlog);
  writeBlogs(blogs);

  res.json(newBlog);
});


app.get('/blogs', (req, res) => {
  const blogs = readBlogs();
  res.json(blogs);
});


app.post('/blogs/:id/comments', (req, res) => {
  const blogs = readBlogs();
  const blog = blogs.find((b) => b.id === req.params.id);

  if (blog) {
    const newComment = {
      id: Date.now().toString(),
      text: req.body.text,
      createdAt: new Date(),
    };
    blog.comments.push(newComment);
    writeBlogs(blogs);
    res.json(blog);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});


app.delete('/blogs/:blogId/comments/:commentId', (req, res) => {
  const blogs = readBlogs();
  const blog = blogs.find((b) => b.id === req.params.blogId);

  if (blog) {
    blog.comments = blog.comments.filter((c) => c.id !== req.params.commentId);
    writeBlogs(blogs);
    res.json(blog);
  } else {
    res.status(404).json({ error: 'Blog or comment not found' });
  }
});


app.put('/blogs/:blogId/comments/:commentId', (req, res) => {
  const blogs = readBlogs();
  const blog = blogs.find((b) => b.id === req.params.blogId);

  if (blog) {
    const comment = blog.comments.find((c) => c.id === req.params.commentId);
    if (comment) {
      comment.text = req.body.text;
      writeBlogs(blogs);
      res.json(blog);
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
