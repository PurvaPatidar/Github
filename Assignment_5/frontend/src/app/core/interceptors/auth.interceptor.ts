import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from '../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog,
    private ar:ActivatedRoute,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this.authService.getCurrentUser();

    if (user && user.token) {
      console.log(user)
      console.log(this.router)
      console.log(this.ar)
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + user.token),
      });

      return next.handle(cloned).pipe(
        tap(
          () => {},
          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status == 401) {
                console.log(err)
                this.dialog.closeAll();
                this.router.navigate(['/auth']);
              }
            }
          }
        )
      );
    } else {
      return next.handle(req);
    }
  }
}
