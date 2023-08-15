import { Injectable } from '@angular/core';
import { Contractor } from '../model/contractor'; 
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private contractors: Contractor[] = [
    new Contractor("111111111", "firma", "123456789123456789",
    "555333", "Pera Peric", "1234566784321") ,
    new Contractor("2222222222", "Firma12", "123456789123456789",
    "666888", "Ivan Peric", "0707000792258") ];

    getAllContractors(): Observable<Contractor[]> {
      return of(this.contractors);
    }

    editContractor(contractor: Contractor) {
      console.log("edited:", contractor);
    }

    addContractor(contractor: Contractor) {
      console.log("added:", contractor);
    this.contractors.push(contractor);
  }

 
}