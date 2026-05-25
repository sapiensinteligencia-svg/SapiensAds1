const jwt  = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No autorizado' })

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await User.findById(decoded.id)

    if (!user)
      return res.status(401).json({ error: 'Usuario no encontrado' })

    if (!user.isActive)
      return res.status(403).json({ error: 'Tu cuenta no está activa' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}