# Serve Backoffice SPA from Spring service

## Status

Accepted

## Context

Following Public Beta, the Beacons development team was reduced to 3 x engineers.

We found that features required frequent commits to both the API Service and Backoffice repositories.

We also found that breaking changes would be pushed to production, as the separate pipelines didn't adequately test integration between the two sub-systems.

We set out to identify an improvement to the architecture that would:

1.  Reduce the cost of change
2.  Increase confidence that the API and its only client are interoperable
3.  Reduce the onboarding burden for new developers

## Decision

_What is the change that we're proposing and/or doing?_

1.  Move the Backoffice SPA repo into the Service repo.
2.  Configure Spring to build and serve the Backoffice SPA's static assets.
3.  Archive the standalone Backoffice SPA repo and infrastructure.

## Key Benefits

_List the main benefits of this implementation._

1. Reduced maintenance burden: each new slice of user value requires commits to one fewer code repo.
2. Greater confidence in user value: the Backoffice SPA can be more easily end-to-end tested with the Service. We will be able to finally test "As a BeaconOwner I can register a Beacon and it is visible to Search and Rescue".
3. Lower systemic complexity: fewer repos, simplified CI/CD pipeline, fewer moving parts.
4. We retain modularity: still able to compartmentalise the Backoffice SPA from the rest of the application.
5. Any changes to API/Backoffice will have to be synchronous: changes to the API contract will cause tests to fail _in this repo_, with no silent failures.

## Key Drawbacks

_List any significant drawbacks from this implementation._

- Commit history from the old Backoffice SPA repo harder to find. (Not lost entirely, as will be archived.)
- Effort required to change Terraform setup, configure DNS etc.
- Negligible increased load on the Service. Assessed to be immaterial.

## Alternatives

_Summarise the main alternatives that have been considered and the reasons why they have not been chosen. Use no
more than one paragraph per alternative._

1.  **Do nothing**. Continue to commit across several repos for slices of user value. We considered that the costs of the 'Do nothing' approach exceed its benefits: without the ability to easily test integration of Backoffice SPA and Service in one repo / build pipeline, the risk of continued integration pain is intolerable, and so is discarded.
2.  **Re-write Backoffice SPA as a SSR/templated series of webpages served from Spring**. Doing this would require re-implementing datatables and search in the SSR/templated paradigm. Current libraries for doing this are few and far between. The paradigm of "displaying and searching data in a web browser" is significantly better supported in the clientside ecosystem. Choosing this option would result in greater effort required to meet user expectations, and so is discarded.
3.  **Create a monorepo in the Service repository, with Backoffice SPA static assets still served via CloudFront/S3**. This would deliver many of the [benefits](#key-benefits) of this ADR, though would not fully deliver benefits 2 and 3. End-to-end testing of the Service and Backoffice (Benefit 2) would require a new layer of abstraction above the services being tested. Instead, it is simpler to test one application. Lower systemic complexity (Benefit 3) would be _partially_ achieved: a single source code repository, a mostly-combined CI/CD pipeline (with separate deployed infrastructure) and fewer moving parts, but less so than the chosen option. The cost of implementing a monorepo would be similar to the chosen option and would deliver fewer benefits, so this option is discarded.
4.  **Consumer-driven contract testing**. We considered implementing consumer-driven contract testing using a tool like [Pact](https://docs.pact.io/). We considered consumer-driven contract testing to be too much of an overhead considering there is a 1-1 relationship between producer and consumer.

## Consequences

_What becomes easier or more difficult to do because of this change?_

Easier:

- Changes to data model, e.g. a new property on a Beacon.
- System discovery: new developers will find it easier to discover how the Beacons Registration Service works.
- CI/CD: Backoffice and Service can be tested and deployed in conjunction within a single pipeline.
- Architecture: It will be easier to oversee and ensure business rules and Model concerns are implemented in the correct place.

More difficult:

- Higher barrier to entry for developers unfamiliar with Java, who may prefer a TypeScript-only repo.

## Supporting Documentation

- [https://blog.indrek.io/articles/serving-react-apps-from-spring-boot/](https://blog.indrek.io/articles/serving-react-apps-from-spring-boot/)
