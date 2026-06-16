import { DefaultCRUDRepository, inject, repository } from '@venizia/ignis';
import { PostgresDataSource } from '@/datasources/postgres.datasource';
import { Like } from '@/models/like.model';
import { Pool } from 'pg';

@repository({ model: Like, dataSource: PostgresDataSource })
export class LikeRepository extends DefaultCRUDRepository<typeof Like.schema> {
  private pool: Pool;

  constructor(
    @inject({ key: 'datasources.PostgresDataSource' })
    dataSource: PostgresDataSource,
  ) {
    super(dataSource);
    this.pool = dataSource.getPool();
  }

  //Get the total number of likes for a specific post
  async getLikeCount(postId: number) {
    const result = await this.pool.query(
      'SELECT COUNT(*) FROM likes WHERE post_id = $1',
      [postId]
    );
    return parseInt(result.rows[0].count);
  }

  //Check if a specific user has liked a specific post
  async getUserLike(postId: number, userId: number) {
    const result = await this.pool.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );
    return result.rows[0];
  }

  //Insert a new like row for a post/user combination
  async createLike(postId: number, userId: number) {
    await this.pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
      [postId, userId]
    );
  }

  //Remove a like row for a post/user combination
  async deleteLike(postId: number, userId: number) {
    await this.pool.query(
      'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );
  }

  // If not already liked then like, otherwise unlike. Returns whether the post is now liked or not.
  async toggleLike(postId: number, userId: number) {
    const existing = await this.pool.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      await this.deleteLike(postId, userId);
      return { liked: false };
    }

    await this.createLike(postId, userId);
    return { liked: true };
  }
}