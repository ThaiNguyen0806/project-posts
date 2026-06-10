import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  email: string;
  created_at: string;
}

function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      setError('Post not found');
    }
  };

  if (!post) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="nav">
        <button onClick={() => navigate('/posts')}>← Back</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="post-card">
        <h1>{post.title}</h1>
        <p>By: <span
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate(`/users/${post.user_id}`)}
        >{post.email}</span></p>
        <p>{post.created_at}</p>
        <p>{post.content}</p>
      </div>
    </div>
  );
}

export default PostDetail;