import { withContainer } from "../../src/lib/container";

describe("Application Container callback", () => {
  it("should return a new instance of the application container if none is provided", () => {
    const providedContext: any = {};
    const callback = jest.fn();
    const withContainerFunction = withContainer(callback);
    withContainerFunction(providedContext);

    expect(providedContext.container).toBeDefined();
  });

  it("should not modify the container if one is already provided to the function", () => {
    const providedContext: any = { container: "hex id" };
    const callback = jest.fn();

    const withContainerFunction = withContainer(callback);
    withContainerFunction(providedContext);
    expect(providedContext.container).toBe("hex id");
  });

  it("should call the callback with the provided context", () => {
    const providedContext: any = {};
    const callback = jest.fn();
    const withContainerFunction = withContainer(callback);
    withContainerFunction(providedContext);

    expect(callback).toHaveBeenCalledWith(providedContext);
  });
});
