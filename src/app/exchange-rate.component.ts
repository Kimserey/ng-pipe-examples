import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from './exchange-rate.service';
import { FormControl } from '@angular/forms';
import { combineLatest, Observable, merge, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html'
})
export class ExchangeRateComponent implements OnInit {
  input = new FormControl([1]);
  inputCurrency = new FormControl(['EUR']);
  targetCurrency = new FormControl(['EUR']);
  
  currencies$: Observable<string[]>;
  result$: Observable<number>;
  rate$: Observable<number>;

  ngOnInit() {
    this.result$ =
      combineLatest(
        merge(of(1), this.input.valueChanges),
        merge(of('EUR'), this.inputCurrency.valueChanges),
        merge(of('EUR'), this.targetCurrency.valueChanges)
      ).pipe(
        switchMap(([val, inputCur, targetCur]) => this.service.convert(val, inputCur, targetCur))
      );

    this.rate$ =
      combineLatest(
        merge(of('EUR'), this.inputCurrency.valueChanges),
        merge(of('EUR'), this.targetCurrency.valueChanges)
      ).pipe(
        switchMap(([inputCur, targetCur]) => this.service.convert(1, inputCur, targetCur))
      );

    this.currencies$ =
        this.service.getCurrencies();
  }

  constructor(private service: ExchangeRateService) { }
}