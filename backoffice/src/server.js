import { camelize } from "inflected";
import { createServer, JSONAPISerializer, Model } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  console.log("Stubbing the Beacons API using Mirage...");

  const authDomains = [
    "https://*.msftauth.net/**",
    "https://login.live.com/**",
    "https://login.microsoftonline.com/**",
  ];

  const apiDomains = ["http://localhost:8080"];

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
        "/backoffice/tenant-id",
        () => "513fb495-9a90-425b-a49a-bc6ebe2a429e"
      );

      this.get(
        "/backoffice/client-id",
        () => "5cdcbb41-958a-43b6-baa1-bbafd80b4f70"
      );

      this.passthrough(...authDomains, ...apiDomains);
    },
  });
}
