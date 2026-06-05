import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  content: string;
  email: string;
  created_at: string;
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/posts');
      setPosts(res.data.posts);
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  const handleCreate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/posts',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="nav">
        <h1>Posts</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleCreate}>
        <h2>Create Post</h2>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      <h2>All Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>By: {post.email}</p>
          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Posts;