import { Job } from "./Job";
import { Contractor } from "./contractor";

export class Account {
    predracun: string;
    izvodjac: Contractor;
    idRacuna: string;
    brojRacuna: string;
    objekat: string;
    investitor: string;
    realizacija: string;
    datumIspostavljanja: Date;
    datumIzdavanja: Date;
    datumPrometaDobaraIUsluga: Date;
    posao: Job;
    
  
    constructor( 
        predracun: string,
    izvodjac: Contractor,
    idRacuna: string,
    brojRacuna: string,
    objekat: string,
    investitor: string,
    realizacija: string,
    datumIspostavljanja: Date,
    datumIzdavanja: Date,
    datumPrometaDobaraIUsluga: Date,
    posao: Job
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
      this.posao = posao;
 
    }
  }
  