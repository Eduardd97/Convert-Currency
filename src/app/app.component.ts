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

  constructor(private currencyService: CurrencyConverterApiService) {}

  ngOnInit() {
    this.fetchRates('UAH', 'EUR', '100');
    this.fetchRates('UAH', 'USD', '100');
  }

  async fetchRates(fromCurrency: string, toCurrency: string, amountCurrency: string) {
    try {
      
      const result = await this.currencyService.getRates(fromCurrency, toCurrency, amountCurrency);
      console.log(result)
      this.rates[toCurrency] = result; // Храним результат в объекте по ключу валюты

    } catch (error) {
      console.error(`Error fetching currency rates for ${toCurrency}`, error);
    }
  }
}

