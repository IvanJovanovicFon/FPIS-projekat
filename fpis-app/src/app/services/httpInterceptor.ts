import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
export class ErrorIntercept implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                        
                    } else {
                        // server-side error
                        if(error.error.error == 'Ovaj broj računa već postoji, pokušajte ponovo!')
                            alert("Ovaj broj računa već postoji!")
                    
                        if(error.error.error == 'PIB, broj računa i naziv moraju biti jedinstveni!')
                            alert(error.error.error)
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                    }
                   console.log(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }
}