const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware')
const { setAuthHeader } = require('./middlewares/setHeader')

// Create Express Server
const app = express()

// Configuration
const PORT = 3000
const TARGET_URL = 'https://api.clashroyale.com'

// Proxy
const crProxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/royale': ''
  },
  logLevel: 'debug',
  onProxyReq: fixRequestBody
})

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.options('*', cors())
app.use(express.json())

// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies to Billing and Account APIs.')
})

// Proxy endpoints
app.use('/royale', setAuthHeader, crProxy)

// Start the Proxy
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
