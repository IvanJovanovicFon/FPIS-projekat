import { Job } from "./Job";
import { Contractor } from "./contractor";

export class Account {
    predracun: string;
    izvodjac: Contractor;
    idRacuna: string;
    brojRacuna: string;
    objekat: string;
    investitor: string;
    realizacija: number;
    datumIspostavljanja: Date;
    datumIzdavanja: Date;
    datumPrometaDobaraIUsluga: Date;
    ukupnaCena: number;
    poslovi: Job[];
    
  
    constructor( 
        predracun: string,
    izvodjac: Contractor,
    idRacuna: string,
    brojRacuna: string,
    objekat: string,
    investitor: string,
    realizacija: number,
    datumIspostavljanja: Date,
    datumIzdavanja: Date,
    datumPrometaDobaraIUsluga: Date,
    ukupnaCena: number,
    poslovi: Job[]
        ) {
      this.predracun = predracun;
      this.izvodjac = izvodjac;
      this.idRacuna = idRacuna;
      this.brojRacuna = brojRacuna;
      this.objekat = objekat;
      this.investitor = investitor;
      this.realizacija = realizacija;
      this.datumIspostavljanja = datumIspostavljanja;
      this.datumIzdavanja = datumIzdavanja;
      this.datumPrometaDobaraIUsluga = datumPrometaDobaraIUsluga;
      this.ukupnaCena = ukupnaCena;
      this.poslovi = poslovi;
 
    }
  }
  