import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { environment } from "../../../environments/environment.prod";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-list-syllabus',
  templateUrl: './list-syllabus.component.html',
  styleUrls: ['./list-syllabus.component.scss']
})
export class ListSyllabusComponent implements OnInit {
  
  displayedColumns = [
    "no",
    "class_id",
    "curriculum_year",
    "pdf_url",
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
    console.log('Syllabus data...', data);
    this.http
      .post(`${environment.apiUrl}syllabus/get`, data, options)
      .map(res => res.json())
      .subscribe(response => {
        this.showloader = false;
        console.log('Syllabus response...', response);
        this.dataSource.data = response.data;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  } 
  onDeleteClick(id: any) {
    if (confirm("Do you want to delete it?")) {
      this.showloader = true;
      console.log(id);
      let data = {
        id
      }
      this.http
        .post(`${environment.apiUrl}syllabus/delete`, data)
        .map(res => res.json())
        .subscribe(response => {
          this.showloader = false;
          console.log('Syllabus response...', response);
          // this.dataSource.data = response.data;
          this.getMeetings()
        });
    }
  }
}

export interface Element {
  no: number;
  class_id: number;
  curriculum_year: string;
  pdf_url: string;
}
