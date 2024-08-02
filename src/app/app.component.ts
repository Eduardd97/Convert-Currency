import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyConverterApiService } from './service/currency-converter-api.service';
import { CurrencyConversionResponse } from './type';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rates: { [key: string]: CurrencyConversionResponse } = {}; // Храним курсы валют в объекте
  defaultAmount: number = 100;

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit() {
    this.fetchRates('EUR', 'UAH', this.defaultAmount);
    this.fetchRates('USD', 'UAH', this.defaultAmount);
  }

  fetchRates(
    fromCurrency: string,
    toCurrency: string,
    amountCurrency: number
  ) {
    this.currencyService
      .getRates({
        from: fromCurrency,
        to: toCurrency,
        amount: amountCurrency,
      })
      .pipe(
        switchMap((result) => {
          this.rates[`${fromCurrency}_${toCurrency}`] = result;
          return of();
        }),
        catchError((error) => {
          console.error(`Error fetching currency rates for ${toCurrency}`, error);
          return of();
        })
      )
      .subscribe();
  }
}
