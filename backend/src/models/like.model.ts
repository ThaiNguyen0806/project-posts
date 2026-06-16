import { BaseEntity, model } from '@venizia/ignis';
import { pgTable, serial, integer, unique } from 'drizzle-orm/pg-core';

@model({ type: 'entity' })
export class Like extends BaseEntity<typeof Like.schema> {
  static override schema = pgTable('likes', {
    id: serial('id').primaryKey(),
    post_id: integer('post_id').notNull(),
    user_id: integer('user_id').notNull(),
  }, (table) => [
    unique().on(table.post_id, table.user_id),
  ]);

  static override relations = () => [];
  static override TABLE_NAME = 'likes';
}