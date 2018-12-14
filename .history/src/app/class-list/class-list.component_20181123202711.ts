import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment.prod";
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { Router } from '@angular/router';


@Component({
  selector: "app-class-list",
  templateUrl: "./class-list.component.html",
  styleUrls: ["./class-list.component.scss"]
})
export class ClassListComponent implements OnInit {

  classList: any;
  sectionList: any;
  classId: any;
  sectionId: any;
  fieldCountArr: any;
  typeId: any;
  org_code: any;
  choosenClassAndSectionArr: any;
  finalClassSeclistArr: any;
  shiftID: any;
  orgShiftLists: any;

  // @ViewChild('shiftOption') private shifts: ElementRef;

  constructor(public http: Http, public router: Router, public sessionStore: SessionStorageService) {}

  ngOnInit() {
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.getOrgDetails();
    this.getShiftLists();
    this.fieldCountArr = [1,2,3];
    this.choosenClassAndSectionArr = [];
    this.finalClassSeclistArr = [];
  }

  getOrgDetails(){
    //org_code from session
    // this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
    this.org_code = this.sessionStore.retrieve('user-data')[0].org_code;
  
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {org_id: this.org_code};

    this.http
      .post(`${environment.apiUrl}org/getdetail`, data, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        // console.log("org details", data);
        this.typeId = data.data[0].org_type_id;
        // console.log("type id :", this.typeId);
        this.getClasslistNames(this.typeId);
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
    .post(`${environment.apiUrl}shift/orgshiftlist`, data)
    .map(res => res.json())
    .subscribe(
      data => {
        console.log("Org shift list ", data.data);
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
// ------------------ After choose shift -----------------
// ########################################################################
onChooseShift(e){
  this.shiftID = e.value;
  // console.log(e);
  // console.log(this.allSelected);        

  console.log('shift : ', e.value); 

  let ifAllSelect = e.value.filter((ele)=>{
    return ele == "all";
  });
  
  if(ifAllSelect.length > 0){
    this.shiftID = [];
    let options = <HTMLSelectElement>document.getElementsByClassName('shiftOptions');
    // console.log('shifts options : ', options);
    Array.from(options).forEach(ele => {
      // console.log(ele.children[1].innerHTML.toLocaleLowerCase().trim().toString());
      if(ele.children[1].innerHTML.toLocaleLowerCase().trim().toString() != "all"){
        // console.log(ele.getAttribute('ng-reflect-value'));
        ele.children[0].classList.value = "mat-option-pseudo-checkbox mat-pseudo-checkbox ng-star-inserted mat-pseudo-checkbox-checked"; 
        this.shiftID.push(ele.getAttribute('ng-reflect-value'));      
      }else{
        // console.log(ele.children[0].getAttribute('ng-reflect-state'));
      }      
    });
    
  }else if(ifAllSelect.length < 1){
    this.shiftID = [];

    let options = <HTMLSelectElement>document.getElementsByClassName('shiftOptions');

    Array.from(options).forEach(ele => {
        if(ele.children[0].classList.value == "mat-option-pseudo-checkbox mat-pseudo-checkbox ng-star-inserted mat-pseudo-checkbox-checked"){
          if(ele.children[1].innerHTML.toLocaleLowerCase().trim().toString() != "all"){
            ele.children[0].classList.value = "mat-option-pseudo-checkbox mat-pseudo-checkbox ng-star-inserted";
            this.shiftID.push(ele.getAttribute('ng-reflect-value'));
          }          
        }      
    });

  }else{
    this.shiftID = e.value;
    // console.log(this.shiftID);     
  }

   
  console.log('shift : ', this.shiftID);
  // shiftOptions.mat-option.mat-option-multiple.ng-star-inserted.mat-selected.mat-active
  
  // let ifAllSelect = e.value.filter((ele)=>{
  //   return ele == "all";
  // });

  // console.log("shift list : ", this.orgShiftLists);
  
  // if(ifAllSelect.length > 0){
  //   this.sortArray = [];
  //   this.selectedData.selectedShifts = this.orgShiftLists;

  //   this.createSortArray(this.orgClassSectionList);
  //   this.sortArray.unshift({
  //     class_name: "All",
  //     class_id: "all"
  //   });
  //   // console.log("filter class list for choosen shift : ", this.sortArray); 
  // }else{
  //   this.sortArray = [];
  //   this.selectedData.selectedShifts = e.value;

  //   this.filteredArrayForClassList = this.orgClassSectionList.filter((ele)=>{
  //     return ele.org_shift_id == e.value;
  //   });

  //   // console.log(this.filteredArrayForClassList);
  //   this.createSortArray(this.filteredArrayForClassList);
  //   this.sortArray.unshift({
  //     class_name: "All",
  //     class_id: "all"
  //   });
  //   //  console.log("filter class list for choosen shift : ", this.sortArray); 
  // }
}





// ########################################################################
//       ------------------ getting classlist here -----------------
// ########################################################################
  getClasslistNames(oti) {
    let header = new Headers();
    header.set("Content-Type", "application/json");

    let data = {
      org_type_id: oti
    };

    this.http
      .post(`${environment.apiUrl}classlist/classlist`, data, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        // let jsonResponse = data.json();
        // console.log("class list ", data.data);
        this.classList = data.data;
    });


    this.http
      .post(`${environment.apiUrl}classlist/sectionlist`,data, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        // console.log("section list ", data.data);
        this.sectionList = data.data;
    });
  }



// ########################################################################
//       ------------------ After choosing a class -----------------
// ########################################################################
  onChangeClass(e, f) {
    // console.log('class ', e.value); 
    this.classId = e.value;  
    
    let check_exist = this.finalClassSeclistArr.filter((ele)=> {
      return ele.row == f;
    });

    if(check_exist.length > 0){
      let i = this.finalClassSeclistArr.indexOf(check_exist[0]);
      this.finalClassSeclistArr.splice(i,1);
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );

      console.log('final array ', this.finalClassSeclistArr);
    }else{
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );

      console.log('final array ', this.finalClassSeclistArr);
    }
  }





  onChangeSection(e, f){
    // console.log('section ', e.value);
    // console.log('row num ', f);

    // console.log('final array at first ', this.finalClassSeclistArr);
    this.sectionId = e.value; 

    let check_exist = this.finalClassSeclistArr.filter((ele)=> {
      return ele.row == f;
    });

    // console.log('checking obj ', check_exist);      

    if(check_exist.length > 0){
      let i = this.finalClassSeclistArr.indexOf(check_exist[0]);
      this.finalClassSeclistArr.splice(i,1);
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );

      console.log('final array ', this.finalClassSeclistArr);
    }else{
      this.finalClassSeclistArr.push(
        {
          row: f,
          classId: this.classId,
          secId: this.sectionId,
          org_id: this.org_code
        }
      );

      console.log('final array ', this.finalClassSeclistArr);
    }
  }



  increaseField(){
    // console.log(this.fieldCountArr.length);
    let lengthIncValue = this.fieldCountArr.length;
    this.fieldCountArr.push(++lengthIncValue);
    // console.log(this.fieldCountArr);        
  }



  onClickSave(){
    let header = new Headers();
    header.set("Content-Type", "application/json");    

    this.http
      .post(`${environment.apiUrl}classsection/add`, this.finalClassSeclistArr, {headers: header})
      .map(res => res.json())
      .subscribe(data => {
        console.log("after success add class/section : ", data);
        this.router.navigate(['/dashboard']);
    });
  }
  
}
