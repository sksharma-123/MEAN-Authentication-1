import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // get token from local storage
    // add Authorization header to request (unless excluded)
    // if(req.headers.has('exclude-authorization'))
    if(req.headers.has('exclude_authorization')){
      req = req.clone({
        headers: req.headers.delete('exclude_authorization')
      })
      return next.handle(req);
    }
    // if token is expired - get refresh token
    // if refresh is expired - sign them out
    return next.handle(req).pipe(
      tap(
        (event) => event,
        (err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // do something - remove tokens
              return;
            }
          }
        }
      )
    );
  }
}
