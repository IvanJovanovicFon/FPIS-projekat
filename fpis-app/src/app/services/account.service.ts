import { Account } from '../model/account';
import { Injectable } from '@angular/core';
import { Accounting } from '../model/Accounting';
import { TypeOfJob } from '../model/typeOfjob';
import { SubtypeOfJob } from '../model/subtypeOfJob';
import { UnitOfMeasure } from '../model/unit-of-measure';
import { Observable, map, of, throwError  } from 'rxjs';
import { HttpClient , HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const accounts: Account[] = [];

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  
  private apiUrl = `http://localhost:3000/api/`;
  
  
  getAllAccounts(): Observable<Account[]> {
    return of(accounts);
  }
  
  editAccount(acc: Account) {
      console.log("edited:", acc);
    }

  
  addAccount(acc: Account) {
    console.log("added:", acc);
    this.apiUrl = 'http://localhost:3000/api/racun'
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(this.apiUrl, acc, httpOptions)
    .pipe(
      map((response: any) => response)
      ).subscribe();
      console.log("added new account!");
  }
  

  constructor(private http: HttpClient) {}

  getAllAccountings(): Observable<Accounting[]> {
    this.apiUrl ='http://localhost:3000/api/predracuni';
    return this.http.get<Accounting[]>(this.apiUrl);
  }

  getAllTypesOfJob(): Observable<TypeOfJob[]> {
    this.apiUrl ='http://localhost:3000/api/vrsta';
    return this.http.get<TypeOfJob[]>(this.apiUrl);
  }

  getAllSubtypesOfJobByTypeId(id:string): Observable<SubtypeOfJob[]> {
    this.apiUrl =`http://localhost:3000/api/podvrsta/${id}`;
    return this.http.get<SubtypeOfJob[]>(this.apiUrl);
  }

  getAllJM(): Observable<UnitOfMeasure[]> {
    this.apiUrl ='http://localhost:3000/api/mere';
    return this.http.get<UnitOfMeasure[]>(this.apiUrl);
  }

}
