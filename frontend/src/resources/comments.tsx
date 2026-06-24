import {
  useGetList,
  useGetIdentity,
  useCreate,
  useDelete,
  useRecordContext,
} from 'react-admin';
import { useState } from 'react';

export const PostComments = () => {
  const post = useRecordContext();
  const { identity } = useGetIdentity();
  const [content, setContent] = useState('');

  const { data: comments, refetch } = useGetList('comments', {
    meta: { postId: post?.id },
  });

  const [create] = useCreate();
  const [deleteOne] = useDelete();

  const handleAddComment = async () => {
    if (!content.trim()) return;
    await create('comments', { data: { content }, meta: { postId: post?.id } }, { onSuccess: () => refetch() });
    setContent('');
  };

  const handleDeleteComment = async (id: number) => {
    await deleteOne('comments', { id }, { onSuccess: () => refetch() });
  }
  if (!post) return null;

  return (
    <div>
      <h3>Comments</h3>

      {comments?.map((comment) => (
        <div key={comment.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
          <p>{comment.content}</p>
          <p style={{ color: '#888', fontSize: '12px' }}>By: {comment.email}</p>
          {Number(identity?.id) === comment.user_id && (
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
          )}
        </div>
      ))}

      {identity && (
        <div style={{ marginTop: '16px' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            style={{ width: '100%', minHeight: '80px' }}
          />
          <button onClick={handleAddComment}>Post Comment</button>
        </div>
      )}
    </div>
  );
};