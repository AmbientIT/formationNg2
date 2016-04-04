'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')

const config = {
  tokenDurationInSecond: '10000000',
  TOKEN_SECRET: 'YOUR_UNIQUE_JWT_TOKEN_SECRET',

  // OAuth 2.0
  GITHUB_SECRET: '4ded05f9ea3ae0bf315cf6e554f2ebc6252e4b98',
  FACEBOOK_SECRET: 'YOUR_FACEBOOK_CLIENT_SECRET',
  GOOGLE_SECRET: 'YOUR_GOOGLE_CLIENT_SECRET',
  INSTAGRAM_SECRET: 'YOUR_INSTAGRAM_CLIENT_SECRET',
  LINKEDIN_SECRET: 'YOUR_LINKEDIN_CLIENT_SECRET',
  TWITCH_SECRET: 'YOUR_TWITCH_CLIENT_SECRET',
  WINDOWS_LIVE_SECRET: 'YOUR_MICROSOFT_CLIENT_SECRET',

  // OAuth 1.0
  TWITTER_KEY: 'YOUR_TWITTER_CONSUMER_KEY',
  TWITTER_SECRET: 'YOUR_TWITTER_CONSUMER_SECRET',
}


function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' })
  }
  var token = req.headers.authorization.split(' ')[1]

  var payload = null
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET)
  } catch (err) {
    return res.status(401).json({
      message: 'invalid token',
    })
  }
  if (payload.exp < moment().unix) {
    return res.status('401').json({
      message: 'token expired',
    })
  }
  req.user = payload.user
  next()
}

function generateToken(user) {
  const payload = {
    user: user,
    exp: moment().add(config.tokenDurationInSecond, 's').unix(),
    createdAt: moment().unix(),
  }
  return jwt.encode(payload, config.TOKEN_SECRET)
}

module.exports = {
  ensureAuthenticated,
  config,
  generateToken,
}
