import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddContractorComponent } from './components/add-contractor/add-contractor.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-contractor', component: AddContractorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
