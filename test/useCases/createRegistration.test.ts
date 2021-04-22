import { CreateRegistration } from "../../src/useCases/createRegistration";

describe("Create Registration Use Case", () => {
  let gateway;
  let registration;
  let json;
  let useCase;

  beforeEach(() => {
    json = { model: "ASOS" };
    gateway = { sendRegistration: jest.fn() };
    registration = { serialiseToAPI: jest.fn().mockImplementation(() => json) };
    useCase = new CreateRegistration(gateway);
  });

  it("should post the registration json via the api gateway", async () => {
    await useCase.execute(registration);

    expect(gateway.sendRegistration).toHaveBeenCalledWith(json);
  });

  it("should return true if the request is successful", async () => {
    gateway.sendRegistration.mockImplementation(() => {
      return false;
    });
    const expected = await useCase.execute(registration);

    expect(expected).toBe(false);
  });

  it("should return false if the request is unsuccessful", async () => {
    gateway.sendRegistration.mockImplementation(() => {
      return true;
    });
    const expected = await useCase.execute(registration);

    expect(expected).toBe(true);
  });
});
