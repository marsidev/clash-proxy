const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware')
const { setAuthHeader } = require('./middlewares/setHeader')

// Create Express Server
const app = express()

// Proxy
const crProxy = createProxyMiddleware({
  target: 'https://api.clashroyale.com',
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
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
