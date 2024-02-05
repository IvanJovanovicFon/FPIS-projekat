import { ToastrService } from 'ngx-toastr';
import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ErrorIntercept implements HttpInterceptor {
    
    constructor(private toastr: ToastrService) {}
    
    showAlert(error: string)
    {
       console.log(1123123)
       this.toastr.error( "error: ",error);

  }

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
                        if(error.error.error === 'Ovaj broj računa već postoji, pokušajte ponovo!')
                            this.showAlert("Ovaj broj računa već postoji!")
                    
                        if(error.error.error === 'PIB, broj računa i naziv moraju biti jedinstveni!'){
                        this.showAlert(error.error.error)
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;}

                        if(error.error.error ==="Wrong email or password. Please check and try again."){
                            this.showAlert(error.error.error)
                        errorMessage = error.error.error;
                    }

                        if(error.error.error ==="User not found. Please check the email."){
                        this.showAlert(error.error.error)
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;}

                        if(error.error.error ==="Error! Something went wrong."){
                            this.showAlert(error.error.error)
                            errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;}
                    }
                  // console.log(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }
}