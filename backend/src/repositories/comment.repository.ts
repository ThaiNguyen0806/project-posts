import { DefaultCRUDRepository, inject, repository } from '@venizia/ignis';
import { PostgresDataSource } from '@/datasources/postgres.datasource';
import { Comment } from '@/models/comment.model';
import { Pool } from 'pg';

@repository({ model: Comment, dataSource: PostgresDataSource })
export class CommentRepository extends DefaultCRUDRepository<typeof Comment.schema> {
  private pool: Pool;

  constructor(
    @inject({ key: 'datasources.PostgresDataSource' })
    dataSource: PostgresDataSource,
  ) {
    super(dataSource);
    this.pool = dataSource.getPool();
  }

  async findCommentsByPostId(postId: number) {
    const result = await this.pool.query(
      `SELECT comments.id, comments.content, comments.created_at, comments.user_id, users.email
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`,
      [postId]
    );
    return result.rows;
  }

  async createComment(postId: number, userId: number, content: string) {
    const result = await this.pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [postId, userId, content]
    );
    return result.rows[0];
  }

  async findCommentById(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM comments WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async deleteComment(id: number) {
    await this.pool.query('DELETE FROM comments WHERE id = $1', [id]);
  }
  
}