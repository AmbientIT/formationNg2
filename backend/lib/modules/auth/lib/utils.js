import jwt from 'jwt-simple'
import moment from 'moment'

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


const ensureAuthenticated = (ctx, next) => {
  if (!ctx.request.headers.authorization) {
    ctx.status = 401
    ctx.body = {
      message: 'Please make sure your request has an Authorization header' 
    }
    return
  }
  var token = ctx.request.headers.authorization.split(' ')[1]

  var payload = null
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET)
  } catch (err) {
    ctx.status = 401
    ctx.body = {
      message: 'invalid token',
    }
    return
  }
  if (payload.exp < moment().unix) {
    ctx.status = 401
    ctx.body = {
      message: 'token expired',
    }
    return
  }
  ctx.user = payload.user
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


export {
  ensureAuthenticated,
  config,
  generateToken,
}
