export class Job {
    id:string;
    idVrsta: string;
    idPodvrsta: string;
    idjedinicaMere: string;
    kolicina: number;
    cena: number;
    opis: string;
    idRacuna:string;
  
    constructor( 
        id:string,
        idRacuna:string,
        vrsta: string,
        podvrsta: string,
        jedinicaMere: string,
        kolicina: number,
        cena: number,
        opis: string)
         {
      this.idVrsta = vrsta;
      this.idPodvrsta = podvrsta;
      this.idjedinicaMere = jedinicaMere; 
      this.kolicina = kolicina;
      this.cena = cena;
      this.opis = opis;
      this.idRacuna = idRacuna;
      this.id = id;
    }
  }
  