import { GoogleGenerativeAI } from '@google/generative-ai'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to my Node.js app!')
})

app.post('/api/chat', async (req, res) => {
  const { message } = req.body
  try {
    const result = await model.generateContent(message)
    res.status(200).json({ response: result.response.text() })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
