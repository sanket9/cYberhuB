import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";
import { NotificationService } from "../../services/notification.service";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

import "rxjs/add/observable/of";
@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss']
})
export class ListEventsComponent implements OnInit {
  displayedColumns = [
    "id",
    "event_name",
    "event_location",
    "event_description",
    "event_startdate",
    "event_enddate",
    "actions"
  ];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  constructor(public http: Http, public router: Router,  
    public notification: NotificationService, public SessionStore: SessionStorageService) { }

  ngOnInit() {
    this.getAllEvents();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllEvents() {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var status = this.SessionStore.retrieve('user-data');
    // console.log(status);
    
    let data = {
      org_id: status[0].org_code
    };
    this.http
      .post(`${environment.apiUrl}event/eventdetails`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.dataSource.data = data.data;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  selectEvent(id: number){
    let result = this.dataSource.data.find(itm => itm.id == id);
    // console.log(result);

    let q = btoa(JSON.stringify(result));
    this.router.navigate(["event/edit-event"], { queryParams: {data: q} });
  }

  deleteEvent(id){
    if(confirm("Are You Want to Delete this?")){
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      let options = new RequestOptions({ headers: headers });
      let data = {
        id: id
      };
    this.http
      .post(`${environment.apiUrl}event/deleteevent`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Event Deleted SuccessFuly"
          );
          this.getAllEvents();
        } else {
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Something Went Wrong"
          );
        }
      });
      
    }else{
      console.log("0");
      
    }
  }

}

export interface Element {
  id: number;
  event_name: string;
  event_location: string;
  event_description: string;
  event_startdate: string;
  event_enddate: string;
}
