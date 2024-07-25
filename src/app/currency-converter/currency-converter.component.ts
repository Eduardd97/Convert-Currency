import { Component, OnInit } from '@angular/core';
import { CurrencyConverterApiService } from '../service/currency-converter-api.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  currencies = ['UAH', 'USD', 'EUR'];
  currencyFrom: string = 'UAH';
  currencyTo: string = 'USD';
  amountFrom: number = 100;
  amountTo: number = 0;

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit(): void {
    this.convertCurrency();
  }

  async convertCurrency() {
    if (this.currencyFrom === this.currencyTo) {
      this.amountTo = this.amountFrom;
      return;
    }
    
    try {
      // Convert amountFrom to currencyTo
      const responseFromTo = await this.currencyService.getRates(this.currencyFrom, this.currencyTo, this.amountFrom.toString());
      this.amountTo = responseFromTo.result; // Обновите в соответствии с структурой ответа

      // Convert amountTo to currencyFrom (to keep both directions in sync)
      const responseToFrom = await this.currencyService.getRates(this.currencyTo, this.currencyFrom, this.amountTo.toString());
      this.amountFrom = responseToFrom.result; // Обновите в соответствии с структурой ответа
    } catch (error) {
      console.error('Error during currency conversion:', error);
    }
  }
}

