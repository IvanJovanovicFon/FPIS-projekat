export class Contractor {//treba da se doda adresa i id;
    pib: string;
    naziv: string;
    tekuciRacun: string;
    sifra: string;
    imeIprezime: string;
    jmbg: string;
    
  
    constructor(  pib: string,
        naziv: string,
        tekuciRacun: string,
        sifra: string,
        imeIprezime: string,
        jmbg: string,
        ) {
      this.pib = pib;
      this.imeIprezime = imeIprezime;
      this.jmbg = jmbg;
      this.naziv = naziv;
      this.sifra = sifra;
      this.tekuciRacun = tekuciRacun;
 
    }
  }
  