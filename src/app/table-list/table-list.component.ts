import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from "../../environments/environment.prod";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  org_id: any;
  userRolls: any[];
  constructor(
    public router: Router,
    public http: Http,
    public SessionStore: SessionStorageService,
    public notification: NotificationService
  ) { }

  ngOnInit() {
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code
    this.orgRollList();
  }
  orgRollList() {
    let apiData = {
      org_id : this.org_id
    }
    this.http.post(`${environment.apiUrl}role/org/list`,apiData)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data) {
          let newArry = [];
          data.data.forEach(element => {
            let isPresentUser = newArry.filter(ele => ele.user.id == element.master_id);
            if (isPresentUser.length > 0) {
              let pos = newArry.map(function(e) { return e.user.id }).indexOf(element.master_id);
              // console.log(pos);
              
              let newpushdata= {
                module_id: element.module_id,
                permissions : {
                  add: element.add == 1 ? true : false,
                  edit: element.edit == 1 ? true : false,
                  delete: element.delete == 1 ? true : false,
                  view: element.view == 1 ? true : false,
                  all: element.all == 1 ? true : false,
                }
              }
              newArry[pos].roles.push(newpushdata);
            }else{
              let pushData = {
                user : {
                  id: element.master_id,
                  user_name: element.staff.user_name
                },
                roles : [
                  {
                    module_id: element.module_id,
                    permissions : {
                      add: element.add == 1 ? true : false,
                      edit: element.edit == 1 ? true : false,
                      delete: element.delete == 1 ? true : false,
                      view: element.view == 1 ? true : false,
                      all: element.is_all == 1 ? true : false,
                    }
                  }
                ]
              }
              newArry.push(pushData);
              console.log(newArry);
              this.userRolls = newArry
            }
          });
        }
      })
  }
}
