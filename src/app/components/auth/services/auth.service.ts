import {Injectable} from 'angular2/core'
import {Http, Headers} from 'angular2/http'
import {AuthConfig} from '../config/index'
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class AuthService {
  private _http: Http;
  private authConfig: AuthConfig
  loggedUser$: Observable<any>;
  private _loggedUserObserver: Observer<any>;
  
  constructor() {
    this.loggedUser$ = new Observable(observer =>  {
      this._loggedUserObserver = observer
    })
      .startWith({})
      .share();
  }
  
  login(user) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');
    this._http.post(`${this.authConfig.basePath}/${this.authConfig.loginUrl}`, JSON.stringify(user), {headers})
      .map(response => response.json())
      .subscribe(
        data => {
          this._loggedUserObserver.next(data.user);
        },
        error => console.log('Could not create post.'));
  }

  signup() {

  }

  logout() {

  }

  isAuthenticated() {

  }

  getToken() {

  }
}
