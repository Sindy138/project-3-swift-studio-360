function errorHandler(err, req, res, next) {
  // Malformed JSON body — express.json() throws SyntaxError before reaching the controller
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON in request body' })
  }

  // Prisma: unique constraint violation (e.g. duplicate email)
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'field'
    return res.status(409).json({ error: `A record with that ${field} already exists` })
  }

  // Prisma: record not found when using update/delete by ID
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' })
  }

  // Prisma: foreign key constraint — related record does not exist
  if (err.code === 'P2003') {
    return res.status(409).json({ error: 'Related record does not exist' })
  }

  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (status >= 500) {
    console.error(`[500] ${req.method} ${req.path}`, err)
  }

  return res.status(status).json({ error: message })
}

module.exports = { errorHandler }
