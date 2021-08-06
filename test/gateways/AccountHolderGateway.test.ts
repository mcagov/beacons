import axios from "axios";
import { v4 } from "uuid";
import { AccountHolder } from "../../src/entities/AccountHolder";
import { BeaconsApiAccountHolderGateway } from "../../src/gateways/BeaconsApiAccountHolderGateway";
import { AuthGateway } from "../../src/gateways/interfaces/AuthGateway";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Account Holder API Gateway", () => {
  const hostName = "a-host";
  let gateway: BeaconsApiAccountHolderGateway;
  let token;

  describe("Creating an account holder from a provided auth id", () => {
    const authId = v4();
    const email = authId + "@madetech.com";
    const accessToken = v4();
    const mockAuthGateway: AuthGateway = {
      getAccessToken: jest.fn().mockResolvedValue(accessToken),
    };
    gateway = new BeaconsApiAccountHolderGateway(hostName, mockAuthGateway);

    it("should call the endpoint with the correct request and headers", async () => {
      const createAccountHolderEndpoint = "account-holder";
      const expectedUrl = `${hostName}/${createAccountHolderEndpoint}`;
      const expectedRequest = {
        data: { attributes: { authId, email } },
      };
      const expectedHeaders = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            id: "test-id",
          },
        },
      });

      await gateway.createAccountHolder(authId, email);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expectedUrl,
        expectedRequest,
        expectedHeaders
      );
    });

    it("returns the newly created account holder's details", async () => {
      const tesId = v4();
      const testFullName = "Adut Akech";
      const expectedAccountHolder: Partial<AccountHolder> = {
        id: tesId,
        email: email,
        fullName: testFullName,
      };
      mockedAxios.post.mockResolvedValue({
        data: {
          data: {
            id: tesId,
            attributes: {
              fullName: testFullName,
              email: email,
            },
          },
        },
      });

      const createdAccountHolder = await gateway.createAccountHolder(
        authId,
        email
      );
      expect(createdAccountHolder).toEqual(expectedAccountHolder);
    });
  });

  describe("Getting an account holder id from an auth id", () => {
    const accountHolderIdEndpoint = "account-holder/auth-id";
    let authId;
    beforeEach(() => {
      authId = v4();
      token = v4();
      const mockAuthGateway: AuthGateway = {
        getAccessToken: jest.fn().mockResolvedValue(token),
      };
      gateway = new BeaconsApiAccountHolderGateway(hostName, mockAuthGateway);
    });

    it("should request an accountHolderId from the correct endpoint", async () => {
      const expectedUrl = `${hostName}/${accountHolderIdEndpoint}/${authId}`;
      mockedAxios.get.mockResolvedValue({
        data: {
          id: "any id",
        },
      });

      await gateway.getAccountHolderId(authId);

      expect(mockedAxios.get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it("should return the obtained accountHolderId from the API", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          id: "any-account-holder-id",
        },
      });

      const result = await gateway.getAccountHolderId(authId);

      expect(result).toBe("any-account-holder-id");
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()));
      const call = () => gateway.getAccountHolderId(authId);

      expect(call).rejects.toThrow();
    });
  });

  describe("Getting an account holder details", () => {
    const accountHolderDetailsEndpoint = "account-holder";
    let accountHolderId;

    beforeEach(() => {
      accountHolderId = v4();
      token = v4();
      const mockAuthGateway: AuthGateway = {
        getAccessToken: jest.fn().mockResolvedValue(token),
      };
      gateway = new BeaconsApiAccountHolderGateway(hostName, mockAuthGateway);
    });

    it("should request account holder details from the correct endpoint", async () => {
      const expectedUrl = `${hostName}/${accountHolderDetailsEndpoint}/${accountHolderId}`;
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            id: "any id",
            attributes: {},
          },
        },
      });
      await gateway.getAccountHolderDetails(accountHolderId);

      expect(mockedAxios.get).toHaveBeenLastCalledWith(expectedUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    it("should return account holder details", async () => {
      const mockResponse = {
        data: {
          id: accountHolderId,
          attributes: {
            fullName: "Bill Gates",
            email: "bill@billynomates.test",
            telephoneNumber: "0788888888",
            alternativeTelephoneNumber: "NA",
            addressLine1: "Evil Lair",
            addressLine2: "1 Microsoft Square",
            addressLine3: "",
            addressLine4: "",
            townOrCity: "Googleville",
            county: "Lancs",
            postcode: "ZX80 CPC",
          },
        },
      };
      const expected = {
        id: accountHolderId,
        fullName: "Bill Gates",
        email: "bill@billynomates.test",
        telephoneNumber: "0788888888",
        alternativeTelephoneNumber: "NA",
        addressLine1: "Evil Lair",
        addressLine2: "1 Microsoft Square",
        addressLine3: "",
        addressLine4: "",
        townOrCity: "Googleville",
        county: "Lancs",
        postcode: "ZX80 CPC",
      };
      mockedAxios.get.mockResolvedValue({ data: { ...mockResponse } });

      const result = await gateway.getAccountHolderDetails(accountHolderId);
      expect(result).toMatchObject<AccountHolder>(expected);
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()));
      const call = () => gateway.getAccountHolderDetails(accountHolderId);

      expect(call).rejects.toThrow();
    });
  });

  describe("Updating an account holder details", () => {
    const accountHolderDetailsEndpoint = "account-holder";
    let accountHolderId;

    beforeEach(() => {
      accountHolderId = v4();
      token = v4();
      const mockAuthGateway: AuthGateway = {
        getAccessToken: jest.fn().mockResolvedValue(token),
      };
      gateway = new BeaconsApiAccountHolderGateway(hostName, mockAuthGateway);
    });

    it("should request account holder details from the correct endpoint", async () => {
      const mockUpdate: Partial<AccountHolder> = {
        fullName: "Bill Gates",
        email: "bill@billynomates.test",
        telephoneNumber: "0788888888",
        alternativeTelephoneNumber: "NA",
        addressLine1: "Evil Lair",
        addressLine2: "1 Microsoft Square",
        addressLine3: "",
        addressLine4: "",
        townOrCity: "Googleville",
        county: "Lancs",
        postcode: "ZX80 CPC",
      };
      const expectedPatch = {
        id: accountHolderId,
        attributes: {
          fullName: "Bill Gates",
          email: "bill@billynomates.test",
          telephoneNumber: "0788888888",
          alternativeTelephoneNumber: "NA",
          addressLine1: "Evil Lair",
          addressLine2: "1 Microsoft Square",
          addressLine3: "",
          addressLine4: "",
          townOrCity: "Googleville",
          county: "Lancs",
          postcode: "ZX80 CPC",
        },
      };
      const expectedUrl = `${hostName}/${accountHolderDetailsEndpoint}/${accountHolderId}`;
      mockedAxios.patch.mockResolvedValue({
        data: {
          data: {
            id: "any id",
            attributes: {},
          },
        },
      });
      await gateway.updateAccountHolderDetails(
        accountHolderId,
        mockUpdate as AccountHolder
      );

      expect(mockedAxios.patch).toHaveBeenLastCalledWith(
        expectedUrl,
        { data: { ...expectedPatch } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });

    it("should return account holder details on update", async () => {
      const mockResponse = {
        data: {
          id: accountHolderId,
          attributes: {
            fullName: "updated Bill Gates",
            email: "updated bill@billynomates.test",
            telephoneNumber: "updated 0788888888",
            alternativeTelephoneNumber: "updated NA",
            addressLine1: "updated Evil Lair",
            addressLine2: "updated 1 Microsoft Square",
            addressLine3: "updated ",
            addressLine4: "updated ",
            townOrCity: "updated Googleville",
            county: "updated Lancs",
            postcode: "updated ZX80 CPC",
          },
        },
      };
      const expectedResult = {
        id: accountHolderId,
        fullName: "updated Bill Gates",
        email: "updated bill@billynomates.test",
        telephoneNumber: "updated 0788888888",
        alternativeTelephoneNumber: "updated NA",
        addressLine1: "updated Evil Lair",
        addressLine2: "updated 1 Microsoft Square",
        addressLine3: "updated ",
        addressLine4: "updated ",
        townOrCity: "updated Googleville",
        county: "updated Lancs",
        postcode: "updated ZX80 CPC",
      };
      mockedAxios.patch.mockResolvedValue({ data: { ...mockResponse } });

      const result = await gateway.updateAccountHolderDetails(
        accountHolderId,
        {} as AccountHolder
      );
      expect(result).toMatchObject<AccountHolder>(expectedResult);
    });

    it("should allow errors to bubble up", async () => {
      jest.spyOn(console, "error").mockReturnValue();
      mockedAxios.patch.mockImplementationOnce(() =>
        Promise.reject(new Error())
      );
      const call = () =>
        gateway.updateAccountHolderDetails(
          accountHolderId,
          {} as AccountHolder
        );

      await expect(call).rejects.toThrow();
    });
  });
});
