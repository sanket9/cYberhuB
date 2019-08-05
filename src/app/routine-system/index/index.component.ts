import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  modele_id = 6;
  filterRole;
  constructor(
    public sessionStore: SessionStorageService,
  ) { }

  ngOnInit() {
    this.getRole()
  }
  getRole() {
    var role = this.sessionStore.retrieve('user-role');
    // console.log(role);

    // role = JSON.parse(role);
    let filterRole = role.filter(ele => ele.module_id == this.modele_id);
    if (filterRole.length > 0) {
      this.filterRole = filterRole[0]
    }
  }
}
