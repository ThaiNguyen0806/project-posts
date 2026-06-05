import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

//GET ALL POSTS
router.get('/', async (req: Request, res: Response) => {
    const result = await pool.query(`Select posts.id, posts.title, posts.content, posts.created_at, users.email
                                        FROM posts
                                        JOIN users ON posts.user_id = users.id
                                        ORDER BY posts.created_at DESC`);
    res.json({ posts: result.rows });
});

//GET POST BY ID
router.get('/:id', async (req: Request, res: Response) => {
    const result = await pool.query(`Select posts.id, posts.title, posts.content, posts.created_at, users.email
                                        FROM posts
                                        JOIN users ON posts.user_id = users.id
                                        WHERE posts.id = $1`, [req.params.id]);

    if (!result.rows[0]) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ post: result.rows[0] });
});

//CREATE POST
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const { title, content } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const result = await pool.query(`INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`, 
                                    [ req.user!.id, title, content]);

    res.status(201).json({ post: result.rows[0] });
});

//UPDATE POST
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    const { title, content } = req.body;

    const existing = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (existing.rows[0].user_id !== req.user!.id) {
        return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    const result = await pool.query(`UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
                                    [title, content, req.params.id]);

    res.json({ post: result.rows[0] });
});

//DELETE POST
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const existing = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (existing.rows[0].user_id !== req.user!.id) {
        return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
});

export default router;