import path from 'path'
const mockPath = path.resolve(__dirname, '../../mockData/user.json')
import fs from 'fs-promise'
import middleware from 'koa-router'

const router = middleware()

module.exports = (app) => {
  router.get('/isAvailable/:email', async ctx => {
    console.log(ctx)
    try {
      const users = await fs.readJson(mockPath)
      const user = users.find(item => {
        return item.email === ctx.params.email
      })
      if (user) {
        ctx.status = 400
        this.body = {
          message: 'email is not availlable',
        }
      } else {
        ctx.status = 200
        ctx.body = ''
      }
    } catch (err) {
      ctx.status = 500
      ctx.body = err
    }
  })
  app.use(router.routes())
  app.use(router.allowedMethods())
}
