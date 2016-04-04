/*
 * These are globally available services in any component or any other service
 */


import {provide} from 'angular2/core';

// Angular 2
import {FORM_PROVIDERS} from 'angular2/common';

// Angular 2 Http
import {HTTP_PROVIDERS} from 'angular2/http';
// Angular 2 Router
import {ROUTER_PROVIDERS, LocationStrategy, PathLocationStrategy} from 'angular2/router';

import { MATERIAL_PROVIDERS } from "ng2-material/all";
import {Config} from '../../app/config'
import {PostDao} from '../../app/components/post/model/postDao.service'

// Angular 2 Material
// import {MdRadioDispatcher} from '@angular2-material/radio/radio_dispatcher';
// const MATERIAL_PROVIDERS = [
//   MdRadioDispatcher
// ];

/*
* Application Providers/Directives/Pipes
* providers/directives/pipes that only live in our browser environment
*/
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  Config,
  PostDao,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
