const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')
const { sendMagicLinkEmail, sendWelcomeEmail } = require('../services/emailService')

const FREE_PLAN_CREDITS = 3

router.post('/register', async (req, res) => {
  const { name, email } = req.body
  if (!name || !email)
    return res.status(400).json({ error: 'Nombre y correo son requeridos' })

  try {
    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ error: 'Ya existe una cuenta con este correo. Inicia sesión.' })

    const user = new User({
      name,
      email,
      plan:     'free',
      credits:  FREE_PLAN_CREDITS,
      isActive: true,
      source:   'manual',
    })

    const token = user.generateMagicToken()
    await user.save()

    try {
      await sendWelcomeEmail({ name, email })
      await sendMagicLinkEmail({ name, email, token })
    } catch (emailErr) {
      console.error('Cuenta creada pero falló el envío de email:', emailErr)
    }

    res.status(201).json({ message: 'Cuenta creada. Revisa tu correo para acceder.' })
  } catch (err) {
    console.error('Error en registro gratuito:', err)
    res.status(500).json({ error: 'Error al crear la cuenta' })
  }
})

router.post('/magic-link', async (req, res) => {
  console.log('Magic link solicitado para:', req.body.email)
  const { email } = req.body
  if (!email)
    return res.status(400).json({ error: 'El correo es requerido' })

  try {
    const user = await User.findOne({ email })
    console.log('Usuario encontrado:', user ? 'sí' : 'no')

    if (!user)
      return res.status(404).json({ error: 'No encontramos una cuenta con ese correo. ¿Ya compraste tu plan?' })

    if (!user.isActive)
      return res.status(403).json({ error: 'Tu cuenta no está activa. Verifica tu compra en Hotmart.' })

    console.log('Usuario activo:', user.isActive)

    const token = user.generateMagicToken()
    await user.save()

    console.log('Token generado, enviando correo...')
    await sendMagicLinkEmail({ name: user.name, email: user.email, token })
    console.log('Correo enviado exitosamente')

    res.json({ message: 'Enlace enviado. Revisa tu correo.' })
  } catch (err) {
    console.error('Error magic link:', err)
    res.status(500).json({ error: 'Error al enviar el enlace' })
  }
})

router.get('/verify', async (req, res) => {
  const { token } = req.query
  if (!token)
    return res.status(400).json({ error: 'Token inválido' })

  try {
    const user = await User.findOne({
      magicToken:        token,
      magicTokenExpires: { $gt: new Date() }
    })

    if (!user)
      return res.status(400).json({ error: 'El enlace expiró o es inválido. Solicita uno nuevo.' })

    user.magicToken        = undefined
    user.magicTokenExpires = undefined
    await user.save()

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.redirect(`${process.env.APP_URL}/auth/callback?token=${jwtToken}`)
  } catch (err) {
    console.error('Error verificando token:', err)
    res.status(500).json({ error: 'Error al verificar el enlace' })
  }
})


const DEV_LOGIN_ENABLED =
  process.env.ENABLE_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production'

if (DEV_LOGIN_ENABLED) {
  console.warn(
    '\n  ATENCION: /api/auth/dev-login esta ACTIVO.\n' +
    '  Permite iniciar sesion como cualquier usuario con solo su email.\n' +
    '  No despliegues con ENABLE_DEV_LOGIN=true.\n'
  )
}

router.post('/dev-login', async (req, res) => {
  if (!DEV_LOGIN_ENABLED)
    return res.status(404).json({ error: 'Not found' })

  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan, credits: user.credits }
    })
  } catch (err) {
    res.status(500).json({ error: 'Error' })
  }
})

router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = req.user
    res.json({
      id:      user._id,
      name:    user.name,
      email:   user.email,
      plan:    user.plan,
      credits: user.credits,
    })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil' })
  }
})

module.exports = router