export const createCommentSchema = {
  articleId: { type: 'string', required: true },
  body: { type: 'string', required: true, maxLength: 2000 },
  authorName: { type: 'string', maxLength: 120 },
  userId: { type: 'string' },
  status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
}

export const updateCommentSchema = {
  body: { type: 'string', maxLength: 2000 },
  authorName: { type: 'string', maxLength: 120 },
  status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
}
