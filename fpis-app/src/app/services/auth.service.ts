import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private http:HttpClient) { }

  isAuthenticated(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  register(first_name: string, last_name: string,password:string, email:string, username:string,
    preferences: string[], date_of_birth: string, longer_than_2h: boolean, favorite_decades: number[]){
    console.log(first_name, last_name,  password, email, username, preferences,date_of_birth,
   longer_than_2h, favorite_decades)
   return this.http
    .post<any>(
      'http://localhost:8080/api/v1/users/register',(
        {first_name, last_name, password, email, username,preferences, date_of_birth,
          longer_than_2h, favorite_decades})
      )
      }   


      login(email: string, password:string){
        // let user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJUaW4iLCJleHBpcmUiOjE3MDU3NTU5MjksInVzZXJJZCI6IjY1OTU5MjYzM2U5OGZmNjVhMzRlNjZlYyIsImVtYWlsIjoidGluLnNvcGljQGdtYWlsLmNvbSJ9.ocXwvwQBTSnHGpL2JngZ-oG0jiM9qX-8-q561FVKZHU'
        // localStorage.setItem('currentUser', JSON.stringify(user)); 

        return this.http.post<any>('http://localhost:8080/api/v1/users/login', {email,password})
        .pipe(
            map(user => {
                // login successful if the response has jwt token/hmm
             //  user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJUaW4iLCJleHBpcmUiOjE3MDU3NTU5MjksInVzZXJJZCI6IjY1OTU5MjYzM2U5OGZmNjVhMzRlNjZlYyIsImVtYWlsIjoidGluLnNvcGljQGdtYWlsLmNvbSJ9.ocXwvwQBTSnHGpL2JngZ-oG0jiM9qX-8-q561FVKZHU'
                if(user && user.token){
                    // store user details and jwt token in the local storage to keep the user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user)); 
                    console.log( JSON.stringify(user))
                }

                return user;
            })
        );
    }

    logout(){
        localStorage.removeItem('currentUser');
        console.log('logout')
        this.router.navigateByUrl('/login');
    }

}
