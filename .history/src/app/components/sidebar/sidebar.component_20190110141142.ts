import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../../environments/environment.prod";

import "rxjs/add/observable/of";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/add-user', title: 'Add User', icon: 'person', class: '' },
    { path: '/notice', title: 'Notice', icon: 'notes', class: '' },
    { path: '/library/index', title: 'Library', icon: 'library_books', class: '' },
    { path: '/event/index', title: 'Events', icon: 'speaker', class: '' },
    { path: '/routine/index', title: 'Routine', icon: 'event_available', class: '' },
    { path: '/exam/index', title: 'Exam System', icon: 'event_available', class: '' },
    // { path: '/add-user-details', title: 'Add Details', icon: 'event_available', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

    constructor(public http: Http) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    // this.getRouts();
    
  }
//   getRouts(){
//       this.http.get(`${environment.apiUrl}role/addpermission`);
//   }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

}
