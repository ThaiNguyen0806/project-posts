import { BaseRestController, controller, get, post, del, jsonResponse, jsonContent, TRouteContext, inject, Authentication, IJWTTokenPayload, TAuthStrategy } from '@venizia/ignis';
import { HTTP } from '@venizia/ignis-helpers';
import { z } from '@hono/zod-openapi';
import { CommentService } from '@/services/comment.service';

const CommentRoutes = {
  GET_BY_POST: {
    path: '/{postId}',
    request: { params: z.object({ postId: z.string() }) },
    responses: jsonResponse({
      description: 'Returns all comments for a post',
      schema: z.object({ comments: z.array(z.any()) }),
    }),
  },
  CREATE: {
    path: '/{postId}',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: {
      params: z.object({ postId: z.string() }),
      body: jsonContent({
        description: 'Add a comment to a post',
        schema: z.object({ content: z.string() }),
      }),
    },
    responses: jsonResponse({
      description: 'Comment created',
      schema: z.object({ comment: z.any() }),
    }),
  },
  DELETE: {
    path: '/{id}',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: { params: z.object({ id: z.string() }) },
    responses: jsonResponse({
      description: 'Comment deleted',
      schema: z.object({ message: z.string() }),
    }),
  },
};

@controller({ path: '/comments' })
export class CommentController extends BaseRestController {
  constructor(
    @inject({ key: 'services.CommentService' })
    private commentService: CommentService,
  ) {
    super({ scope: CommentController.name });
  }

  override binding() {}

  @get({ configs: CommentRoutes.GET_BY_POST })
  async getCommentsByPost(c: TRouteContext) {
    try {
      const { postId } = c.req.valid<{ postId: string }>('param');
      const comments = await this.commentService.getCommentsByPost(parseInt(postId));
      return c.json({ comments }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @post({ configs: CommentRoutes.CREATE })
  async createComment(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      const userId = parseInt(user.userId as string);
      const { postId } = c.req.valid<{ postId: string }>('param');
      const { content } = c.req.valid<{ content: string }>('json');
      if (!content) return c.json({ message: 'Content is required' }, 400);
      const comment = await this.commentService.createComment(parseInt(postId), userId, content);
      return c.json({ comment }, HTTP.ResultCodes.RS_2.Created);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @del({ configs: CommentRoutes.DELETE })
  async deleteComment(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      const userId = parseInt(user.userId as string);
      const { id } = c.req.valid<{ id: string }>('param');
      await this.commentService.deleteComment(parseInt(id), userId);
      return c.json({ message: 'Comment deleted' }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }
}