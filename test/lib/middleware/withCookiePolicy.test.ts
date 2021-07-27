import { withContainer } from "../../../src/lib/middleware/withContainer";

it("should return a new instance of the application container if none is provided", () => {
  const providedContext: any = {};
  const callback = jest.fn();
  const withContainerFunction = withContainer(callback);
  withContainerFunction(providedContext);

  expect(providedContext.container).toBeDefined();
});
