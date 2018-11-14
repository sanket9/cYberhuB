import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment.prod";
import { Route, ActivatedRoute, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-choose-notice-type',
  templateUrl: './choose-notice-type.component.html',
  styleUrls: ['./choose-notice-type.component.scss']
})
export class ChooseNoticeTypeComponent implements OnInit {
  org_code: any;
  noticeTypes: any;
  orgShiftLists: any;
  noticeTypeID: any;
  orgClassSectionList: any;
  sortArray: any;
  filteredArrayForSectionList: any;
  showShiftClassSectionField: boolean;
  showSectionField: boolean;

  constructor(public route: ActivatedRoute, public routes: Router, public http: Http, public sessionStore: SessionStorageService) { }

  ngOnInit() {
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.getNoticeTypeSection();
    this.orgShiftLists = [];
    this.orgClassSectionList = [];
    this.sortArray = [];
    this.filteredArrayForSectionList = [];
    this.showShiftClassSectionField = false;
    this.showSectionField = false;
  }




  getNoticeTypeSection(){
    let header = new Headers();
    header.set("Content-Type", "application/json");

    // let data = {
    //   org_id 
    // };

    this.http
      .get(`${environment.apiUrl}notice/types`, {headers: header})
      .map(res => res.json())
      .subscribe(
        data => {
          // console.log("notice types list ", data.data);
          this.noticeTypes = data.data;
    });
  }




  getShiftLists() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code
    };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          // console.log("Org shift list ", data.data);
          this.orgShiftLists = data.data;
          this.orgShiftLists.unshift({
            id: "all",
            name: "All",
            orgshift: [
              {
                id: "all"
              }
            ]
          });
    });
  }


getClassList(){
  let header = new Headers();
  header.set("Content-Type", "application/json");

  let data = {
    org_id: this.org_code
  };
  
  this.http
    .post(`${environment.apiUrl}classsection/getall`, data)
    .map(res => res.json())
    .subscribe(
      data => {
        // console.log("Org Class list : ", data.data);
        this.orgClassSectionList = data.data;
        this.createSortArray(this.orgClassSectionList);
        this.sortArray.unshift({
          class_name: "All",
          class_id: "all"
        });
  });
}
  




  onChooseNoticeType(e) {
    if(e.value == "1" || e.value == "4"){
      this.showShiftClassSectionField = true;
      this.showSectionField = true;
    }else if(e.value == "5"){
      this.showShiftClassSectionField = true;
      this.showSectionField = false;
    }else{
      this.showShiftClassSectionField = false;
      this.showSectionField = false;
      // this.routes.navigate(['/notice-management/add-notice']);
    }

    if(this.orgShiftLists.length < 1){
      this.getShiftLists();
    }      
    this.noticeTypeID = e.value;
  }


  onChooseShift(e){
    if(this.orgClassSectionList.length < 1){
      this.getClassList();
    }
  }


  onChooseClassStream(e) {
    // let classStreamID = e.value;
    if(e.value == "all"){
      this.filteredArrayForSectionList = [
        { sec_id: "all", section_name: "All"}
      ];

      return;
    }

    this.filteredArrayForSectionList = this.sortArray.filter((element)=> {
      return element.class_id == e.value;
    });

    // console.log('filter section array : ', this.filteredArrayForSectionList);
    // console.log('filter only section array : ', this.filteredArrayForSectionList[0].sections);    
    this.filteredArrayForSectionList = this.filteredArrayForSectionList[0].sections;
    this.filteredArrayForSectionList.unshift({ sec_id: "all", section_name: "All"});
  }



  onChooseSection(e){
    if(e.value){
      // this.routes.navigate(['/notice-management/add-notice']);
    }    
  }



  onClickSubmitBtn(){
    this.routes.navigate(['/notice-management/add-notice']);
  }



  createSortArray(arr){
    // var rs = 1;
    arr.forEach(ele => {

      var obj = {
        class_id: ele.class_id,
        sec_id: ele.sec_id,
        class_name: ele.class.class_name,
        sections: [
          {
            section_name: ele.section.sec_name,
            sec_id: ele.sec_id,
            classSectionIndexId: ele.id
          }
        ]
      }

      let check_exist = this.sortArray.filter((element)=> {
        return element.class_id == ele.class_id;
      });

      if(check_exist.length > 0){
        // console.log('exist');
        let i = this.sortArray.indexOf(check_exist[0]);
        this.sortArray.splice(i,1); 

        check_exist[0].sections.push({
          section_name: ele.section.sec_name,
          sec_id: ele.sec_id,
          classSectionIndexId: ele.id
        });

        this.sortArray.push(check_exist[0]);       
      }else{
        this.sortArray.push(obj);
      }
    });
    // console.log(this.sortArray);    
  }




}
