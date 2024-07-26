import { Component, OnInit } from '@angular/core';
import { CurrencyConverterApiService } from '../service/currency-converter-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css'],
})
export class CurrencyConverterComponent implements OnInit {
  currencies = ['UAH', 'USD', 'EUR', 'PLN', 'CHF', 'JPY', 'GBP'];
  currencyFrom: string = '';
  currencyTo: string = '';
  amountFrom: number = 0;
  amountTo: number = 0;

  private debounceTimeout: any;

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit(): void {
    if (this.currencyFrom && this.currencyTo) {
      this.convertCurrency();
    }
  }

  async convertCurrency() {
    if (
      !this.currencyFrom ||
      !this.currencyTo ||
      this.currencyFrom === 'Выберите Валюту' ||
      this.currencyTo === 'Выберите Валюту'
    ) {
      return;
    }

    if (this.currencyTo === this.currencyFrom) {
      this.amountTo = this.amountFrom;
      return;
    } else if (this.currencyFrom === this.currencyTo) {
      this.amountFrom = this.amountTo;
    }

    try {
      if (this.amountTo) {
        const responseToFrom = await this.currencyService.getRates(
          this.currencyTo,
          this.currencyFrom,
          this.amountTo
        );
        this.amountFrom = responseToFrom.result;
      } else if (this.amountFrom) {
        const responseFromTo = await this.currencyService.getRates(
          this.currencyFrom,
          this.currencyTo,
          this.amountFrom
        );
        this.amountTo = responseFromTo.result;
      }
    } catch (error) {
      console.error('Error during currency conversion:', error);
    }
  }

  onCurrencyChangeFrom(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currencyFrom = selectElement.value;
    
    this.debounceConvertCurrency();  
  }

  onCurrencyChangeTo(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currencyTo = selectElement.value;
    
    this.debounceConvertCurrency();  
  }

  onAmountChange(value: number) {  
    this.amountFrom = value;  

    // Устанавливаем debounce  
    this.debounceConvertCurrency();  
  }  

  private debounceConvertCurrency() {  
    // Очистить таймер, если он существует  
    if (this.debounceTimeout) {  
      clearTimeout(this.debounceTimeout);  
    }  

    // Установить новый таймер на 500 мс (или любое другое время, которое вам подходит)  
    this.debounceTimeout = setTimeout(() => {  
      this.convertCurrency();  
    }, 1000);  
  } 
}
