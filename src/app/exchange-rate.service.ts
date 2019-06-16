import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { ExchangeRateStorage } from './exchange-rate.storage';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  // Base currency in EUR.
  // (1 / EURCUR) * EURTAR = CURTAR
  convert(value: number, currencyCode: string, targetCode: string): Observable<number> {
    return combineLatest(
      this.storage.getRate(currencyCode),
      this.storage.getRate(targetCode)
    ).pipe(
      map(([cur, tar]) => {
        return (value / cur.value) * tar.value;
      })
    );
  }

  constructor(private storage: ExchangeRateStorage) { }
}
