import { Action, Reducer, Store } from '@ngrx/store'
import { List, Map, Record, fromJS } from 'immutable'
import { normalize, arrayOf, Schema } from 'normalizr'
import {IUsers} from './user.schema'

var initialState: IUsers = fromJS({
  result: [],
  entities: {
    users: {},
  },
  adding: false,
  loading: false
})

export const users: Reducer<any> = (state = initialState, action: Action) => {
  
}
