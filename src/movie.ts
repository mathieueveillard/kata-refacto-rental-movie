export interface PriceAndPointsStrategy {
  computeAmountOwed(days: number): number;
  computeFrequentRenterPoints(days: number): number;
}

export class Movie {
  public constructor(
    public title: string,
    public priceAndPointsStrategy: PriceAndPointsStrategy
  ) {}
}
