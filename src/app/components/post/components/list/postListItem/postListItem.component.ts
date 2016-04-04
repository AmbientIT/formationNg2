import {Component, EventEmitter} from 'angular2/core';
import {Router} from 'angular2/router'

import {Post} from '../../../model/post.interface';

@Component({
  selector: 'post-list-item',
  template: require('./postListItem.html'),
  styles: [require('./postListItem.css')],
  inputs: ['post'],
  outputs: ['destroyPost']
})
export class PostListItem{
  post: Post;
  destroyPost: EventEmitter<any>;

  constructor(private _router: Router) {
    this.destroyPost = new EventEmitter();
  }

  edit(id) {
    this._router.parent.navigate(['PostEdit', {id}]);
  }

  destroy() {
    this.destroyPost.emit(this.post);
  }

  ngOnInit() {
    console.log('postss !!! !! !!');
  }
}
