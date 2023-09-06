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
  mestoDisabled:boolean = true;
  ulicaDisabled:boolean = true;
  brojDisabled:boolean = true;
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
    }
  };

  constructor(private fb: FormBuilder, private conService: ContractorService, private adressService: AdressService) {}

  ngOnInit(): void {
    this.adressService.getAllCities().subscribe((data) => {
      Object.values(data).forEach((city: city)=>{
        console.log(city)
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

  addContractor(event: Event): void {
    event.preventDefault();
    if (this.contractorForm.valid) {
      const contractorData = this.contractorForm.value;
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
  }

  initializeForms(): void {
    this.searchForm = this.fb.group({
      searchQuery: [''],
      pib: ['', [Validators.minLength(9), Validators.maxLength(9), Validators.required, Validators.pattern('^[0-9]*$')]],
      naziv: ['', Validators.required],
      tekracun: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), 
        Validators.pattern('^[0-9]*$')]],
      sifra: ['', [Validators.pattern('^[0-9]*$')]],
      ime: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(2)]],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]]
    });



    this.contractorForm = this.fb.group({
      pib: ['', [Validators.minLength(9), Validators.maxLength(9), Validators.required, Validators.pattern('^[0-9]*$')]],
      naziv: ['', Validators.required],
      tekracun: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18), 
        Validators.pattern('^[0-9]*$')]],
      sifra: ['', [Validators.pattern('^[0-9]*$')]],
      ime: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(2)]],
      jmbg: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]],
     
    });

  }
  onCitySelected(event: any) {
    const selectedCityPtt = event.target.value;
//sada ovde pozvati ulicu koja u bazi ima taj grad za id
  }

}
