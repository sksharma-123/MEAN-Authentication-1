import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticateUser } from 'src/app/models/authenticate-user';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService,
              private router: Router,
              private notifier: NotifierService,
              private tokenService: TokenService){}

  form = this.initForm();

  initForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  onLoginSubmit(): void {
    if(this.form.valid){
      this.authService.authenticateUser(<AuthenticateUser>this.form.value)
      .pipe(
        tap(() => { 
          this.notifier.notify('success', 'User successfully authenticated');
          this.tokenService.setLoginState(true);
          this.router.navigate(['dashboard']);
        }),
        catchError(() => 
        { 
          this.notifier.notify('error', 'User could not be authenticated');
          return EMPTY; 
        })
      ).subscribe();
    }
  }

}
