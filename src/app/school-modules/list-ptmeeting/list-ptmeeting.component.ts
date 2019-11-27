import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
@Component({
  selector: 'app-list-ptmeeting',
  templateUrl: './list-ptmeeting.component.html',
  styleUrls: ['./list-ptmeeting.component.scss']
})
export class ListPtmeetingComponent implements OnInit {
  displayedColumns = [
    "id",
    "title",
    "date",
    "time",
    "location",
    // "accession_no",
    // "call_no",
    "actions"
  ];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);

  showloader: boolean = false;
  constructor(
    public http: Http, 
    public router: Router, 
    public SessionStore: SessionStorageService,
  ) { }

  ngOnInit() {
    this.getMeetings();
  }
  getMeetings() {
    this.showloader = true
    var status = this.SessionStore.retrieve('user-data');
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      org_id: status[0].org_code
    };
    this.http
      .post(`${environment.apiUrl}ptmeeting/get`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        // console.log(data);
        this.dataSource.data = data.data;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
export interface Element {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  // accession_no: string;
  // call_no: string;
}
