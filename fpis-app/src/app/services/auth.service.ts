import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  isAuthenticated(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  getRole(): string {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      if (currentUser && currentUser.data.token) {
        const role = this.jwtService.getRoleFromToken(currentUser.data.token);
        console.log('role', role);

        if (role === 'admin') {
          return 'admin';
        } else if (role === 'regular') {
          return 'regular';
        } else {
          return '';
        }
      }
      return '';
    }
    return '';
  }

  register(
    firstname: string,
    lastname: string,
    password: string,
    email: string,
    birthdate: string
  ) {
    return this.http.post<any>('http://localhost:3000/api/register', {
      firstname,
      lastname,
      password,
      email,
      birthdate,
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<any>('http://localhost:3000/api/login', {
        email,
        password,
      })
      .pipe(
        map((user) => {
          if (user || user.token || user.data.token) {
            // store user details and jwt token in the local storage to keep the user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log(JSON.stringify(user));
          }

          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    console.log('logout');
    this.router.navigateByUrl('/login');
  }
}
