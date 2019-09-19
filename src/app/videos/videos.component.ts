import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  showloader: boolean = false;
  video_details: any = [];

  constructor(public http: Http) { }

  ngOnInit() {
    this.http.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBuM2gCCThKbGByZCCG8YAdkqkSUbItSZ8&channelId=UCcxJfVmy3lNLuwdePviqZwg&part=snippet,id&order=date&maxResults=20`).map(resp => resp.json()).subscribe((data: any) => {
      let videos = data.items;
      let length = videos.length;
      let i = 0;

      videos.forEach(video => {
        i++;
        if(i != length)
          this.video_details.push(video);
      });
      console.log('video_details...........', this.video_details);
      // if(data.data) {
      //   this.exam_list = data.data;
      // }
    });
  }

}
