const express   = require('express')
const cors      = require('cors')
require('dotenv').config()

// Se valida antes de cargar rutas y de abrir el puerto: es preferible que el
// despliegue falle al arrancar, con el motivo en los logs, a que quede en pie
// a medias y el fallo aparezca cuando un usuario intente pagar o entrar
const REQUIRED_ENV = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
  'FAL_KEY',
  'RESEND_API_KEY',
  'APP_URL',
  'API_URL',
  'HOTMART_WEBHOOK_TOKEN',
]

const missing = REQUIRED_ENV.filter(key => !process.env[key])

if (missing.length) {
  console.error('\nFaltan variables de entorno obligatorias:')
  missing.forEach(key => console.error(`  - ${key}`))
  console.error('\nEl servidor no puede arrancar sin ellas.\n')
  process.exit(1)
}

if (process.env.NODE_ENV !== 'production') {
  console.warn(
    `\n  NODE_ENV = "${process.env.NODE_ENV || 'sin definir'}" (no es "production").\n` +
    '  Si esto es un despliegue real, definela: hay comportamiento de desarrollo activo.\n'
  )
}

const connectDB      = require('./config/db')
const generateRoute  = require('./routes/generate')
const authRoute      = require('./routes/auth')
const hotmartRoute   = require('./routes/hotmart')

const app  = express()
const PORT = process.env.PORT || 3001

connectDB()

app.use(cors({ origin: process.env.APP_URL || 'http://localhost:5173' }))

// El webhook necesita el body crudo para validar la firma,
// por eso se monta antes de express.json()
app.use('/api/hotmart', hotmartRoute)

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api', generateRoute)
app.use('/api/auth', authRoute)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})