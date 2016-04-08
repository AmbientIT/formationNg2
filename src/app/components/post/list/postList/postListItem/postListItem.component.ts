import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from 'angular2/core'
import {Router} from 'angular2/router'

import {IPost} from 'model/post/post.schema.ts'

@Component({
  selector: 'post-list-item',
  template: require('./postListItem.html'),
  styles: [require('./postListItem.scss')],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostListItem{
  @Input() post: IPost
  @Output() destroy = new EventEmitter(false)

  constructor(private router: Router) {}

  edit(id) {
    this.router.parent.navigate(['PostEdit', {id}])
  }
}
