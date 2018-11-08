import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Routes, Router } from '@angular/router';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public router: Router, public SessionStore: SessionStorageService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      var status = this.SessionStore.retrieve('user-data');
      if(status){
        return true;
      }else{
        this.router.navigate([""]);
        return false;
      }
    
  }
}
