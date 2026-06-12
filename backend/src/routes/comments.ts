import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /comments/:postId - get all comments for a post
router.get('/:postId', async (req: Request, res: Response) => {
  const result = await pool.query(
    `SELECT comments.id, comments.content, comments.created_at, comments.user_id, users.email
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE comments.post_id = $1
     ORDER BY comments.created_at ASC`,
    [req.params.postId]
  );
  res.json({ comments: result.rows });
});

// POST /comments/:postId - add a comment to a post
router.post('/:postId', authenticateToken, async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const result = await pool.query(
    `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
    [req.params.postId, req.user!.id, content]
  );

  res.status(201).json({ comment: result.rows[0] });
});

// DELETE /comments/:id - delete a comment
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  const existing = await pool.query('SELECT * FROM comments WHERE id = $1', [req.params.id]);

  if (!existing.rows[0]) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (existing.rows[0].user_id !== req.user!.id) {
    return res.status(403).json({ message: 'You can only delete your own comments' });
  }

  await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
  res.json({ message: 'Comment deleted' });
});

export default router;