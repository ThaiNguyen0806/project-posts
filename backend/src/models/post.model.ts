import { BaseEntity, model } from '@venizia/ignis';
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

@model({ type: 'entity' })
export class Post extends BaseEntity<typeof Post.schema> {
  static override schema = pgTable('posts', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    created_at: timestamp('created_at').defaultNow(),
  });

  static override relations = () => [];
  static override TABLE_NAME = 'posts';
}