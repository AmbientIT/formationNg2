import path from 'path'
import glob from 'glob-promise'

import Koa from 'koa'
import c2k from 'koa-connect'
import logger from 'koa-logger'
import convert from 'koa-convert'
import koaCors from 'koa-cors'
import bodyParser from 'koa-bodyparser'

import express from 'express'
import jsonServer from 'json-server'

const server = express()

const app = new Koa()
const db = {}

app.use(convert(koaCors()))
app.use(logger())

glob(path.join(__dirname, 'lib/mockData/*.json'))
  .then(mocks => {
    mocks.forEach(mock =>{
      db[path.basename(mock).replace('.json', '')] = require(`./${mock.replace(__dirname, '')}`)
    })
    //fix if not always 404 but with data .????? probably because i use koa@2 with express
    server.use(function (req, res, next) {
      res.status(200)
      next()
    })
    server.use('/api', jsonServer.router(db))
    app.use(convert(c2k(server)))
    return glob(path.join(__dirname, './lib/modules/**/index.js'))
  })
  .then(modules => {
    app.use(bodyParser())
    modules.forEach(module => {
      try {
        require(`.${module.replace(__dirname, '')}`)(app)
      } catch (err) {
        console.log(err)
      }
    })
    app.listen(3001, () => {
      console.log('koa2 server listening on port 3001')
    })
  })


