import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private authService: AuthService,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private router: Router) { }

  onLogoutClick(): void {
    this.authService.logout(this.localStorageService.getRefreshToken())
    .pipe(
      catchError(() => { 
        this.notifierService.notify('Error', 'User could not be logged out');
        return EMPTY;
    }),
    tap(() => 
    {
      this.notifierService.notify('Success', 'User successfully logged out');
      this.router.navigate(['login']);
    })
    ).subscribe();
  }

}
