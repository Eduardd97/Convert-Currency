export type CurrencyConversionParams = {
  from: string;
  to: string;
  amount: number;
  [key: string]: string | number;
};

export type CurrencyConversionResponse = {
  success: boolean;
  request: {
    from: string;
    to: string;
    amount: number;
  };
  meta: {
    timestamp: number;
    rates: {
      from: number;
      to: number;
    };
    formated: {
      from: string;
      to: string;
    };
  };
  result: number;
};

export type CurrenciesResponse = {
  success: boolean;
  result: {
    [currencyCode: string]: string;
  };
};