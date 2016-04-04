import {Injectable} from 'angular2/core'
import {Http, Headers} from 'angular2/http'
import {Observable, Subject} from 'rxjs'
import * as R from 'ramda'
import {Post} from './post.interface.ts'
import {Config} from '../../../config'

@Injectable()
export class PostDao {
  public posts$: Observable<Post[]>
  private post$: Subject<Post>
  private deletedId$: Subject<string>
  private URI: string

  constructor(private http: Http, private config: Config) {
    this.post$ = new Subject<Post>()
    this.deletedId$ = new Subject<string>()
    const deletedIds$ = this.deletedId$
      .scan((acc, id) => R.append(id, acc), new Array<string>())
      .startWith(new Array<string>())
    this.posts$ = this.post$
      .scan((posts, post) => R.append(post, posts), new Array<Post>())
      .combineLatest(deletedIds$, (posts: Post[], deletedIds) => R.filter(
        post => !R.contains(post.id, deletedIds),
        posts
      ))
    this.URI = `${this.config.api.basePath}/posts`
  }

  findAll(): Observable<Post[]> {
    this.http
      .get(`${this.URI}?_expand=user`)
      .flatMap(response => response.json())
      .subscribe(this.post$)
    return this.posts$
  }

  find(id: string): Observable<Post> {
    this.http
      .get(`${this.URI}/${id}?_expand=user`)
      .map(response => response.json())
      .subscribe(this.post$)
    return this.posts$
      .takeLast(1)
      .flatMap(posts => posts)
      .filter(post => post.id === id)
  }

  create(post: Post): Observable<Post> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const created$ = this.http
      .post(this.URI, JSON.stringify(post), {headers})
      .map(response => response.json())
    created$.subscribe(this.post$)
    return created$
  }

  update(post: Post): Observable<Post> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const updated$ = this.http
      .put(`${this.URI}/${post.id}`, JSON.stringify(post), {headers})
      .map(response => response.json())
    updated$.subscribe(this.post$)
    return updated$
  }

  destroy(post: Post): Observable<any> {
    const deleted$ = this.http
      .delete(`${this.URI}/${post.id}`)
      .map(response => response.json())
    deleted$.subscribe(() => this.deletedId$.next(post.id))
    return deleted$
  }
}
