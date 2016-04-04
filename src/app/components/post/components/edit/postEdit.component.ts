import {Component, Injector} from 'angular2/core'
import {FORM_DIRECTIVES, Validators, FormBuilder, ControlGroup} from 'angular2/common'
import {RouteParams, CanActivate, OnActivate, ComponentInstruction} from 'angular2/router'
import {PostDao} from '../../model/postDao.service'
import {appInjector} from '../../../../app.injector'
import {Post} from '../../model/post.interface'
import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject'
import {PostImpl} from '../../model/post'


@Component({
  template: require('./postEdit.html'),
  styles: [require('./postEdit.scss')],
  directives: [FORM_DIRECTIVES],
})
// @CanActivate((next, after) => {
//   console.log('before', next)
//   let injector: Injector = appInjector() // get the stored reference to the injector
//   const dao = injector.get(PostDao)
//   const routeParams = next.urlPath.split('/')[1]
//   return new Promise((resolve, reject) => {
//     if(!routeParams) {
//       resolve(true)
//     } else {
//       return dao.find(routeParams)
//         .subscribe(
//           data => {
//             console.log('before data here !!!')
//             next.params = data
//             resolve(true)
//           },
//           err => {
//             resolve(false)
//           })
//     }
//   })
// })
export class PostEdit {
  postForm: ControlGroup
  post$: Observable<Post>
  postId: string

  constructor(private formBuilder: FormBuilder,
              private routeParams: RouteParams,
              private postDao: PostDao) {
    this.postId = routeParams.get('id')
    if (this.postId) {
      this.post$ = postDao.find(this.postId)
    } else {
      const post = new Subject<Post>()
      post.next(new PostImpl())
      this.post$ = post
    }
    this.postForm = this.createPostForm(formBuilder)
  }

  save(form) {
    this.post$.do(post => {
      if (post.id) {
        this.postDao.update(post)
      } else {
        post.id = this.postId
        this.postDao.create(post)
      }
    })
  }

  private createPostForm(formBuilder: FormBuilder) {
    return formBuilder.group({
      'title': ['', Validators.compose([
        Validators.required,
      ])],
      'body': ['', Validators.compose([
        Validators.required,
        Validators.minLength(25),
        Validators.maxLength(300)
      ])]
    })
  }

  // routerOnActivate(next: ComponentInstruction) {
  //   console.log('onActivate', next)
  //   this.post = next.params
  // }
}
