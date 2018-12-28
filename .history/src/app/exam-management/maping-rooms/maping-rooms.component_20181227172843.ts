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
    let values = {'org_id': this.org_id}
    this.http
      .post(`${environment.apiUrl}`, values, options)
      .map(res => res.json())
      .subscribe(data => {

      })
  }
}
