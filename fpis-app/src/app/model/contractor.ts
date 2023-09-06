export class Contractor {
  id:string;
    pib: string;
    naziv: string;
    tekuciRacun: string;
    sifra: string;
    imeIprezime: string;
    jmbg: string;
    mesto: string;
    ulica:string;
    broj:string;
  
    constructor(  id:string,
      pib: string,
        naziv: string,
        tekuciRacun: string,
        sifra: string,
        imeIprezime: string,
        jmbg: string,
        mesto: string,
        ulica:string,
        broj:string
        ) {
      this.pib = pib;
      this.imeIprezime = imeIprezime;
      this.jmbg = jmbg;
      this.naziv = naziv;
      this.sifra = sifra;
      this.tekuciRacun = tekuciRacun;
 this.broj= broj;
 this.ulica =ulica;
 this.mesto = mesto;
 this.id = id;
    }
  }
  