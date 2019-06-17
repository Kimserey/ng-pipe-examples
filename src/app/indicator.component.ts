import { OnInit, Component } from '@angular/core';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html'
})
export class IndicatorComponent implements OnInit {
  indicator$: Observable<boolean>;

  ngOnInit() {
    this.indicator$ = 
      merge(
        of(true),
        fromEvent(window, "online"),
        fromEvent(window, "offline")
      ).pipe(
        map(() => navigator.onLine)
      )
  }
}
