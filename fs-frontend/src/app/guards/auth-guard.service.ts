import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private _loginSvc: LoginService, private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._loginSvc.authorize().pipe(
      map((isAuthorized) => {
        if (isAuthorized) {
          return true;
        } else {
          this._router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        console.error(error);
        this._router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
