import { Injectable } from '@angular/core';
import { Contractor } from '../model/contractor'; 
import { Observable, of, throwError  } from 'rxjs';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  private contractors: Contractor[] = [];

    private apiUrl = 'http://localhost:3000/api/izvodjaci';

    constructor(private http: HttpClient) {}

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
    }

    addContractor(contractor: Contractor): Observable<Contractor> {
      console.log("added:", contractor);
      this.contractors.push(contractor);
      return this.http.post<Contractor>(this.apiUrl, contractor);
    }

 
}