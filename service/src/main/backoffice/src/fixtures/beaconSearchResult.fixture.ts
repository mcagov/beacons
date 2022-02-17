import { IBeaconSearchResult } from "../entities/IBeaconSearchResult";
import { deepFreeze } from "../utils";

export const beaconSearchResultFixture = deepFreeze<IBeaconSearchResult>({
  page: {
    size: 20,
    totalElements: 4,
    totalPages: 1,
    number: 0,
  },
  _embedded: {
    beaconSearch: [
      {
        id: "97b306aa-cbd0-4f09-aa24-2d876b983efb",
        hexId: "Hex me",
        beaconStatus: "NEW",
        createdDate: "2020-02-01T00:00",
        lastModifiedDate: "2020-02-01T00:00",
        useActivities: "SAILING, KAYAKING",
        ownerName: "Vice-Admiral Horatio Nelson, 1st Viscount Nelson",
        ownerEmail: "nelson@royalnavy.mod.uk",
        accountHolderId: "ee86f9c2-839b-4269-8b72-daac3cb18b28",
        beaconType: "BEACON",
        cospasSarsatNumber: null,
        manufacturerSerialNumber: null,
        _links: {
          self: {
            href: "/97b306aa-cbd0-4f09-aa24-2d876b983efb",
          },
          beaconSearchEntity: {
            href: "/97b306aa-cbd0-4f09-aa24-2d876b983efb",
          },
        },
      },
      {
        id: "97b306aa-cbd0-4f09-aa24-2d876b983efc",
        hexId: "Hex me difficultly",
        beaconStatus: "NEW",
        createdDate: "2020-02-01T00:00",
        lastModifiedDate: "2020-02-01T00:00",
        useActivities: "MOTORING",
        ownerName: "Vice-Admiral Horatio Nelson, 1st Viscount Nelson",
        ownerEmail: "nelson@royalnavy.mod.uk",
        accountHolderId: "ee86f9c2-839b-4269-8b72-daac3cb18b28",
        beaconType: "BEACON",
        cospasSarsatNumber: null,
        manufacturerSerialNumber: null,
        _links: {
          self: {
            href: "/97b306aa-cbd0-4f09-aa24-2d876b983efc",
          },
          beaconSearchEntity: {
            href: "/97b306aa-cbd0-4f09-aa24-2d876b983efc",
          },
        },
      },
      {
        id: "97b306aa-cbd0-4f09-aa24-2d876b983efd",
        hexId: "Hex me beacon",
        beaconStatus: "NEW",
        createdDate: "2020-02-01T00:00",
        lastModifiedDate: "2020-02-01T00:00",
        useActivities: "VESSELING",
        ownerName: "Vice-Admiral Horatio Nelson, 1st Viscount Nelson",
        ownerEmail: "nelson@royalnavy.mod.uk",
        accountHolderId: "ee86f9c2-839b-4269-8b72-daac3cb18b28",
        beaconType: "BEACON",
        cospasSarsatNumber: null,
        manufacturerSerialNumber: null,
        _links: {
          self: {
            href: "/97b306aa-cbd0-4f09-aa24-2d876b983efd",
          },
          beaconSearchEntity: {
            href: "/97b306aa-cbd0-4f09-aa24-2d876b983efd",
          },
        },
      },
      {
        id: "efeea9c2-85fc-4d3a-90ba-299e95f8114e",
        createdDate: "2015-04-07T00:00:00Z",
        lastModifiedDate: "2021-09-22T15:13:26Z",
        beaconStatus: "MIGRATED",
        hexId: "9D68175034D34D1",
        ownerName: "ULTRASHIP APS",
        ownerEmail: "owner@testlegacybeacons.dk",
        accountHolderId: null,
        useActivities: "Maritime",
        beaconType: "LEGACY_BEACON",
        cospasSarsatNumber: null,
        manufacturerSerialNumber: null,
        _links: {
          self: {
            href: "/efeea9c2-85fc-4d3a-90ba-299e95f8114e",
          },
          beaconSearchEntity: {
            href: "/efeea9c2-85fc-4d3a-90ba-299e95f8114e",
          },
        },
      },
    ],
  },
});
