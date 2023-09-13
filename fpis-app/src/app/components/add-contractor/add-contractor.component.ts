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
  selectedMesto: string = ''; // Initialize with an empty string or default value
selectedUlica: string = '';
selectedBroj: string = '';

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
      console.log("prazan: ",contractors);
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
      const grad = this.cities.find((g)=>g.naziv === contractorData.mesto)
      
      if(grad){
        const ulica = this.streets.find((u)=>u.naziv === contractorData.ulica)
       
        if(ulica){
          const broj = this.numbers.find((b)=>b.broj === contractorData.broj)
         
          if(broj){

            this.conService.getAllContractors().subscribe((c) => {
              
              const contractors: Contractor[] = c;
              console.log(contractors)
              const izvodjacOriginal = contractors.find((con)=> con.pib === contractorData.pib);
              
              if(izvodjacOriginal){

                const contractor = new Contractor(
                  izvodjacOriginal?.id,
                  contractorData.pib,
                  contractorData.naziv,
                  contractorData.tekracun,
                  contractorData.sifra,
                  contractorData.ime,
                  contractorData.jmbg,
                  grad.ptt,
                  ulica.id,
                  broj.broj
                  );
                  
                  this.conService.editContractor(contractor);
                  this.searchForm.reset();
                  this.searchForm.get('mesto')?.disable()
                  this.searchForm.get('ulica')?.disable()
                  this.searchForm.get('broj')?.disable()
                }
                });
              }
            }
          }
        }
  }

  addContractor(event: Event): void {
    event.preventDefault();
    if (this.contractorForm.valid) {
      const contractorData = this.contractorForm.value;
      const [ptt, id] = contractorData.ulica.split(',');
      contractorData.ulica = id;
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

  selectSearchResult(result: any) {//ima dosta nekih bagova ali videcemo, trebalo bi da je sve izabrano i ucitano, samo treba da pise vrednost jos u selectu
    this.searchResults = [];
    this.streets = [];
    this.numbers = [];
    this.searchForm.get('mesto')?.enable()
    this.searchForm.get('ulica')?.enable()
    this.searchForm.get('broj')?.enable()
    const selectedMesto = this.cities.find((city) => city.ptt === result.mesto) as city;
    let selectedUlica: street  = new street("1","1","1");
    let selectedBroj :streetNumber = new streetNumber("1","1","1");
    if(selectedMesto){
      this.adressService.getAllStreetsByPTT(selectedMesto.ptt).subscribe((data: street[]) => {
        Object.values(data).forEach((str: street) => {
          this.streets.push(str);
        });     
       
        this.streets.forEach(str => {
          if(str.id.toString() === result.ulica){
           selectedUlica = str as street;
          }
        });
        if (selectedUlica) {
          const ulicaIdString = (selectedUlica as { id: string }).id;
          const ulicaId = parseInt(ulicaIdString, 10);
          this.adressService.getAllNumbersByPTTAndId(selectedMesto.ptt, ulicaId).subscribe((data: streetNumber[]) => {
            Object.values(data).forEach((num: streetNumber) => {
              this.numbers.push(num);
            });
            let num =  null;
            this.numbers.forEach((nmb)=>{
              if(nmb.broj == result.broj){
                num = nmb as streetNumber
              }
            })          
            if(num){
              selectedBroj = num;
            }

            this.searchForm.patchValue({
              pib: result.pib,
              naziv: result.naziv,
              tekracun: result.tekuciRacun,
              sifra: result.sifra,
              ime:result.imeIprezime,
              jmbg: result.jmbg,
              mesto: selectedMesto.naziv,
              ulica: selectedUlica.naziv,
              broj: selectedBroj.broj
            });
            console.log("***", selectedMesto.naziv, selectedUlica.naziv, selectedBroj.broj);

            this.selectedMesto = selectedMesto.naziv;
            this.selectedUlica = selectedUlica.naziv;
            this.selectedBroj = selectedBroj.broj;
            this.searchForm.get('mesto')?.setValue(selectedMesto.naziv);
            this.searchForm.get('ulica')?.setValue(selectedUlica.naziv);
            this.searchForm.get('broj')?.setValue(selectedBroj.broj);

          });          
        }     
      });
    }
//************************************************************************************************************ */
this.searchForm.get('mesto')?.valueChanges.subscribe((selectedMestoNaziv) => {
  if (selectedMestoNaziv) {

    const selectedCity: city | undefined = this.cities.find((ct) => ct.naziv === selectedMestoNaziv);

    if (selectedCity) {
      this.adressService.getAllStreetsByPTT(selectedCity.ptt).subscribe((data) => {
        this.streets = data;

        this.searchForm.get('ulica')?.valueChanges.subscribe((value) => {
          const selectedStreet =this.streets.find((st)=>{
            return st.naziv === value
          } )

          if (selectedCity && selectedStreet) {
          
            if (selectedCity.ptt && selectedStreet.id) {
              const ulicaIdString = (selectedStreet as { id: string }).id;
              const ulicaId = parseInt(ulicaIdString, 10);
              this.adressService
                .getAllNumbersByPTTAndId(selectedMesto.ptt,ulicaId)
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
  
  toggleForm() {
    this.initializeForms()
    this.showAddForm = !this.showAddForm;
    this.searchForm.get('mesto')?.disable()
    this.searchForm.get('ulica')?.disable()
    this.searchForm.get('broj')?.disable()
    // this.contractorForm.get('broj')?.reset();
    // this.contractorForm.get('ulica')?.reset();
    // this.searchForm.get('ulica')?.reset();
    // this.searchForm.get('ulica')?.reset();
    // this.searchForm.reset();
    // this.contractorForm.reset();
  }

  initializeForms(): void {

    
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
      mesto: [{ value: 'Mesto', disabled: true }, Validators.required],
      ulica: [{ value: 'Ulica', disabled: true }, Validators.required],
      broj: [{ value: 'Broj', disabled: true }, Validators.required]
    });

    this.contractorForm.get('mesto')?.valueChanges.subscribe((value) => {//ima bag kad promenis grad ulica postane izabrana prva i ne radi onChange
      if (value) {
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
       this.contractorForm.get('ulica')?.enable();
        this.contractorForm.get('broj')?.disable();
      } 
    });

    this.contractorForm.get('ulica')?.valueChanges.subscribe((value) => {
      if (value) {
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
    
    //*****************************************search form*********************************************************** *
  }
  
  onReset(){
    this.searchForm.get('mesto')?.disable()
    this.searchForm.get('ulica')?.disable()
    this.searchForm.get('broj')?.disable()
  }
}
