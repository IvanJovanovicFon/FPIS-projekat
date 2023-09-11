export class Job {
    id:string;
    idVrstaPosla: string;
    idPodvrstaPosla: string;
    oznakaJedinicaMere: string;
    kolicina: number;
    cena: number;
    opis: string;
    idRacun:string;
  
    constructor( 
        id:string,
        idRacun:string,
        vrsta: string,
        podvrsta: string,
        jedinicaMere: string,
        kolicina: number,
        cena: number,
        opis: string)
         {
      this.idVrstaPosla = vrsta;
      this.idPodvrstaPosla = podvrsta;
      this.oznakaJedinicaMere = jedinicaMere; 
      this.kolicina = kolicina;
      this.cena = cena;
      this.opis = opis;
      this.idRacun = idRacun;
      this.id = id;
    }
  }
  