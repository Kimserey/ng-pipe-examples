import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from './exchange-rate.service';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, merge, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ExchangeRateStorage } from './exchange-rate.storage';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html'
})
export class ExchangeRateComponent implements OnInit {
  input = new FormControl();
  inputCurrency = new FormControl(['EUR']);
  targetCurrency = new FormControl(['EUR']);

  result$: Observable<{ value: number, currencyCode: string }>;

  storage$: Observable<{ value: number, updated: Date }>;

  currencies = [{
    currencyCode: 'CAD',
    description: 'Canadian Doller'
  }, {
    currencyCode: 'EUR',
    description: 'Euro'
  }, {
    currencyCode: 'GBP',
    description: 'Britain Pound'
  }, {
    currencyCode: 'USD',
    description: 'US Dollar'
  }, {
    currencyCode: 'SGD',
    description: 'Singapore Dollar'
  }]

  ngOnInit() {
    this.result$ =
      combineLatest(
        merge(of(1), this.input.valueChanges),
        merge(of('EUR'), this.inputCurrency.valueChanges),
        merge(of('EUR'), this.targetCurrency.valueChanges)
      ).pipe(
        switchMap(([val, inputCur, targetCur]) => this.service.convert(val, inputCur, targetCur))
      );

    this.input.setValue(1);
  }

  constructor(private service: ExchangeRateService, private storage: ExchangeRateStorage) { }
}