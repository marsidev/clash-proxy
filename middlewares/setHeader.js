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

const retrieveLocalToken = () => {
  let tokenData = localStorage.getItem('tokenData')
  if (tokenData) {
    tokenData = JSON.parse(tokenData)
    console.log('localToken found')
    return tokenData
  }
  console.log('localToken not found')
  return null
}

const getNewToken = async ip => {
  try {
    const { CR_API_TOKENER_URL, CRDEV_EMAIL, CRDEV_PASSWORD, CR_API_TOKENER_WHITELIST } = process.env

    if (!CR_API_TOKENER_URL || !CRDEV_EMAIL || !CRDEV_PASSWORD || !CR_API_TOKENER_WHITELIST) {
      throw new Error('Missing environment variables')
    }

    const tokenerPayload = {
      game: 'clashroyale',
      email: CRDEV_EMAIL,
      password: CRDEV_PASSWORD,
      whiteLlst: CR_API_TOKENER_WHITELIST,
      fixedIp: ip
    }

    console.log('getting new token...')
    const response = await axios.post(CR_API_TOKENER_URL, tokenerPayload)

    const tokenData = response.data
    localStorage.setItem('tokenData', JSON.stringify(tokenData))

    return tokenData
  } catch (error) {
    console.log(error?.response?.data || error)
  }
}

const setAuthHeader = async (req, res, next) => {
  try {
    const ip = await getIP()

    let tokenData = retrieveLocalToken()

    if (tokenData) {
      const ipRange = tokenData.ipRange
      if (!ipRange.includes(ip)) {
        // console.log('ip is not in range')
        tokenData = await getNewToken(ip)
      }
    } else {
      tokenData = await getNewToken(ip)
    }

    req.headers.authorization = `Bearer ${tokenData.key}`
    next()
  } catch (error) {
    console.log(error?.response?.data || error)
    next()
  }
}

module.exports = { setAuthHeader }
