const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { setAuthHeader } = require('./middlewares/setHeader')

const app = express()

const crProxy = createProxyMiddleware({
  target: 'https://api.clashroyale.com',
  changeOrigin: true,
  pathRewrite: { '^/': '' }
})

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.options('*', cors())
app.use(express.json())

// Routes
app.use('/', setAuthHeader, crProxy)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
