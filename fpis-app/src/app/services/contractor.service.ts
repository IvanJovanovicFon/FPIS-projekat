import { Injectable } from '@angular/core';
import { Contractor } from '../model/contractor'; 
import { Observable, of, throwError  } from 'rxjs';
import { HttpClient , HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContractorService {

    private apiUrl = 'http://localhost:3000/api/izvodjaci';

    constructor(private http: HttpClient) {}

    addContractor(contractor: Contractor) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.http.post(this.apiUrl, contractor, httpOptions)
      .pipe(
        map((response: any) => response)
        ).subscribe();
        console.log("added new contractor!");
    }

    getAllContractors(): Observable<Contractor[]> {
      return this.http.get<Contractor[]>(this.apiUrl).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          return throwError('An error occurred while fetching contractors.');
        })
      );
    }


    editContractor(contractor: Contractor) {
      console.log("edited:", contractor);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.http.put(`${this.apiUrl}/${contractor.id}`, contractor, httpOptions)
      .pipe(
        map((response: any) => response)
        ).subscribe();
    }
 
}