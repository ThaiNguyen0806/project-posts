import { useParams, useNavigate } from 'react-router-dom';
import { useGetList } from 'react-admin';

export const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: posts, isLoading } = useGetList('posts', {
    meta: { userId },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '16px' }}>
      <button onClick={() => navigate('/posts')}>← Back</button>
      <h2>Posts by User {userId}</h2>
      {posts?.length === 0 && <p>No posts found.</p>}
      {posts?.map((post) => (
        <div key={post.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
          <h3
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/posts/${post.id}/show`)}
          >
            {post.title}
          </h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};