import { HttpError } from '../utils/httpError.js'

export function authorize(allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Authentication required'))
    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, 'You do not have permission for this action'))
    }
    return next()
  }
}
