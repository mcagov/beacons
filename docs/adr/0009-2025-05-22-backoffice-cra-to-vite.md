# Migrate backoffice/ from Create React App to Vite

## Status

Accepted

## Context

The backoffice codebase was originally bootstrapped using Create React App (CRA). As of 2024, CRA is officially **deprecated** ([see CRA README](https://github.com/facebook/create-react-app)), and is no longer recommended for new projects. There are numerous open issues regarding security vulnerabilities in `react-scripts` and other dependencies, which remain unpatched ([example issue](https://github.com/facebook/create-react-app/issues/17040), [unmerged dependency bumps](https://github.com/facebook/create-react-app/pull/13778)). This exposes our project to unnecessary risk and makes it difficult to keep up with modern best practices.

The React team now recommends alternatives such as [Vite](https://vitejs.dev/) for new projects ([React documentation: Creating a React App](https://react.dev/learn/creating-a-react-app)). Vite offers a modern, actively maintained development experience with faster builds, better support for modern JavaScript and TypeScript, and a more flexible plugin ecosystem.

Additionally, CRA previously wrapped and abstracted configuration for our test framework (Jest and Testing Library) and linting (ESLint). This made it difficult to update or customize these tools. By migrating away from CRA, we will **separate out the test framework (Jest and Testing Library) and linting (ESLint)** into standalone configurations. This gives us more flexibility and control over updates and customizations.

## Decision

We have decided to migrate the `backoffice/` codebase from Create React App to Vite. This involves replacing the CRA build and development tooling with Vite, updating configuration files, and making necessary changes to support Vite's conventions and plugin ecosystem. We will also extract and maintain separate configurations for Jest, Testing Library, and ESLint.

## Key Benefits

- **Active maintenance and community support** for Vite, unlike CRA which is deprecated.
- **Faster development startup and hot reloads** due to Vite's native ESM and optimized dependency handling.
- **Simpler and more flexible configuration** compared to CRA's abstracted setup.
- **Better support for modern JavaScript and TypeScript features**.
- **Smaller and faster production builds**.
- **Easier integration with modern tools and plugins** (e.g., for testing, linting, and environment variables).
- **Ability to update testing and other dependencies** to current, secure versions.
- **Alignment with React team recommendations** for new projects.
- **Direct control and flexibility over Jest, Testing Library, and ESLint configuration and updates**.

## Key Drawbacks

- **Initial migration effort**: Some time and resources are required to update configuration, scripts, and resolve compatibility issues.
- **Potential for new bugs**: Differences in build and runtime environments may introduce unforeseen issues.
- **Learning curve**: Team members need to become familiar with Vite's configuration and ecosystem.
- **Responsibility for maintaining separate test and linting configurations**.

## Alternatives

- **Remain on Create React App**: Rejected due to its deprecated status, known vulnerabilities, and lack of updates.
- **Migrate to Next.js**: Considered, but Next.js is optimized for SSR and routing, which is not a requirement for our backoffice SPA.
- **Use Webpack directly**: More flexible than CRA, but requires more manual configuration and does not offer the speed and simplicity of Vite.

## Consequences

- **Easier and faster local development** for all contributors.
- **Simpler configuration and easier upgrades** in the future.
- **Some dependencies or plugins may need to be replaced or reconfigured** to work with Vite.
- **Improved security and maintainability** by being able to update dependencies.
- **Greater flexibility and control over testing and linting tools**.

## Supporting Documentation

- [Vite Documentation](https://vitejs.dev/)
- [Migration Guide: CRA to Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [Create React App repository (deprecated)](https://github.com/facebook/create-react-app)
- [React documentation: Creating a React App](https://react.dev/learn/creating-a-react-app)
- [Known vulnerabilities in CRA](https://github.com/facebook/create-react-app/issues/17040)
- [Unmerged dependency bumps in CRA](https://github.com/facebook/create-react-app/pull/13778)
- [Related Trello card: Migrate backoffice to Vite](https://trello.com/)
