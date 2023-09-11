import { Accounting } from "./Accounting";
import { Job } from "./Job";
import { city } from "./city";
import { Contractor } from "./contractor";
import { street } from "./street";
import { streetNumber } from "./streetNumber";

export class Account {
  izvodjac: Contractor;
  id: string;
  idIzvodjac:string;
    idPredracun: Accounting;
    brojRacuna: string;
    objekat: string;
    realizacija: number;
    investitor: string;
    datumIspostavljanja: Date;
    datumIzdavanja: Date;
    datumPrometaDobaraIUsluga: Date;
    ukupnaCena: number;//11
    // mesto:city;
    // ulica:street;
    // broj:streetNumber;
    mesto:string;
    idUlica:string;
    brojUlice:string;
    poslovi: Job[];
    
  
    constructor( 
    predracun: Accounting,
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
    // mesto:city,
    // ulica:street,
    // broj:streetNumber,
    mesto:string,
    ulica:string,
    broj:string,
    poslovi: Job[]
        ) {
      this.idPredracun = predracun;
      this.izvodjac = izvodjac;
      this.id = idRacuna;
      this.brojRacuna = brojRacuna;
      this.objekat = objekat;
      this.investitor = investitor;
      this.realizacija = realizacija;
      this.datumIspostavljanja = datumIspostavljanja;
      this.datumIzdavanja = datumIzdavanja;
      this.datumPrometaDobaraIUsluga = datumPrometaDobaraIUsluga;
      this.ukupnaCena = ukupnaCena;
      this.poslovi = poslovi;
      this.mesto = mesto,
      this.brojUlice = broj,
      this.idUlica = ulica
      this.idIzvodjac = izvodjac.id
    }
  }
  