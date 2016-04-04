import {Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';
import {AuthService} from './services/auth.service'
import {AuthConfig} from './config/index.ts'
import {Login} from './components/login/login.component'
import {Signup} from './components/signup/signup.component'

@Component({
  selector: 'post',
  template: require('./auth.html'),
  providers: [Auth, AuthConfig]
})
@RouteConfig([
  {
    path: '/login',
    name: 'Login',
    component: Login,
    useAsDefault: true
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
])
export class Auth {

}
