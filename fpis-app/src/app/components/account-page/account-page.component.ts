import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, map, switchMap, take } from 'rxjs';
import { Accounting } from 'src/app/model/Accounting';
import { Job } from 'src/app/model/Job';
import { Account } from 'src/app/model/account';
import { city } from 'src/app/model/city';
import { Contractor } from 'src/app/model/contractor';
import { street } from 'src/app/model/street';
import { streetNumber } from 'src/app/model/streetNumber';
import { SubtypeOfJob } from 'src/app/model/subtypeOfJob';
import { TypeOfJob } from 'src/app/model/typeOfjob';
import { UnitOfMeasure } from 'src/app/model/unit-of-measure';
import { AccountService } from 'src/app/services/account.service';
import { AdressService } from 'src/app/services/adress.service';
import { ContractorService } from 'src/app/services/contractor.service';
import { v4 as uuidv4 } from 'uuid';

interface AccountBack {
  brojRacuna: string;
  id: string;
}

interface Result {
  account: {
    id: string;
    idIzvodjac: string;
    idPredracun: string;
    brojRacuna: string;
    objekat: string;
    realizacija: number;
    datumIspostavljanja: string; // Assuming it's a string, change to Date if needed
    datumIzdavanja: string; // Assuming it's a string, change to Date if needed
    datumPrometaDobaraIUsluga: string; // Assuming it's a string, change to Date if needed
    ukupnaCena: number;
    investitor: string;
    mesto: string;
    idUlica: string;
    brojUlice: string;
    poslovi: Job[]; // Assuming Posao is another interface
  };
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public constructor(private conService: ContractorService, private fb: FormBuilder
    , private accService: AccountService, private adressService:AdressService){}

  contractors: Contractor[] = [];
  addAccountForm!: FormGroup;
  editAccountForm!: FormGroup;
  posaoGroup!: FormGroup;
  form!: FormGroup;
  jobs: Job[] = [];
  addedJobs: boolean = false;
  isValidCenaFlag :boolean = true;
  isValidKolicinaFlag :boolean = true;
  isValidJMFlag :boolean = true;
  isValidVrstaFlag :boolean = true;
  isValidPodvrstaFlag :boolean = true;
  showAddForm: boolean = true;
  searchResults: Account[] = [];
  searchTrigger = new Subject<string>();
  isDodajStavkuFlag: boolean = true;
  indexOfEditedJob: number = -1;
  ukupnaCena:number = 0;
  clickOnAddJob:boolean = false;
  selectedMesto: string = ''; // Initialize with an empty string or default value
  selectedUlica: string = '';
  selectedBroj: string = '';
  skipInitialChange: boolean = true;
  cities: city[] = [];
  streets: street[] = [];
  numbers: streetNumber[] = [];
  predracuni: Accounting[]=[];
  vrste: TypeOfJob[]=[];
  podvrste: SubtypeOfJob[]=[];
  mere: UnitOfMeasure[]=[];
  validationMessages = {
    izvodjac: {
      required: 'Izvođač je obavezan!'
    },
    id:{
      required: "Id je obavezan!"
    },
    broj:{
      required: "  Broj računa je obavezan!",
      pattern: 'Unesite tačan broj računa!'
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
    },
    vrsta:{
      required: "Izaberite vrstu!",
    },
    podvrsta:{
      required: "Izaberite podvrstu!",
    },    
    jedinicamere:{
      required: "Izaberite jedinicu mere!",
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
    //this.addAccountForm.get('posao.podvrsta')?.disable();
    //this.editAccountForm.get('posao.podvrsta')?.disable();
    this.initializeForms();
  }

  initializeForms(): void {
    this.cities=[];
    this.predracuni = [];
    this.mere = [];
    this.vrste = [];
    this.podvrste = [];

    
    this.adressService.getAllCities().subscribe((data) => {
      Object.values(data).forEach((city: city)=>{
        this.cities.push(city);
      })
    });
    
    this.accService.getAllAccountings().subscribe((data)=>{
      Object.values(data).forEach((pred: Accounting)=>{
        this.predracuni.push(pred);
      })
    })
    
    this.accService.getAllJM().subscribe((data)=>{
      Object.values(data).forEach((item: UnitOfMeasure)=>{
        this.mere.push(item);
      })
    })
    
    this.accService.getAllTypesOfJob().subscribe((data)=>{
      Object.values(data).forEach((item: TypeOfJob)=>{
        this.vrste.push(item);
      })
    })
    
    const currentDate = new Date(); 
    this.conService.getAllContractors().subscribe((contractors)=>{
      this.contractors = contractors;
    });
    
    this.addAccountForm = this.fb.group({
      izvodjac:['', Validators.required],
      predracun:['', Validators.required],
      id: [uuidv4(), Validators.required],
      brojRacuna: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$'), ]],
      objekat: ['', Validators.required],
      realizacija: ['', [Validators.required, Validators.pattern('^[0-9]+$'),  Validators.min(0)]],
      investitor: ['', Validators.required],
      datumIspos: [currentDate, Validators.required],
      datumIzdav: [currentDate, Validators.required],
      datumPromet: [currentDate, Validators.required],
      ukupnaCena: [0],
      mesto: ['', Validators.required], 
      ulica: [{ value: '', disabled: true }, Validators.required], 
      broj: [{ value: '', disabled: true }, Validators.required],
      posao: this.fb.group({
        idPosla:[''],
        vrsta: ['', Validators.required],
        podvrsta: [{ value: '', disabled: true}, Validators.required],
        jedinicamere: ['', Validators.required],
        kolicina: ['', [Validators.required, Validators.min(0)]],
        cena: ['', [Validators.required, Validators.min(0)]],
        opis: ['']
      })
    });

    this.editAccountForm = this.fb.group({
      searchQuery: [''],
      izvodjac:['', Validators.required],
      predracun:['', Validators.required],
      id: ['', Validators.required],
      brojRacuna: ['', [Validators.required, Validators.pattern('^[0-9]+$'), ]],
      objekat: ['', Validators.required],
      realizacija: ['', [Validators.required, Validators.pattern('^[0-9]+$'),  Validators.min(0)]],
      investitor: ['', Validators.required],
      datumIspos: [currentDate, Validators.required],
      datumIzdav: [currentDate, Validators.required],
      datumPromet: [currentDate, Validators.required],
      ukupnaCena: [0],
      mesto: ['', Validators.required], 
      ulica: [{  disabled: true }, Validators.required], 
      broj: [{  disabled: true }, Validators.required],
      posao: this.fb.group({
        idPosla:[uuidv4()],
        vrsta: ['', Validators.required],
        podvrsta: [{ value: ''}, Validators.required],
        jedinicamere: ['', Validators.required],
        kolicina: ['', [Validators.required, Validators.min(0)]],
        cena: ['', [Validators.required, Validators.min(0)]],
        opis: ['']
      })
    });
    
        let posaoGroup: AbstractControl | null;
      posaoGroup = this.addAccountForm.get('posao');
      this.form = this.addAccountForm;

    this.form.get('mesto')?.valueChanges.subscribe((value) => {//ima bag kad promenis grad ulica postane izabrana prva i ne radi onChange
      if (value) {
        const selectedCityPtt = this.form.get('mesto')?.value
        this.streets=[];
        this.numbers=[];
        this.form.get('broj')?.reset();
        this.form.get('broj')?.setValue('');
        this.form.get('ulica')?.setValue('');
        this.adressService.getAllStreetsByPTT(selectedCityPtt).subscribe((data: street[])=>{
          Object.values(data).forEach((str:street)=>{
            this.streets.push(str)
          })
       })
       this.form.get('ulica')?.enable();
        this.form.get('broj')?.disable();
      } 
    });

    this.form.get('ulica')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('broj')?.enable();
        const selected = this.form.get('ulica')?.value
        const [ptt, id] = selected.split(',');
        this.numbers=[];
        this.form.get('broj')?.reset();
        this.adressService.getAllNumbersByPTTAndId(ptt, id).subscribe((data: streetNumber[])=>{
          Object.values(data).forEach((num:streetNumber)=>{
            this.numbers.push(num)
          })
        })
      } 
    });

    if(this.showAddForm){
      posaoGroup = this.addAccountForm.get('posao')
    }
    else{
      posaoGroup = this.editAccountForm.get('posao');
    }
    if (posaoGroup) {
      posaoGroup?.get('vrsta')?.valueChanges.subscribe((value) => {//ima bag kad promenis grad ulica postane izabrana prva i ne radi onChange    
      if (value) {
        posaoGroup?.get('podvrsta')?.enable();
        const selectedVrsta = posaoGroup?.get('vrsta')?.value
        this.podvrste = [];
        posaoGroup?.get('podvrsta')?.reset();
        posaoGroup?.get('podvrsta')?.setValue('');
      this.accService.getAllSubtypesOfJobByTypeId(selectedVrsta).subscribe((data)=>{
        Object.values(data).forEach((item: SubtypeOfJob)=>{
          this.podvrste.push(item);
        })
      })
      } 
    });
    }
//********************************************************************************************** */
this.editAccountForm.get('mesto')?.valueChanges.subscribe((selectedMestoNaziv) => {
  if (selectedMestoNaziv) {
    const selectedCity: city | undefined = this.cities.find((ct) => ct.naziv === selectedMestoNaziv);

    if (selectedCity) {
      this.adressService.getAllStreetsByPTT(selectedCity.ptt).subscribe((data) => {
        this.streets = data;

        this.editAccountForm.get('ulica')?.valueChanges.subscribe((value) => {

          const selectedStreet = this.streets.find((st) => st.naziv === value);

          if (selectedCity && selectedStreet) {
            if (selectedCity.ptt && selectedStreet.id) {
              this.editAccountForm.get('broj')?.enable();

              const ulicaIdString = (selectedStreet as { id: string }).id;
              const ulicaId = parseInt(ulicaIdString, 10);
              this.adressService
                .getAllNumbersByPTTAndId(selectedCity.ptt, ulicaId)
                .subscribe((data) => {
                  this.numbers = data;
                });
            } else {
              this.numbers = [];
            }
          }
        });
      });
    } else {
      this.streets = [];
    }
  }
});
  }
  
  editAccount(event:Event): void {
    event.preventDefault();
    let izvodjacName: string = this.editAccountForm.get('izvodjac')?.value;
    this.conService.getContracorByName(izvodjacName)
    .subscribe((foundContractor)=>{
      if (foundContractor) {
 

        const grad = this.cities.find((g)=>g.naziv === this.editAccountForm.get('mesto')?.value)
 
        if(grad){
          console.log("da vidim;00 ",grad, this.streets, this.editAccountForm.get('ulica')?.value)

          const ulica = this.streets.find((u)=>u.id == this.editAccountForm.get('ulica')?.value)
          if(ulica){
            console.log(ulica)
            const broj = this.numbers.find((b)=>b.broj === this.editAccountForm.get('broj')?.value)
            console.log("bbb",broj)
            
            if(broj){
              console.log(broj)
              const editedAccount: Account = {
                izvodjac: foundContractor,
                idIzvodjac:foundContractor.id,
                idPredracun: this.editAccountForm.get('predracun')?.value,
                id: this.editAccountForm.get('id')?.value,
                brojRacuna: this.editAccountForm.get('brojRacuna')?.value,
                objekat: this.editAccountForm.get('objekat')?.value,
                realizacija: this.editAccountForm.get('realizacija')?.value,
                investitor: this.editAccountForm.get('investitor')?.value,
                datumIspostavljanja: this.editAccountForm.get('datumIspos')?.value,
                datumIzdavanja: this.editAccountForm.get('datumIzdav')?.value,
                datumPrometaDobaraIUsluga: this.editAccountForm.get('datumPromet')?.value,
                ukupnaCena: this.editAccountForm.get('ukupnaCena')?.value,
                mesto:  grad.ptt,
                idUlica:ulica.id,
                brojUlice:broj.broj,
                poslovi: this.jobs
              };    
              console.log("ajmoo menjaj")
              this.accService.editAccount(editedAccount);
              this.jobs =[];
              this.initializeForms();
            }}}
      } else {
        console.log('Contractor not found');
        return;
      }
    });    
  }
  
  addAccount(): void {
    let izvodjacId: string = this.addAccountForm.get('izvodjac')?.value;
    this.conService.getAllContractors().subscribe(izvodjaci => {

      const foundContractor = izvodjaci.find(contractor => {
        return contractor.naziv === izvodjacId || contractor.pib === izvodjacId;
      });
      
      if (foundContractor) {
        const newAccount: Account = {
          izvodjac: foundContractor,
          idIzvodjac: foundContractor.id,
          idPredracun: this.addAccountForm.get('predracun')?.value, 
          id: this.addAccountForm.get('id')?.value,
          brojRacuna: this.addAccountForm.get('brojRacuna')?.value,
          objekat: this.addAccountForm.get('objekat')?.value,
          realizacija: this.addAccountForm.get('realizacija')?.value,
          investitor: this.addAccountForm.get('investitor')?.value,
          datumIspostavljanja: this.addAccountForm.get('datumIspos')?.value,
          datumIzdavanja: this.addAccountForm.get('datumIzdav')?.value,
          datumPrometaDobaraIUsluga: this.addAccountForm.get('datumPromet')?.value,
          ukupnaCena:this.addAccountForm.get('ukupnaCena')?.value,
          mesto:this.addAccountForm.get('mesto')?.value,
          idUlica:this.addAccountForm.get('ulica')?.value,
          brojUlice:this.addAccountForm.get('broj')?.value,
          poslovi: this.jobs
        };      
      
        const [ptt, id] = newAccount.idUlica.split(',');
        newAccount.idUlica = id;
        this.accService.addAccount(newAccount);
        this.initializeForms();
      } else {
        console.log('Contractor not found');
        return;
      }
    });


  }
  
  onSearch(): void {
    const query = this.editAccountForm.value.searchQuery.toLowerCase();
    this.searchTrigger.next(query);
  }

  performSearch(query: string): void {
    if (!query) {
      this.searchResults = [];
      return;
    }

    
  
    this.accService.getAccountsIdAndNumber().subscribe((accounts) => {
      console.log("prazam: ",accounts)
      if(accounts !== Array(0))
      this.searchResults = accounts.filter((account: Account) =>{
        return (
          (account.id && account.id.toLowerCase().includes(query)) ||
          (account.brojRacuna && account.brojRacuna.toLowerCase().includes(query))
        );
      });
    });
  }
  


selectSearchResult(valueId:Account) {

  this.searchResults = [];
  this.streets = [];
  this.numbers = [];
  this.editAccountForm.get('podvrsta')?.enable()
  this.editAccountForm.get('mesto')?.enable()
  this.editAccountForm.get('ulica')?.enable()
  this.editAccountForm.get('broj')?.enable()
 
  console.log(this.predracuni)


  this.accService.getAccountById(valueId.id).subscribe((result: Result) => {//videti nesto sa switch mapom
    console.log("rezz:",result)
    
    this.searchResults = [];
    let selectedJobs: Job[] = [];
    selectedJobs = result.account.poslovi;
    this.jobs = selectedJobs
    this.conService.getContracorById(result.account.idIzvodjac).subscribe((contractor)=>{
    
      const selectedMesto = this.cities.find((city) => city.ptt === result.account.mesto) as city;
      let selectedUlica: street  = new street("1","1","1");
      let selectedBroj :streetNumber = new streetNumber("1","1","1");
      if(selectedMesto){
        this.adressService.getAllStreetsByPTT(selectedMesto.ptt).subscribe((data: street[]) => {
          Object.values(data).forEach((str: street) => {
            this.streets.push(str);
          });     
         
          this.streets.forEach(str => {
            if(str.id.toString() === result.account.idUlica){
             selectedUlica = str as street;
            }
          });
          if (selectedUlica) {
            const ulicaIdString = (selectedUlica as { id: string }).id;
            const ulicaId = parseInt(ulicaIdString, 10);
            console.log("broojevii: ", selectedMesto.ptt, ulicaId)
            this.adressService.getAllNumbersByPTTAndId(selectedMesto.ptt, ulicaId).subscribe((data: streetNumber[]) => {
              console.log(data)
              Object.values(data).forEach((num: streetNumber) => {
                this.numbers.push(num);
              });
              let num =  null;
              this.numbers.forEach((nmb)=>{
                if(nmb.broj == result.account.brojUlice){
                  num = nmb as streetNumber
                }
              })          
              if(num){
                selectedBroj = num;
              }
              this.editAccountForm.patchValue({
                id: result.account.id,
                izvodjac:contractor.naziv,
                predracun: result.account.idPredracun,
                brojRacuna: result.account.brojRacuna,
                objekat: result.account.objekat,
                realizacija:result.account.realizacija,
                investitor: result.account.investitor,
                datumIspos: formatDate(new Date(result.account.datumIspostavljanja), 'yyyy-MM-dd', 'en'),
                datumIzdav: formatDate(new Date(result.account.datumIzdavanja), 'yyyy-MM-dd', 'en'),
                datumPromet: formatDate(new Date(result.account.datumPrometaDobaraIUsluga), 'yyyy-MM-dd', 'en'),
                mesto: selectedMesto.naziv,
                ulica: selectedUlica.naziv,
                broj: selectedBroj.broj
               });
                this.jobs.forEach(job => {
                  this.ukupnaCena+=job.cena*job.kolicina;
                });
                this.editAccountForm.get('ukupnaCena')?.setValue(this.ukupnaCena);
                this.addedJobs = true;
    
              this.selectedMesto = selectedMesto.naziv;
              this.selectedUlica = selectedUlica.naziv;
              this.selectedBroj = selectedBroj.broj;
              // this.editAccountForm.get('mesto')?.setValue(selectedMesto.naziv);
              // this.editAccountForm.get('ulica')?.setValue(selectedUlica.naziv);
              // this.editAccountForm.get('broj')?.setValue(selectedBroj.broj);
    
            });          
          }     
        });
      }
        })
      });
    



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
      const jmValue = posaoGroup.get('jedinicamere')?.value;
      const vrstaValue = posaoGroup.get('vrsta')?.value;
      const podvrstaValue = posaoGroup.get('podvrsta')?.value;

     if (cenaValue ===null || cenaValue === "" ) {
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

      

        if(jmValue ===""  || vrstaValue === null){
      const jmControl = posaoGroup.get('jedinicamere');

        jmControl?.markAsTouched();
        jmControl?.markAsDirty();
        jmControl?.setErrors({ required: true });
        this.isValidJMFlag = false;
      } else {
        this.isValidJMFlag = true;
      }

      if(vrstaValue ==="" || vrstaValue === null){
        const vrstaControl = posaoGroup.get('vrsta');
    
        vrstaControl?.markAsTouched();
        vrstaControl?.markAsDirty();
        vrstaControl?.setErrors({ required: true });
          this.isValidVrstaFlag = false;
        } else {
          this.isValidVrstaFlag = true;
        }

        if(podvrstaValue ==="" || podvrstaValue ===null){
          const pvControl = posaoGroup.get('podvrsta');
      
          pvControl?.markAsTouched();
          pvControl?.markAsDirty();
          pvControl?.setErrors({ required: true });
            this.isValidPodvrstaFlag = false;
          } else {
            this.isValidPodvrstaFlag = true;
          }
  

      if (this.isValidCenaFlag === false || this.isValidKolicinaFlag === false || this.isValidJMFlag === false
         || this.isValidPodvrstaFlag === false || this.isValidVrstaFlag === false) {
        return;
      }
  
      const newJob = this.getJobFromEditForm();
      if(newJob.id === null){
        newJob.id = uuidv4();
      }
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
      posaoGroup.reset();
      this.isValidJMFlag =false;
      this.isValidPodvrstaFlag =false;
      this.isValidVrstaFlag =false;
      this.isValidCenaFlag =false;
      this.isValidKolicinaFlag =false;

      this.podvrste = [];
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
        jedinicamere: editedJob.oznakaJedinicaMere,
        vrsta: editedJob.idVrstaPosla,
        podvrsta: editedJob.idPodvrstaPosla,
        opis: editedJob.opis,
        idPosla: editedJob.id
      });
    }
    this.addedJobs = true;
  }

  getJobFromEditForm(): Job {

    let posaoGroup: AbstractControl | null;
    if (this.showAddForm) {
      posaoGroup = this.addAccountForm.get('posao');
       const job: Job = {
        id:uuidv4(),
        idVrstaPosla: posaoGroup?.get('vrsta')?.value ,
        idPodvrstaPosla: posaoGroup?.get('podvrsta')?.value ,
        oznakaJedinicaMere: posaoGroup?.get('jedinicamere')?.value ,
        kolicina: posaoGroup?.get('kolicina')?.value,
        cena: posaoGroup?.get('cena')?.value,
        opis: posaoGroup?.get('opis')?.value || 'nema opisa',
        idRacun: this.addAccountForm.get('id')?.value,
      };
      return job;
    } else {
      posaoGroup = this.editAccountForm.get('posao');

       const job: Job = {
        id: posaoGroup?.get('idPosla')?.value,
        idVrstaPosla: posaoGroup?.get('vrsta')?.value ,
        idPodvrstaPosla: posaoGroup?.get('podvrsta')?.value ,
        oznakaJedinicaMere: posaoGroup?.get('jedinicamere')?.value ,
        kolicina: posaoGroup?.get('kolicina')?.value,
        cena: posaoGroup?.get('cena')?.value,
        opis: posaoGroup?.get('opis')?.value || 'nema opisa',
        idRacun: this.editAccountForm.get('id')?.value,
      };
      return job;
    }

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
 
  onVrstaSelected(event: any) {
    let posaoGroup: AbstractControl | null;
    
    if (this.showAddForm) {
      posaoGroup = this.addAccountForm.get('posao');
    } else {
      posaoGroup = this.editAccountForm.get('posao');
    }
    if (posaoGroup) {
      
      this.posaoGroup.get('podvrsta')?.enable()
    const selectedTypeId = event.target.value;
    this.podvrste = [];
    this.accService.getAllSubtypesOfJobByTypeId(selectedTypeId).subscribe((data)=>{
      Object.values(data).forEach((item: SubtypeOfJob)=>{
        this.podvrste.push(item);
      })
    })
    }
  }
}
