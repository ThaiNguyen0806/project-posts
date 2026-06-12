import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

//GET /likes/:postId - get like count and whether current user liked it
router.get('/:postId', authenticateToken, async (req: Request, res: Response) => {
  const countResult = await pool.query(
    'SELECT COUNT(*) FROM likes WHERE post_id = $1',
    [req.params.postId]
  );

  const userLikeResult = await pool.query(
    'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
    [req.params.postId, req.user!.id]
  );

  res.json({
    count: parseInt(countResult.rows[0].count),
    liked: userLikeResult.rows.length > 0,
  });
});

//POST /likes/:postId - toggle like
router.post('/:postId', authenticateToken, async (req: Request, res: Response) => {
  const existing = await pool.query(
    'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
    [req.params.postId, req.user!.id]
  );

  if (existing.rows.length > 0) {
    await pool.query(
      'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
      [req.params.postId, req.user!.id]
    );
    return res.json({ liked: false });
  }

  await pool.query(
    'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
    [req.params.postId, req.user!.id]
  );
  res.json({ liked: true });
});

export default router;