// import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Store } from '@ngrx/store';
// import { EMPTY, Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { AuthActions, AuthService } from '../modules/auth';

// export class HttpErrorInterceptor implements HttpInterceptor {

//   constructor(private _auth: AuthService, private store: Store) { }


//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(request)
//       .pipe(
//         catchError((error: HttpErrorResponse) => {
//           let errorMessage = '';
//           if (error.error instanceof ErrorEvent) {
//             errorMessage = `Error: ${error.error.message}`;
//           }
//           else{
//             if (error.status === 401 && ![this._auth.loginUrl, this._auth.refresUrl].includes(error.url)) {
//               return this._auth.refresh().pipe(
//                 switchMap(() => next.handle(request)),
//                 catchError((err) => {
//                   console.error(err);
//                   this.store.dispatch(AuthActions.forceLogout());
//                   return EMPTY;
//                 })
//               );
//             }
//             errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
//           }
//           console.error(errorMessage);
//           return throwError(error.error);
//         })
//       )
//   }
// }
