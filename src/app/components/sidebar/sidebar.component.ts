import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../../environments/environment.prod";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router, ActivatedRoute } from '@angular/router';

import "rxjs/add/observable/of";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard/', title: 'Dashboard',  icon: 'dashboard', class: '0', },
    { path: '/user-profile/', title: 'User Profile',  icon:'person', class: '0' },
    { path: '/gallery/', title: 'Gallery', icon:'photo_library', class: '100A' },
    { path: '/videos/', title: 'Videos', icon:'video_library', class: '100A' },
    { path: '/add-user-details/', title: 'Upload Details',  icon:'notifications', class: '100A' },
    { path: '/search-user', title: 'Search Student',  icon:'search', class: '100A' },
    { path: '/add-user/', title: 'Add User Role', icon: 'person', class: '3' },
    { path: '/notice/', title: 'Notice', icon: 'notes', class: '2' },
    { path: '/library/index/', title: 'Library', icon: 'library_books', class: '4' },
    { path: '/event/index/', title: 'Events', icon: 'speaker', class: '5' },
    { path: '/routine/index/', title: 'Routine', icon: 'event_available', class: '6' },
    { path: '/exam/index/', title: 'Exam System', icon: 'event_available', class: '7' },
    { path: '/school/module/index/', title: 'More', icon: 'settings_remote', class: '0' },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any = [];
  org_code;
  orgDetails;
  user_id;
  constructor(public http: Http, public sessionStore: SessionStorageService, private router: Router,) {}

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
          // if (this.sessionStore.retrieve("user-data")[0].user_type_id == 1) {
          //   //this.menuItems = ROUTES;
          // }else{

          // }
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
          // console.log("Roll List",data);
          let routes = [];
          if (this.sessionStore.retrieve("user-data")[0].user_type_id == 1) {
            let searchroutes = ROUTES.filter(menuItem => {
              return menuItem.class == "0" || menuItem.class == "100A"
            });
            console.log(searchroutes);

            routes = searchroutes;
          } else if (this.sessionStore.retrieve("user-data")[0].user_type_id == 2) {
            let searchroutes = ROUTES.filter(menuItem => {
              return menuItem.class == "0"
            });
            routes = searchroutes;
          }
          // console.log(routes);
          
          if (data.data.length > 0 && routes.length > 0) {
            this.sessionStore.store("user-role", data.data);
            data.data.forEach(ele => {
  
              if (ele.module_id) {
                let searchroutes = ROUTES.filter(menuItem => {
                  return menuItem.class == ele.module_id
                });
                // console.log(searchroutes);
                if (searchroutes.length > 0) {
                  routes.push(searchroutes[0])
                }       
              }
            });
            routes.splice(routes.length, 0, routes.splice(6, 1)[0]);
            this.menuItems = routes;
            // console.log(this.menuItems);
            
          }else{
            alert('You are not Athorized to this area. Contact to Institute Admin');
            this.logout()
          }
          
          
          
        }
        
      );
  }

  logout() {
    this.sessionStore.clear("user-data");
    this.router.navigate(["/"]);
  }
}
