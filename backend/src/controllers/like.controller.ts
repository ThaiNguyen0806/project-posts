import { BaseRestController, controller, get, post, jsonResponse, TRouteContext, inject, Authentication, IJWTTokenPayload, TAuthStrategy } from '@venizia/ignis';
import { HTTP } from '@venizia/ignis-helpers';
import { z } from '@hono/zod-openapi';
import { LikeService } from '@/services/like.service';

const LikeRoutes = {
  GET_LIKES: {
    path: '/{postId}',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: { params: z.object({ postId: z.string() }) },
    responses: jsonResponse({
      description: 'Returns like count and liked status',
      schema: z.object({ count: z.number(), liked: z.boolean() }),
    }),
  },
  TOGGLE_LIKE: {
    path: '/{postId}',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: { params: z.object({ postId: z.string() }) },
    responses: jsonResponse({
      description: 'Toggles like status',
      schema: z.object({ liked: z.boolean() }),
    }),
  },
};

@controller({ path: '/likes' })
export class LikeController extends BaseRestController {
  constructor(
    @inject({ key: 'services.LikeService' })
    private likeService: LikeService,
  ) {
    super({ scope: LikeController.name });
  }

  override binding() {}

  @get({ configs: LikeRoutes.GET_LIKES })
  async getLikes(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      const userId = parseInt(user.userId as string);
      const { postId } = c.req.valid<{ postId: string }>('param');
      const result = await this.likeService.getLikes(parseInt(postId), userId);
      return c.json(result, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @post({ configs: LikeRoutes.TOGGLE_LIKE })
  async toggleLike(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      const userId = parseInt(user.userId as string);
      const { postId } = c.req.valid<{ postId: string }>('param');
      const result = await this.likeService.toggleLike(parseInt(postId), userId);
      return c.json(result, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }
}