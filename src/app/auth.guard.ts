import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Routes, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      var status = localStorage.getItem('logedin');
      if(status == 'true'){
        return true;
      }else{
        this.router.navigate([""]);
        return false;
      }
    
  }
}
