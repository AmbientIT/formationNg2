/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';
import {Home} from './components/home';
import {Post} from './components/post/post.component'
import {Aside} from './components/aside/aside.component'
import {Auth} from './components/auth/auth.component'
import {SidenavService, Media} from "ng2-material/all";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  directives: [ Aside ],
  styles: [ require('./app.scss') ],
  template: require('./app.html'),
})
@RouteConfig([
  { path: '/', name: 'Home', component: Home, useAsDefault: true },
  { path: '/post/...',  name: 'Post',  component: Post },
  { path: '/about', name: 'About', loader: () => require('es6-promise!./components/about')('About') },
  { path: '/auth/...',  name: 'Auth',  component: Auth},

])
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(public sidenav: SidenavService) {}
  hasMedia(breakSize: string): boolean {
    return Media.hasMedia(breakSize);
  }
  open(name: string) {
    this.sidenav.show(name);
  }
}
