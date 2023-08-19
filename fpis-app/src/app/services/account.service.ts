import { Account } from '../model/account';
import { Observable, of } from 'rxjs';
import { Job } from '../model/Job';
import { Contractor } from '../model/contractor';
import { Injectable } from '@angular/core';

const accounts: Account[] = [
  new Account("neka bude string za sad", new Contractor("22222222222", "Firma12", "123456789123456789",
    "666888", "Ivan Peric", "0707000792258"),
    "neki id", 
    "1111",
    "objekat neki", "neki investitor", 10000, new Date(), new Date(), new Date(),10000,
    [
      new Job("vrsta posla", "podvrsta", "Km", 3, 0, "nema opisa"),
      new Job("vrsta posla2", "podvrsta2", "Km2", 32, 0, "nema opisa2")
    ]
  ), 
  new Account("neka bude string za sad2", new Contractor("22222222222", "firma", "123456789123456789",
    "666888", "Ivan Peric", "0707000792258"),
    "neki id2", 
    "22222",
    "objekat neki2", "neki investitor2",12000, new Date(), new Date(), new Date(),10000,
    [
      new Job("vrsta posla3", "podvrsta3", "Km3", 33, 1, "nema opisa3"),
      new Job("vrsta posla23", "podvrsta23", "Km23", 332, 0, "nema opisa23")
    ]
  )
];

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  

    getAllAccounts(): Observable<Account[]> {
      return of(accounts);
    }

    editAccount(acc: Account) {
      console.log("edited:", acc);
    }

    addAccount(acc: Account) {
      console.log("added:", acc);
    accounts.push(acc);
  }


}
