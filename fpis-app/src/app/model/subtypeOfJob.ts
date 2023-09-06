export class typeOfJob {
    idTypeOfWork:number;
    id:string;
    name:string;

    constructor(idTypeOfWork:number, id:string, name:string){
        this.id=id;
        this.name=name;
        this.idTypeOfWork = idTypeOfWork;
    }
}