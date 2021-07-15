import { v4 as uuidv4 } from "uuid";
import { IAccountHolderDetails } from "../../src/entities/accountHolderDetails";
import { IAccountHolderApiGateway } from "../../src/gateways/accountHolderApiGateway";
import { IAppContainer } from "../../src/lib/appContainer";
import { updateAccountHolder } from "../../src/useCases/updateAccountHolder";

describe("The updateAccountHolder use case", () => {
  const currentAccountHolder = {
    id: uuidv4(),
    fullName: "Bill Gates",
    email: "bill@billynomates.test",
    telephoneNumber: "0788888888",
    alternativeTelephoneNumber: "updated NA",
    addressLine1: "Evil Lair",
    addressLine2: "1 Microsoft Square",
    addressLine3: "",
    addressLine4: "",
    townOrCity: "Googleville",
    county: "Lancs",
    postcode: "ZX80 CPC",
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const buildGateway = (
    captureUpdate: (capture: any) => void
  ): Partial<IAccountHolderApiGateway> => ({
    updateAccountHolderDetails: jest
      .fn()
      .mockImplementation((id, update, token) => {
        captureUpdate(update);
        return {};
      }),
    createAccountHolder: jest.fn(),
  });

  const buildContainer = (
    gateway: Partial<IAccountHolderApiGateway>
  ): Partial<IAppContainer> => ({
    getSession: jest.fn().mockResolvedValue({ user: { id: "a-session-id" } }),
    accountHolderApiGateway: gateway as IAccountHolderApiGateway,
    getAccessToken: jest.fn(),
  });

  it("only updates the changed fields", async () => {
    const update = {
      id: uuidv4(),
      fullName: "Bob Gates",
      email: "bill@billynomates.test",
      telephoneNumber: "0788888888",
      alternativeTelephoneNumber: "07800 99999999",
      addressLine1: "Evil Lair",
      addressLine2: "1 Microsoft Square",
      addressLine3: "",
      addressLine4: "",
      townOrCity: "Googleville",
      county: "",
      postcode: "ZX80 CPC",
    };
    let captureUpdateParam: IAccountHolderDetails;
    const gateway = buildGateway((update) => (captureUpdateParam = update));
    const container = buildContainer(gateway) as IAppContainer;

    await updateAccountHolder(container)(currentAccountHolder, update);

    expect(
      container.accountHolderApiGateway.updateAccountHolderDetails
    ).toHaveBeenCalledTimes(1);
    expect(captureUpdateParam).toEqual({
      fullName: "Bob Gates",
      alternativeTelephoneNumber: "07800 99999999",
      county: "",
    });
  });

  it("shouldn't update id even if changed somehow", async () => {
    const update = {
      id: uuidv4(),
      fullName: "Bob Gates",
    };
    let captureUpdateParam: IAccountHolderDetails;
    const gateway = buildGateway((update) => (captureUpdateParam = update));
    const container = buildContainer(gateway) as IAppContainer;

    await updateAccountHolder(container)(
      currentAccountHolder,
      update as IAccountHolderDetails
    );

    expect(captureUpdateParam).toHaveProperty("fullName");
    expect(captureUpdateParam).not.toHaveProperty("id");
  });
});
