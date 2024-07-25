import { TestBed } from '@angular/core/testing';

import { CurrencyConverterApiService } from './currency-converter-api.service';

describe('CurrencyConverterApiService', () => {
  let service: CurrencyConverterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyConverterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
