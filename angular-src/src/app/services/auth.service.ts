import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { ExclusionHeader } from '../utils/exclusion-header';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<string> {
    return this.http
      .post<string>(
        `${this.apiUrl}/register`,
        user,
        ExclusionHeader.addExclusionHeader()
      )
      .pipe(catchError((err) => throwError(err)));
  }
}
