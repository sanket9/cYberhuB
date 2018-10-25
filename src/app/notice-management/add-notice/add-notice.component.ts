import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-notice',
  templateUrl: './add-notice.component.html',
  styleUrls: ['./add-notice.component.scss']
})
export class AddNoticeComponent implements OnInit {

  title: string = null;
  subTitle: string = null;
  description: string = null;

  constructor() { }

  ngOnInit() {
  }

}
