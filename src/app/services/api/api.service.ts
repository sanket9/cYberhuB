import { Injectable } from "@angular/core";
import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ApiService {
  // serviceData: any;

  private dataSource = new BehaviorSubject('default message');
  serviceData = this.dataSource.asObservable();

  constructor(private http: HttpClient) {}


  changeData(data: any) {
    this.dataSource.next(data);
  }

  // addNotice(newNoticeData) {
  //   let header = new HttpHeaders();
  //   // header.set("Content-Type", "*");
  //   return this.http
  //     .post("http://softechs.co.in/fileupload.php", newNoticeData, {
  //       headers: header
  //     })
  //     .map(res => {
  //       return res;
  //     });
  // }
}
