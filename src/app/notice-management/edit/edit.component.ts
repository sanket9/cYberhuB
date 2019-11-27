import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { ApiService } from "../../services/api/api.service";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Route, ActivatedRoute, Router } from "@angular/router";

import { NotificationService } from '../../services/notification.service';
import { environment } from 'environments/environment.prod';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  noticeId:any;
  showloader: boolean;
  editNoticeForm: FormGroup;
  schedulenotiForm: FormGroup;
  file: any;

  constructor(public activatedRoute:ActivatedRoute, public router: Router,
    public http: Http,
    private apiServ: ApiService,
    private sessionStore: SessionStorageService,
    public notification: NotificationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      // console.log(params);
      this.noticeId = params.id
    });
    this.getNotieceDtails()
    this.createFormControls();
  }

  createFormControls() {
    this.editNoticeForm = new FormGroup({
      id: new FormControl(this.noticeId.id, [Validators.required]),
      title: new FormControl(this.noticeId.title, [Validators.required]),
      subject: new FormControl(this.noticeId.subject, [Validators.required]),
      startDate: new FormControl(this.noticeId.start_date, [Validators.required]),
      endDate: new FormControl(this.noticeId.end_date, [Validators.required]),
      text: new FormControl(this.noticeId.text, [Validators.required]),
    });

    // let notiFrm =  new FormArray([
    //   new FormGroup({
    //     noti_date: new FormControl("", [Validators.required]),
    //     noti_time: new FormControl("", [Validators.required]),
    //     noti_title: new FormControl("", [Validators.required]),
    //     noti_body: new FormControl("", [Validators.required]),
    //   })  
    // ]);
    // this.schedulenotiForm = new FormGroup({
    //   schedule: notiFrm
    // })

    // let data = this.schedulenotiForm.get("schedule");
    // this.noticeId.notiece_send_notification(ele=> {
      
    //   const newarry = new FormGroup({
    //     noti_date: new FormControl(ele.date, [Validators.required]),
    //     noti_time: new FormControl(ele.time, [Validators.required]),
    //     noti_title: new FormControl(ele.title, [Validators.required]),
    //     noti_body: new FormControl(ele.body, [Validators.required]),
        
    //   });
    //   (data as FormArray).push(newarry);
    // })
  }
  getNotieceDtails() {
    this.showloader = true;
    let data = {
      id: this.noticeId
    }
    this.http.post(`${environment.apiUrl}notice/details`, data).map(res => res.json()).subscribe(data => {
      // console.log(data);
      this.showloader = false;
      this.noticeId = data.data;
      this.createFormControls();
      
    })
  }


  onSelectFile($event): void {
    var inputValue = $event.target;
    this.file = inputValue.files[0];
    console.log(this.file);
  }


  
  onNoticeSubmit() {
    this.showloader = true;
    let data = this.editNoticeForm.value;

    if (this.noticeId.start_date != data.startDate) {
      data.startDate = this.getFullDate(this.editNoticeForm.value.startDate)
    }
    if (this.noticeId.end_date != data.endDate) {
      data.endDate = this.getFullDate(this.editNoticeForm.value.endDate)
    }

    this.http.post(`${environment.apiUrl}notice/noticeupdate`, data).map(res => res.json()).subscribe(data => {
      // console.log(data);
      if (data.data) {
        this.showloader = true;
        this.notification.showNotification(
          "top",
          "right",
          "success",
          "Notice Updated Successfully."
        );
        this.router.navigate(['/notice'])
      }
    })
  }

  getFullDate(today) {
    // var today = new Date();
    if (today) {
      
      var dd = today.getDate().toString();
      var mm = today.getMonth().toString();
      var monthNum = Number(mm) + 1;
      var yyyy = today.getFullYear();
      // var returnDate;
  
      // console.log('length : ', dd.length);
      if (dd.length < 1) {   
        dd = '0' + dd;
        // console.log(dd);    
      }
  
      // console.log('length : ', monthNum.length);
      // if (monthNum < 10) {
      //   var monthNum1 = '0' + monthNum;
      //   // console.log(monthNum);
      // }
  
      // console.log(yyyy + '-' + monthNum + '-' + dd);  
      return yyyy + '-' + monthNum + '-' + dd;    
    }
  }
}
