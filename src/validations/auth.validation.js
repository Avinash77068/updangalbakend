export const loginSchema = {
  username: { type: 'string', required: true, minLength: 3, maxLength: 40 },
  password: { type: 'string', required: true, minLength: 6, maxLength: 200 },
}

export const refreshSchema = {
  refreshToken: { type: 'string', required: true },
}
