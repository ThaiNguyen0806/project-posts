import { DefaultCRUDRepository, inject, repository } from '@venizia/ignis';
import { PostgresDataSource } from '@/datasources/postgres.datasource';
import { Post } from '@/models/post.model';
import { Pool } from 'pg';

@repository({ model: Post, dataSource: PostgresDataSource })
export class PostRepository extends DefaultCRUDRepository<typeof Post.schema> {
  private pool: Pool;

  constructor(
    @inject({ key: 'datasources.PostgresDataSource' })
    dataSource: PostgresDataSource,
  ) {
    super(dataSource);
    this.pool = dataSource.getPool();
  }

  async findAllPosts() {
    const result = await this.pool.query(
      `SELECT posts.id, posts.user_id, posts.title, posts.content, posts.created_at, users.email
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );
    return result.rows;
  }

  async findPostById(id: number) {
    const result = await this.pool.query(
      `SELECT posts.id, posts.user_id, posts.title, posts.content, posts.created_at, users.email
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async findPostsByUserId(userId: number) {
    const result = await this.pool.query(
      `SELECT posts.id, posts.user_id, posts.title, posts.content, posts.created_at, users.email
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $1
       ORDER BY posts.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async searchPosts(q: string) {
    const result = await this.pool.query(
      `SELECT posts.id, posts.user_id, posts.title, posts.content, posts.created_at, users.email
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.title ILIKE $1
       ORDER BY posts.created_at DESC`,
      [`%${q}%`]
    );
    return result.rows;
  }

  async createPost(userId: number, title: string, content: string) {
    const result = await this.pool.query(
      'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    return result.rows[0];
  }

  async updatePost(id: number, title: string, content: string) {
    const result = await this.pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return result.rows[0];
  }

  async deletePost(id: number) {
    await this.pool.query('DELETE FROM posts WHERE id = $1', [id]);
  }
  
}
