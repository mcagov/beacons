import { camelize } from "inflected";
import { createServer, JSONAPISerializer, Model } from "miragejs";
import { v4 } from "uuid";
import { applicationConfig } from "./config";
import { beaconSearchResultFixture } from "./fixtures/beaconSearchResult.fixture";
import { manyBeaconsApiResponseFixture } from "./fixtures/manyBeaconsApiResponse.fixture";
import { singleBeaconApiResponseFixture } from "./fixtures/singleBeaconApiResponse.fixture";
import { singleLegacyBeaconApiResponseFixture } from "./fixtures/singleLegacyBeaconApiResponse.fixture";

export function makeServer({ environment = "development" } = {}) {
  console.log("Stubbing the Beacons API using Mirage...");

  const authDomains = [
    "https://*.msftauth.net/**",
    "https://login.live.com/**",
    "https://login.microsoftonline.com/**",
  ];

  return createServer({
    environment,

    models: {
      note: Model,
    },

    serializers: {
      application: JSONAPISerializer.extend({
        typeKeyForModel() {
          return "note";
        },

        /*
        JSONAPISerializer make attribute names kebab-case by default
        https://miragejs.com/api/classes/jsonapi-serializer/#key-for-attribute
         */
        keyForAttribute(attr) {
          return camelize(attr, false);
        },
      }),
    },

    seeds(server) {
      server.db.loadData({
        notes: [],
      });
    },

    routes() {
      this.get(
        `${applicationConfig.apiUrl}/beacon-search/search/find-all`,
        () => {
          return beaconSearchResultFixture;
        }
      );

      this.get(`${applicationConfig.apiUrl}/beacons`, () => {
        // TODO: Update manyBeaconsApiResponseFixture to match endpoint
        return {
          data: manyBeaconsApiResponseFixture,
        };
      });

      this.get(`${applicationConfig.apiUrl}/beacons/:id`, () => {
        return singleBeaconApiResponseFixture;
      });

      this.get(`${applicationConfig.apiUrl}/legacy-beacon/:id`, () => {
        return singleLegacyBeaconApiResponseFixture;
      });

      this.patch(`${applicationConfig.apiUrl}/beacons/:id`, () => {
        return true;
      });

      this.get(`${applicationConfig.apiUrl}/beacons/:id/notes`, (schema) => {
        return schema.notes.all();
      });

      this.post(`${applicationConfig.apiUrl}/note`, (schema, request) => {
        const noteRequest = JSON.parse(request.requestBody);
        const noteId = v4();
        const note = {
          id: noteId,
          beaconId: noteRequest.data.attributes.beaconId,
          text: noteRequest.data.attributes.text,
          type: noteRequest.data.attributes.type,
          createdDate: "2021-09-24 11:09:55.914918 +00:00",
          userId: v4(),
          fullName: "Beacon McBeaconFace",
          email: "mcbeaconface@beacons.com",
        };
        schema.db.notes.insert(note);
        return schema.notes.find(noteId);
      });

      this.passthrough(...authDomains);
    },
  });
}
