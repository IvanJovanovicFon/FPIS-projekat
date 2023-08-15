import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contractor } from 'src/app/model/contractor';
import { ContractorService } from 'src/app/services/contractor.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public constructor(private conService: ContractorService, private fb: FormBuilder){}

  contractors: Contractor[] = [];
  addAccountForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    const currentDate = new Date(); 
    this.conService.getAllContractors().subscribe((contractors)=>{
      this.contractors = contractors;
    });
  
    this.addAccountForm = this.fb.group({
      id: [''],
      broj: [''],
      objekat: [''],
      realizacija: [''],
      investitor: [''],
      datumIspos: [currentDate, Validators.required],
      datumIzdav: [currentDate, Validators.required],
      datumPromet: [currentDate, Validators.required],
      kolicina: [''],
      cena: [''],
      opis: ['']
    });
  }

}
