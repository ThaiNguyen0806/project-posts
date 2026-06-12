import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface Comment {
  id: number;
  content: string;
  email: string;
  user_id: number;
  created_at: string;
}

function PostDetail() {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const token = localStorage.getItem('token');
  const currentUser = token ? jwtDecode<TokenPayload>(token) : null;

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      setError('Post not found');
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/comments/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      setError('Failed to load comments');
    }
  };

  const handleAddComment = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/comments/${id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete comment');
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
        <h2>Comments</h2>

{token && (
  <form onSubmit={handleAddComment}>
    <div>
      <label>Add a comment</label>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
    </div>
    <button type="submit">Post Comment</button>
  </form>
)}

{comments.length === 0 ? (
  <p>No comments yet.</p>
) : (
          comments.map((comment) => (
            <div key={comment.id} className="post-card">
              <p>{comment.content}</p>
              <p>By: <span
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => navigate(`/users/${comment.user_id}`)}
              >{comment.email}</span></p>
              {currentUser?.id === comment.user_id && (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
            </div>
          ))
        )}
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