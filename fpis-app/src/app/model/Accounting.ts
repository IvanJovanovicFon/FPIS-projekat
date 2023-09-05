import { Job } from "./Job";
import { Contractor } from "./contractor";

export class Accounting {

    id: string;
    izvodjac: Contractor;
pib:string;
  
    constructor( 
        id: string,
    izvodjac: Contractor,
        ) {
      this.id = id;
      this.izvodjac = izvodjac;
    this.pib = izvodjac.pib;
 
    }
  }
  