import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterApiService {
  private axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: 'https://currency-converter-pro1.p.rapidapi.com/convert',
      headers: {
        'x-rapidapi-key': '9ebb47f7c6mshfe8c805d52bddacp1f9a17jsnd085d3940efd',
        'x-rapidapi-host': 'currency-converter-pro1.p.rapidapi.com',
      },
    });
  }

  async getRates(fromCurrency: string, toCurrency: string, amountCurrency: number): Promise<any> {
    try {
      const response = await this.axiosClient.get('', {
        params: { from: fromCurrency,
          to: toCurrency,
          amount: amountCurrency },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching currency rates', error);
      throw error;
    }
  }
}
