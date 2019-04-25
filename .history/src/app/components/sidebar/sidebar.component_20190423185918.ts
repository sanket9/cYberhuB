import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../../environments/environment.prod";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import "rxjs/add/observable/of";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '0' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '0' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/add-user-details', title: 'Upload Details',  icon:'notifications', class: '0' },
    { path: '/add-user', title: 'Add User Role', icon: 'person', class: '3' },
    { path: '/notice', title: 'Notice', icon: 'notes', class: '2' },
    { path: '/library/index', title: 'Library', icon: 'library_books', class: '4' },
    { path: '/event/index', title: 'Events', icon: 'speaker', class: '5' },
    { path: '/routine/index', title: 'Routine', icon: 'event_available', class: '6' },
    { path: '/exam/index', title: 'Exam System', icon: 'event_available', class: '7' },
    // { path: '/add-user-details', title: 'Add Details', icon: 'event_available', class: '' },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  org_code;
  orgDetails;
  user_id;
  constructor(public http: Http, public sessionStore: SessionStorageService) {}

  ngOnInit() {
    // this.menuItems = ROUTES.filter(menuItem => menuItem);
    // this.getRouts();
    this.org_code = this.sessionStore.retrieve("user-data")[0].org_code;
    this.user_id = this.sessionStore.retrieve("user-data")[0].master_id;
    this.getOrgdetails();
  }
  //   getRouts(){
  //       this.http.get(`${environment.apiUrl}role/addpermission`);
  //   }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  getOrgdetails() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code
    };
    this.http
      .post(`${environment.apiUrl}org/getdetail`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          // console.log(data);
          this.orgDetails = data.data;
          this.getRollList();
          
        }
        // error => {
        //   console.log("Error! ", error);
        // }
      );
  }

  getRollList() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code,
      master_id: this.user_id
    };
    this.http
      .post(`${environment.apiUrl}role/roledetails`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          console.log("Roll List",data);
          let routes = [];
          data.data.forEach(ele => {

            if (ele.module_id) {
              let searchroutes = ROUTES.filter(menuItem => {
                return menuItem.class == ele.module_id
              });
              if (searchroutes.length > 0) {
                routes.push(searchroutes[0])
              }       
            }
          });

          if (this.sessionStore.retrieve("user-data")[0].user_type_id == 1 ||
            this.sessionStore.retrieve("user-data")[0].user_type_id == 2
          ) {
            let searchroutes = ROUTES.filter(menuItem => {
              return menuItem.class == "0"
            });
            console.log(searchroutes);
            
            // routes.unshift(searchroutes)
          }
          this.menuItems = routes;
        }
        
      );
  }
}
