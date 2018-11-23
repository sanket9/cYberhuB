import { Component, OnInit } from '@angular/core';
import * as csv from "csvtojson";
@Component({
  selector: "app-schedule-exam",
  templateUrl: "./schedule-exam.component.html",
  styleUrls: ["./schedule-exam.component.scss"]
})
export class ScheduleExamComponent implements OnInit {
  fileReaded: any;
  constructor() {}

  ngOnInit() {}

  handleFileSelect(fileInput: any) {
    this.fileReaded = fileInput.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);

    reader.onload = e => {
      let csv: string = reader.result;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(",");
      let lines = [];

      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(",");
        if (data.length === headers.length) {
          let tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }

          // log each row to see output
          lines.push(tarr);
        }
      }
      // all rows in the csv file
      console.log(">>>>>>>>>>>>>>>>>", lines);
    };
  }
}
