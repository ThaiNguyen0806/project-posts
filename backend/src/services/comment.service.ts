import { inject } from '@venizia/ignis';
import { BaseService } from '@venizia/ignis';
import { CommentRepository } from '@/repositories/comment.repository';
import { getError } from '@venizia/ignis-helpers';

export class CommentService extends BaseService {
    constructor(
        @inject({ key: 'repositories.CommentRepository' })
        private commentRepository: CommentRepository,
    ) {
        super({ scope: CommentService.name });
    }

    //Get all comments for a post
    async getCommentsByPost(postId: number) {
    return this.commentRepository.findCommentsByPostId(postId);
  }

  //Create a new comment
  async createComment(postId: number, userId: number, content: string) {
    return this.commentRepository.createComment(postId, userId, content);
  }

  //Delete comment
  async deleteComment(id: number, userId: number) {
    const comment = await this.commentRepository.findCommentById(id);
    if (!comment) {
      throw getError({ statusCode: 404, message: 'Comment not found' });
    }
    if (comment.user_id !== userId) {
      throw getError({ statusCode: 403, message: 'You can only delete your own comments' });
    }
    return this.commentRepository.deleteComment(id);
  }
}
