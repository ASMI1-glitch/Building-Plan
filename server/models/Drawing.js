const mongoose = require('mongoose')

const shapeSchema = new mongoose.Schema({
  type: String,
  x1: Number,
  y1: Number,
  x2: Number,
  y2: Number,
})

const drawingSchema = new mongoose.Schema(
  {
    name: String,
    shapes: [shapeSchema],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Drawing', drawingSchema)