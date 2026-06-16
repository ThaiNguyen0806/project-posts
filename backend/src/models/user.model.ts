import { BaseEntity, model } from '@venizia/ignis';
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

@model({
  type: 'entity',
  settings: {
    hiddenProperties: ['password'],
  },
})
export class User extends BaseEntity<typeof User.schema> {
  static override schema = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: varchar('role', { length: 50 }).default('user'),
    created_at: timestamp('created_at').defaultNow(),
  });

  static override relations = () => [];
  static override TABLE_NAME = 'users';
}