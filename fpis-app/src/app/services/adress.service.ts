import { Injectable } from '@angular/core';
import { Observable, of, throwError  } from 'rxjs';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { city } from '../model/city';

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  private apiUrlMesta = 'http://localhost:3000/api/mesta';

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<city[]> {
    return this.http.get<city[]>(this.apiUrlMesta);
  }

}
