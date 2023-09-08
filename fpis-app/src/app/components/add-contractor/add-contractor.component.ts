import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contractor } from 'src/app/model/contractor';
import { ContractorService } from 'src/app/services/contractor.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AdressService } from 'src/app/services/adress.service';
import { city } from 'src/app/model/city';
import { TitleStrategy } from '@angular/router';
import { streetNumber } from 'src/app/model/streetNumber';
import { street } from 'src/app/model/street';


@Component({
  selector: 'app-add-contractor',
  templateUrl: './add-contractor.component.html',
  styleUrls: ['./add-contractor.component.scss']
})
export class ContractorComponent implements OnInit {
  contractorForm!: FormGroup;
  searchForm!: FormGroup;
  showAddForm = true;
  searchResults: Contractor[] = [];
  searchTrigger = new Subject<string>();
  cities: city[] = [];
  streets: street[] = [];
  numbers: streetNumber[] = [];
  mestoDisabled:boolean = true;
  ulicaDisabled:boolean = true;
  brojDisabled:boolean = true;
  mestoSelected:boolean = false;
  ulicaSelected:boolean = false;
  brojSelected:boolean = false;

  validationMessages = {
    pib: {
      required: 'Izvođač je obavezan!',
      pattern:' PIB se sastoji od 9 cifara!'
    },
    naziv:{
      required: "Id je obavezan!"
    },
    tekracun:{
      required: " Tekući račun je obavezno polje!",
      minLength:"Tekući račun se sastoji od tačno 18 cifara!",
      maxLength:'Tekući račun se sastoji od tačno 18 cifara!',
      pattern: 'Tekući račun se sastoji samo od cifara!'
    },
    sifra:{
      required: "Šifra delatnosti je obavezna!",
      pattern:' Šifra delatnosti se sastoji samo od cifara!'
    },
   ime:{
    required:' Ime i prezime direktora je obavezno!',
      pattern: " Ime i prezime se sastoji od više od slova!"
    },
   jmbg:{
      required: " JMBG direktora je obavezan!",
      pattern: 'JMBG se sastoji od 13 cifara!',
      minLength: 'JMBG se sastoji od tačno 13 cifara!',
      maxLength: 'JMBG se sastoji od tačno 13 cifara!'
    },
    mesto:{
      required: "Izaberite mesto!",
    },
    ulica:{
      required: "Izaberite ulica!",
    },
    broj:{
      required: "Izaberite broj!",
    }
  };

  constructor(private fb: FormBuilder, private conService: ContractorService, private adressService: AdressService)
   {

  }

  ngOnInit(): void {
    this.adressService.getAllCities().subscribe((data) => {
      Object.values(data).forEach((city: city)=>{
     this.cities.push(city);
      })
    });

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

   performSearch(query: string): void {
    if (!query) {
      this.searchResults = [];
      return;
    }
  
    this.conService.getAllContractors().subscribe((contractors) => {
      console.log(contractors);
      this.searchResults = contractors.filter((contractor) => {
        const pib = contractor.pib;
        const naziv = contractor.naziv;
        return pib.toLowerCase().includes(query) ||
               naziv.toLowerCase().includes(query);
      });
    });
  }

  editContractor(event:Event):void{
    event.preventDefault();
    if (this.searchForm.valid) {
      const contractorData = this.searchForm.value;
      const contractor = new Contractor(
        uuidv4(),
        contractorData.pib,
        contractorData.naziv,
        contractorData.tekracun,
        contractorData.sifra,
        contractorData.ime,
        contractorData.jmbg,
        contractorData.mesto,
        contractorData.ulica,
        contractorData.broj
        );
      this.conService.editContractor(contractor);
      this.searchForm.reset();
    }
  }

  addContractor(event: Event): void {//mora da se ubace vrednosti od combo boxa
    event.preventDefault();
    if (this.contractorForm.valid) {
      const contractorData = this.contractorForm.value;
      console.log("da vidimo: ", contractorData)
      const contractor = new Contractor(
        uuidv4(),
        contractorData.pib,
        contractorData.naziv,
        contractorData.tekracun,
        contractorData.sifra,
        contractorData.ime,
        contractorData.jmbg,
        contractorData.mesto,
        contractorData.ulica,
        contractorData.broj
        );
      this.conService.addContractor(contractor);
      this.contractorForm.reset();
    }
  }

  onSearch(): void {
    const query = this.searchForm.value.searchQuery.toLowerCase();
    this.searchTrigger.next(query);
  }
  

  selectSearchResult(result: any) {
    this.searchResults = [];
    console.log('Selected:', result);
  
    this.searchForm.patchValue({
      pib: result.pib,
      naziv: result.naziv,
      tekracun: result.tekuciRacun,
      sifra: result.sifra,
      ime:result.imeIprezime,
      jmbg: result.jmbg
    });
  }
  
  toggleForm() {
    this.showAddForm = !this.showAddForm;
    this.ulicaDisabled = true;
    this.brojDisabled = true;
  }

  initializeForms(): void {
    this.mestoSelected = false;
    this.ulicaSelected = false;
    this.brojSelected = false;
    this.ulicaDisabled = true;
    this.brojDisabled = true;
    
    this.contractorForm = this.fb.group({
      pib: ['', [Validators.minLength(9), Validators.maxLength(9), Validators.required, Validators.pattern('^[0-9]*$')]],
      naziv: ['', Validators.required],
      tekracun: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), 
        Validators.pattern('^[0-9]*$')]],
      sifra: ['', [Validators.pattern('^[0-9]*$')]],
      ime: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(2)]],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]],
      mesto: ['', Validators.required], 
      ulica: [{ value: '', disabled: true }, Validators.required], 
      broj: [{ value: '', disabled: true }, Validators.required]
    });


    this.searchForm = this.fb.group({
      searchQuery: [''],
      pib: ['', [Validators.minLength(9), Validators.maxLength(9), Validators.required, Validators.pattern('^[0-9]*$')]],
      naziv: ['', Validators.required],
      tekracun: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), 
        Validators.pattern('^[0-9]*$')]],
      sifra: ['', [Validators.pattern('^[0-9]*$')]],
      ime: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(2)]],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]],
      mesto: ['', Validators.required], 
      ulica: [{ value: '', disabled: true }, Validators.required], 
      broj: [{ value: '', disabled: true }, Validators.required]
    });


    this.contractorForm.get('mesto')?.valueChanges.subscribe((value) => {//ima bag kad promenis grad ulica postane izabrana prva i ne radi onChange
      if (value) {
        //izabrano mesto
        const selectedCityPtt = this.contractorForm.get('mesto')?.value
        this.streets=[];
        this.numbers=[];
        this.contractorForm.get('broj')?.reset();
        this.contractorForm.get('broj')?.setValue('');
        this.contractorForm.get('ulica')?.setValue('');
        this.adressService.getAllStreetsByPTT(selectedCityPtt).subscribe((data: street[])=>{
          Object.values(data).forEach((str:street)=>{
            this.streets.push(str)
          })
       })
       //this.contractorForm.get('ulica')?.reset();
       this.contractorForm.get('ulica')?.enable();
        this.contractorForm.get('broj')?.disable();
      } 
    });

    this.contractorForm.get('ulica')?.valueChanges.subscribe((value) => {
      if (value) {
        //izabrana ulica
        this.contractorForm.get('broj')?.enable();
        const selected = this.contractorForm.get('ulica')?.value
        const [ptt, id] = selected.split(',');
        this.numbers=[];
        this.contractorForm.get('broj')?.reset();
        this.adressService.getAllNumbersByPTTAndId(ptt, id).subscribe((data: streetNumber[])=>{
          Object.values(data).forEach((num:streetNumber)=>{
            this.numbers.push(num)
          })
        })
      } 

    });

  }

  onCitySelected(event: any) {//ima bag kad promenis grad ulica postane izabrana prva i ne radi onChange
    this.ulicaDisabled = false;
    this.brojDisabled=true;

    this.mestoSelected = true;
    this.brojSelected = false;
    this.ulicaSelected = false;
    const selectedCityPtt = event.target.value;
    this.streets=[];
    this.numbers=[];
    this.adressService.getAllStreetsByPTT(selectedCityPtt).subscribe((data: street[])=>{
      Object.values(data).forEach((str:street)=>{
        this.streets.push(str)
      })
   })
  }



  onStreetSelected(event: any){
    this.brojDisabled = false;
    this.ulicaSelected = true;
    this.brojSelected = false;
    const selected = event.target.value;
    const [ptt, id] = selected.split(',');
    this.numbers=[];
    this.adressService.getAllNumbersByPTTAndId(ptt, id).subscribe((data: streetNumber[])=>{
      Object.values(data).forEach((num:streetNumber)=>{
        this.numbers.push(num)
      })
  })
  }

  onReset(){
    this.mestoSelected = false;
    this.ulicaSelected = false;
    this.brojSelected = false;
    this.ulicaDisabled = true;
    this.brojDisabled = true;
  }
}
