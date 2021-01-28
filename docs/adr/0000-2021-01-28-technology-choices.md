# Technology Choices

## Status

Accepted

## Context

We want to decide upon technology choices for this project. What languages/frameworks, cloud provider, source control, and CI/CD provider should be used?

## Decision

Technical choices are outlined in the table:

| Tech Capability        | Decision                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Front end              | [React](https://reactjs.org/), [NextJS](https://nextjs.org/), [Gov UK Design System](https://design-system.service.gov.uk/) |
| Back end               | [Java](https://adoptopenjdk.net/), [Spring Boot](https://spring.io/projects/spring-boot)                                    |
| Infrastructure-as-code | [Terraform](https://www.terraform.io/)                                                                                      |
| Cloud Provider         | [Amazon Web Services (AWS)](https://aws.amazon.com/)                                                                        |
| Soure Control          | [GitHub](https://github.com/)                                                                                               |
| CI/CD Provider         | [GitHub Actions](https://github.com/features/actions)                                                                       |

## Consequences

- Utilising modern, well supported, and maintained languages and tooling will make it easier for MCA to support internally or recruit support for
- Adherence with the [GDS Service Standard, Point 12](https://www.gov.uk/service-manual/service-standard/point-12-make-new-source-code-open) - making all new source code open and resuable, and publish it under appropriate licenses
- Using HTML for [Gov UK Design System](https://design-system.service.gov.uk/get-started/production/) components will require more effort to incorporate changes to the library compared to [Nunjucks](https://frontend.design-system.service.gov.uk/use-nunjucks/#use-nunjucks)

## Supporting Documentation

- [Trello - Technical Project Plan](https://trello.com/c/hSq6AxWa/138-technical-project-plan)
- [2020-01-11 - Technical Options Presentation](https://trello.com/c/1XegkRWM/127-technical-questions)
