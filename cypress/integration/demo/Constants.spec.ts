import faker from "faker";
import {
  calculateSum,
  calculateSubtraction,
  calculateMultiplication,
  calculateDivision,
} from "./Constants";

describe("Constant", () => {
  context("Calculate Sum", () => {
    it("should get total sum of simple array", () => {
      // Arrange
      const numbers = [
        1432.23,
        4325.43,
        2463.4,
        null,
        2364.55,
        0,
        3255,
        3246.3,
        -1020.3,
      ];

      // Act
      const totalNumber = calculateSum(numbers);

      // Assert
      expect(totalNumber).to.equal(16066.61);
    });

    it("should get total sum of array of object", () => {
      // Arrange
      const numbers = [
        { number: 1432.23 },
        { number: 4325.43 },
        { number: 2463.4 },
        { number: null },
        { number: 2364.55 },
        { number: 0 },
        { number: 3255 },
        { number: 3246.3 },
        { number: -1020.3 },
      ];

      // Act
      const totalNumber = calculateSum(numbers, "number");

      // Assert
      expect(totalNumber).to.equal(16066.61);
    });

    it("should sum collection's item with nested object", () => {
      // Arrange
      const persons = [
        { income: { work: { net: 5 } } },
        { income: { work: { net: 5 } } },
        { income: { work: { net: 5 } } },
        { income: { work: { net: 5 } } },
        { income: { work: { net: 5 } } },
      ];

      // Act
      const totalNumber = calculateSum(persons, "income.work.net");

      // Assert
      expect(totalNumber).to.equal(25);
    });

    context("regression test", () => {
      Array.from({ length: 5 })
        .fill("")
        .forEach((test) => {
          it("should return either in X+ , X+.X or X+.XX format", () => {
            // Arrange
            const numbers = Array.from(
              { length: 40 },
              () => +faker.finance.amount()
            );

            // Act
            const totalNumber = calculateSum(numbers);

            // Assert
            cy.log(totalNumber.toString());
            assert.match(
              totalNumber,
              /\-?\d+\.?\d{0,2}$/,
              "calculate Sum matches"
            );
          });
        });
    });
  });

  context("Calculate Subtraction", () => {
    it("should get subtraction of simple array", () => {
      // Arrange
      const numbers = [1432.23, null, 0, 230.1, -1.1];

      // Act
      const totalNumber = calculateSubtraction(numbers);

      // Assert
      expect(totalNumber).to.equal(1203.23);
    });

    it("should get subtraction of array of object", () => {
      // Arrange
      const numbers = [
        { number: 1432.23 },
        { number: null },
        { number: 0 },
        { number: 230.1 },
        { number: -1.1 },
      ];

      // Act
      const totalNumber = calculateSubtraction(numbers, "number");

      // Assert
      expect(totalNumber).to.equal(1203.23);
    });

    it("should subtract collection's item with nested object", () => {
      // Arrange
      const persons = [
        { income: { work: { net: 50 } } },
        { income: { work: { net: 10 } } },
        { income: { work: { net: 10 } } },
      ];

      // Act
      const totalNumber = calculateSubtraction(persons, "income.work.net");

      // Assert
      expect(totalNumber).to.equal(30);
    });

    context("regression test", () => {
      Array.from({ length: 5 })
        .fill("")
        .forEach((test) => {
          it("should return either in X+ , X+.X or X+.XX format", () => {
            // Arrange
            const numbers = Array.from(
              { length: 40 },
              () => +faker.finance.amount()
            );

            // Act
            const totalNumber = calculateSubtraction(numbers);

            // Assert
            cy.log(totalNumber.toString());
            assert.match(
              totalNumber,
              /\-?\d+\.?\d{0,2}$/,
              "calculate Sum matches"
            );
          });
        });
    });
  });

  context("Calculate Multiplication", () => {
    it("should get multiplication of simple array", () => {
      // Arrange
      const numbers = [325.5, null, -1.35];

      // Act
      const totalNumber = calculateMultiplication(numbers);

      // Assert
      expect(totalNumber).to.equal(-439.43);
    });

    it("should get multiplication of array of object", () => {
      // Arrange
      const numbers = [{ number: 325.5 }, { number: -1.35 }, { number: null }];

      // Act
      const totalNumber = calculateMultiplication(numbers, "number");

      // Assert
      expect(totalNumber).to.equal(-439.43);
    });

    it("should multiply collection's item with nested object", () => {
      // Arrange
      const persons = [
        { income: { work: { net: 5 } } },
        { income: { work: { net: 5 } } },
      ];

      // Act
      const totalNumber = calculateMultiplication(persons, "income.work.net");

      // Assert
      expect(totalNumber).to.equal(25);
    });

    context("regression test", () => {
      Array.from({ length: 5 })
        .fill("")
        .forEach((test) => {
          it("should return either in X+ , X+.X or X+.XX format", () => {
            // Arrange
            const numbers = Array.from(
              { length: 40 },
              () => +faker.finance.amount()
            );

            // Act
            const totalNumber = calculateMultiplication(numbers);

            // Assert
            cy.log(totalNumber.toString());
            assert.match(
              totalNumber,
              /\-?\d+\.?\d{0,2}$/,
              "calculate Sum matches"
            );
          });
        });
    });
  });

  context("Calculate Division", () => {
    it("should get division of simple array", () => {
      // Arrange
      const numbers = [5, null, -2];

      // Act
      const totalNumber = calculateDivision(numbers);

      // Assert
      expect(totalNumber).to.equal(-2.5);
    });

    it("should get division of array of object", () => {
      // Arrange
      const numbers = [{ number: 5 }, { number: -2 }, { number: null }];

      // Act
      const totalNumber = calculateDivision(numbers, "number");

      // Assert
      expect(totalNumber).to.equal(-2.5);
    });

    it("should divide collection's item with nested object", () => {
      // Arrange
      const persons = [
        { income: { work: { net: 5 } } },
        { income: { work: { net: -2 } } },
      ];

      // Act
      const totalNumber = calculateDivision(persons, "income.work.net");

      // Assert
      expect(totalNumber).to.equal(-2.5);
    });

    context("regression test", () => {
      Array.from({ length: 5 })
        .fill("")
        .forEach((test) => {
          it("should return either in X+ , X+.X or X+.XX format", () => {
            // Arrange
            const numbers = Array.from(
              { length: 40 },
              () => +faker.finance.amount()
            );

            // Act
            const totalNumber = calculateDivision(numbers);

            // Assert
            cy.log(totalNumber.toString());
            assert.match(
              totalNumber,
              /\-?\d+\.?\d{0,2}$/,
              "calculate Sum matches"
            );
          });
        });
    });
  });
});
