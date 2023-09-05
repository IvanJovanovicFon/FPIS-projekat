import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContractorComponent } from './components/add-contractor/add-contractor.component';
import { AccountPageComponent } from './components/account-page/account-page.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CarouselModule } from '@coreui/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ContractorComponent,
    AccountPageComponent,
    CarouselComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule ,
    CarouselModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
