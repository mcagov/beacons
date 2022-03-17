# Pre-release testing scenarios

For many reasons, we don't yet have automated acceptance or regression testing on the staging environment prior
to release.

In lieu of automated testing, this document outlines scenarios that must be performed manually before a
production release.

## Checklist

- [ ] Only the newly deployed images of the application are running (check the [AWS Console](https://eu-west-2.console.aws.amazon.com/ecs/v2/clusters/staging-mca-beacons-cluster/services?region=eu-west-2)
- [ ] As an AccountHolder, I can sign in to my account at https://staging.406beacons.com/
- [ ] As an AccountHolder, I can register a new Beacon
- [ ] As an AccountHolder, I can see the newly-registered Beacon in my account home
- [ ] As a BackofficeUser, I can search for the AccountHolder's newly-registered Beacon by HexID
- [ ] As a BackofficeUser, I can view the details of the AccountHolder's newly-registered Beacon
