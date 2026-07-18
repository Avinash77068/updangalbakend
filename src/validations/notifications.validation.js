export const createNotificationSchema = {
  title: { type: 'string', required: true },
  body: { type: 'string', required: true },
  audience: { type: 'string', enum: ['all', 'subscribers', 'admins'] },
  status: { type: 'string', enum: ['draft', 'sent'] },
}

export const updateNotificationSchema = {
  title: { type: 'string' },
  body: { type: 'string' },
  audience: { type: 'string', enum: ['all', 'subscribers', 'admins'] },
  status: { type: 'string', enum: ['draft', 'sent'] },
}
