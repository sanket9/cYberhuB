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
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'negativeNumber' })
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value) * (-1);
  }
}
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
  exam_date_sorted;
  selectedarray;
  examDaySelected;
  shift: any;
  sem: any = [];
  dept: any = [];
  year: any = [];
  sheats: any = [];
  RoomClassStruc: any = [];
  selectedStudent = [];
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

        let arry = [];
        this.exam_data.exam_date.forEach((element, i) => {
          if (i == 0) {
            let data = {
              date: element.exam_date,
              shift: [],
              year: [],
              sem: [],
              depts: []
            };
            arry.push(data);
            arry[0].shift.push(element.shift);
            arry[0].year.push(element.year);
            arry[0].sem.push(element.sem);
            arry[0].depts.push(element.dept);
          } else {
            let indx = arry.findIndex(item => item.date == element.exam_date);
            if (indx < 0) {
              let data = {
                date: element.exam_date,
                shift: [],
                year: [],
                sem: [],
                depts: []
              };
              arry.push(data);
              arry[indx].shift.push(element.shift);
              arry[indx].year.push(element.year);
              arry[indx].sem.push(element.sem);
              arry[indx].depts.push(element.dept);
            } else {
              let shiftindx = arry[indx].shift.indexOf(element.shift);
              if (shiftindx < 0) {
                arry[indx].shift.push(element.shift);
              }
              let semindx = arry[indx].sem.indexOf(element.sem);
              if (semindx < 0) {
                arry[indx].sem.push(element.sem);
              }
              let yearindx = arry[indx].year.indexOf(element.year);
              if (yearindx < 0) {
                arry[indx].year.push(element.year);
              }
              let deptindx = arry[indx].depts.indexOf(element.dept);
              if (deptindx < 0) {
                arry[indx].depts.push(element.dept);
              }
            }
          }
        });
        this.exam_date_sorted = arry;
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
    this.RoomClassStruc =[];
    for (let index = 0; index < this.filtered_room[0].benchCapacity; index++) {
      let data = {
        row: index + 1,
        class: 1,
        students: []
      };
      this.RoomClassStruc.push(data);
    }
    // console.log(this.RoomClassStruc);
  }
  benchcapacity(no) {
    let arry = [];
    for (let index = 0; index < no; index++) {
      arry.push(index);
    }
    return arry;
  }

  changeDate($event) {
    this.selectedarray = this.exam_date_sorted.filter(
      item => item.date === $event.value
    );
    console.log(this.exam_date_sorted);
  }
  searchstudent(i) {
    this.examDaySelected = this.exam_data.exam_date.filter(
      item =>
        item.shift == this.shift &&
        item.sem == this.sem[i] &&
        item.dept == this.dept[i] &&
        item.year == this.year[i]
    );

    alert(`${this.examDaySelected[0].exam_room.length} of Student Found`);
    if (this.examDaySelected[0].exam_room.length) {
      
      this.sheats[i] = this.examDaySelected[0].exam_room.length;
    }
    //console.log(this.examDaySelected);
  }
  assignStudent() {
    let remain_Std = []
    let total = 0;
    for (let index = 0; index < this.sheats.length; index++) {
      total = total + this.sheats[index];
    }
    let total_remain = this.filtered_room[0].total_no_students - total;
    if (total_remain < 0) {
      this.examDaySelected[0].exam_room.forEach(ele => {
        if (ele.room_id == null){
          remain_Std.push(ele);
        }
      });
      let added_student = this.examDaySelected[0].exam_room.length - Math.abs(total_remain);
      let slice_array = remain_Std.slice(0, added_student);
      // console.log(slice_array);
      this.selectedStudent = slice_array;
    }else{
      id
      console.log(this.examDaySelected);
      
      // this.selectedStudent = this.examDaySelected[0].exam_room;
    }
    return total_remain;

  }

  absoluteValue(value) {
    return Math.abs(value);
  }
  addclass(i) {
    this.RoomClassStruc[i].class += 1;
  }
  saveStudentRoom(i) {
    // console.log(this.examDaySelected);
    let send_data:any = [];
    send_data.exam_date_id = this.examDaySelected[0].id;
    this.selectedStudent.forEach(ele => {
      let data = {
        id: ele.id,
        reg_no: ele.std_regs_no
      }
      send_data.push(data);
    });
    
    console.log(send_data);

  }



}
