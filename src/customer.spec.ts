import { Customer } from "./Customer";
import { CustomerBuilder } from "./CustomerBuilder";
import { Movie } from "./Movie";
import { Rental } from "./Rental";
import {
  RegularMoviePriceAndPointsStrategy,
  NewReleaseMoviePriceAndPointsStrategy,
  ChildrenMoviePriceAndPointsStrategy,
} from "./PriceAndPointsStrategy";

describe("Legacy tests", () => {
  it("testCustomer", () => {
    const c = new CustomerBuilder().build();
    expect(c).toBeDefined();
  });

  it("testAddRental", () => {
    const customer2 = new CustomerBuilder().withName("Julia").build();
    const movie1 = new Movie(
      "Gone with the Wind",
      new RegularMoviePriceAndPointsStrategy()
    );
    const rental1 = new Rental(movie1, 3);
    customer2.addRental(rental1);
  });

  it("testGetName", () => {
    const c = new Customer("David");
    expect(c.getName()).toBe("David");
  });

  it("statementForRegularMovie", () => {
    const movie1 = new Movie(
      "Gone with the Wind",
      new RegularMoviePriceAndPointsStrategy()
    );
    const rental1 = new Rental(movie1, 3);
    const customer2 = new CustomerBuilder()
      .withName("Sallie")
      .withRentals(rental1)
      .build();
    const expected =
      "Rental Record for Sallie\n" +
      "\tGone with the Wind\t3.5\n" +
      "Amount owed is 3.5\n" +
      "You earned 1 frequent renter points";
    const statement = customer2.statement();
    expect(statement).toBe(expected);
  });

  it("statementForNewReleaseMovie", () => {
    const movie1 = new Movie(
      "Star Wars",
      new NewReleaseMoviePriceAndPointsStrategy()
    );
    const rental1 = new Rental(movie1, 3);
    const customer2 = new CustomerBuilder()
      .withName("Sallie")
      .withRentals(rental1)
      .build();
    const expected =
      "Rental Record for Sallie\n" +
      "\tStar Wars\t9.0\n" +
      "Amount owed is 9.0\n" +
      "You earned 2 frequent renter points";
    const statement = customer2.statement();
    expect(statement).toBe(expected);
  });

  it("statementForChildrensMovie", () => {
    const movie1 = new Movie(
      "Madagascar",
      new ChildrenMoviePriceAndPointsStrategy()
    );
    const rental1 = new Rental(movie1, 3);
    const customer2 = new CustomerBuilder()
      .withName("Sallie")
      .withRentals(rental1)
      .build();
    const expected =
      "Rental Record for Sallie\n" +
      "\tMadagascar\t1.5\n" +
      "Amount owed is 1.5\n" +
      "You earned 1 frequent renter points";
    const statement = customer2.statement();
    expect(statement).toBe(expected);
  });

  it("statementForManyMovies", () => {
    const movie1 = new Movie(
      "Madagascar",
      new ChildrenMoviePriceAndPointsStrategy()
    );
    const rental1 = new Rental(movie1, 6);
    const movie2 = new Movie(
      "Star Wars",
      new NewReleaseMoviePriceAndPointsStrategy()
    );
    const rental2 = new Rental(movie2, 2);
    const movie3 = new Movie(
      "Gone with the Wind",
      new RegularMoviePriceAndPointsStrategy()
    );
    const rental3 = new Rental(movie3, 8);
    const customer1 = new CustomerBuilder()
      .withName("David")
      .withRentals(rental1, rental2, rental3)
      .build();
    const expected =
      "Rental Record for David\n" +
      "\tMadagascar\t6.0\n" +
      "\tStar Wars\t6.0\n" +
      "\tGone with the Wind\t11.0\n" +
      "Amount owed is 23.0\n" +
      "You earned 4 frequent renter points";
    const statement = customer1.statement();
    expect(statement).toBe(expected);
  });

  // TODO make test for price breaks in code.
});

describe("Test of Rental#computeAmountOwed()", function () {
  describe("For regular movies", function () {
    it("should return a fixed price if the movie is rented for 1 day", function () {
      const movie = new Movie(
        "Regular Movie",
        new RegularMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 1);
      expect(rental.computeAmountOwed()).toEqual(2);
    });

    it("should return a fixed price if the movie is rented for 2 days", function () {
      const movie = new Movie(
        "Regular Movie",
        new RegularMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 2);
      expect(rental.computeAmountOwed()).toEqual(2);
    });

    it("should return the fixed price + an amount proportional to the number of days after", function () {
      const movie = new Movie(
        "Regular Movie",
        new RegularMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 5);
      expect(rental.computeAmountOwed()).toEqual(2 + (5 - 2) * 1.5);
    });
  });

  describe("For new release movies", function () {
    it("should return a price proportional to the number of days", function () {
      const movie = new Movie(
        "New Release Movie",
        new NewReleaseMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 1);
      expect(rental.computeAmountOwed()).toEqual(3);
    });

    it("should return a price proportional to the number of days", function () {
      const movie = new Movie(
        "New Release Movie",
        new NewReleaseMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 2);
      expect(rental.computeAmountOwed()).toEqual(6);
    });
  });

  describe("For new children movies", function () {
    it("should return a fixed price if the movie is rented for 1 day", function () {
      const movie = new Movie(
        "Children Movie",
        new ChildrenMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 1);
      expect(rental.computeAmountOwed()).toEqual(1.5);
    });

    it("should return a fixed price if the movie is rented for 3 days", function () {
      const movie = new Movie(
        "Children Movie",
        new ChildrenMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 3);
      expect(rental.computeAmountOwed()).toEqual(1.5);
    });

    it("should return the fixed price + an amount proportional to the number of days after", function () {
      const movie = new Movie(
        "Children Movie",
        new ChildrenMoviePriceAndPointsStrategy()
      );
      const rental = new Rental(movie, 4);
      expect(rental.computeAmountOwed()).toEqual(1.5 + (4 - 3) * 1.5);
    });
  });
});

describe("Test of Rental#computeFrequentRenterPoints()", function () {
  it("should compute 1 point for a new release movie rented during 1 day", function () {
    const movie = new Movie(
      "New Release Movie",
      new NewReleaseMoviePriceAndPointsStrategy()
    );
    const rental = new Rental(movie, 1);
    expect(rental.computeFrequentRenterPoints()).toEqual(1);
  });

  it("should compute 2 points for a new release movie rented during more than 1 day", function () {
    const movie = new Movie(
      "New Release Movie",
      new NewReleaseMoviePriceAndPointsStrategy()
    );
    const rental = new Rental(movie, 3);
    expect(rental.computeFrequentRenterPoints()).toEqual(2);
  });

  it("should compute 1 point for every other kind of film and rental duration", function () {
    const movie = new Movie(
      "Regular Movie",
      new RegularMoviePriceAndPointsStrategy()
    );
    const rental = new Rental(movie, 2);
    expect(rental.computeFrequentRenterPoints()).toEqual(1);
  });

  it("should compute 1 point for every other kind of film and rental duration", function () {
    const movie = new Movie(
      "Regular Movie",
      new RegularMoviePriceAndPointsStrategy()
    );
    const rental = new Rental(movie, 3);
    expect(rental.computeFrequentRenterPoints()).toEqual(1);
  });

  it("should compute 1 point for every other kind of film and rental duration", function () {
    const movie = new Movie(
      "Children Movie",
      new ChildrenMoviePriceAndPointsStrategy()
    );
    const rental = new Rental(movie, 1);
    expect(rental.computeFrequentRenterPoints()).toEqual(1);
  });

  it("should compute 1 point for every other kind of film and rental duration", function () {
    const movie = new Movie(
      "Children Movie",
      new ChildrenMoviePriceAndPointsStrategy()
    );
    const rental = new Rental(movie, 3);
    expect(rental.computeFrequentRenterPoints()).toEqual(1);
  });
});
