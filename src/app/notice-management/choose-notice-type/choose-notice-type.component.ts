import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from "../../../environments/environment.prod";
import { Route, ActivatedRoute, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { MatOption } from '@angular/material';
import { ApiService } from "../../services/api/api.service";
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-choose-notice-type',
  templateUrl: './choose-notice-type.component.html',
  styleUrls: ['./choose-notice-type.component.scss']
})
export class ChooseNoticeTypeComponent implements OnInit {

  org_code: any;
  noticeTypes: any;
  orgShiftLists: any;
  selectedNoticeTypeID: any;
  orgClassSectionList: any;
  sortArray: any;
  filteredArrayForSectionList: any;
  showShiftClassSectionField: boolean;
  showSectionField: boolean;
  classStreamID: any;
  data: any;

  selectedData: any = {};
  sendSelectData: any;

  selectedShifts: any[];
  shift: any[];

  // get data() { 
  //   return this.apiServ.serviceData; 
  // } 
  // set data(value: any) { 
  //   this.apiServ.serviceData = value; 
  // } 

  @ViewChild('allSelected') private allSelected: MatOption;
  constructor(public route: ActivatedRoute, public routes: Router, public http: Http, public sessionStore: SessionStorageService, private apiServ: ApiService) { }

  ngOnInit() {
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.getNoticeTypeSection();
    this.orgShiftLists = [];
    this.orgClassSectionList = [];
    this.sortArray = [];
    this.filteredArrayForSectionList = [];
    this.showShiftClassSectionField = false;
    this.showSectionField = false;
    this.sendSelectData = {};
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

  // console.log("Org Class list : ", this.sortArray);
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

    // this.selectedNoticeTypeID = e.value;
    // console.log('notice type : ',this.selectedNoticeTypeID);
    this.selectedData.selectedNoticeType = e.value;  
  }


  onChooseShift(e){

    // console.log(e);
    // console.log(this.allSelected);        

    if(this.orgClassSectionList.length < 1) {
      this.getClassList();
    }
    // console.log('shift : ', e.value);  
    
    let ifAllSelect = e.value.filter((ele)=>{
      return ele == "all";
    });

    if(ifAllSelect.length > 0){
      this.selectedData.selectedShifts = this.orgShiftLists;
    }else{
      this.selectedData.selectedShifts = e.value;
    }

  }


  onChooseClassStream(e) {
    this.classStreamID = e.value;
    if(e.value == "all"){
      this.filteredArrayForSectionList = [
        { sec_id: "all", section_name: "All" }
      ];
      return;
    }

    this.filteredArrayForSectionList = this.sortArray.filter((element)=> {
      return element.class_id == e.value;
    });
   
    this.filteredArrayForSectionList = this.filteredArrayForSectionList[0].sections;
    this.filteredArrayForSectionList.unshift({ sec_id: "all", section_name: "All"});

    // console.log('filter section array : ', this.filteredArrayForSectionList);
  }



  onChooseSection(e){
    if(e.value){
      // this.routes.navigate(['/notice-management/add-notice']);
    }   
    
    let ifAllSelect = e.value.filter((ele)=>{
      return ele == "all";
    });

    if(ifAllSelect.length > 0){
      if(this.classStreamID == "all"){
        this.selectedData.selectedSections = this.sortArray;
      }else{
        this.selectedData.selectedSections = this.sortArray.filter((element)=> {
          return element.class_id == this.classStreamID;
        });
      }      
    }else{
      this.selectedData.selectedSections = e.value;
    }        
  }



  onClickSubmitBtn(){   
    this.sortSelectedFilterData(this.selectedData);
    // console.log('Selected send data', this.selectedData);     
    this.routes.navigate(['/notice-management/add-notice']);
  }



  sortSelectedFilterData(arr) {
    this.sendSelectData.noticeType = arr.selectedNoticeType;
    this.sendSelectData.shifts = [];
    this.sendSelectData.sections = [];

    if(arr.selectedShifts[0].id == "all"){
      arr.selectedShifts.forEach(element => {
        if(element.id != "all"){
          if(element.orgshift.length > 0){
            this.sendSelectData.shifts.push(element.orgshift[0].id);
          }          
        }
      });
    }else{
      this.sendSelectData.shifts = arr.selectedShifts;
    }


    if(arr.selectedSections[0].class_id == "all" || arr.selectedSections[0].class_name == "Arts" || arr.selectedSections[0].class_name == "Science"){
      arr.selectedSections.forEach(element => {
        if(element.class_id != "all"){
          if(element.sections.length > 0){
            element.sections.forEach(ele => {
              if(ele.sec_id != "all"){
                this.sendSelectData.sections.push(ele.classSectionIndexId);
              }              
            });            
          }          
        }
      });
    }else{
      this.sendSelectData.sections = arr.selectedSections;
    }

    // console.log('filter data : ', this.sendSelectData);
    this.apiServ.changeData(this.sendSelectData);
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




  selectAllShifts(){
    
  }


}
