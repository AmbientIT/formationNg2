import {Injectable} from 'angular2/core'

@Injectable()
export class AuthConfig {
  basePath: string;
  tokenName: string;
  loginUrl: string;
  signupUrl: string;
  
  constructor() {
    Object.assign(this, require('./env/development.json'))
  }
}
