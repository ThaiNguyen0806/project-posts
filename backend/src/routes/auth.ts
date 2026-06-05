import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

//REGISTER
router.post('/register', async (req: Request, res: Response) => { 
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(`INSERT INTO users (email, password) VALUES ($1, $2)
                                        RETURNING id, email`, [email, hashedPassword]);

        res.status(201).json({user: result.rows[0]});
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

//LOGIN
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    const user = result.rows[0];

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
});

//GET CURRENT USER
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [userId]);
    res.json({ user: result.rows[0] });
});

export default router;