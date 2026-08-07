const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

// onboarding@resend.dev es el remitente compartido de pruebas de Resend: solo
// entrega a la direccion dueña de la cuenta, cualquier otro destinatario da 403.
// Para enviar a clientes hay que verificar un dominio propio en resend.com/domains
// y poner aqui una direccion de ese dominio.
const FROM = process.env.EMAIL_FROM || 'SapiensADS AI <onboarding@resend.dev>'

if (!process.env.EMAIL_FROM) {
  console.warn(
    '\n  EMAIL_FROM no esta definida: se usara onboarding@resend.dev.\n' +
    '  Solo llegaran correos a la cuenta dueña de Resend; el resto fallara con 403.\n'
  )
}

async function sendMagicLinkEmail({ name, email, token }) {
  const url = `${process.env.API_URL}/api/auth/verify?token=${token}`

  const { error } = await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: 'Tu enlace de acceso — SapiensADS AI',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;
                  padding: 40px 24px; background: #0f0a1e; color: #fff; border-radius: 16px;">
        <div style="margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;
                      background: #7c3aed; padding: 8px 12px; border-radius: 10px;">
            <span style="font-weight: 600; font-size: 14px;">SapiensADS AI</span>
          </div>
        </div>

        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #e9d5ff;">
          ${name ? `Hola ${name}, aquí` : 'Aquí'} está tu enlace de acceso
        </h1>
        <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
          Haz clic en el botón para entrar a SapiensADS AI. Este enlace expira en 15 minutos.
        </p>

        <a href="${url}"
           style="display: inline-block; background: #7c3aed; color: #fff; font-weight: 600;
                  font-size: 15px; padding: 14px 28px; border-radius: 12px;
                  text-decoration: none; margin-bottom: 32px;">
          Entrar a SapiensADS AI
        </a>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
          Si no solicitaste este enlace, ignora este correo. Expira en 15 minutos.
        </p>

        <hr style="border: none; border-top: 1px solid #ffffff15; margin: 24px 0;">
        <p style="color: #4b5563; font-size: 12px;">SapiensADS AI · Powered by Gemini & Nano Banana 2</p>
      </div>
    `
  })

  if (error) throw new Error(`Resend rechazó el envío: ${error.message}`)
}

async function sendWelcomeEmail({ name, email }) {
  const { error } = await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: '¡Bienvenido a SapiensADS AI!',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;
                  padding: 40px 24px; background: #0f0a1e; color: #fff; border-radius: 16px;">
        <div style="margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;
                      background: #7c3aed; padding: 8px 12px; border-radius: 10px;">
            <span style="font-weight: 600; font-size: 14px;">SapiensADS AI</span>
          </div>
        </div>

        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px; color: #e9d5ff;">
          ¡Bienvenido${name ? `, ${name}` : ''}!
        </h1>
        <p style="color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
          Tu acceso a SapiensADS AI está listo. Empieza a generar anuncios profesionales
          con inteligencia artificial.
        </p>

        <a href="${process.env.APP_URL}/login"
           style="display: inline-block; background: #7c3aed; color: #fff; font-weight: 600;
                  font-size: 15px; padding: 14px 28px; border-radius: 12px;
                  text-decoration: none; margin-bottom: 32px;">
          Entrar a la plataforma
        </a>

        <hr style="border: none; border-top: 1px solid #ffffff15; margin: 24px 0;">
        <p style="color: #4b5563; font-size: 12px;">SapiensADS AI · Powered by Gemini & Nano Banana 2</p>
      </div>
    `
  })

  if (error) throw new Error(`Resend rechazó el envío: ${error.message}`)
}

module.exports = { sendMagicLinkEmail, sendWelcomeEmail }