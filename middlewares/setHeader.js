require('dotenv').config()
const axios = require('axios')

let localStorage

if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./scratch')
}

const getIP = async () => {
  const url = 'https://api.ipify.org/'
  const response = await axios.get(url)
  return response.data
}

const setAuthHeader = async (req, res, next) => {
  try {
    const { CR_API_TOKENER_URL, CRDEV_EMAIL, CRDEV_PASSWORD, CR_API_TOKENER_WHITELIST } = process.env

    if (!CR_API_TOKENER_URL || !CRDEV_EMAIL || !CRDEV_PASSWORD || !CR_API_TOKENER_WHITELIST) {
      throw new Error('Missing environment variables')
    }

    const ip = await getIP()

    const tokenerPayload = {
      game: 'clashroyale',
      email: CRDEV_EMAIL,
      password: CRDEV_PASSWORD,
      whiteLlst: CR_API_TOKENER_WHITELIST,
      fixedIp: ip
    }

    const response = await axios.post(CR_API_TOKENER_URL, tokenerPayload)
    // console.log({ response: response.data })

    const token = response.data.key

    const localToken = localStorage.getItem('token')
    if (localToken) {
      console.log('local token found')
      console.log({ localToken })
    } else {
      console.log('local token not found')
      localStorage.setItem('token', token)
    }

    req.headers.authorization = `Bearer ${token}`
    next()
  } catch (error) {
    console.log(error?.response?.data || error)
    next()
  }
}

module.exports = { setAuthHeader }
