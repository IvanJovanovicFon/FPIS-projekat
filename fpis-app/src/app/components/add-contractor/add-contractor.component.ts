import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contractor } from 'src/app/model/contractor';
import { ContractorService } from 'src/app/services/contractor.service';

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


  constructor(private fb: FormBuilder, private conService: ContractorService) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  editContractor(event:Event):void{
    event.preventDefault();
    if (this.searchForm.valid) {
      const contractorData = this.searchForm.value;
      const contractor = new Contractor(
        contractorData.pib,
        contractorData.naziv,
        contractorData.tekracun,
        contractorData.sifra,
        contractorData.ime,
        contractorData.jmbg
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
        contractorData.pib,
        contractorData.naziv,
        contractorData.tekracun,
        contractorData.sifra,
        contractorData.ime,
        contractorData.jmbg
        );
      this.conService.addContractor(contractor);
      this.contractorForm.reset();
    }
  }

  onSearch(): void {
    const query = this.searchForm.value.searchQuery.toLowerCase();
    console.log(query)
  
    if (!query) {
      this.searchResults = [];
      return;
    }
  
    this.conService.getAllContractors().subscribe((contractors: Contractor[]) => {
      this.searchResults = contractors.filter((contractor: Contractor) =>
        contractor.pib.toLowerCase().includes(query) ||
        contractor.naziv.toLowerCase().includes(query)
      );
    });
  }
  

  selectSearchResult(result: any) {
    this.searchResults = [];
    console.log('Selected:', result);
  
    this.searchForm.patchValue({//fali
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
}
