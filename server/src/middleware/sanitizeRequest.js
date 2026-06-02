function sanitizeObject(target) {
  if (!target || typeof target !== 'object') return
  if (Array.isArray(target)) {
    for (const item of target) sanitizeObject(item)
    return
  }

  for (const key of Object.keys(target)) {
    const value = target[key]
    const safeKey = key.replace(/\$/g, '').replace(/\./g, '')

    if (safeKey !== key) {
      target[safeKey] = value
      delete target[key]
    }

    sanitizeObject(target[safeKey])
  }
}

function sanitizeRequest(req, res, next) {
  sanitizeObject(req.body)
  sanitizeObject(req.params)
  sanitizeObject(req.query)
  next()
}

module.exports = { sanitizeRequest }

