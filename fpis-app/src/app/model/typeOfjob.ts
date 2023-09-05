export class typeOfJob {
    id:string;
    totalPrice:number;
    idAccounting:string;
    name:string;
    idAccount:string;

    constructor( idAccount:string,id:string, name:string,
        totalPrice:number,
        idAccounting:string){
        this.id=id;
        this.name=name;
        this.totalPrice = totalPrice;
        this.idAccounting = idAccounting;
        this.idAccount = idAccount;
    }
}