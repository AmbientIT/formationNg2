import {Post} from './post.interface'

export class PostImpl implements Post {
  id: string
  title: string
  body: string
  userId: number
  user: any
}
