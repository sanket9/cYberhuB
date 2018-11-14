import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-add-room",
  templateUrl: "./add-room.component.html",
  styleUrls: ["./add-room.component.scss"]
})
export class AddRoomComponent implements OnInit {
  seatingTypes: any = [
    {
      id: 1,
      name: "Table"
    },
    {
      id: 2,
      name: "Banch"
    }
  ];
  disabaleBanchType: boolean = true;
  banchtypes: any = [];
  benchCapacity: any = [];

  constructor() {}

  ngOnInit() {}

  onChangeSheattingtype(e) {
    // console.log(e);
    if (e.value === 1) {
      this.disabaleBanchType = true;
      this.benchCapacity = [1];
      console.log(this.benchCapacity);
      
    } else {
      this.disabaleBanchType = false;
      this.banchtypes = [
        {
          id: 1,
          name: "Long"
        },
        {
          id: 2,
          name: "Short"
        }
      ];
    }
  }

  onChangeBanchtype(e){    
    if (e.value === 1) {
      this.benchCapacity = [1, 2, 3];      
    }else{
      this.benchCapacity = [1, 2];
    }
  }
}
