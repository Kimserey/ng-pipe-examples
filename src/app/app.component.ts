import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  negativeAmount: number = -123.105;
  amount: number = 123.10545;

  today: Date = new Date();

  decimalValue: number = 123.432432;
  
  i18nValueMap: any = {
    'male': 'He',
    'female': 'She'
  };

  gender: string = 'female';

  i18nPluralValue: number = 3;

  // http://userguide.icu-project.org/formatparse/messages
  i18nPluralValueMap: any = {
    '=0': 'Nothing',
    '=1': 'We have one',
    'other': 'We have a few'
  };

  objValue: any = {
    one: 'Hello',
    two: 'Bye'
  };

  phrase: string = 'Hello this is a test';

  percentage: number = 0.15345;
}
