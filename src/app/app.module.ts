import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ExchangeRateComponent } from './exchange-rate.component';
import { IndicatorComponent } from './indicator.component';

@NgModule({
  declarations: [
    AppComponent,
    ExchangeRateComponent,
    IndicatorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
