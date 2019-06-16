import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Observable, from, ReplaySubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

interface ExchangeRateDB extends DBSchema {
  'rates': {
    key: string,
    value: {
      value: number,
      updated: Date
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateStorage {
  getDb(): Observable<IDBPDatabase<ExchangeRateDB>> {
    return from(
      openDB<ExchangeRateDB>('exchange-rate-db', 1, {
        upgrade(db) {
          db.createObjectStore('rates');
        }
      })
    );
  }

  getRate(currencyCode: string): Observable<{ value: number, updated: Date }> {
    const subject =
      new ReplaySubject<{ value: number, updated: Date }>();

    return this.getDb().pipe(
      switchMap(db => {
        db.get('rates', currencyCode)
          .then(val => {
            if(!!val)
              subject.next(val);
          });
        
        this.retrieveRate(currencyCode)
          .then(val => {
            const value = {
              value: val,
              updated: new Date()
            };

            db.put('rates', value, currencyCode);
            subject.next(value);
          });

        return subject;
      })
    );
  }

  private async retrieveRate(currencyCode: string): Promise<number> {
    var values = await this.http.get<{ isoA3Code: string, value: number }[]>("/api").toPromise();
    return values.find(v => v.isoA3Code == currencyCode).value;
  }

  constructor(private http: HttpClient) { }
}
