export class typeOfJob {
    idAccount:string;
    idTypeOfWork:number;
    id:string;
    totalPrice:number;
    idAccounting:string;
    name:string;

    constructor( idAccount:string,
        idTypeOfWork:number, id:string, name:string,rb:number,
        totalPrice:number,
        idAccounting:string){
        this.id=id;
        this.name=name;
        this.totalPrice = totalPrice;
        this.idAccounting = idAccounting;
        this.idAccount = idAccount;
        this.idTypeOfWork = idTypeOfWork;
    }
}