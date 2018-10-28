import { Injectable } from "@angular/core";
import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  addNotice(newNoticeData) {
    let header = new HttpHeaders();
    header.set("Content-Type", "*");
    return this.http
      .post(
        "http://softechs.co.in/school_hub/notice/addnotice",
        newNoticeData,
        { headers: header }
      )
      .map(res => {
        return res;
      });
  }
}
