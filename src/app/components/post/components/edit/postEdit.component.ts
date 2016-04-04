import {Component, Injector} from 'angular2/core';
import {FORM_DIRECTIVES, Validators, FormBuilder, ControlGroup} from "angular2/common";
import {RouteParams, CanActivate, OnActivate, ComponentInstruction} from 'angular2/router'
import {PostDao} from '../../model/postDao.service'
import {appInjector} from '../../../../app.injector';


@Component({
  template: require('./postEdit.html'),
  styles: [ require('./postEdit.scss') ],
  directives: [FORM_DIRECTIVES],
})
@CanActivate((next, after) => {
  console.log('before', next)
  let injector: Injector = appInjector(); // get the stored reference to the injector
  const dao = injector.get(PostDao);
  const routeParams = next.urlPath.split('/')[1];
  return new Promise((resolve, reject) => {
    if(!routeParams) {
      resolve(true)
    } else {
      return dao.find(routeParams)
        .subscribe(
          data => {
            console.log('before data here !!!')
            next.params = data
            resolve(true)
          },
          err => {
            resolve(false)
          })
    }
  })
})
export class PostEdit implements OnActivate{
  postForm: ControlGroup;
  post: any;

  constructor(private formBuilder: FormBuilder, private routeParams: RouteParams, private _postDao: PostDao) {
    console.log('constructor', this)
  }

  save(post) {
    if(this.routeParams.get('id')) {
      post.id = this.routeParams.get('id')
      this._postDao.update(post)
    } else {
      this._postDao.create(post)
    }
  }

  ngOnInit() {
    console.log('init')
    this.postForm = this.formBuilder.group({
      'title': [this.post.title, Validators.compose([
        Validators.required,
      ])],
      'body': [this.post.body, Validators.compose([
        Validators.required,
        Validators.minLength(25),
        Validators.maxLength(300)
      ])]
    });
  }

  routerOnActivate(next:ComponentInstruction) {
    console.log('onActivate', next);
    this.post = next.params;
  }
}
