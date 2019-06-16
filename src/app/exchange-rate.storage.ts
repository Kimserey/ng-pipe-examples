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

interface StaleWhileRevalidateOptions<T> {
  fetch(): Promise<T>;
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

  staleWhileRevalidate<T>(key, store, options: StaleWhileRevalidateOptions<T>) {
    const subject =
      new ReplaySubject<T>();

    return this.getDb().pipe(
      switchMap(db => {
        db.get(store, key)
          .then(val => { if (!!val) subject.next(val); })
          .catch(reason => console.log("IndexedDB error", reason))
          .then(() =>
            options.fetch()
              .then(val => {
                subject.next(val);
                db.put(store, val, key)
                  .catch(reason => console.log("IndexedDB error", reason))
              })
              .catch(() => console.log("Offline"))
          );

        return subject;
      })
    );
  }

  getRate(currencyCode: string): Observable<{ value: number, updated: Date }> {
    return this.staleWhileRevalidate<{ value: number, updated: Date }>(currencyCode, 'rates', {
      fetch() {
        return this.fetchRate(currencyCode);
      }
    }
    );
  }

  private async fetchRate(currencyCode: string): Promise<number> {
    var values = await this.http.get<{ isoA3Code: string, value: number }[]>("/api").toPromise();
    return values.find(v => v.isoA3Code == currencyCode).value;
  }

  constructor(private http: HttpClient) { }
}
