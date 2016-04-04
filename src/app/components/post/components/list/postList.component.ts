import {Component} from 'angular2/core';
import {PostDao} from '../../../common/model/postDao.service'

@Component({
  selector: 'postList',
  template: require('./postList.html'),
  providers: [PostDao]
})
export class PostList{
  posts: any;
  constructor(private _postDao: PostDao) {}

  ngOnInit() {
    this.posts = this._postDao.posts$;
    this._postDao.loadPosts();
  }
}
