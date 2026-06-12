import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import 'dotenv/config';
import postsRoutes from './routes/posts';
import commentsRoutes from './routes/comments';
import likesRoutes from './routes/likes';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);
app.use('/likes', likesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



//SWAGGER SETUP
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));