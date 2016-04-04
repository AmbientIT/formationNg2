import {Injectable} from 'angular2/core';

@Injectable()
export class Config {
  api: any;
  constructor() {
    Object.assign(this, require('./env/development.json'))
  }
}
