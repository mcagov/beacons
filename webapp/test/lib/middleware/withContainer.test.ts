import { getSession } from "next-auth/react";
import { withContainer } from "../../../src/lib/middleware/withContainer";

jest.mock("next-auth/react", () => ({
  getSession: jest.fn().mockResolvedValue(null),
}));

describe("Application Container callback", () => {
  it("should return a new instance of the application container if none is provided", async () => {
    const providedContext: any = {};
    const callback = jest.fn();
    const withContainerFunction = withContainer(callback);
    await withContainerFunction(providedContext);

    expect(providedContext.container).toBeDefined();
  });

  it("should not modify the container if one is already provided to the function", async () => {
    const providedContext: any = { container: "hex id" };
    const callback = jest.fn();

    const withContainerFunction = withContainer(callback);
    await withContainerFunction(providedContext);
    expect(providedContext.container).toBe("hex id");
  });

  it("should call the callback with the provided context", async () => {
    const providedContext: any = {};
    const callback = jest.fn();
    const withContainerFunction = withContainer(callback);
    await withContainerFunction(providedContext);

    expect(callback).toHaveBeenCalledWith(providedContext);
  });

  it("binds the signed-in user's authId onto the container so use cases can enforce ownership", async () => {
    (getSession as jest.Mock).mockResolvedValueOnce({
      user: { authId: "auth-id" },
    });
    const providedContext: any = {};
    const withContainerFunction = withContainer(jest.fn());

    await withContainerFunction(providedContext);

    expect(providedContext.container.authId).toBe("auth-id");
  });
});
