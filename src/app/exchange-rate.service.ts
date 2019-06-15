import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  getCurrencies(): Observable<string[]> {
    return this.http
      .get<{ country: string, isoA3Code: string, value: number }[]>("/api")
      .pipe(
        map(rates => {
          var codes = rates.map(r => r.isoA3Code)
          return codes.filter((cur, index) => codes.indexOf(cur) === index);
        })
      );
  }
  
  // Base is in EUR.
  // (1 / EURCUR) * EURTAR = CURTAR
  convert(value: number, currencyCode: string, targetCode: string): Observable<number> {
    return this.http
        .get<{ country: string, isoA3Code: string, value: number }[]>("/api")
        .pipe(
          map(rates => {
            return {
              rate: rates.find(x => x.isoA3Code === currencyCode).value,
              targetRate: rates.find(x => x.isoA3Code === targetCode).value
            }
          }),
          map(rates => {
            return (value / rates.rate) * rates.targetRate;
          })
        );
  }

  constructor(private http: HttpClient) { }
}
