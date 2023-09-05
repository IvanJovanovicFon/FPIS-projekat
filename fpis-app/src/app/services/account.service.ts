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
      new Job("neki id posla", "neki id racuna","vrsta posla", "podvrsta", "Km", 3, 0, "nema opisa"),
      new Job("neki id posla2", "neki id racuna2","vrsta posla2", "podvrsta2", "Km2", 32, 0, "nema opisa2")
    ]
  ), 
  new Account("neka bude string za sad2", new Contractor("22222222222", "firma", "123456789123456789",
    "666888", "Ivan Peric", "0707000792258"),
    "neki id2", 
    "22222",
    "objekat neki2", "neki investitor2",12000, new Date(), new Date(), new Date(),10000,
    [
      new Job("neki id posla3", "neki id racuna3","vrsta posla4", "podvrsta234234", "Km", 333, 0, "nem2342a opisa"),
      new Job("neki id posla4", "neki id racuna4","vrsta posla3", "pod4234vrsta2", "Km2", 323, 3, "nem243a opisa2")
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
