import { PriceAndPointsStrategy } from "./Movie";

export class RegularMoviePriceAndPointsStrategy
  implements PriceAndPointsStrategy {
  computeAmountOwed(days: number): number {
    return 2 + Math.max(0, (days - 2) * 1.5);
  }

  computeFrequentRenterPoints(): number {
    return 1;
  }
}

export class NewReleaseMoviePriceAndPointsStrategy
  implements PriceAndPointsStrategy {
  computeAmountOwed(days: number): number {
    return days * 3;
  }

  computeFrequentRenterPoints(days: number): number {
    if (days > 1) {
      return 2;
    }
    return 1;
  }
}

export class ChildrenMoviePriceAndPointsStrategy
  implements PriceAndPointsStrategy {
  computeAmountOwed(days: number): number {
    return 1.5 + Math.max(0, (days - 3) * 1.5);
  }

  computeFrequentRenterPoints(): number {
    return 1;
  }
}
