import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DoesExist } from '../models/does-exist';
import { UserService } from '../services/user.service';

export class CheckUsernameValidator {
  static checkUsername(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return userService.checkUsername(control.value).pipe(
        map((result: DoesExist) => (!result.doesExist ? {} : { taken: true })),
        catchError(() => {
          console.error('Check username call error');
          return EMPTY;
        })
      );
    };
  }
}
