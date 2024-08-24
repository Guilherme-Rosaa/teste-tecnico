import { Injectable } from '@angular/core';
  import { CanActivate, Router } from '@angular/router';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class AutenticacaoGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      const token = localStorage.getItem('TOKEN');
      if (token) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    }
  }
