import { Injectable } from '@angular/core';
import { Contractor } from '../model/contractor'; 
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private contractors: Contractor[] = [
    new Contractor("111111111", "firma", "123456789123456789",
    "555333", "Pera Peric", "123456678432")  ];

    getAllContractors(): Observable<Contractor[]> {
      return of(this.contractors);
    }

    addContractor(contractor: Contractor) {
    this.contractors.push(contractor);
  }

 
}