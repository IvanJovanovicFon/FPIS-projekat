import { Account } from '../model/account';
import { Injectable } from '@angular/core';
import { Accounting } from '../model/Accounting';
import { TypeOfJob } from '../model/typeOfjob';
import { SubtypeOfJob } from '../model/subtypeOfJob';
import { UnitOfMeasure } from '../model/unit-of-measure';
import { Observable, catchError, map, of, throwError  } from 'rxjs';
import { HttpClient , HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Job } from '../model/Job';


interface Result {
  account: {
    id: string;
    idIzvodjac: string;
    idPredracun: string;
    brojRacuna: string;
    objekat: string;
    realizacija: number;
    datumIspostavljanja: string; // Assuming it's a string, change to Date if needed
    datumIzdavanja: string; // Assuming it's a string, change to Date if needed
    datumPrometaDobaraIUsluga: string; // Assuming it's a string, change to Date if needed
    ukupnaCena: number;
    investitor: string;
    mesto: string;
    idUlica: string;
    brojUlice: string;
    poslovi: Job[]; // Assuming Posao is another interface
  };
}

interface AccountBack {
  brojRacuna: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  constructor(private http: HttpClient) {}
  private apiUrl = "http://localhost:3000/api/racun";

  getAccountsIdAndNumber(): Observable<Account[]> {
    this.apiUrl ='http://localhost:3000/api/racunBack';
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccountById(id: string): Observable<Result>{
    this.apiUrl =`http://localhost:3000/api/racun/${id}`;
    return this.http.get<Result>(this.apiUrl);
  }

  editAccount(acc: Account) {
      console.log("edited:", acc);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.http.put(`http://localhost:3000/api/racun/${acc.id}`, acc, httpOptions)
    .pipe(
      map((response: any) => response)
      ).subscribe();
    }

  addAccount(acc: Account) {
    console.log("added:", acc);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.apiUrl = `http://localhost:3000/api/racun`;
    this.http.post(this.apiUrl, acc, httpOptions)
    .pipe(
      map((response: any) => response)
      ).subscribe();
      console.log("added new account!");
    }


  


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
