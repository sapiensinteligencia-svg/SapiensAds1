const express   = require('express')
const cors      = require('cors')
require('dotenv').config()

const connectDB      = require('./config/db')
const generateRoute  = require('./routes/generate')
const authRoute      = require('./routes/auth')
const hotmartRoute   = require('./routes/hotmart')

const app  = express()
const PORT = process.env.PORT || 3001

connectDB()

app.use(cors({ origin: process.env.APP_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api', generateRoute)
app.use('/api/auth', authRoute)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/hotmart', hotmartRoute)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})