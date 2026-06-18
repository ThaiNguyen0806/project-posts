import { inject } from '@venizia/ignis';
import { BaseService } from '@venizia/ignis';
import { PostRepository } from '@/repositories/post.repository';
import { getError } from '@venizia/ignis-helpers';

export class PostService extends BaseService {
    constructor(
        @inject({ key: 'repositories.PostRepository' })
        private postRepository: PostRepository,
    ) {
        super({ scope: PostService.name });
    }

async getAllPosts() {
    return this.postRepository.findAllPosts();
  }

  //Get single post by id, 404 if not found
  async getPostById(id: number) {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw getError({ statusCode: 404, message: 'Post not found' });
    }
    return post;
  }

  //Get all posts by a specific user
  async getPostsByUser(userId: number) {
    return this.postRepository.findPostsByUserId(userId);
  }

  //Search posts by title
  async searchPosts(q: string) {
    return this.postRepository.searchPosts(q);
  }

  //Create a new post
  async createPost(userId: number, title: string, content: string) {
    return this.postRepository.createPost(userId, title, content);
  }

  //Update post (only when owned by the user)
  async updatePost(id: number, userId: number, title: string, content: string) {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw getError({ statusCode: 404, message: 'Post not found' });
    }
    if (post.user_id !== userId) {
      throw getError({ statusCode: 403, message: 'You can only edit your own posts' });
    }
    return this.postRepository.updatePost(id, title, content);
  }

  //Delete post (only delete your post) 
  async deletePost(id: number, userId: number) {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw getError({ statusCode: 404, message: 'Post not found' });
    }
    if (post.user_id !== userId) {
      throw getError({ statusCode: 403, message: 'You can only delete your own posts' });
    }
    return this.postRepository.deletePost(id);
  }
}
