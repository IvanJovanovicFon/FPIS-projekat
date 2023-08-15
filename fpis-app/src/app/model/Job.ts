export class Job {//fali id
    vrsta: string;
    podvrsta: string;
    jedinicaMere: string;
    kolicina: string;
    cena: string;
    opis: string;
    
  
    constructor(  
        vrsta: string,
        podvrsta: string,
        jedinicaMere: string,
        kolicina: string,
        cena: string,
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
  