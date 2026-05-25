const mongoose = require('mongoose')

const adSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  idea:        { type: String, required: true },
  format: {
    id:     String,
    label:  String,
    ratio:  String,
    width:  Number,
    height: Number,
  },
  headline:    { type: String, required: true },
  subheadline: { type: String },
  body:        { type: String },
  cta:         { type: String },
  imageUrl:    { type: String },
  imagePrompt: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Ad', adSchema)