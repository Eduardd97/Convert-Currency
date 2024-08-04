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
  amountFrom: number | null = null;
  amountTo: number | null = null;

  private currencyChange$ = new Subject<void>();
  private isUpdating: boolean = false;
  private debounceTimeMs: number = 1000; // Задержка перед конвертацией
  private lastChangedInput: 'amountFrom' | 'amountTo' | null = null;

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies()
      .pipe(
        tap(response => {
          if (response.success) {
            this.currencies = Object.keys(response.result);
          }
        }),
        catchError(error => {
          console.error('Error fetching currencies:', error);
          return of(null);
        })
      )
      .subscribe();

    this.currencyChange$
      .pipe(
        debounceTime(this.debounceTimeMs), // Устанавливаем задержку
        switchMap(() => this.convertCurrency()),
        catchError(error => {
          console.error('Error during currency conversion:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  convertCurrency(): Observable<void> {
    // Проверяем совпадают ли валюта "из" и валюта "в"
    if (this.currencyFrom === this.currencyTo) {
      if (this.amountFrom !== null) {
        if (!this.isUpdating) {
          this.isUpdating = true;
          this.amountTo = this.amountFrom;
          this.isUpdating = false;
        }
      } else if (this.amountTo !== null) {
        if (!this.isUpdating) {
          this.isUpdating = true;
          this.amountFrom = this.amountTo;
          this.isUpdating = false;
        }
      }
      return of(); // Возвращаем Observable без значений, если валюты совпадают
    }

    // Определяем, какой инпут был последним изменён и выполняем конвертацию
    if (this.lastChangedInput === 'amountFrom' && this.amountFrom !== null && this.amountFrom > 0) {
      const params: CurrencyConversionParams = {
        from: this.currencyFrom,
        to: this.currencyTo,
        amount: this.amountFrom,
      };

      return this.currencyService.getRates(params)
        .pipe(
          tap(response => {
            if (!this.isUpdating) {
              this.isUpdating = true;
              this.amountTo = response.result;
              this.isUpdating = false;
            }
          }),
          map(() => void 0)
        );
    }

    if (this.lastChangedInput === 'amountTo' && this.amountTo !== null && this.amountTo > 0) {
      const reverseParams: CurrencyConversionParams = {
        from: this.currencyTo,
        to: this.currencyFrom,
        amount: this.amountTo,
      };

      return this.currencyService.getRates(reverseParams)
        .pipe(
          tap(response => {
            if (!this.isUpdating) {
              this.isUpdating = true;
              this.amountFrom = response.result;
              this.isUpdating = false;
            }
          }),
          map(() => void 0)
        );
    }

    return of(); // Возвращаем Observable без значений, если нет данных для конвертации
  }

  onCurrencyChangeFrom(value: string) {
    this.currencyFrom = value;
    this.triggerConversionWithDelay(); // Запускаем конвертацию с задержкой
  }

  onCurrencyChangeTo(value: string) {
    this.currencyTo = value;
    this.triggerConversionWithDelay(); // Запускаем конвертацию с задержкой
  }

  onAmountChangeFrom(value: number | null) {
    this.amountFrom = value;
    if (this.amountFrom === null || this.amountFrom === 0) {
      this.amountTo = null; // Очистка второго инпута при удалении значения
    }
    this.lastChangedInput = 'amountFrom'; // Отмечаем, что изменился первый инпут
    this.triggerConversionWithDelay(); // Запускаем конвертацию с задержкой
  }

  onAmountChangeTo(value: number | null) {
    this.amountTo = value;
    if (this.amountTo === null || this.amountTo === 0) {
      this.amountFrom = null; // Очистка первого инпута при удалении значения
    }
    this.lastChangedInput = 'amountTo'; // Отмечаем, что изменился второй инпут
    this.triggerConversionWithDelay(); // Запускаем конвертацию с задержкой
  }

  private triggerConversionWithDelay() {
    // Запускаем конвертацию через задержку
    setTimeout(() => {
      this.currencyChange$.next(); // Триггерим изменение
    }, this.debounceTimeMs);
  }
}







