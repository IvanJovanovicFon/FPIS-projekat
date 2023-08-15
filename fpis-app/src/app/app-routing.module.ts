import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContractorComponent } from './components/add-contractor/add-contractor.component';
import { AccountPageComponent } from './components/account-page/account-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contractors', component: ContractorComponent },
  { path: 'accounts', component: AccountPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
