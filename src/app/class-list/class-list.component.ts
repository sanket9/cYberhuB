import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment.prod";

@Component({
  selector: "app-class-list",
  templateUrl: "./class-list.component.html",
  styleUrls: ["./class-list.component.scss"]
})
export class ClassListComponent implements OnInit {
  classList: any;
  sectionList: any;

  constructor(public http: Http) {}

  ngOnInit() {
    this.getClasslistNames();
  }

  //get class lists
  getClasslistNames() {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    this.http
      .get(`${environment.apiUrl}classlist/classlist`)
      .map(res => res.json())
      .subscribe(data => {
        // let jsonResponse = data.json();
        console.log("class list ", data.data);
        this.classList = data.data;
      });

    this.http
      .get(`${environment.apiUrl}classlist/sectionlist`)
      .map(res => res.json())
      .subscribe(data => {
        console.log("section list ", data.data);
        this.sectionList = data.data;
      });
  }
  
}
