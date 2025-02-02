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
      this.apiUrl = `http://localhost:3000/api/izvodjaci`;
      this.http.post(this.apiUrl, contractor, httpOptions)
      .pipe(catchError((error: any): Observable<any> => {
        console.error('There was an error!', error);
        return of();
    }))
    .subscribe();
    }

    getAllContractors(): Observable<Contractor[]> {
      this.apiUrl = `http://localhost:3000/api/izvodjaci`;
      return this.http.get<Contractor[]>(this.apiUrl);
    }

    getContracorById(id: string): Observable<Contractor> {
      this.apiUrl = `http://localhost:3000/api/izvodjaci/${id}`;
      return this.http.get<Contractor>(this.apiUrl);
    }

    getContracorByName(name: string): Observable<Contractor> {
      this.apiUrl = `http://localhost:3000/api/izvodjac/${name}`;
      return this.http.get<Contractor>(this.apiUrl);
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