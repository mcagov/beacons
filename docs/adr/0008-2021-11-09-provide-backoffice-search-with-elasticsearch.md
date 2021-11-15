# Provide Backoffice search functionality using OpenSearch

## Status

Accepted

## Context

As part of the continuous improvement of the Beacons application we are required to extend the search functionality of the Backoffice SPA.

We have found that extending the search has greatly increased the complexity of the SQL queries we are writing. The increase in complexity means that:

- The service is becoming more fragile: It is not practical to automate tests for all combinations of search parameters. This may result in edge cases that are only detected in production.
- The overall performance of the search functionality has degraded: Many of the columns are unindexed resulting in full table scans and long running sorts.
- The load on the database has significantly increased: a single user of the Backoffice SPA can cause noticeable spikes in CPU utilization, often going from idle up to 30%.

We set out to identify an architectural change that will not only prevent further performance degradation but will improve the baseline performance of the search, increasing the effectiveness of SAR operators and members of the registry team, while allowing engineers to deliver features rapidly and with greater confidence.

## Decision

We have decided to add [OpenSearch](https://opensearch.org/docs/latest/) as a piece of core infrastructure.

We will be using a fork of ElasticSearch called OpenSearch. OpenSearch was forked from ElasticSearch in March 2021 in order to retain the original Apache License 2.0. Due to the change in license of ElasticSearch, AWS is no longer able to provide a managed service for ElasticSearch. Due to the shared history, any experience using ElasticSearch is transferrable to OpenSearch.

We will be indexing documents in OpenSearch, keeping Postgres as our primary datastore.

## Key Benefits

1. Reduced time to deliver features: We have many user stories that require improved searching and categorisation of records, the default capabilities of OpenSearch will meet many of these requirements.
2. Improved performance: OpenSearch was built specifically for fast and flexible searching, and realtime analytics.
3. Convention: OpenSearch is a widely used and well-documented tool, there are developers within the team and Made Tech that have experience using OpenSearch.
4. Tooling: There are many tools and libraries that have been built specifically for working with OpenSearch, this will save on development time and should reduce the amount of automated testing that is needed.
5. Reduced coupling: The underlying data model will not have to be changed to make search more performant.
6. Scalability: We have already had to vertically scale our Postgres instances to support search with a large number of records. OpenSearch allows for horizontal scaling and is optimised for this use case.
7. Partial matching: It will be much easier to find matching records using OpenSearch. For example, a search for "Mr Smith" will match against a record containing "Mr Andrew Smith" - the existing search functionality does not support this.

## Key Drawbacks

1. Time required for initial implementation: We have to set up infrastructure, design a schema that will support the required search functionality, write the necessary glue code to index and query data in OpenSearch, and update the Backoffice SPA. This is a large amount of work that will require a significant development effort.
2. Increased complexity: Adding an extra service will require more integration code, more infrastructure to manage, and introduce the inherent complexity of distributed data and eventual consistency.
3. Cost: Amazon OpenSearch is a paid service. This should be slightly offset by the reduced utilization of the Postgres instances.

## Alternatives

1. **Do nothing**. Continue to add search functionality to the existing implementation. This will result in continued performance degradation and increased fragility.
2. **Optimise database schema for search**. Refactor large amounts of the database schema to reduce the complexity of the SQL that we will need to write to support search. This may not result in the desired performance improvements. This will require:
   - Large amounts of refactoring.
   - Running transformations on production data.
   - Tighter coupling between the API and Postgres.

## Consequences

Easier:

- Deliver features that require searching and categorisation.
- Provide advanced search and analytical capabilities.

Harder:

- Architecture: There will be more infrastructure to manage and more knowledge required to work with the overall system.

## Supporting Documentation

- [User story detailing some of the search requirements.](https://trello.com/c/6RbSzvz9/303-as-a-search-and-rescue-operator-i-want-search-to-be-extended-so-that-i-can-find-beacon-registrations-easier-during-an-incident)
