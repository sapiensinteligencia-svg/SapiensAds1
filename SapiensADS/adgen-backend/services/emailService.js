const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

async function sendMagicLinkEmail({ name, email, token }) {
  const url = `${process.env.APP_URL}/auth/verify?token=${token}`

  await resend.emails.send({
    from:    'SapiensADS AI <onboarding@resend.dev>',
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
        <p style="color: #4b5563; font-size: 12px;">SapiensADS AI · Powered by OpenAI & Ideogram</p>
      </div>
    `
  })
}

async function sendWelcomeEmail({ name, email }) {
  await resend.emails.send({
    from:    'SapiensADS AI <onboarding@resend.dev>',
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
        <p style="color: #4b5563; font-size: 12px;">SapiensADS AI · Powered by OpenAI & Ideogram</p>
      </div>
    `
  })
}

module.exports = { sendMagicLinkEmail, sendWelcomeEmail }