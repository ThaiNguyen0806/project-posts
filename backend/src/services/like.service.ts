import { inject } from '@venizia/ignis';
import { BaseService } from '@venizia/ignis';
import { LikeRepository } from '@/repositories/like.repository';

export class LikeService extends BaseService {
  constructor(
    @inject({ key: 'repositories.LikeRepository' })
    private likeRepository: LikeRepository,
  ) {
    super({ scope: LikeService.name });
  }

  //Get like count and whether current user liked the post
  async getLikes(postId: number, userId: number) {
    const count = await this.likeRepository.getLikeCount(postId);
    const userLike = await this.likeRepository.getUserLike(postId, userId);
    return {
      count,
      liked: !!userLike,
    };
  }

  //Toggle like/unlike
  async toggleLike(postId: number, userId: number) {
    return this.likeRepository.toggleLike(postId, userId);
  }
}