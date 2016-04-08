import { Action, Reducer, Store } from '@ngrx/store'
import { List, Map, Record, fromJS } from 'immutable'
import { normalize, arrayOf, Schema } from 'normalizr'
import {PostRecord, postSchema, IPosts, IPost} from './post.schema'
import {UserRecord, userSchema, IUsers} from '../user/user.schema'
import {
  LOADING_POSTS,
  LOADED_POSTS,
  LOADING_POST,
  LOADED_POST,
  ADDING_POST,
  ADDED_POST,
  DELETING_POST,
  DELETED_POST,
  PATCHED_POST
} from './post.model'

var initialState: IPosts = fromJS({
  result: [],
  entities: {
    posts: {},
    users: {},
  },
  adding: false,
  loading: false
})

export const posts: Reducer<any> = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOADING_POSTS:
    case LOADING_POST:
      return state.set('loading', true)
    case LOADED_POSTS:
      const normalizedPosts: IPosts = normalize(action.payload, arrayOf(postSchema))
      return state.withMutations(map => {
        map.set('loading', false)
        map.set('result', List(normalizedPosts.result))
        normalizedPosts.result.forEach((postId: number) => {
          normalizedPosts.entities.posts[postId].user = normalizedPosts.entities.users[normalizedPosts.entities.posts[postId].user]
          map.setIn(
            ['entities', 'posts', postId],
            new PostRecord(normalizedPosts.entities.posts[postId])
          )
        })
      })
    case LOADED_POST:
      return state.withMutations(map => {
        map.set('loading', false)
        if (map.get('result').indexOf(action.payload.id) === -1) {
          map.update('result', list => list.push(action.payload.id))
        }
        map.setIn(
          ['entities', 'posts', action.payload.id],
          new PostRecord(action.payload)
        )
      })
    case DELETING_POST:
      return state.setIn(['entities', 'posts', action.payload.id, 'deleting'], true)
    case DELETED_POST:
      return state.withMutations(map => map
        .deleteIn(['entities', 'posts', action.payload])
        .deleteIn(['result', map.get('result').indexOf(action.payload)])
      )
    case ADDING_POST:
      return state.set('adding', true)
    case ADDED_POST:
      return state.withMutations(map => map
        .setIn(['entities', 'posts', action.payload.id], new PostRecord(action.payload))
        .update('result', list => list.push(action.payload.id))
        .set('adding', false)
      )
    case PATCHED_POST:
      return state
        .setIn(['entities', 'posts', action.payload.id], new PostRecord(action.payload))

    default:
      return state
  }
}
