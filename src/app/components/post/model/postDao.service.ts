import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Post} from './post.interface.ts'
import {Config} from '../../../config'
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class PostDao {
  posts$: Observable<any>;
  private _postsObserver: Observer<Post[]>;
  private _dataStore: {
    posts: Post[];
  };

  private URI: string;

  constructor(private _http: Http, private config: Config) {
    this._dataStore = { posts: [] };
    this.URI = `${this.config.api.basePath}/posts`

    this.posts$ = new Observable(observer =>  {
      this._postsObserver = observer
      console.log('fuck it')
    })
      .startWith(this._dataStore.posts)
      .share();
  }

  findAll() {
    this._http.get(`${this.URI}?_expand=user`).map(response => response.json()).subscribe(data => {
      console.log('findAll')
      this._dataStore.posts = data;
      this._postsObserver.next(this._dataStore.posts);
    }, error => console.log('Could not load posts.'));
  }

  find(id: string): Observable<any> {
     return this._http.get(`${this.URI}/${id}?_expand=user`).map(response => response.json())
  }

  create(post: Post) {
    console.log(post)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._http.post(this.URI, JSON.stringify(post), {headers})
      .map(response => response.json())
      .subscribe(
        data => {
          this._dataStore.posts.push(data);
          this._postsObserver.next(this._dataStore.posts);
        },
        error => console.log('Could not create post.'));
  }

  update(post: Post) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this._http.put(`${this.URI}/${post.id}`, JSON.stringify(post), {headers})
      .map(response => response.json())
      .subscribe(
        data => {
          this._dataStore.posts.forEach((todo, i) => {
            if (todo.id === data.id) { this._dataStore.posts[i] = data; }
          });
          this._postsObserver.next(this._dataStore.posts);
        },
        error => console.log('Could not update todo.'));
  }

  destroy(post: Post) {
    this._http.delete(`${this.URI}/${post.id}`).subscribe(response => {
      this._dataStore.posts.forEach((t, index) => {
        if (t.id === post.id) { this._dataStore.posts.splice(index, 1); }
      });

      this._postsObserver.next(this._dataStore.posts);
    }, error => console.log('Could not delete todo.'));
  }
}
