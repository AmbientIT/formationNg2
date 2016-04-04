import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {PostDao} from '../../model/postDao.service';
import {Post} from '../../model/post.interface';
import {PostListItem} from './postListItem/postListItem.component';

@Component({
  selector: 'post-list',
  template: require('./postList.html'),
  styles: [require('./postList.css')],
  directives: [PostListItem]
})
export class PostList{
  posts: Observable<Post[]>;
  constructor(private _postDao: PostDao) {}

  destroyPost(post) {
    this._postDao.destroy(post);
  }

  ngOnInit() {
    this.posts = this._postDao.posts$;
    this._postDao.findAll();
  }
}
