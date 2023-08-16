import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job } from 'src/app/model/Job';
import { Account } from 'src/app/model/account';
import { Contractor } from 'src/app/model/contractor';
import { ContractorService } from 'src/app/services/contractor.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  public constructor(private conService: ContractorService, private fb: FormBuilder){}

  contractors: Contractor[] = [];
  addAccountForm!: FormGroup;
  posaoGroup!: FormGroup;
  jobs: Job[] = [];
  validAddAcount: boolean = false;

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    const currentDate = new Date(); 
    this.conService.getAllContractors().subscribe((contractors)=>{
      this.contractors = contractors;
    });
  
    this.addAccountForm = this.fb.group({
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
        kolicina: ['', [Validators.min(0)]],
        cena: ['', [Validators.min(0)]],
        opis: ['']
      })
    });
  }

  addAccount(): void {
    const newAccount: Account = {
      predracun:this.addAccountForm.get('predracun')?.value,
      izvodjac:this.addAccountForm.get('izvodjac')?.value,
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
  
    console.log(newAccount);
  }
  

  addJob(): void {
    const posaoGroup = this.addAccountForm.get('posao');
    if (posaoGroup) {
      const newJob: Job = {
        vrsta: posaoGroup.get('vrsta')?.value || '',
        podvrsta: posaoGroup.get('podvrsta')?.value || '',
        jedinicaMere: posaoGroup.get('jedinicaMere')?.value || '',
        kolicina: posaoGroup.get('kolicina')?.value || 0,
        cena: posaoGroup.get('cena')?.value || 0,
        opis: posaoGroup.get('opis')?.value || 'nema opisa',
      };

      console.log(newJob)
      this.jobs.push(newJob);
      posaoGroup.get('kolicina')?.setValue("");
      posaoGroup.get('cena')?.setValue("");
      posaoGroup.get('opis')?.setValue("");
    }

    console.log(this.addAccountForm)
  }

  
  removeJob(index: number): void {
    this.jobs.splice(index, 1);
  }

}
