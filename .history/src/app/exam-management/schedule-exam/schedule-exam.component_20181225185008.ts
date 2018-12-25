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
import * as csv from "csvtojson";

@Component({
  selector: "app-schedule-exam",
  templateUrl: "./schedule-exam.component.html",
  styleUrls: ["./schedule-exam.component.scss"]
})
export class ScheduleExamComponent implements OnInit {
  fileReaded: any;
  examForm: FormGroup;
  org_id: string;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public router: Router,
    public activeroute: ActivatedRoute,
    public SessionStore: SessionStorageService
  ) {}

  ngOnInit() {
    this.createFormGroup();
    var status = this.SessionStore.retrieve("user-data");
    this.org_id = status[0].org_code;
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
      }
    } else {
      alert("File not accepted. Please select .csv File...");
    }
  }

  createFormGroup() {
    this.examForm = new FormGroup({
      exam_name: new FormControl("", [Validators.required]),
      exam_file: new FormControl(null, [Validators.required])
    });
  }
  FormSubmit(values){
    console.log(values);
    values.org_id = this.org_id;
    this.http
      .post(`${environment.apiUrl}exam/create`, values)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  }
}
