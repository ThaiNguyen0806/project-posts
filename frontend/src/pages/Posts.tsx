import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  role: string;
}

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  email: string;
  created_at: string;
}

function Posts() {
  const token = localStorage.getItem('token');
  const currentUser = token ? jwtDecode<TokenPayload>(token) : null;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');


  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      fetchPosts();
    } else {
      searchPosts();
    }
  }, [search]);


  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/posts');
      setPosts(res.data.posts);
    } catch (err) {
      setError('Failed to load posts');
    }
  };


  const searchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/search?q=${search}`);
      setPosts(res.data.posts);
    } catch (err) {
      setError('Search failed');
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

  const handleEdit = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:3000/posts/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditTitle('');
      setEditContent('');
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post');
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
      <input
        className="search-input"
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          {editingId === post.id ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="post-actions">
                <button onClick={() => handleEdit(post.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
                <h3
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >{post.title}</h3>
              <p>{post.content}</p>
                <p>By: <span
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => navigate(`/users/${post.user_id}`)}
                >{post.email}</span></p>
        {post.user_id === currentUser?.id && (
          <>
              <button style={{marginRight: '8px'}} onClick={() => {
                setEditingId(post.id);
                setEditTitle(post.title);
                setEditContent(post.content);
              }}>Edit</button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
          </>
        )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Posts;