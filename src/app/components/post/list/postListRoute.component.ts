import {Component} from 'angular2/core';
import {Posts} from 'model/post/post.model'
import {PostList} from './postList/postList.component.ts';

@Component({
  selector: 'post-list-route',
  template: require('./postListRoute.html'),
  styles: [require('./postListRoute.scss')],
  directives: [PostList],
})
export class PostListRoute {
  constructor(public posts: Posts) {
    posts.loadAll()
  }
}
