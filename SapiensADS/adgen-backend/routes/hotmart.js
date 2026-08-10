const express = require('express')
const router  = express.Router()
const crypto  = require('crypto')
const User    = require('../models/User')
const { sendWelcomeEmail } = require('../services/emailService')

const PLAN_CREDITS = {
  pro:      30,
  business: 100,
}

function getPlanFromHotmart(data) {
  const productName = data?.purchase?.product?.name?.toLowerCase() || ''
  if (productName.includes('business')) return 'business'
  if (productName.includes('pro'))      return 'pro'
  return 'pro'
}


function validateHotmartWebhook(req) {
  const hotmartToken = process.env.HOTMART_WEBHOOK_TOKEN

  if (!hotmartToken) {
    console.error('HOTMART_WEBHOOK_TOKEN no está configurado, webhook rechazado')
    return false
  }

  const signature = req.headers['x-hotmart-hottok']
  return signature === hotmartToken
}

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!validateHotmartWebhook(req))
    return res.status(401).json({ error: 'Webhook no autorizado' })


  let event
  try {
    event = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString('utf8')) : req.body
  } catch {
    return res.status(400).json({ error: 'Body inválido' })
  }

  if (!event || typeof event !== 'object')
    return res.status(400).json({ error: 'Body inválido' })

  const { event: eventType, data } = event
  const email = data?.buyer?.email
  const name  = data?.buyer?.name
  const subscriptionId = data?.subscription?.subscriber?.code || data?.purchase?.transaction

  console.log(`Hotmart webhook: ${eventType} - ${email}`)

  try {
    if (eventType === 'PURCHASE_COMPLETE' || eventType === 'PURCHASE_APPROVED') {
      const plan    = getPlanFromHotmart(data)
      const credits = PLAN_CREDITS[plan]

      let user = await User.findOne({ email })
      const isNewUser = !user

      if (user) {
        user.plan     = plan
        user.credits  = credits
        user.isActive = true
        user.hotmartSubscriptionId = subscriptionId
        user.creditsResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      } else {
        user = new User({
          name,
          email,
          plan,
          credits,
          isActive: true,
          source:   'hotmart',
          hotmartSubscriptionId: subscriptionId,
          creditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
      }


      await user.save()

      if (isNewUser) {
        try {
          await sendWelcomeEmail({ name, email })
        } catch (err) {
          console.error('Cuenta activada pero fallo el email de bienvenida a', email, '-', err.message)
        }
      }
    }

    if (eventType === 'PURCHASE_CANCELED'      ||
        eventType === 'PURCHASE_REFUNDED'       ||
        eventType === 'SUBSCRIPTION_CANCELLATION') {
      await User.findOneAndUpdate({ email }, { isActive: false })
    }

    if (eventType === 'PURCHASE_RENEWED') {
      const plan    = getPlanFromHotmart(data)
      const credits = PLAN_CREDITS[plan]
      await User.findOneAndUpdate({ email }, {
        isActive:  true,
        credits,
        creditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
    }

    res.json({ received: true })
  } catch (err) {
    console.error('Error procesando webhook:', err)
    res.status(500).json({ error: 'Error procesando webhook' })
  }
})

module.exports = router