import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

import "rxjs/add/observable/of";

@Component({
  selector: "app-book-listing",
  templateUrl: "./book-listing.component.html",
  styleUrls: ["./book-listing.component.scss"]
})
export class BookListingComponent implements OnInit {
  displayedColumns = [
    "id",
    "bookname",
    "author",
    "publisher_name",
    "no_copy",
    "isbn_code",
    "place_of_pub",
    "year_of_pub",
    "edition",
    // "accession_no",
    // "call_no",
    "actions"
  ];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  constructor(
    public http: Http, 
    public router: Router, 
    public SessionStore: SessionStorageService,
  ) {}

  ngOnInit() {
    this.getAllBooks();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }
  getAllBooks() {
    var status = this.SessionStore.retrieve('user-data');
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      master_id: status[0].org_code
    };
    this.http
      .post(`${environment.apiUrl}library/librarydetails`, data, options)
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

  selectStaff(id){
    let result = this.dataSource.data.find(itm => itm.id == id);
    // console.log(result);

    let q = btoa(JSON.stringify(result));
    this.router.navigate(["library/edit-book"], { queryParams: {data: q} });
    
    
    // let url: string = this.router.url.substring(0, this.router.url.indexOf("?"));
    // this.router.navigateByUrl(url);
  }
}
export interface Element {
  id: number;
  bookname: string;
  author: string;
  no_copy: string;
  publisher_name: string;
  edition: string;
  isbn_code: string;
  place_of_pub: string;
  year_of_pub: string;
  // accession_no: string;
  // call_no: string;
}