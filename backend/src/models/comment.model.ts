import { BaseEntity, model } from '@venizia/ignis';
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

@model({ type: 'entity' })
export class Comment extends BaseEntity<typeof Comment.schema> {
  static override schema = pgTable('comments', {
    id: serial('id').primaryKey(),
    post_id: integer('post_id').notNull(),
    user_id: integer('user_id').notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  });

  static override relations = () => [];
  static override TABLE_NAME = 'comments';
}