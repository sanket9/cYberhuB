import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../../environments/environment.prod";
import { FormControl, FormGroup, NgForm, Validators, FormGroupDirective } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { NotificationService } from '../../services/notification.service';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: "app-add-library",
  templateUrl: "./add-library.component.html",
  styleUrls: ["./add-library.component.scss"]
})
export class AddLibraryComponent implements OnInit {
  bookaddForm: FormGroup;
  bookname: FormControl;
  authorname: FormControl;
  publishername: FormControl;
  isbn_code: FormControl;
  edition: FormControl;
  no_of_copy: FormControl;
  book_for_out: FormControl;
  showErrors: boolean = false;
  showloader: boolean = false;
  constructor(
    public http: Http,
    public notification: NotificationService,
    public SessionStore: SessionStorageService,
    public router: Router
  ) {}

  ngOnInit() {
    this.createFormControl();
    this.createFormGroup();
  }

  createFormControl() {
    this.bookname = new FormControl("", [Validators.required]);
    this.authorname = new FormControl("", [Validators.required]);
    this.publishername = new FormControl("", [Validators.required]);
    this.isbn_code = new FormControl("", [Validators.required]);
    this.edition = new FormControl("", [Validators.required]);
    this.book_for_out = new FormControl("", [Validators.required]);
    this.no_of_copy = new FormControl("", [Validators.required]);
  }

  createFormGroup() {
    this.bookaddForm = new FormGroup({
      bookname: this.bookname,
      authorname: this.authorname,
      publishername: this.publishername,
      edition: this.edition,
      isbn_code: this.isbn_code,
      book_for_out: this.book_for_out,
      no_of_copy: this.no_of_copy
    });
    // console.log(this.bookaddForm);
  }

  bookadd(values) {
    this.showloader = true;
    var status = this.SessionStore.retrieve("user-data");
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    values.org_id = status[0].org_code;
    // console.log(this.bookaddForm);
    this.http
      .post(`${environment.apiUrl}library/addbook`, values, options)
      .map(res => res.json())
      .subscribe(data => {
        this.showloader = false;
        // console.log(data);
        if (!data.error && data.data) {
          this.notification.showNotification(
            "top",
            "right",
            "success",
            "Book Added SuccessFuly"
          );
          this.router.navigate(["/library/index"]);
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

  uploadFile(event) {
    this.showloader = true;
    let elem = event.target;
    if (elem.files.length > 0) {
      let formData = new FormData();
      formData.append("file", elem.files[0]);
      var status = this.SessionStore.retrieve("user-data");
      formData.append("org_id", status[0].org_code);
      this.http
        .post(`${environment.apiUrl}library/libraryimport`, formData)
        .map(res => res.json())
        .subscribe(
          data => {
            this.showloader = false;
            if (data.status == 1) {

              this.notification.showNotification(
                "top",
                "right",
                "success",
                "Book Added SuccessFuly"
              );

              this.router.navigate(["/library/index"]);
            } else {
              this.notification.showNotification(
                "top",
                "right",
                "warning",
                "Something Went Wrong"
              );
            }

            //console.log("Got some data from backend ", data);
          },
          error => {
            console.log("Error! ", error);
          }
        );
    }
  }
}
