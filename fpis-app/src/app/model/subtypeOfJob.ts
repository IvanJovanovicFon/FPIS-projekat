export class SubtypeOfJob {
    idVrstaPosla:string;
    id:string;
    naziv:string;

    constructor(idVrstaPosla:string, id:string, naziv:string){
        this.id=id;
        this.naziv=naziv;
        this.idVrstaPosla = idVrstaPosla;
    }
}