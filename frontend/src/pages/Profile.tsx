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

function Profile() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserPosts();
  }, [id]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/user/${id}`);
      setPosts(res.data.posts);
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  return (
    <div className="container">
      <div className="nav">
        <h1>{posts[0]?.email}'s Posts</h1>
        <button onClick={() => navigate('/posts')}>Back</button>
      </div>

      {error && <p className="error">{error}</p>}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>{post.created_at}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Profile;