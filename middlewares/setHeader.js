require('dotenv').config()
const axios = require('axios')

const setAuthHeader = async (req, res, next) => {
  try {
    const { CR_API_TOKENER_URL, CRDEV_EMAIL, CRDEV_PASSWORD } = process.env

    const tokenerPayload = {
      email: CRDEV_EMAIL,
      password: CRDEV_PASSWORD,
      game: 'clashroyale',
      whiteLlst: ['RoyaleAPI Proxy']
    }

    const response = await axios.post(CR_API_TOKENER_URL, tokenerPayload)
    // console.log(response.data)

    const token = response.data.key

    req.headers.authorization = `Bearer ${token}`
    next()
  } catch (error) {
    console.log(error.response.data)
    next()
  }
}

module.exports = { setAuthHeader }
