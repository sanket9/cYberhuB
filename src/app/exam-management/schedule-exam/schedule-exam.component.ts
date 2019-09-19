import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormGroupDirective,
  FormArray
} from "@angular/forms";
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import * as csv from "csvtojson";
import { DatePipe } from '@angular/common';

@Component({
  selector: "app-schedule-exam",
  templateUrl: "./schedule-exam.component.html",
  styleUrls: ["./schedule-exam.component.scss"],
  providers: [DatePipe]
})
export class ScheduleExamComponent implements OnInit {
  fileReaded: any;
  examForm: FormGroup;
  org_id: string;
  master_id;
  showloader: boolean = false
  exam_list: any;

  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.createFormGroup();
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
    this.master_id = status[0].master_id;

    this.getExamName();
  }

  getExamName() {
    this.http.get(`${environment.apiUrl}exam/getexamname`).map(resp => resp.json()).subscribe((data: any) => {
      console.log('data....', data);
      if(data.data) {
        this.exam_list = data.data;
      }
    });
  }

  handleFileSelect(fileInput: any) {
    this.fileReaded = fileInput.target.files[0];
    // console.log(this.fileReaded);
    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    if (this.fileReaded.type === "application/vnd.ms-excel") {
      reader.onload = e => {
        // let csv: string = reader.result;
        // let allTextLines = csv.split(/\r|\n|\r/);
        // let headers = allTextLines[0].split(",");
        // let lines = [];

        // for (let i = 0; i < allTextLines.length; i++) {
        //   // split content based on comma
        //   let data = allTextLines[i].split(",");
        //   if (data.length === headers.length) {
        //     let tarr = [];
        //     for (let j = 0; j < headers.length; j++) {
        //       tarr.push(data[j]);
        //     }

        //     // log each row to see output
        //     lines.push(tarr);
        //   }
        // }
        // // all rows in the csv file
        // console.log(">>>>>>>>>>>>>>>>>", lines);
        this.examForm.patchValue({ exam_file: this.fileReaded });
      };
    } else {
      alert("File not accepted. Please select .csv File...");
    }
  }

  createFormGroup() {
    this.examForm = new FormGroup({
      exam_name: new FormControl("", [Validators.required]),
      exam_date: new FormControl("", [Validators.required]),
      exam_file: new FormControl(null, [Validators.required])
    });
  }

  FormSubmit(values) {
    let header = new Headers();
    header.append("Content-Type", "multipart/form-data");
    values.org_id = this.org_id;

    if(this.examForm.value.exam_date)
      this.examForm.value.exam_date = this.datePipe.transform(this.examForm.value.exam_date, 'dd/MM/yyyy');

    let fd = new FormData();
    fd.append("exam_name", this.examForm.value.exam_name);
    fd.append("exam_date", this.examForm.value.exam_date);
    fd.append("exam_file", this.fileReaded);
    fd.append("org_id", this.org_id);
    fd.append("master_id", this.master_id);
    //console.log('this.examForm.value.exam_date............', this.examForm.value.exam_date);

    this.http
      .post(`${environment.apiUrl}exam/create`, fd)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.data) {
          
          this.router.navigateByUrl("exam/room-select");
        }
      });
  }

  downloadDemo(url){
    return this.http
      .get(url, {
        responseType: ResponseContentType.Blob
        //search: // query string if have
      })
      .map(res => {
        return { filename: "demo-exam.csv", data: res.blob() };
      })
      .subscribe(
        res => {
          // console.log("start download:", res);
          var url = window.URL.createObjectURL(res.data);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = res.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        },
        error => {
          console.log("download error:", JSON.stringify(error));
        },
        () => {
          console.log("Completed file download.");
        }
      );
  }
  
  submitBtnDisabled() {
    if(this.examForm.valid) {
      return false;
    } else {
      return true;
    }
  }
}
