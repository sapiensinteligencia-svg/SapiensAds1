const mongoose = require('mongoose')
const dns = require('dns')

dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB conectado')
  } catch (err) {
    console.error('Error conectando MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB