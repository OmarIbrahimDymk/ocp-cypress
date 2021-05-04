let sum = (...args) => args.reduce((total, arg) => total + arg);

describe("Sum function", () => {
  it("should add two arguments", () => {
    expect(sum(1, 1)).to.equal(2);
  });

  it("should add three arguments", () => {
    expect(sum(1, 1, 1)).to.equal(3);
  });

  it("should add multiple arguments", () => {
    expect(sum(1, 1, 1, 1, 1)).to.equal(5);
  });
});
