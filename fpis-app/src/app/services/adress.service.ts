import { Injectable } from '@angular/core';
import { Observable, of, throwError  } from 'rxjs';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { city } from '../model/city';
import { street } from '../model/street';
import { streetNumber } from '../model/streetNumber';

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  private pttCode = "";
  private apiUrlMesta = 'http://localhost:3000/api/mesta';
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<city[]> {
    return this.http.get<city[]>(this.apiUrlMesta);
  }

  getAllStreetsByPTT(Ptt:string): Observable<street[]> {
    this.pttCode = Ptt;
    this.apiUrl = `http://localhost:3000/api/ulice/${this.pttCode}`
    return this.http.get<street[]>(this.apiUrl);
    
  }

  getAllNumbersByPTTAndId(ptt: string, id:number): Observable<streetNumber[]> {
    this.apiUrl = `http://localhost:3000/api/brojevi/${ptt}/${id}`
    return this.http.get<streetNumber[]>(this.apiUrl);
    
  }

}
