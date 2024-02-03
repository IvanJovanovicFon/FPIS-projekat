import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";

/*
The JWT interceptor intercepts the incoming requests from the application/user and adds JWT token to the request's Authorization header, only if the user is logged in.

This JWT token in the request header is required to access the SECURE END API POINTS on the server 
*/

@Injectable()
export class JwtInterceptor 
 implements HttpInterceptor 
{
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // check if the current user is logged in
        // if the user making the request is logged in, he will have JWT token in it's local storage, which is set by Authorization Service during the login process
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const currentUser = JSON.parse(storedUser);
            if (currentUser && currentUser.data.token) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.data.token}`
                    }
                });
            }
            else{
                console.log("Greska u interceptoru jwt")
            }
        }
        // handle any other requests which went unhandled
        return next.handle(request);
    }
}
