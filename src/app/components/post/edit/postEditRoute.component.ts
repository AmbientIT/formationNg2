import {Component} from 'angular2/core'
import {RouteParams, Router} from 'angular2/router'
import {Subject} from 'rxjs'

import {PostForm} from '../form/postForm.component'
import {Posts} from 'model/post/post.model'

@Component({
  selector: 'post-edit-route',
  template: require('./postEdit.html'),
  styles: [require('./postEdit.scss')],
  directives: [PostForm],
})

export class PostEditRoute {
  postId: string
  post$: any
  title: string

  constructor(private routeParams: RouteParams, private router: Router, public posts: Posts) {
    this.postId = routeParams.get('id')
    this.post$ = !!this.postId ? posts.load(this.postId) : new Subject().startWith({
      title: 'nouveau post'
    })

    this.post$.subscribe(data => {
      this.title = data.title
    })
  }

  save(form) {
    if (form.valid) {
      if (this.postId) {
        const post = form.value
        post.id = this.postId
        this.posts.patch(post)
      } else {
        this.posts.add(form.value)
      }
      this.router.parent.navigate(['PostList'])
    }
  }
}
