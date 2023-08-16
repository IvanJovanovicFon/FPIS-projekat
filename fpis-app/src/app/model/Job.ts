export class Job {//fali id
    vrsta: string;
    podvrsta: string;
    jedinicaMere: string;
    kolicina: number;
    cena: number;
    opis: string;
    
  
    constructor(  
        vrsta: string,
        podvrsta: string,
        jedinicaMere: string,
        kolicina: number,
        cena: number,
        opis: string,
        ) {
      this.vrsta = vrsta;
      this.podvrsta = podvrsta;
      this.jedinicaMere = jedinicaMere;
      this.kolicina = kolicina;
      this.cena = cena;
      this.opis = opis;
 
    }
  }
  