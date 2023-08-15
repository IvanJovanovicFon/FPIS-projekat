import { Injectable } from '@angular/core';
import { Contractor } from '../model/contractor'; 
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private contractors: Contractor[] = [
    new Contractor("684","123456789123456789", "1234567891234", "ivan",
    "123456789", "ivan") ,
    new Contractor("684","123456789123456789", "1234567891234", "jovan",
    "123456789", "jovan") ,
    new Contractor("684","123456789123456789", "1234567891234", "marko",
    "123456789", "marko")    ];

    getAllContractors(): Observable<Contractor[]> {
      return of(this.contractors);
    }

    addContractor(contractor: Contractor) {
    this.contractors.push(contractor);
  }

 
}