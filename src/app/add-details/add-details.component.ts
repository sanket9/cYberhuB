import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { environment } from "../../environments/environment.prod";
import { FormControl, FormGroup, NgForm, Validators, FormGroupDirective } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router'
import { ErrorStateMatcher } from '@angular/material/core';
// import { NotificationService } from '../../services/notification.service'
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
@Component({
  selector: "app-add-details",
  templateUrl: "./add-details.component.html",
  styleUrls: ["./add-details.component.css"]
})
export class AddDetailsComponent implements OnInit {
  constructor(
    public http: Http,
    // public notification: NotificationService,
    public SessionStore: SessionStorageService,
    public router: Router
  ) {}

  ngOnInit() {}

  uploadStudentFile(event) {
    //this.showloader = true;
    let elem = event.target;
    if (elem.files.length > 0) {
      let formData = new FormData();
      formData.append("file", elem.files[0]);
      var status = this.SessionStore.retrieve("user-data");
      formData.append("org_id", status[0].org_code);
      this.http
        .post(`${environment.apiUrl}student/addstudentexcel`, formData)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
        });
    }
  }
  uploadTeacherFile(event){
    let elem = event.target;
    if (elem.files.length > 0) {
      let formData = new FormData();
      formData.append("file", elem.files[0]);
      var status = this.SessionStore.retrieve("user-data");
      formData.append("org_id", status[0].org_code);
      this.http
        .post(`${environment.apiUrl}staff/addstaffexcel`, formData)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
        });
    }
  }

  downloadFile(url){
    return this.http
      .get(url, {
        responseType: ResponseContentType.Blob
        //search: // query string if have
      })
      .map(res => {
        return { filename: "student.csv", data: res.blob() };
      })
      .subscribe(res => {
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
        }, error => {
          console.log("download error:", JSON.stringify(error));
        }, () => {
          console.log("Completed file download.");
        });
  }
}
