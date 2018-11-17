import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: "app-listroom",
  templateUrl: "./listroom.component.html",
  styleUrls: ["./listroom.component.scss"]
})
export class ListroomComponent implements OnInit {
  displayedColumns = [
    "id",
    "room_name",
    "floor_name",
    "sheating_type",
    "banchtypes",
    "benchCapacity",
    "no_of_banches",
    "total_no_students"
  ];

  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  showloader: boolean = true;

  constructor(
    public http: Http,
    public router: Router,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.getAllRooms();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
   
  }
  getAllRooms() {
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = { org_id: status[0].org_code };
    this.http
      .post(`${environment.apiUrl}room/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.showloader = false;
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
  room_name: string;
  floor_name: string;
  sheating_type: string;
  banchtypes: string;
  benchCapacity: string;
  no_of_banches: string;
  total_no_students: string;
}
