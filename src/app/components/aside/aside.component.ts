import {Component} from 'angular2/core';
import { SidenavService} from "ng2-material/all";


@Component({
  selector: 'my-aside',
  styles: [require('./aside.scss')],
  template: require('./aside.html')
})
export class Aside {
  constructor(public sidenav: SidenavService) {}
  close(name: string) {
    this.sidenav.hide(name);
  }
}
