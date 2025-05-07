# Post-release testing scenarios

For many reasons, we don't yet have automated smoke tests to confirm a deployment succeeded.

In lieu of automated testing, this document outlines scenarios that must be performed immediately after a
production release.

## Pre-requisites

We don't want to pollute production state with test data. Therefore, no _new_ Beacon registrations should occur.

Instead, post a message on the "#maritime-and-coastguard-agency" Slack channel asking for the member of the team that
"owns" the test Beacon **1D0E9B07CEFFBFF** to log in and perform the smoke tests on production.

## Checklist

- [ ] Only the newly deployed images of the application are running (check the [AWS Console](https://eu-west-2.console.aws.amazon.com/ecs/v2/clusters/production-mca-beacons-cluster/services?region=eu-west-2))
- [ ] As the test AccountHolder of the Beacon with HexId 1D0E9B07CEFFBFF, I can sign in to my account at
      https://register-406-beacons.service.gov.uk/
- [ ] As an AccountHolder, I can see Beacon with HexId 1D0E9B07CEFFBFF in my account home
- [ ] As a BackofficeUser, I check if I can see a list of Beacons in default search mode
- [ ] As a BackofficeUser, I check if I can see a list of Beacons in advanced search mode
- [ ] As a BackofficeUser, I can search for the Beacon with HexID 1D0E9B07CEFFBFF
- [ ] As a BackofficeUser, I can view the details of the Beacon with HexID 1D0E9B07CEFFBFF
