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
export class PostList {
  posts: Observable<Post[]>

  constructor(private postDao: PostDao) {
    this.posts = postDao.findAll()
  }

  destroyPost(post) {
    this.postDao.destroy(post);
  }
}
