import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contractor',
  templateUrl: './add-contractor.component.html',
  styleUrls: ['./add-contractor.component.scss']
})
export class AddContractorComponent implements OnInit {
  contractorForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  addConstractor(event: Event): void {
    event.preventDefault();
   const newContractor = JSON.stringify(this.contractorForm.value, null, 2);
    console.log(newContractor);
    this.contractorForm.reset();
  }
  
  

  initializeForm(): void {
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