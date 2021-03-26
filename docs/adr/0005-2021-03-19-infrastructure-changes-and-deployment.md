# Infrastructure changes and deployment

## Status

Accepted

## Context

We initially only had one environment for our application, but we want separate environments for different purposes, ie:

    Dev/development - for pushing our latest dev work
    Staging - for pushing changes that can be tested with Users or for PO signoff
    Production - for changes that have been approved to go live! 🎉

This required us to refactor our terraform and pipeline.

## Decision

We refactored our infrastructure to allow for several environments using terraform [workspaces](https://www.terraform.io/docs/language/state/workspaces.html):

- More detailed information on the change and `dev` deployment is in [this PR](https://github.com/mcagov/beacons-integration/pull/25)
- A similar [smaller change](https://github.com/mcagov/beacons-integration/pull/26) was made to allow us to have a manual deployment to a `staging` environment

## Key Benefits

- We won't need to have code-freezes during user testing and show and tell demos
- We have a pattern in place that we can easily replicate for when we need a `production` environment

## Key Drawbacks

- We might need to consider refactoring to use the _modules_ approach in the future
  - Using workspaces is the _smallest next step_ - explained in [this PR](https://github.com/mcagov/beacons-integration/pull/25)

## Consequences

We now have multiple environments - including a more stable `staging` environment, that can be used for demos and user testing, without afffecting the development process.

## Supporting Documentation

- [PR for dev deployment](https://github.com/mcagov/beacons-integration/pull/25)
- [PR for staging deployment](https://github.com/mcagov/beacons-integration/pull/26)
- [Terraform workspaces docs](https://www.terraform.io/docs/language/state/workspaces.html)
