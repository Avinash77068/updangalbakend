export const Roles = Object.freeze({
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  USER: 'user',
})

export const permissions = Object.freeze({
  contentRead: [Roles.ADMIN, Roles.EDITOR, Roles.AUTHOR, Roles.USER],
  contentWrite: [Roles.ADMIN, Roles.EDITOR, Roles.AUTHOR],
  contentPublish: [Roles.ADMIN, Roles.EDITOR],
  manageUsers: [Roles.ADMIN],
  manageAds: [Roles.ADMIN, Roles.EDITOR],
  viewAnalytics: [Roles.ADMIN, Roles.EDITOR],
})
