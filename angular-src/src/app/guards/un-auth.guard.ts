import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  
  constructor(private tokenService: TokenService){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.tokenService.isLoggedIn()
    .pipe(
      map((bool) => {
        return !bool
      })
    );
  }
  
}
