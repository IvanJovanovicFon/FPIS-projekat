import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContractorComponent } from './components/add-contractor/add-contractor.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { EditContractorComponent } from './components/edit-contractor/edit-contractor.component';
import { ViewAccountsComponent } from './components/view-accounts/view-accounts.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'contractors', component: ContractorComponent },
  { path: 'accounts', component: AccountPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contractorView', component: EditContractorComponent },
  { path: 'accountsView', component: ViewAccountsComponent },
 
 { path: 'home', component: HomeComponent,

 canActivate: [AuthGuard],

},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }