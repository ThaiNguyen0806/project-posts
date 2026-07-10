import { BaseRestController, controller, get, post, put, del, jsonResponse, jsonContent, TRouteContext, inject, Authentication, IJWTTokenPayload, TAuthStrategy } from '@venizia/ignis';
import { HTTP } from '@venizia/ignis-helpers';
import { z } from '@hono/zod-openapi';
import { PostService } from '@/services/post.service';

const PostRoutes = {
  GET_ALL: {
    path: '/',
    responses: jsonResponse({
      description: 'Returns all posts',
      schema: z.object({ posts: z.array(z.any()) }),
    }),
  },
  SEARCH: {
    path: '/search',
    request: { query: z.object({ q: z.string() }) },
    responses: jsonResponse({
      description: 'Returns matching posts',
      schema: z.object({ posts: z.array(z.any()) }),
    }),
  },
  GET_BY_USER: {
    path: '/user/{userId}',
    request: { params: z.object({ userId: z.string() }) },
    responses: jsonResponse({
      description: 'Returns all posts by a user',
      schema: z.object({ posts: z.array(z.any()) }),
    }),
  },
  GET_BY_ID: {
    path: '/{id}',
    request: { params: z.object({ id: z.string() }) },
    responses: jsonResponse({
      description: 'Returns a single post',
      schema: z.object({ post: z.any() }),
    }),
  },
  CREATE: {
    path: '/',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: {
      body: jsonContent({
        description: 'Create a post',
        schema: z.object({
          title: z.string(),
          content: z.string().optional(),
        }),
      }),
    },
    responses: jsonResponse({
      description: 'Post created',
      schema: z.object({ post: z.any() }),
    }),
  },
  UPDATE: {
    path: '/{id}',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: {
      params: z.object({ id: z.string() }),
      body: jsonContent({
        description: 'Update a post',
        schema: z.object({
          title: z.string(),
          content: z.string().optional(),
        }),
      }),
    },
    responses: jsonResponse({
      description: 'Post updated',
      schema: z.object({ post: z.any() }),
    }),
  },
  DELETE: {
    path: '/{id}',
    authenticate: { strategies: [Authentication.STRATEGY_JWT] as TAuthStrategy[] },
    request: { params: z.object({ id: z.string() }) },
    responses: jsonResponse({
      description: 'Post deleted',
      schema: z.object({ message: z.string() }),
    }),
  },
};

@controller({ path: '/posts' })
export class PostController extends BaseRestController {
  constructor(
    @inject({ key: 'services.PostService' })
    private postService: PostService,
  ) {
    super({ scope: PostController.name });
  }

  override binding() {}

  @get({ configs: PostRoutes.GET_ALL })
  async getAllPosts(c: TRouteContext) {
    try {
      const posts = await this.postService.getAllPosts();
      return c.json({ posts }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @get({ configs: PostRoutes.SEARCH })
  async searchPosts(c: TRouteContext) {
    try {
      const { q } = c.req.valid<{ q: string }>('query');
      const posts = await this.postService.searchPosts(q);
      return c.json({ posts }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @get({ configs: PostRoutes.GET_BY_USER })
  async getPostsByUser(c: TRouteContext) {
    try {
      const { userId } = c.req.valid<{ userId: string }>('param');
      const posts = await this.postService.getPostsByUser(parseInt(userId));
      return c.json({ posts }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @get({ configs: PostRoutes.GET_BY_ID })
  async getPostById(c: TRouteContext) {
    try {
      const { id } = c.req.valid<{ id: string }>('param');
      const post = await this.postService.getPostById(parseInt(id));
      return c.json({ post }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @post({ configs: PostRoutes.CREATE })
  async createPost(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      console.log('DEBUG user:', JSON.stringify(user));
      const userId = parseInt(user.userId as string);
      console.log('DEBUG userId:', userId);
      const { title, content } = c.req.valid<{ title: string; content: string }>('json');
      if (!title) return c.json({ message: 'Title is required' }, 400);
      const post = await this.postService.createPost(userId, title, content);
      console.log("testing");
      return c.json({ post }, HTTP.ResultCodes.RS_2.Created);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @put({ configs: PostRoutes.UPDATE })
  async updatePost(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      const userId = parseInt(user.userId as string);
      const { id } = c.req.valid<{ id: string }>('param');
      const { title, content } = c.req.valid<{ title: string; content: string }>('json');
      const post = await this.postService.updatePost(parseInt(id), userId, title, content);
      return c.json({ post }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }

  @del({ configs: PostRoutes.DELETE })
  async deletePost(c: TRouteContext) {
    try {
      const user = c.get(Authentication.CURRENT_USER) as IJWTTokenPayload;
      const userId = parseInt(user.userId as string);
      const { id } = c.req.valid<{ id: string }>('param');
      await this.postService.deletePost(parseInt(id), userId);
      return c.json({ message: 'Post deleted' }, HTTP.ResultCodes.RS_2.Ok);
    } catch (err: any) {
      return c.json({ message: err.message ?? 'Internal server error' }, err.statusCode ?? 500);
    }
  }
}