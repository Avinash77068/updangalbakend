export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

// Translates low-level Mongoose/Mongo errors into consistent HTTP responses.
function normalizeError(err) {
  if (err.status) return err

  // Schema validation failure -> 422 with per-field details.
  if (err.name === 'ValidationError') {
    const details = Object.fromEntries(
      Object.values(err.errors || {}).map((e) => [e.path, e.message])
    )
    return { status: 422, message: 'Validation failed', details }
  }

  // Bad ObjectId / type coercion -> 400.
  if (err.name === 'CastError') {
    return { status: 400, message: `Invalid value for "${err.path}"` }
  }

  // Duplicate unique key -> 409.
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {})
    return {
      status: 409,
      message: `Duplicate value for ${fields.join(', ') || 'unique field'}`,
      details: err.keyValue,
    }
  }

  return {
    status: err.status || 500,
    message: err.message || 'Internal server error',
    details: err.details,
  }
}

export function errorHandler(err, req, res, _next) {
  const { status, message, details } = normalizeError(err)

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err)
  }

  res.status(status).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  })
}
