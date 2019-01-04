import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
@Component({
  selector: "app-maping-rooms",
  templateUrl: "./maping-rooms.component.html",
  styleUrls: ["./maping-rooms.component.scss"]
})
export class MapingRoomsComponent implements OnInit {
  org_id: string;
  exam_data: any;
  org_rooms;
  filtered_room;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.getdata();
  }

  getdata = () => {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let values = { org_id: this.org_id };
    this.http
      .post(`${environment.apiUrl}exam/last-exam`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.exam_data = data.data;
        // console.log(this.exam_data);
        this.getallRooms();
        let date = []
        let shift=[];
        let year = [];
        let sem = [];
        let arry = [];
        this.exam_data.exam_date.forEach((element, i) => {
          if(i == 0) {
            let data = {
              date: element.exam_date,
              shift: [],
              year: [],
              sem: []
            }
            arry.push(data);
          }else{
            let indx = arry.findIndex(item => item.date == element.date);
            console.log(indx);
            
            // if(indx < 0){
            //   let data = {
            //     date: element.exam_date,
            //     shift: [],
            //     year: [],
            //     sem: []
            //   }
            //   arry.push(data);
            // }else{
              
            // }
          }
          
         
        });
        console.log(arry);
        
      });
  };

  getallRooms() {
    // this.showloader = true;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      org_id: this.org_id
    };
    this.http
      .post(`${environment.apiUrl}room/getall`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        this.org_rooms = data.data;
      });
  }
  changeRoom(e) {
    // console.log(e);
    this.filtered_room = this.org_rooms.filter(item => item.id === e.value);

  }
  benchcapacity(no){
    let arry = []
    for (let index = 0; index < no; index++) {
      arry.push(index);
    }
    return arry;
  }
}
