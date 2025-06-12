const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const Drawing = require('./models/Drawing')

app.get('/', (req, res) => res.send('API running'))

app.post('/api/drawings', async (req, res) => {
  try {
    const drawing = await Drawing.create(req.body)
    res.status(201).json(drawing)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.get('/api/drawings', async (req, res) => {
  try {
    const drawings = await Drawing.find()
    res.json(drawings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => console.error(err))
