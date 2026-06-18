import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  role: string;
}

export const authenticateToken = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('authorization');

  if (!authHeader) {
    return c.json({ message: 'No token provided' }, 401);
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const decoded = jwt.verify(token, secret) as TokenPayload;
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ message: 'Invalid or expired token' }, 403);
  }
});