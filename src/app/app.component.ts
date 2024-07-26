import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyConverterApiService } from './service/currency-converter-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rates: { [key: string]: any } = {}; // Храним курсы валют в объекте
  defaultAmount: number = 100;

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit() {
    this.fetchRates('EUR', 'UAH', this.defaultAmount);
    this.fetchRates('USD', 'UAH', this.defaultAmount);
  }

  async fetchRates(fromCurrency: string, toCurrency: string, amountCurrency: number) {
    try {
      
      const result = await this.currencyService.getRates(fromCurrency, toCurrency, amountCurrency);
      // console.log(result)
      this.rates[`${fromCurrency}_${toCurrency}`] = result; // Храним результат в объекте по ключу валюты

    } catch (error) {
      console.error(`Error fetching currency rates for ${toCurrency}`, error);
    }
  }
}


