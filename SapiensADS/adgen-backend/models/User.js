const mongoose = require('mongoose')
const crypto   = require('crypto')

const userSchema = new mongoose.Schema({
  name:     { type: String, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  plan:     { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
  credits:  { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  source:   { type: String, enum: ['hotmart', 'manual'], default: 'manual' },
  hotmartSubscriptionId: { type: String },
  creditsResetAt: { type: Date },
  magicToken:        { type: String },
  magicTokenExpires: { type: Date },
}, { timestamps: true })

userSchema.methods.generateMagicToken = function() {
  const token = crypto.randomBytes(32).toString('hex')
  this.magicToken        = token
  this.magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000)
  return token
}

module.exports = mongoose.model('User', userSchema)