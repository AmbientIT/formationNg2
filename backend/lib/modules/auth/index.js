import jwt from 'jwt-simple'
import fs from 'fs-promise'
import {config, ensureAuthenticated, generateToken} from './lib/utils'

import qs from 'querystring'
import request from 'request-promise'
const mockPath = './gulp/server/mockData/user.json'

module.exports = (server) => {
  server.post('/auth/signup', async (ctx) => {
    try {
      const users = await fs.readJson(mockPath)
      ctx.req.body.id = users.length
      users.push(ctx.req.body)
      await fs.outputJson(mockPath, users)
      ctx.body = {
        token: jwt.encode(ctx.req.body, config.TOKEN_SECRET),
        user: ctx.req.body,
      }
    } catch (err) {
      console.error(err)
      this.status = 500
      this.body = err
    }
  })

  server.post('/auth/login', async (ctx) => {
    try {
      const users = await fs.readJson(mockPath)
      const user = users.find(mappedUser => {
        return ctx.req.body.email === mappedUser.email
      })
      if (user) {
        if (user.password === ctx.req.body.password) {
          delete user.password
          const token = generateToken(user)
          ctx.body = {
            token,
            user,
          }
        }else {
          ctx.status = 403
          ctx.body = {
            message: 'forbidden',
          }
        }
      }else {
        ctx.status = 403
        ctx.body = {
          message: 'forbidden',
        }
      }
    } catch (err) {
      console.error(err)
      ctx.status = 500
      ctx.body = err
    }
  })

  server.post('/auth/github', async (ctx) => {
    const accessTokenUrl = 'https://github.com/login/oauth/access_token'
    const userApiUrl = 'https://api.github.com/user'
    /*eslint camelcase:0*/
    const params = {
      code: ctx.body.code,
      client_id: ctx.req.body.clientId,
      client_secret: config.GITHUB_SECRET,
      redirect_uri: ctx.req.body.redirectUri,
    }

    // Step 1. Exchange authorization code for access token.
    let accessToken = await request({method: 'GET', url: accessTokenUrl, qs: params })
    accessToken = qs.parse(accessToken)
    const headers = {'User-Agent': 'Satellizer'}
    const authData = await Promise.all([
      request({method: 'GET', uri: userApiUrl, qs: accessToken, headers: headers, json: true}),
      fs.readJson(mockPath),
    ])
    const profile = authData[0]
    const users = authData[1]
    if (ctx.req.headers.authorization) {
      const existingUser = users.find(mappedUser => {
        return mappedUser.github === profile.id
      })
      if (existingUser) {
        ctx.status = 409
        ctx.body = {
          message: 'There is already a GitHub account that belongs to you',
        }
        return
      }
      const token = ctx.req.headers.authorization.split(' ')[1]
      const payload = jwt.decode(token, config.TOKEN_SECRET)
      if (!payload.user) {
        ctx.status = 400
        ctx.body = {
          message: 'User not found',
        }
        return
      }
      payload.user.github = profile.id
      payload.user.avatar = profile.avatar_url
      payload.user.name = profile.name
      payload.id = profile.id
      const indexOfUser = users.indexOf(users.find(mappedUser => {
        return mappedUser === payload.user.id
      }))
      users[indexOfUser] = payload.user

      await fs.outputJson(mockPath, users)
      ctx.body = {
        token: generateToken(payload.user),
        user: payload.user,
      }
    } else {
      const existingUser = users.find(mappedUser => {
        return mappedUser.github === profile.id
      })
      if (existingUser) {
        ctx.body = {
          token: generateToken(existingUser),
          user: existingUser,
        }
        return
      }
      const user = {
        id: profile.id,
        github: profile.id,
        avatar: profile.avatar_url,
        name: profile.name,
      }
      users.push(user)
      await fs.outputJson(mockPath, users)
      ctx.body = {
        token: generateToken(user),
        user: user,
      }
    }
  })

  server.get('/auth/me', ensureAuthenticated, (req, res) => {
    res.json(req.user)
  })
}
