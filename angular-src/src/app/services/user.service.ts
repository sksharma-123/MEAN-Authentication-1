import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DoesExist } from '../models/does-exist';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  checkUsername(username: string): Observable<DoesExist> {
    return this.http.get<DoesExist>(`${this.apiUrl}/check-username?username=${username}`)
    .pipe(
      catchError((err) => throwError(err))
    );
  }
}
