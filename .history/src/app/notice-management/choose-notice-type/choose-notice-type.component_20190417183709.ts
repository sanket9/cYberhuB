import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from "../../../environments/environment.prod";
import { Route, ActivatedRoute, Router } from "@angular/router";
import { Http, RequestOptions, Headers } from "@angular/http";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { MatOption } from '@angular/material';
import { ApiService } from "../../services/api/api.service";
import { NgModel } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

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
  filteredArrayForClassList: any;
  showShiftField: boolean;
  showClassField: boolean;
  showSectionField: boolean;
  showStuffTypeField: boolean;
  showSearchField: boolean;
  showRollField: boolean;
  showFoundStudentTable: boolean;
  classStreamID: any;
  shiftID: any;
  data: any;
  searchRoll: any;
  foundStudentForSearch: any;
  selectStdArr: any;
  studentSelectedForPersonelNotice: boolean;
  getAllStuff: any; 
  teachingOrNonteachingStuff: any;

  selectedData: any = {};
  sendSelectData: any;

  selectedShifts: any[];
  shifts: any[]; 

  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(
    public route: ActivatedRoute, 
    public routes: Router, 
    public http: Http, 
    public sessionStore: SessionStorageService, 
    private apiServ: ApiService,
    public notification: NotificationService
    ) { }

  ngOnInit() {
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.getNoticeTypeSection();
    this.getClassList();
    this.orgShiftLists = [];
    this.orgClassSectionList = [];
    this.sortArray = [];
    this.filteredArrayForSectionList = [];
    this.filteredArrayForClassList = [];
    this.showShiftField = false;
    this.showSectionField = false;
    this.showClassField = false;
    this.showStuffTypeField = false;
    this.showSearchField = false;
    this.showRollField = false;
    this.showFoundStudentTable = false;
    this.studentSelectedForPersonelNotice = false;
    this.sendSelectData = {};
    this.selectStdArr = [];
  }



// ###################################################################
//    ------------------ getting all notice type -----------------
// ###################################################################
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



// ########################################################################
//       ------------------ getting all shifts here -----------------
// ########################################################################
  getShiftLists() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
    let data = {
      org_id: this.org_code
    };
    // this.checkshift = [];
    this.http
      .post(`${environment.apiUrl}shift/orgshiftlist`, data, {headers: header})
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






// ########################################################################
//     ------------------ getting all class list here -----------------
// ########################################################################
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
        console.log("Org Class list : ", data.data);
        this.orgClassSectionList = data.data;
        // this.createSortArray(this.orgClassSectionList);
        // this.sortArray.unshift({
        //   class_name: "All",
        //   class_id: "all"
        // });
  });
  // console.log("Org Class list : ", this.sortArray);
}


  



// ########################################################################
// ------------------ After choose notice type function -----------------
// ########################################################################
  onChooseNoticeType(e) {

    this.selectedData.noticeType = e.value;

    if(e.value == "1" || e.value == "4"){
      this.showClassField = true;
      this.showSectionField = true;
      this.showShiftField = true;
      this.showStuffTypeField = false;
      this.showSearchField = false;
      this.showRollField = false;
    }else if(e.value == "5"){
      this.showShiftField = true;
      this.showClassField = true;
      this.showSectionField = true;
      this.showStuffTypeField = true;
      this.showSearchField = false;
      this.showRollField = false;
      this.getStuffs();
    }else if(e.value == "2"){
      this.showShiftField = false;
      this.showClassField = false;
      this.showSectionField = false;
      this.showStuffTypeField = false;
      this.showSearchField = false;
      this.showRollField = false;
    }else{
      this.showShiftField = false;
      this.showClassField = false;
      this.showSectionField = false;
      this.showStuffTypeField = false;
      this.showSearchField = true;
      this.showRollField = true;
    }

    if(this.orgShiftLists.length < 1){
      this.getShiftLists();
    } 

    // this.selectedNoticeTypeID = e.value;
    // console.log('notice type : ',this.selectedNoticeTypeID);
    this.selectedData.selectedNoticeType = e.value; 
    this.sortArray = []; 
    this.filteredArrayForSectionList = [];
  }




// ########################################################################
//    -------- get list of teaching and non teaching stuff ---------
// ########################################################################
  getStuffs() {
    let header = new Headers();
    header.set("Content-Type", "application/json");
  
    this.http
      .get(`${environment.apiUrl}rolecategory/all`, {headers: header})
      .map(res => res.json())
      .subscribe(
        data => {
          console.log("found stuff details : ", data.data); 
          this.getAllStuff = data.data;         
          // this.foundStudentForSearch = data.data[0];
    });
  }




// ########################################################################
//    ------------------ After choose stuff type ------------------
// ########################################################################
  onChangeStuffType(e){
    console.log(e.value);
    if(e.value != "3"){

      let teachOrNonTeachthis = this.getAllStuff.filter((ele) => {
        return ele.parent_id == e.value;
      });

      this.teachingOrNonteachingStuff = teachOrNonTeachthis;
      this.teachingOrNonteachingStuff.unshift({id: "all", name: "All"});
      console.log(this.teachingOrNonteachingStuff); 

    }else{

    }      
  }





// ########################################################################
//        ------------------ After choose stuff ------------------
// ########################################################################
  onChangeStuff(e) {
    console.log(e.value);

    this.selectedData.selectedStuff = [];

    let ifAllSelect = e.value.filter((ele)=>{
      return ele == "all";
    });

    if(ifAllSelect.length > 0){

      // this.selectedData.selectedStuff = [];

      this.teachingOrNonteachingStuff.forEach(ele => {
        this.selectedData.selectedStuff.push(ele.id);
        this.selectedData.selectedStuff = this.selectedData.selectedStuff.filter((elem) => {
          return elem != "all";
        });
      });
      // if(this.classStreamID == "all"){
      //   this.selectedData.selectedSections = this.sortArray;
      // }else{
      //   this.selectedData.selectedSections = this.sortArray.filter((element)=> {
      //     return element.class_id == this.classStreamID;
      //   });
      // }      
    }else{
      this.selectedData.selectedStuff = e.value;
    }  

    console.log(this.selectedData.selectedStuff);    
  }






// ########################################################################
//    ------------------ After choose shift -----------------
// ########################################################################
  onChooseShift(e){
    this.sortArray = [];
    this.shiftID = e.value;
    // console.log(e);
    // console.log(this.allSelected);        
    console.log('shift : ', e.value);  
    
    let ifAllSelect = e.value.filter((ele)=>{
      return ele == "all";
    });
    
    if(ifAllSelect.length > 0){
      this.sortArray = [];
      this.selectedData.selectedShifts = this.orgShiftLists;

      this.createSortArray(this.orgClassSectionList);
      this.sortArray.unshift({
        class_name: "All",
        class_id: "all"
      });

      // console.log("filter class list for choosen shift : ", this.sortArray); 
    }else{
      this.sortArray = [];
      this.selectedData.selectedShifts = e.value;

      this.filteredArrayForClassList = this.orgClassSectionList.filter((ele) => {
        return ele.org_shift_id == e.value;
      });

      console.log(this.filteredArrayForClassList);
      this.createSortArray(this.filteredArrayForClassList);
      this.sortArray.unshift({
        class_name: "All",
        class_id: "all"
      });
    }
  }






// ########################################################################
//      ------------------ After choose class/stream -----------------
// ########################################################################
  onChooseClassStream(e) {
    this.filteredArrayForSectionList = [];
    this.classStreamID = e.value;

    if(e.value == "all"){
      this.filteredArrayForSectionList = [
        { sec_id: "all", section_name: "All" }
      ];
      return;
    }

    this.filteredArrayForSectionList = this.sortArray.filter((element)=> {
      // console.log(element);
      
      return element.class_id == e.value;
    });
   
    if(this.filteredArrayForSectionList.length > 0){
      this.filteredArrayForSectionList = this.filteredArrayForSectionList[0].sections;
      this.filteredArrayForSectionList.unshift({ sec_id: "all", section_name: "All"});
    }  

    console.log('filter section array : ', this.filteredArrayForSectionList);
  }





// ########################################################################
//     ------------------ After choose section -----------------
// ########################################################################
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





// ########################################################################
// ------------------ After clicking submit btn -----------------
// ########################################################################
  onClickSubmitBtn(){   
    this.sortSelectedFilterData(this.selectedData);
    // console.log('Selected data', this.selectedData);     
    this.routes.navigate(['/notice-management/add-notice']);
  }






// ########################################################################
// ----- sorting selected data method for sending to add notice --------
// ########################################################################
  sortSelectedFilterData(arr) {
    console.log(arr);
    
    this.sendSelectData.noticeType = arr.selectedNoticeType;
    this.sendSelectData.shifts = [];
    this.sendSelectData.sections = [];
    this.sendSelectData.stuffs = [];

    if(arr.selectedNoticeType == "2"){
      this.sendSelectData.noticeType = arr.selectedNoticeType;
      this.sendSelectData.shifts = [];
      this.sendSelectData.sections = [];
      // console.log('filter data : ', this.sendSelectData);
      this.apiServ.changeData(this.sendSelectData);
      return;
    }



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



    if(arr.selectedSections.length > 0){

      console.log("Here.");
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
      } else {
        this.sendSelectData.sections = arr.selectedSections;
      }

    }



    if(arr.selectedStuff && arr.selectedStuff.length > 0){
      console.log('selected stuff : ', arr.selectedStuff);
      this.sendSelectData.stuffs = arr.selectedStuff;
    }

    // if(arr.selectedSections[0].class_id == "all" || arr.selectedSections[0].class_name == "Arts" || arr.selectedSections[0].class_name == "Science"){
    //   arr.selectedSections.forEach(element => {
    //     if(element.class_id != "all"){
    //       if(element.sections.length > 0){
    //         element.sections.forEach(ele => {
    //           if(ele.sec_id != "all"){
    //             this.sendSelectData.sections.push(ele.classSectionIndexId);
    //           }              
    //         });            
    //       }          
    //     }
    //   });
    // }else{
    //   this.sendSelectData.sections = arr.selectedSections;
    // }

    // console.log('filter data : ', this.sendSelectData);
    this.apiServ.changeData(this.sendSelectData);
  }






// ########################################################################
// ----------- sorting class list array here for looping -----------
// ########################################################################
  createSortArray(arr){
    // var rs = 1;
    var d = new Date;
    arr.forEach(ele => {
      if (ele.year == d.getFullYear()) {

        var obj = {
          class_id: ele.class_id,
          sec_id: ele.sec_id,
          class_name: ele.class.class_name,
          shift_id: ele.org_shift_id,
          sections: [
            {
              section_name: ele.section.sec_name,
              sec_id: ele.sec_id,
              sem: ele.sem.sem_no,
              classSectionIndexId: ele.id
            }
          ]
        }

        let check_exist = this.sortArray.filter((element) => {
          return element.class_id == ele.class_id;
        });

        if (check_exist.length > 0) {
          // console.log('exist');
          let i = this.sortArray.indexOf(check_exist[0]);
          this.sortArray.splice(i, 1);

          check_exist[0].sections.push({
            section_name: ele.section.sec_name,
            sec_id: ele.sec_id,
            sem: ele.sem.sem_no,
            classSectionIndexId: ele.id
          });

          this.sortArray.push(check_exist[0]);
        } else {
          this.sortArray.push(obj);
        }
      }
      
    });
    // console.log(this.sortArray);    
  }





// ########################################################################
//    ----------- searching for student by roll -----------
// ########################################################################
  onClickSearchBtn() {
    console.log(this.searchRoll); 
    this.showFoundStudentTable = false;
    this.foundStudentForSearch = null;

    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_id: this.org_code,
      roll_no: this.searchRoll
    };
  
    this.http
      .post(`${environment.apiUrl}student/studentsearch`, data)
      .map(res => res.json())
      .subscribe(
        data => {
          console.log("found student : ", data.data[0]);          
          this.foundStudentForSearch = data.data[0];

          if(data.data.length > 0){
            this.notification.showNotification(
              "top",
              "right",
              "success",
              "Success, One Student Found."
            );
            this.showFoundStudentTable = true;
          }else{
            this.notification.showNotification(
              "top",
              "right",
              "warning",
              "Sorry, Did't Not Found Any Student."
            );

            this.showFoundStudentTable = false;
          }
    });
    
  }





// ########################################################################
// ----------- check box click function for selecting student -----------
// ########################################################################
  onClickFoundStdCheckBox(e) {
    // console.log('event value : ', e); 
    this.sendSelectData.studentsArr = [];
    console.log('roll value : ', e.target.value); 
    console.log('check value : ', e.target.checked);

    if(e.target.checked){

      let is_exist =  this.selectStdArr.filter((ele)=> {
        return ele == e.target.value;
      });

      if(is_exist.length > 0){

        console.log('already exist.'); 

        this.notification.showNotification(
          "top",
          "right",
          "warning",
          "Student All Ready Added."
        );

        this.showFoundStudentTable = false;
        this.foundStudentForSearch = null;
      }else{

        console.log('not exist.');
        this.selectStdArr.push(e.target.value);
      }
    }else{
      let is_exist =  this.selectStdArr.filter(()=> {
        return e.target.value;
      });

      if(is_exist.length > 0){
        let index = this.selectStdArr.indexOf(e.target.value);
        this.selectStdArr.splice(index, 1);
      }
    }
     
    
    if(this.selectStdArr.length > 0) {
      this.studentSelectedForPersonelNotice = true;
    }else{
      this.studentSelectedForPersonelNotice = false;
    }

    console.log('selected Student array : ', this.selectStdArr);
    this.sendSelectData.noticeType = this.selectedData.noticeType;
    this.sendSelectData.studentsArr = this.selectStdArr;
  }





// ########################################################################
// ----------- go next btn function for personel notice -----------
// ########################################################################
  onClickGoNextForPersonelNotice() {
    this.apiServ.changeData(this.sendSelectData);
    console.log('send data : ', this.sendSelectData);
    this.routes.navigate(['/notice-management/add-notice']);
  }





  selectAllShifts(e){
    if(e.value == "all") {
      console.log("native element : ", e.source._parentFormField._elementRef.nativeElement);
      console.log("Sibling : ", e.source._parentFormField._elementRef.nativeElement.nextSibling);  
    }
  }






}
