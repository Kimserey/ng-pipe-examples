import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { get, set } from 'idb-keyval';

interface StaleWhileRevalidateOptions<T> {
  fetch(): Promise<T>;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateStorage {
  staleWhileRevalidate<T>(key, options: StaleWhileRevalidateOptions<T>) {
    const subject =
      new ReplaySubject<T>();

    get<T>(key)
      .then(val => { if (!!val) subject.next(val); })
      .catch(reason => console.log("IndexedDB error", reason))
      .then(() =>
        options.fetch()
          .then(val => {
            subject.next(val);
            set(key, val)
              .catch(reason => console.log("IndexedDB error", reason))
          })
          .catch(() => console.log("Offline"))
      );

    return subject;
  }

  getRate(currencyCode: string): Observable<{ value: number, updated: Date }> {
    var fetch = () => this.fetchRate(currencyCode);
    return this.staleWhileRevalidate<{ value: number, updated: Date }>(currencyCode, { fetch });
  }

  private async fetchRate(currencyCode: string): Promise<{ value: number, updated: Date }> {
    var values = await this.http.get<{ isoA3Code: string, value: number }[]>("/api").toPromise();
    return {
      value: values.find(v => v.isoA3Code == currencyCode).value,
      updated: new Date()
    };
  }

  constructor(private http: HttpClient) { }
}
