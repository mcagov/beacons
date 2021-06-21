import { IBeaconListResponse } from "../../src/gateways/mappers/beaconResponse";
import { deepFreeze } from "../utils/deepFreeze";

export const manyBeaconsApiResponseFixture: IBeaconListResponse = deepFreeze({
  data: [
    {
      type: "beacon",
      id: "97b306aa-cbd0-4f09-aa24-2d876b983efb",
      attributes: {
        hexId: "Hex me",
        status: "NEW",
        manufacturer: "Ocean Signal",
        createdDate: "2020-02-01T00:00",
        model: "EPIRB1",
        manufacturerSerialNumber: "1407312904",
        chkCode: "9480B",
        batteryExpiryDate: "2020-02-01T00:00",
        lastServicedDate: "2020-02-01T00:00",
        uses: [
          {
            environment: "MARITIME",
            activity: "SAILING",
            moreDetails: "More details of this vessel",
          },
        ],
        owner: {
          fullName: "Vice-Admiral Horatio Nelson, 1st Viscount Nelson",
          email: "nelson@royalnavy.mod.uk",
          telephoneNumber: "02392 856624",
          addressLine1: "1 The Hard",
          addressLine2: "",
          townOrCity: "Portsmouth",
          county: "Hampshire",
          postcode: "PO1 3DT",
        },
        emergencyContacts: [
          {
            fullName: "Lady Hamilton",
            telephoneNumber: "02392 856621",
            alternativeTelephoneNumber: "0    2392 856622",
          },
          {
            fullName: "Neil Hamilton",
            telephoneNumber: "04392 856626",
            alternativeTelephoneNumber: "04392 856625",
          },
        ],
      },
    },
  ],
});
