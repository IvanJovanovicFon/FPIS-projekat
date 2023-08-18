import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Job } from 'src/app/model/Job';
import { Account } from 'src/app/model/account';
import { Contractor } from 'src/app/model/contractor';
import { AccountService } from 'src/app/services/account.service';
import { ContractorService } from 'src/app/services/contractor.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public constructor(private conService: ContractorService, private fb: FormBuilder
    , private accService: AccountService){}

  contractors: Contractor[] = [];
  addAccountForm!: FormGroup;
  editAccountForm!: FormGroup;
  posaoGroup!: FormGroup;
  jobs: Job[] = [];
  addedJobs: boolean = false;
  isValidPosaoFlag :boolean = true;
  showAddForm: boolean = true;
  searchResults: Account[] = [];
  searchTrigger = new Subject<string>();
  validationMessages = {
    izvodjac: {
      required: 'Izvođač je obavezan!'
    },
    id:{
      required: "Id je obavezan!"
    },
    broj:{
      required: "  Broj računa je obavezan!",
      pattern: 'Broj računa se sastoji samo od cifara!'
    },
    objekat:{
      required: "Objekat je obavezan!"
    },
   investitor:{
      required: "Investitor je obavezan!"
    },
   realizacija:{
      required: "Realizacija je obavezna!",
      pattern: 'Realizacija se sastoji samo od cifara!',
      min: 'Realizacija mora biti pozitivan broj!'
    },
    kolicina: {
      required: 'Količina je obavezna!',
      min: 'Količina mora biti pozitivan broj!'
    },
    cena: {
      required: 'Cena je obavezna!',
      min: 'Cena mora biti pozitivan broj!'
    }
  };
  


  ngOnInit(): void {
    this.initializeForms();

    this.searchTrigger
    .pipe(
      debounceTime(1000),       
      distinctUntilChanged()      
    )
    .subscribe((query: string) => {
      this.performSearch(query);
    });
  }

  toggleForm():void {
    this.showAddForm = !this.showAddForm;
    this.jobs = [];
    this.addedJobs = false;
  }


  initializeForms(): void {
    const currentDate = new Date(); 
    this.conService.getAllContractors().subscribe((contractors)=>{
      this.contractors = contractors;
    });
  
    this.addAccountForm = this.fb.group({
      izvodjac:['', Validators.required],
      id: [uuidv4(), Validators.required],
      broj: ['', [Validators.required, Validators.pattern('^[0-9]+$'), ]],
      objekat: ['', Validators.required],
      realizacija: ['', [Validators.required, Validators.pattern('^[0-9]+$'),  Validators.min(0)]],
      investitor: ['', Validators.required],
      datumIspos: [currentDate, Validators.required],
      datumIzdav: [currentDate, Validators.required],
      datumPromet: [currentDate, Validators.required],
      posao: this.fb.group({
        vrsta: ['', Validators.required],
        podvrsta: ['', Validators.required],
        jedinicaMere: ['', Validators.required],
        kolicina: ['', [Validators.required, Validators.min(0)]],
        cena: ['', [Validators.required, Validators.min(0)]],
        opis: ['']
      })
    });

    this.editAccountForm = this.fb.group({
      searchQuery: [''],
      izvodjac:['', Validators.required],
      id: ['', Validators.required],
      broj: ['', [Validators.required, Validators.pattern('^[0-9]+$'), ]],
      objekat: ['', Validators.required],
      realizacija: ['', [Validators.required, Validators.pattern('^[0-9]+$'),  Validators.min(0)]],
      investitor: ['', Validators.required],
      datumIspos: [currentDate, Validators.required],
      datumIzdav: [currentDate, Validators.required],
      datumPromet: [currentDate, Validators.required],
      posao: this.fb.group({
        vrsta: ['', Validators.required],
        podvrsta: ['', Validators.required],
        jedinicaMere: ['', Validators.required],
        kolicina: ['', [Validators.required, Validators.min(0)]],
        cena: ['', [Validators.required, Validators.min(0)]],
        opis: ['']
      })
    });
  }
  

  addAccount(): void {
    let izvodjacId: string = this.addAccountForm.get('izvodjac')?.value;
    
    this.conService.getAllContractors().subscribe(izvodjaci => {
      console.log(this.contractors);
      const foundContractor = izvodjaci.find(contractor => {
        return contractor.naziv === izvodjacId || contractor.pib === izvodjacId;
      });
      
      if (foundContractor) {
        const newAccount: Account = {
          izvodjac: foundContractor,
          predracun: this.addAccountForm.get('predracun')?.value,
          idRacuna: this.addAccountForm.get('id')?.value,
          brojRacuna: this.addAccountForm.get('broj')?.value,
          objekat: this.addAccountForm.get('objekat')?.value,
          realizacija: this.addAccountForm.get('realizacija')?.value,
          investitor: this.addAccountForm.get('investitor')?.value,
          datumIspostavljanja: this.addAccountForm.get('datumIspos')?.value,
          datumIzdavanja: this.addAccountForm.get('datumIzdav')?.value,
          datumPrometaDobaraIUsluga: this.addAccountForm.get('datumPromet')?.value,
          poslovi: this.jobs
        };
        
        this.accService.addAccount(newAccount);
      } else {
        console.log('Contractor not found');
        return;
      }
    });


  }
  

  onSearch(): void {
    const query = this.editAccountForm.value.searchQuery.toLowerCase();
    console.log(query)
    this.searchTrigger.next(query);
  }


  performSearch(query: string): void {
    if (!query) {
      this.searchResults = [];
      return;
    }
  
    this.accService.getAllAccounts().subscribe((accounts: Account[]) => {
      this.searchResults = accounts.filter((account: Account) =>
        account.idRacuna.toLowerCase().includes(query) ||
        account.brojRacuna.toLowerCase().includes(query)
      );
    });
  }

//izmena
  selectSearchResult(result: any) {
    this.searchResults = [];
    console.log('Selected:', result);
  
    this.editAccountForm.patchValue({
      id: result.idRacuna,
      izvodjac:result.izvodjac.naziv,
      broj: result.brojRacuna,
      objekat: result.objekat,
      realizacija:result.realizacija,
      investitor: result.investitor,
    datumIspos: formatDate(result.datumIspostavljanja, 'yyyy-MM-dd', 'en'),
    datumIzdav: formatDate(result.datumIzdavanja, 'yyyy-MM-dd', 'en'),
    datumPromet: formatDate(result.datumPrometaDobaraIUsluga, 'yyyy-MM-dd', 'en'),
      //fali da se doda niz sacuvanih poslova i treba da se omoguci izmena stavki posla
      //mozda dodati dugme izmeni i onda se popune polja sa ovim i mozes da izmenis poslje i onda ga dodas  
    });
  }

  addJob(): void {
    this.addedJobs = true;
    let posaoGroup: AbstractControl | null;
    if(this.addAccountForm.get('posao')){
     posaoGroup = this.addAccountForm.get('posao');
    }
    else {
     posaoGroup = this.editAccountForm.get('posao');
    }
    console.log(posaoGroup)

    if (posaoGroup) {
      const newJob: Job = {
        vrsta: posaoGroup.get('vrsta')?.value || '',//za sad nek ide dok ne popunim
        podvrsta: posaoGroup.get('podvrsta')?.value || '',
        jedinicaMere: posaoGroup.get('jedinicaMere')?.value || '',
        kolicina: posaoGroup.get('kolicina')?.value,
        cena: posaoGroup.get('cena')?.value,
        opis: posaoGroup.get('opis')?.value || 'nema opisa',
      };
      
      
      if (posaoGroup.get('cena')?.value ==null || posaoGroup.get('cena')?.value === "") {
        const cenaControl = posaoGroup.get('cena');
      
        cenaControl?.markAsTouched();
        cenaControl?.markAsDirty();
        cenaControl?.setErrors({ required: true });
        this.isValidPosaoFlag = false;
      }
      else{
        this.isValidPosaoFlag = true;
      }
      
      if (posaoGroup.get('kolicina')?.value === "" || posaoGroup.get('kolicina')?.value ==null ) {
        const kolicinaControl = posaoGroup.get('kolicina');
      
        kolicinaControl?.markAsTouched();
        kolicinaControl?.markAsDirty();
        kolicinaControl?.setErrors({ required: true });
        this.isValidPosaoFlag = false;
      }
      else{
        this.isValidPosaoFlag = true;
      }

      if(this.isValidPosaoFlag === false){
        return;
      }
      

      console.log(newJob)
      this.jobs.push(newJob);
      // this.posaoGroup.get('kolicina')?.reset();
      // this.posaoGroup.get('cena')?.reset();
      // this.posaoGroup.get('opis')?.reset();
      posaoGroup.reset();
    }
  }

  
  removeJob(index: number): void {
    if(this.jobs.length===1){
      this.addedJobs = false;
    }
    this.jobs.splice(index, 1);
  }

 

}
