import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrenciesResponse, CurrencyConversionParams, CurrencyConversionResponse } from '../type';
import { environment, environmentCurrencies } from '../../enviroument/environment';


@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterApiService {
  private baseUrl: string = environment.apiUrl;
  private headers = {
    'x-rapidapi-key': environment.apiKey,
    'x-rapidapi-host': environment.apiHost,
  };

  constructor(private http: HttpClient) {}

  getRates(params: CurrencyConversionParams): Observable<CurrencyConversionResponse> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    return this.http.get<CurrencyConversionResponse>(this.baseUrl, {
      headers: this.headers,
      params: httpParams,
    });
  }

  private apiUrlCurrencies = environmentCurrencies.apiUrlCurrencies;
  private headersCurrencies = new HttpHeaders({
    'x-rapidapi-key': environmentCurrencies.apiKeyCurrencies,
    'x-rapidapi-host': environmentCurrencies.apiHostCurrencies
  });

  getCurrencies(): Observable<CurrenciesResponse> {
    return this.http.get<CurrenciesResponse>(this.apiUrlCurrencies, { headers: this.headersCurrencies });
  }
}

