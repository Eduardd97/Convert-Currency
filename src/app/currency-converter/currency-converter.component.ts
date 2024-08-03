import { Component, OnInit } from '@angular/core';
import { CurrencyConverterApiService } from '../service/currency-converter-api.service';
import { FormsModule } from '@angular/forms';
import { CurrencyConversionParams } from '../type';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError, tap } from 'rxjs/operators';
import { AppSelectComponent } from '../app-select/app-select.component';
import { map } from 'rxjs/operators';
import { AppInputComponent } from '../app-input/app-input.component';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [FormsModule, AppInputComponent, AppSelectComponent],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css'],
})
export class CurrencyConverterComponent implements OnInit {
  currencies: string[] = [];
  currencyFrom: string = '';
  currencyTo: string = '';
  amountFrom: number = 0;
  amountTo: number = 0;

  private currencyChange$ = new Subject<void>();

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies()
    .pipe(
      tap(response => {
        if (response.success) {
          this.currencies = Object.keys(response.result); // Используем ключи объекта как список валют
        }
      }),
      catchError((error) => {
        console.error('Error fetching currencies:', error);
        return of(null);
      })
    )
    .subscribe();

    this.currencyChange$
      .pipe(
        debounceTime(500),
        switchMap(() => this.convertCurrency()),
        catchError((error) => {
          console.error('Error during currency conversion:', error);
          return of(null); // Пустое значение, если произошла ошибка
        })
      )
      .subscribe();
  }

  convertCurrency(): Observable<void> {
    if (
      !this.currencyFrom ||
      !this.currencyTo ||
      this.currencyFrom === 'Select Currency' ||
      this.currencyTo === 'Select Currency'
      
    ) {
      return of(); // Возвращаем Observable без значений
    }

    if (this.currencyTo === this.currencyFrom) {
      this.amountTo = this.amountFrom;
      return of(); // Ничего не делаем, если валюты совпадают
    } else if (this.currencyFrom === this.currencyTo) {
      this.amountFrom = this.amountTo;
    }

    const params: CurrencyConversionParams = {
      from: this.currencyFrom,
      to: this.currencyTo,
      amount: this.amountFrom,
    };

    if (this.amountTo) {
      return this.currencyService
        .getRates({
          ...params,
          to: this.currencyTo,
          from: this.currencyFrom,
          amount: this.amountTo,
        })
        .pipe(
          tap((response) => {
            this.amountFrom = response.result;
          }),
          map(() => void 0)
        );
    } else if (this.amountFrom) {
      return this.currencyService
        .getRates(params)
        .pipe(
          tap((response) => {
            this.amountTo = response.result;
          }),
          map(() => void 0)
        );
    }

    return of(); // Возвращаем Observable без значений, если нет данных для конвертации
  }

  onCurrencyChangeFrom(value: string) {
    this.currencyFrom = value;
    this.currencyChange$.next(); // Триггерим изменение
  }
  
  onCurrencyChangeTo(value: string) {
    this.currencyTo = value;
    this.currencyChange$.next(); // Триггерим изменение
  }

  onAmountChange(value: number) {
    this.amountFrom = value;
    this.currencyChange$.next(); // Триггерим изменение
  }
}


