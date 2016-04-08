import { Schema } from 'normalizr'
import { List, Map, Record } from 'immutable'

import {userSchema, IUser} from '../user/user.schema'

export const PostRecord = Record({
  id: null,
  title: null,
  body: null,
  user: null,
  deleting: false
})

export const postSchema = new Schema('posts')

postSchema.define({
  user: userSchema
})


export interface IPost {
  id: string
  title: string
  body: string
  userId: number
  user: any
}

export interface IPosts extends Map<String, any> {
  result: List<Number>
  entities: {
    posts: Map<Number, IPost>,
    users: Map<Number, IUser>,
  }
  adding: boolean
  loading: boolean
}
