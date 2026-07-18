import { User } from './user.model.js'
import { Category } from './category.model.js'
import { Article } from './article.model.js'
import { Ad } from './ad.model.js'
import { Video } from './video.model.js'
import { TrendingTopic } from './trendingTopic.model.js'
import { BreakingNews } from './breakingNews.model.js'
import { Comment } from './comment.model.js'
import { Notification } from './notification.model.js'
import { Tag } from './tag.model.js'
import { RefreshToken } from './refreshToken.model.js'

// Maps the logical collection names used across the app to their Mongoose models.
export const models = {
  users: User,
  categories: Category,
  articles: Article,
  ads: Ad,
  videos: Video,
  trendingTopics: TrendingTopic,
  breakingNews: BreakingNews,
  comments: Comment,
  notifications: Notification,
  tags: Tag,
  refreshTokens: RefreshToken,
}

export {
  User,
  Category,
  Article,
  Ad,
  Video,
  TrendingTopic,
  BreakingNews,
  Comment,
  Notification,
  Tag,
  RefreshToken,
}
