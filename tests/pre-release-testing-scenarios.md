# Pre-release testing scenarios

For many reasons, we don't yet have automated acceptance or regression testing on the staging environment prior
to release.

In lieu of automated testing, this document outlines scenarios that must be performed manually before a
production release.

## Checklist

### Deployment

- [ ] Only the newly deployed images of the application are running (check the [AWS Console](https://eu-west-2.console.aws.amazon.com/ecs/v2/clusters/staging-mca-beacons-cluster/services?region=eu-west-2))

### Public facing

For staging, use the credentials for "Test B2C account" in 1 password to sign in.

Example beacon ID `1D0E9B07CEFFBFF`.

- [ ] As an AccountHolder, I can sign in to my account at https://dev.register-406-beacons.service.gov.uk/ or https://staging.register-406-beacons.service.gov.uk/
- [ ] As an AccountHolder, I can register a new Beacon
- [ ] As an AccountHolder, I can see the newly-registered Beacon in my account home
- [ ] As an AccountHolder, I can sign out

### Backoffice

- [ ] As a BackofficeUser, I sign in to the Backoffice
- [ ] As a BackofficeUser, I check if I can see a list of Beacons in default search mode
- [ ] As a BackofficeUser, I check if I can see a list of Beacons in advanced search mode
- [ ] As a BackofficeUser, I can search for the AccountHolder's newly-registered Beacon by HexID
- [ ] As a BackofficeUser, I can view the details of the AccountHolder's newly-registered Beacon
- [ ] As a BackofficeUser, I can sign out
