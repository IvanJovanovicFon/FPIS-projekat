import { Injectable } from '@angular/core';
import { Contractor } from '../model/contractor'; 
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private contractors: Contractor[] = [
    new Contractor("111111111", "firma", "123456789123456789",
    "555333", "Pera Peric", "1234566784321") ,
    new Contractor("22222222222", "Firma12", "123456789123456789",
    "666888", "Ivan Peric", "0707000792258") ];

    private apiUrl = '/api/izvodjac';

    constructor(private http: HttpClient) {}

    getAllContractors(): Observable<Contractor[]> {
      return of(this.contractors);
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