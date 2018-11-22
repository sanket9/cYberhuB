import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Router } from "@angular/router";

@Component({
  selector: 'app-notice-management',
  templateUrl: './notice-management.component.html',
  styleUrls: ['./notice-management.component.css']
})
export class NoticeManagementComponent implements OnInit {

  sessionValue: any;

  constructor(
    public router: Router,
    public http: Http,
    private sessionStore: SessionStorageService
  ) { }

  ngOnInit() {
    this.sessionValue = this.sessionStore.retrieve('user-data')[0];
    // console.log(this.sessionValue); 
    this.getAllNotice();   
  }




  getAllNotice() {
    let header = new Headers();
    header.append('Content-Type', 'multipart/form-data');

    let data = {
      user_type_id: "1",
      org_id: "1",
      master_id: this.sessionValue.master_id
    }

    console.log('send data : ...', data);    

    this.http.post("http://softechs.co.in/school_hub/notice/noticelist", data, {headers: header}).map((res)=>{res.json()})
    .subscribe(data => {
      console.log('All notice list : ', data);
    });
  }

}
