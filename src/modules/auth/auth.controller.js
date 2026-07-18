import { ok } from '../../utils/response.js'
import { authService } from './auth.service.js'

export const authController = {
  async login(req, res) {
    return ok(res, await authService.login(req.body))
  },
  async refresh(req, res) {
    return ok(res, await authService.refresh(req.body.refreshToken))
  },
  async me(req, res) {
    return ok(res, await authService.me(req.user.id))
  },
  async logout(req, res) {
    await authService.logout(req.body.refreshToken)
    return ok(res, { loggedOut: true })
  },
}
