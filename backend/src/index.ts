import express from 'express';
import authRoutes from './routes/auth';
import 'dotenv/config';
import postsRoutes from './routes/posts';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



//SWAGGER SETUP
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));