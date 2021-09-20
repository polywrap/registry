// eslint-disable-next-line @typescript-eslint/no-var-requires
require("custom-env").env(process.env.ENV);

it("sanity", () => {
  expect(true).toEqual(true);
});
