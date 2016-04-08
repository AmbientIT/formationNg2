import { Injectable } from 'angular2/core';
import {Http} from 'angular2/http'
import { Action, Reducer, Store, provideStore } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { List, Map, Record } from 'immutable';
import { IPost, IPosts } from './post.schema'
import {Api} from '../api'
import {Config} from '../../config/index'

export const LOADING_POSTS = 'LOADING_POSTS';
export const LOADED_POSTS = 'LOADED_POSTS';
export const LOADING_POST = 'LOADING_POST';
export const LOADED_POST = 'LOADED_POST';
export const ADDING_POST = 'ADDING_POST';
export const ADDED_POST = 'ADDED_POST';
export const DELETING_POST = 'DELETING_POST';
export const DELETED_POST = 'DELETED_POST';
export const PATCHED_POST = 'PATCHED_POST';

const PATCH_POST = 'PATCH_POST';
const DELETE_POST = 'DELETE_POST';
const ADD_POST = 'ADD_POST';
const LOAD_POST = 'LOAD_POST';
const LOAD_POSTS = 'LOAD_POSTS';

@Injectable()
export class PostApi extends Api<IPost>{
  constructor(http:Http, private config: Config) {
    super(http, `${config.api.basePath}/posts?_expand=user`)
  }
}

@Injectable()
export class Posts {
  loading$: Observable<Map<String, Boolean>>;
  adding$: Observable<Map<String, Boolean>>;
  posts$: Observable<Map<String, any>>;

  private actions$ = new BehaviorSubject<Action>({type: null, payload: null});

  constructor(private _store: Store<any>, api: PostApi) {
    const store$ = this._store.select<IPosts>('posts');

    this.adding$ = store$.map(data => data.get('adding'));
    this.loading$ = store$.map(data => data.get('loading'));

    this.posts$ = store$.map(data => {
      return data.get('result').reduce((acc, postId) => {
        acc.push(data.getIn(['entities', 'posts', postId]));
        return acc;
      }, []);
    });

    let adds = this.actions$
      .filter(action => action.type === ADD_POST)
      .do(() => _store.dispatch({type: ADDING_POST}))
      .mergeMap(
        action => api.create(action.payload),
        (action, payload: IPost) => ({type: ADDED_POST, payload}));

    let deletes = this.actions$
      .filter(action => action.type === DELETE_POST && !action.payload.deleting)
      .do(action => _store.dispatch({type: DELETING_POST, payload: action.payload}))
      .mergeMap(action => api.destroy(action.payload),
        (action, payload: IPost) => ({type: DELETED_POST, payload: action.payload}));

    let loads = this.actions$
      .filter(action => action.type === LOAD_POSTS)
      .do(() => _store.dispatch({type: LOADING_POSTS}))
      .mergeMap(action => api.findAll(),
        (action, payload: IPost[]) => ({type: LOADED_POSTS, payload}));

    let loadsOne = this.actions$
      .filter(action => action.type === LOAD_POST)
      .do(() => _store.dispatch({type: LOADING_POST}))
      .mergeMap(action => api.find(action.payload),
        (action, payload: IPost) => ({type: LOADED_POST, payload: payload}));

    let patchesOne = this.actions$
      .filter(action => action.type === PATCH_POST)
      .mergeMap(action => api.update(action.payload, action.payload.id),
        (action, payload: IPost) => ({type: PATCHED_POST, payload}));

    Observable
      .merge(adds, deletes, loads, loadsOne, patchesOne)
      .subscribe((action: Action) => _store.dispatch(action));
  }

  add(post) {
    this.actions$.next({type: ADD_POST, payload: post});
  }

  destroy(id) {
    this.actions$.next({type: DELETE_POST, payload: id});
  }

  loadAll() {
    this.actions$.next({type: LOAD_POSTS});
  }

  load(id) {
    id = parseInt(id, 10);
    this.actions$.next({type: LOAD_POST, payload: id});
    return this.posts$
      .map(data => data.find(item => item.id === id) || {});
  }

  patch(post) {
    this.actions$.next({type: PATCH_POST, payload: post});
  }

  reload() {
    this._store.dispatch({type: LOADED_POSTS, payload: []});
    this.loadAll();
  }
}

