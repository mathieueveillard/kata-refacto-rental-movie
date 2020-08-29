import { Movie } from "./Movie";

export class Rental {
  public constructor(private movie: Movie, private daysRented: number) {}

  public getMovieTitle(): string {
    return this.movie.title;
  }

  public computeAmountOwed(): number {
    return this.movie.priceAndPointsStrategy.computeAmountOwed(this.daysRented);
  }

  public computeFrequentRenterPoints(): number {
    return this.movie.priceAndPointsStrategy.computeFrequentRenterPoints(
      this.daysRented
    );
  }
}
