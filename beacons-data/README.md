# Beacons Data Seeding Scripts

## Why do we need this code?

- During local development, you will need records in your local Postgres DB in all the tables
- These scripts seed the DB tables with dummy data to help you get started

## Prerequisites

- Rbenv
- Set rbenv to use your preferred Ruby version. E.g:
  `rbenv local 2.6.8`
- You will see at the top of each script we are using the following Ruby gems:

```
require 'pg'
require 'faker'
require 'securerandom'
require 'json'
```

Please install these gems locally using your current local Ruby version you've just set with Rbenv.
