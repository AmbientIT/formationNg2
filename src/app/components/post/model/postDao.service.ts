import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Post} from './post.interface.ts'

@Injectable()
export class PostDao {
  posts$: Observable<Post[]>;
  private _postsObserver: Observer<Post[]>;
  private _dataStore: {
    posts: Post[];
  };

  constructor(private _http: Http) {
    this._dataStore = { posts: [] };

    this.posts$ = new Observable(observer =>  this._postsObserver = observer)
      .startWith(this._dataStore.posts)
      .share();
  }

  loadPosts() {
    this._http.get('/api/todos').map(response => response.json()).subscribe(data => {
      this._dataStore.posts = data;
      this._postsObserver.next(this._dataStore.posts);
    }, error => console.log('Could not load posts.'));
  }

  createPost(post: Post) {
    this._http.post('/api/todos', <any>post)
      .map(response => response.json()).subscribe(data => {
      this._dataStore.posts.push(data);
      this._postsObserver.next(this._dataStore.posts);
    }, error => console.log('Could not create post.'));
  }

  updatePost(post: Post) {
    this._http.put(`/api/todos/${post.id}`, <any>post)
      .map(response => response.json()).subscribe(data => {
      this._dataStore.posts.forEach((todo, i) => {
        if (todo.id === data.id) { this._dataStore.posts[i] = data; }
      });

      this._postsObserver.next(this._dataStore.posts);
    }, error => console.log('Could not update todo.'));
  }

  deletePost(post: Post) {
    this._http.delete(`/api/todos/${post.id}`).subscribe(response => {
      this._dataStore.posts.forEach((t, index) => {
        if (t.id === post.id) { this._dataStore.posts.splice(index, 1); }
      });

      this._postsObserver.next(this._dataStore.posts);
    }, error => console.log('Could not delete todo.'));
  }
}
