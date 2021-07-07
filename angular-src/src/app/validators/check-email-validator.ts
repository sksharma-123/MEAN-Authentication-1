import { AsyncValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { DoesExist } from "../models/does-exist";
import { UserService } from "../services/user.service";

export class CheckEmailValidator {
    static checkEmail(userService: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
          return userService.checkEmail(control.value).pipe(
            map((result: DoesExist) => (!result.doesExist ? {} : { taken: true })),
            catchError(() => {
              console.error('Check email call error');
              return EMPTY;
            })
          );
        };
      }
}
