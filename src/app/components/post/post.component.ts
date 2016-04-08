/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {PostListRoute} from './list/postListRoute.component';
import {PostEditRoute} from './edit/postEditRoute.component';

/*
 * Post Component
 */
@Component({
  selector: 'post',
  template: require('./post.html'),
})
@RouteConfig([
  {
    path: '/list',
    name: 'PostList',
    component: PostListRoute,
    useAsDefault: true
  },
  {
    path: '/edit/:id',
    name: 'PostEdit',
    component: PostEditRoute
  },
  {
    path: '/create',
    name: 'PostCreate',
    component: PostEditRoute
  },
])
export class Post {

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
