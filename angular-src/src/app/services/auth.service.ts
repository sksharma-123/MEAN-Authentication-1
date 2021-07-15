import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticateUser } from '../models/authenticate-user';
import { Tokens } from '../models/tokens';
import { User } from '../models/user';
import { ExclusionHeader } from '../utils/exclusion-header';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {}

  authenticateUser(authenticate: AuthenticateUser): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.apiUrl}/authenticate`, 
    authenticate, 
    ExclusionHeader.addExclusionHeader())
    .pipe(
      catchError((err) => throwError(err)),
      tap((tokens: Tokens) => { 
        this.localStorageService.setAccessToken(tokens.accessToken);
        this.localStorageService.setRefreshToken(tokens.refreshToken);
        this.localStorageService.storeUserData(tokens.user);
      })
      )
  }

  logout(refreshToken: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/logout?refreshToken-${refreshToken}`)
    .pipe(
      catchError((err) => throwError(err)),
      tap(() => {
        this.localStorageService.removeTokens();
        this.localStorageService.removeUserData();
      })
    )
  }

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
