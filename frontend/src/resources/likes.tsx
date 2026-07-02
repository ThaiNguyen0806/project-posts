import { useRecordContext, useGetIdentity } from 'react-admin';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const PostLikes = () => {
    const post = useRecordContext();
    const { identity } = useGetIdentity();
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!post?.id || !identity) return;
        fetchLikes();
    }, [post?.id, identity]);

    const fetchLikes = async () => {
      if (!post?.id) return;
      try {
        const res = await fetch(`${API_URL}/likes/${post.id}`, {
          headers: getHeaders(),
        });
        const json = await res.json();
        setLikeCount(json.count);
        setLiked(json.liked);
      } catch (err) {
        console.error(err);
      }
    };

  const handleToggleLike = async () => {
    if (!post?.id) return;
    try {
      const res = await fetch(`${API_URL}/likes/${post.id}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      const json = await res.json();
      setLiked(json.liked);
      setLikeCount((prev) => (json.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  if (!identity) return <p>❤️ {likeCount} likes</p>;

  return (
    <div style={{ marginTop: '16px' }}>
      <button onClick={handleToggleLike}>
        {liked ? '❤️ Liked' : '🤍 Like'} ({likeCount})
      </button>
    </div>
  );
};
