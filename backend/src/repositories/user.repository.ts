import { DefaultCRUDRepository, inject, repository } from '@venizia/ignis';
import { PostgresDataSource } from '@/datasources/postgres.datasource';
import { User } from '@/models/user.model';
import { Pool } from 'pg';

@repository({ model: User, dataSource: PostgresDataSource })
export class UserRepository extends DefaultCRUDRepository<typeof User.schema> {
  private pool: Pool;

  constructor(
    @inject({ key: 'datasources.PostgresDataSource' })
    dataSource: PostgresDataSource,
  ) {
    super(dataSource);
    this.pool = dataSource.getPool();
  }

  async findByEmail(email: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async createUser(email: string, hashedPassword: string) {
    const result = await this.pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    return result.rows[0];
  }

  async findUserById(id: number) {
    const result = await this.pool.query(
        'SELECT id, email, role, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}
}