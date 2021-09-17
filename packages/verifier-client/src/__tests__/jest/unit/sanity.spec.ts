// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env("local");

it("sanity", () => {
  expect(true).toEqual(true);
});
