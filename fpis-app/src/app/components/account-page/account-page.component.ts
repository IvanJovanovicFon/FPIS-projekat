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
  isValidCenaFlag :boolean = true;
  isValidKolicinaFlag :boolean = true;
  showAddForm: boolean = true;
  searchResults: Account[] = [];
  searchTrigger = new Subject<string>();
  isDodajStavkuFlag: boolean = true;
  indexOfEditedJob: number = -1;
  ukupnaCena:number = 0;
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
    this.ukupnaCena = 0;
    this.editAccountForm.reset();
    this.addAccountForm.reset();
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
      ukupnaCena: [0],
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
      ukupnaCena: [0],
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
  

  editAccount(): void {
    let izvodjacId: string = this.editAccountForm.get('izvodjac')?.value;
    this.conService.getAllContractors().subscribe(izvodjaci => {
      const foundContractor = izvodjaci.find(contractor => {
        return contractor.naziv === izvodjacId || contractor.pib === izvodjacId;
      });
      
      if (foundContractor) {
        const editedAccount: Account = {
          izvodjac: foundContractor,
          predracun: this.editAccountForm.get('predracun')?.value,
          idRacuna: this.editAccountForm.get('id')?.value,
          brojRacuna: this.editAccountForm.get('broj')?.value,
          objekat: this.editAccountForm.get('objekat')?.value,
          realizacija: this.editAccountForm.get('realizacija')?.value,
          investitor: this.editAccountForm.get('investitor')?.value,
          datumIspostavljanja: this.editAccountForm.get('datumIspos')?.value,
          datumIzdavanja: this.editAccountForm.get('datumIzdav')?.value,
          datumPrometaDobaraIUsluga: this.editAccountForm.get('datumPromet')?.value,
          ukupnaCena: this.editAccountForm.get('ukupnaCena')?.value,
          poslovi: this.jobs
        };      
        this.accService.editAccount(editedAccount);
      } else {
        console.log('Contractor not found');
        return;
      }
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
          ukupnaCena:this.addAccountForm.get('ukupnaCena')?.value,
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


  selectSearchResult(result: any) {
    this.searchResults = [];
    let selectedJobs: Job[] = [];
    selectedJobs = result.poslovi;
    this.jobs = selectedJobs;
  

    this.editAccountForm.patchValue({
      id: result.idRacuna,
      izvodjac:result.izvodjac.naziv,
      broj: result.brojRacuna,
      objekat: result.objekat,
      realizacija:result.realizacija,
      investitor: result.investitor,
      datumIspos: formatDate(result.datumIspostavljanja, 'yyyy-MM-dd', 'en'),
      datumIzdav: formatDate(result.datumIzdavanja, 'yyyy-MM-dd', 'en'),
      datumPromet: formatDate(result.datumPrometaDobaraIUsluga, 'yyyy-MM-dd', 'en')
    });
      this.jobs.forEach(job => {
        this.ukupnaCena+=job.cena*job.kolicina;
      });
      this.editAccountForm.get('ukupnaCena')?.setValue(this.ukupnaCena);
      this.addedJobs = true;
  }


  addJob(): void {
    this.addedJobs = true;
    let posaoGroup: AbstractControl | null;
    
    if (this.showAddForm) {
      posaoGroup = this.addAccountForm.get('posao');
    } else {
      posaoGroup = this.editAccountForm.get('posao');
    }
  
    if (posaoGroup) {
      const kolicinaValue = posaoGroup.get('kolicina')?.value;
      const cenaValue = posaoGroup.get('cena')?.value;

      if (cenaValue ===null || cenaValue === "") {
        const cenaControl = posaoGroup.get('cena');
  
        cenaControl?.markAsTouched();
        cenaControl?.markAsDirty();
        cenaControl?.setErrors({ required: true });
        this.isValidCenaFlag = false;
      } else {
        this.isValidCenaFlag = true;
      }
  
  
      if (kolicinaValue ===null || kolicinaValue === "") {
        const kolicinaControl = posaoGroup.get('kolicina');
  
        kolicinaControl?.markAsTouched();
        kolicinaControl?.markAsDirty();
        kolicinaControl?.setErrors({ required: true });
        this.isValidKolicinaFlag = false;
      } else {
        this.isValidKolicinaFlag = true;
      }
  

      if (this.isValidCenaFlag === false || this.isValidKolicinaFlag == false) {
        return;
      }
  
      const newJob = this.getJobFromEditForm();
      this.jobs.push(newJob);
      this.ukupnaCena += newJob.cena * newJob.kolicina;
      if(this.showAddForm){
        this.addAccountForm.get('ukupnaCena')?.
        setValue(this.ukupnaCena);
      }
      else{
        this.editAccountForm.get('ukupnaCena')?.
        setValue(this.ukupnaCena);
      }
      console.log()
      posaoGroup.reset();
    }
  }
  
  
  removeJob(index: number): void {
    if(this.jobs.length===1){
      this.addedJobs = false;
    }
    if(this.indexOfEditedJob === index){
      this.isDodajStavkuFlag = true;
      this.editAccountForm.get('posao')?.reset();
    }
    this.ukupnaCena -= this.jobs[index].cena*this.jobs[index].kolicina;

    if(this.showAddForm){
      this.addAccountForm.get('ukupnaCena')?.setValue(this.ukupnaCena);
    }
    else{
      this.editAccountForm.get('ukupnaCena')?.setValue(this.ukupnaCena);
    }
    this.jobs.splice(index, 1);
  }


  editJob(index: number): void {
    const editedJob = this.jobs[index];
  this.isDodajStavkuFlag = false;
  this.indexOfEditedJob = index;
    const posaoGroup = this.editAccountForm.get('posao');
    if (posaoGroup) {
      posaoGroup.patchValue({
        kolicina: editedJob.kolicina,
        cena: editedJob.cena,
        jedinicaMere: editedJob.jedinicaMere,
        vrsta: editedJob.vrsta,
        podvrsta: editedJob.podvrsta,
        opis: editedJob.opis
      });
    }
  
    this.addedJobs = true;
  }


  getJobFromEditForm(): Job {

    let posaoGroup: AbstractControl | null;
    
    if (this.showAddForm) {
      posaoGroup = this.addAccountForm.get('posao');
    } else {
      posaoGroup = this.editAccountForm.get('posao');
    }
 
    const job: Job = {
      vrsta: posaoGroup?.get('vrsta')?.value || '',//za sad nek ide dok ne popunim
      podvrsta: posaoGroup?.get('podvrsta')?.value || '',
      jedinicaMere: posaoGroup?.get('jedinicaMere')?.value || '',
      kolicina: posaoGroup?.get('kolicina')?.value,
      cena: posaoGroup?.get('cena')?.value,
      opis: posaoGroup?.get('opis')?.value || 'nema opisa',
    };
    return job;
    //fali nekki error da se vrati
  }
  

  onEditJob(): void{
    const posaoGroup = this.editAccountForm.get('posao');
    const job = this.getJobFromEditForm();
    this.ukupnaCena-=(this.jobs[this.indexOfEditedJob].cena*this.jobs[this.indexOfEditedJob].kolicina)
    this.jobs[this.indexOfEditedJob] = job;
   
    this.ukupnaCena+= job.cena*job.kolicina;
    this.editAccountForm.get('ukupnaCena')?.setValue(this.ukupnaCena);

    posaoGroup?.reset();
    this.isDodajStavkuFlag = true;
  }
 

}
