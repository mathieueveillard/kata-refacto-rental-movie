import { Rental } from "./Rental";
import { get } from "./util/get";
import { add } from "./util/add";
import { IdentityFunctor } from "./util/IdentityFunctor";

export class Customer {
  private name: string;
  private rentals: Rental[] = [];

  public constructor(name: string) {
    this.name = name;
  }

  public addRental(arg: Rental) {
    this.rentals.push(arg);
  }

  public getName(): string {
    return this.name;
  }

  public statement(): string {
    const rentalData = this.rentals.map((rental) => ({
      filmTitle: rental.getMovieTitle(),
      amountOwed: rental.computeAmountOwed(),
      frequentRenterPoints: rental.computeFrequentRenterPoints(),
    }));

    const totalAmount = rentalData.map(get<number>("amountOwed")).reduce(add);

    const frequentRenterPoints = rentalData
      .map(get<number>("frequentRenterPoints"))
      .reduce(add);

    const rentalStatements = rentalData.map(
      ({ filmTitle, amountOwed }) =>
        "\t" + filmTitle + "\t" + amountOwed.toFixed(1) + "\n"
    );

    return IdentityFunctor("")
      .map(makeHeaderStatement(this.name))
      .map(makeAllRentalsStatement(rentalStatements))
      .map(makeTotalAmountStatement(totalAmount))
      .map(makeFrequentRenterPointsStatement(frequentRenterPoints))
      .valueOf();
  }
}

function makeHeaderStatement(name: string) {
  return function (s: string): string {
    return s + "Rental Record for " + name + "\n";
  };
}

function makeAllRentalsStatement(statements: string[]) {
  return function (s: string): string {
    return s + statements.join("");
  };
}

function makeTotalAmountStatement(totalAmount: number) {
  return function (s: string): string {
    return s + "Amount owed is " + totalAmount.toFixed(1) + "\n";
  };
}

function makeFrequentRenterPointsStatement(frequentRenterPoints: number) {
  return function (s: string): string {
    return s + "You earned " + frequentRenterPoints + " frequent renter points";
  };
}
