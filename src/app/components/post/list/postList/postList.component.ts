import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from 'angular2/core'
import {PostListItem} from './postListItem/postListItem.component'

@Component({
  selector: 'post-list',
  template: require('./postList.html'),
  styles: [require('./postList.scss')],
  directives: [PostListItem],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostList {
  @Input() posts;
  @Input() loading;
  @Output() destroy = new EventEmitter(false);
  @Output() reload = new EventEmitter(false);
  constructor() {
    console.log('posts', this.posts)
  }
}
