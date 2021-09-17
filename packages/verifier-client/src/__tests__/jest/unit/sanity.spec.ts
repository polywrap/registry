// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("local");

const shouldLog = process.env.LOG_TESTS === "true";

it("sanity", () => {
  expect(true).toEqual(true);
});
