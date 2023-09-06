import { Job } from "./Job";
import { Contractor } from "./contractor";

export class Accounting {

    id: string;
    izvodjac: Contractor;
    ukupnaCena: number;
  
    constructor( 
        id: string,
        izvodjac: Contractor,
        ukupnaCena:number
        ) {
      this.id = id;
      this.izvodjac = izvodjac;
      this.ukupnaCena = ukupnaCena;
    }
  }
  