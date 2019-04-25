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
  showloader: boolean = false;
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
  teacherList;
  teacher;
  exam_date_id
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
    this.getStaffList();
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
        // console.log(data);
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
        console.log("sorted",arry);
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
    this.RoomClassStruc = [];
    for (let index = 0; index < this.filtered_room[0].benchCapacity; index++) {
      let data = {
        row: index + 1,
        class: 1,
        students: []
      };
      this.RoomClassStruc.push(data);
    }
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    let data = {
      org_id: this.org_id,
      exam_date: this.exam_data.id,
      shift: this.shift,
      room_no: this.filtered_room[0].id
    };
    this.http
      .post(`${environment.apiUrl}exam/search-room`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data.data) {
          data.data.exam_date.forEach(element => {
            if (element.exam_room.length > 0) {
              alert(`Already Student Assigned
                Year: ${element.year}
                Sem: ${element.sem}
                Deperment: ${element.dept}
              `);
            }
          });
        }
      });
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
    let _i = 0;
    console.log(this.examDaySelected[0]);
    this.exam_date_id[i] = this.examDaySelected[0].id;
    if (this.examDaySelected.length > 0) {
      this.examDaySelected[0].exam_room.forEach(ele => {
        if (ele.room_id == null && ele.position == null) {
          _i++;
        }
      });
      alert(`${_i} of Student Found`);
      this.sheats[i] = _i;
    }else{

      alert(`No Student Found`);
    }
    // if (this.examDaySelected[0].exam_room.length) {

    // }
    //console.log(this.examDaySelected);
  }
  assignStudent() {
    let remain_Std = [];
    let total = 0;
    for (let index = 0; index < this.sheats.length; index++) {
      total = total + this.sheats[index];
    }

    let total_remain = this.filtered_room[0].total_no_students - total;
    if (total_remain < 0) {
      this.examDaySelected[0].exam_room.forEach(ele => {
        if (ele.room_id == null) {
          remain_Std.push(ele);
        }
      });
      let added_student =
        this.examDaySelected[0].exam_room.length - Math.abs(total_remain);
      let slice_array = remain_Std.slice(0, added_student);
      // console.log(slice_array);
      this.selectedStudent = slice_array;
    } else {
      this.selectedStudent = [];
      // console.log(this.examDaySelected);
      
      if (this.examDaySelected && this.examDaySelected.length > 0 ) {
        this.examDaySelected[0].exam_room.forEach(ele => {
          if (ele.room_id == null && ele.position == null) {
            // this.selectedStudent.findIndex(ele => ele.id == )
            this.selectedStudent.push(ele);
          }
        });
      }
    }
    return total_remain;
  }

  absoluteValue(value) {
    return Math.abs(value);
  }
  addclass(i) {
    this.RoomClassStruc[i].class += 1;
  }
  // yearchange(e) {
  //   console.log(e);
  //   console.log("Exam data",this.exam_data);
    
  //   let a  = this.exam_data.exam_date.filter(ele => {
  //     return ele.exam_date == this.selectedarray[0].date && ele.year == e.value
  //   })
  //   this.semOptions = a
    
  // }

  // semchange(e) {
  //   console.log(e);
  //   console.log("Exam data", this.exam_data);

  //   let a = this.exam_data.exam_date.filter(ele => {
  //     return ele.exam_date == this.selectedarray[0].date && ele.year == e.value
  //   })
  //   console.log(a);

  // }


  saveStudentRoom(i) {
    // console.log(this.selectedStudent);
    let send_data: any = [];
    this.selectedStudent.forEach(ele => {
      let data = {
        id: ele.id,
        reg_no: ele.std_regs_no
      };
      send_data.push(data);
    });

    let data = {
      room_id: this.filtered_room[0].id,
      pos: i,
      exam_date_id: this.examDaySelected[0].id,
      student: send_data
    };

    // console.log(data);
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
      .post(`${environment.apiUrl}exam/stdn-update`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  }
  getStaffList() {
    let data = { org_id: this.org_id };
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
      .post(`${environment.apiUrl}staff/orglist`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        if (data.data) {
          this.teacherList = data.data;
        }
      });
  }
  assignTeacher() {
    // console.log(this.examDaySelected);

    let data = {
      org_id: this.org_id,
      exam_date: this.exam_data.id,
      theacher_ids: this.teacher,
      room_id: this.filtered_room[0].id
    };
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
      .post(`${environment.apiUrl}exam/assign-staff`, data, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Teacher Assign SuccessFuly"
          );
        } else {
          this.notification.showNotification(
            "top",
            "right",
            "warning",
            "Something Went Wrong"
          );
        }
      });
  }
}
