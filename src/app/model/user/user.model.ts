import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {Api} from '../api'
import {Config} from '../../config/index'

@Injectable()
export class UserModel extends Api<any>{
  constructor(http:Http, private config: Config) {
    super(http, `${config.api.basePath}/users`)
  }
}
