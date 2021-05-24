export interface IPaidTaxDetails {
  row: number;
  paymentDate: string;
  paymentMethod: "Card" | "Cash";
  bankName: "BIBD" | "Baiduri";
  amount: string;
  currencyType: "BND" | "USD";
  exchangeRate: string;
  amountBND: string;
}

export interface IFillH1 {
  currency?: "BND" | "USD";
  d3?: string;
  g2?: string;
}
