import { Schema } from 'normalizr';
import { List, Map, Record } from 'immutable';

export const UserRecord = Record({
  id: null,
  username: null,
  email: null,
  avatar: null,
  dob: null,
  deleting: false
})

export const userSchema = new Schema('users');


export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: number;
  dob: Date;
  user: any;
}

export interface IUsers extends Map<String, any> {
  result: List<Number>;
  entities: {posts: Map<Number, IUser>};
  adding: boolean;
  loading: boolean;
}
