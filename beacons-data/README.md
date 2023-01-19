# Beacons Data Scripts

## Beacons Data Seeding Scripts

## Why do we need this code?

- During local development, you will need records in your local Postgres DB in all the tables
- These _Ruby_ scripts seed the DB tables with dummy data to help you get started

## Prerequisites

- Postgresql:
  `brew install postgresql`
- [Rbenv](https://github.com/rbenv/rbenv)
- Set rbenv to use your preferred Ruby version. E.g:
  `rbenv local 2.6.8`
- You will see at the top of each script we are using the following Ruby gems:

```
require 'pg'
require 'faker'
require 'securerandom'
require 'json'
```

Please install these gems locally using your current local Ruby version you've just set with Rbenv:

```
xcrun gem install pg
xcrun gem install faker
```

## How to run the scripts

### Local

- Ensure your local dockerised instance of the Postgres DB server is running
- Run each script using Ruby, e.g:
  `ruby beacons_bulk_load_legacy.rb`

### Other environments

- In AWS, allow public connections and add an inbound connection rule, allowing your IP address to connect to the VPC containing the relevant DB
- Connect your psql shell or pgAdmin instance to your desired DB server
- _For legacy beacons_, run the following SQL code to clear the data if you need to:

```
delete from legacy_beacon_claim_event;
delete from legacy_beacon;
```

- _For modern beacons_, run the following SQL code to clear the data if you need to:

```
update account_holder set person_id = null;
update person set beacon_id = null;

delete from note;
delete from emergency_contact;
delete from beacon_use;
delete from beacon_owner;
delete from beacon;
delete from account_holder;
delete from person;
```

- Obtain the DB credentials relevant to the environment you're working with from 1Password, and use them to replace the local DB credentials below in the code (only temporarily though: do not commit these sensitive values to source control)

```
db_host = 'localhost'
db_password= 'password'
```

- Run each script using Ruby
- Remove the sensitive values from your Ruby code and set them back to the local credentials above
- In AWS, delete the inbound rule you made earlier to the VPC
- Disallow public connections to the DB

## Beacons Data Export Scripts

## Why do we need this code?

- The P.O requires an export of the beacons data, with these specific fields (not all of them) on an infrequent basis
- These _PostgreSQL_ scripts select the relevant modern and legacy beacon data, transforming text to uppercase and formatting the dates to dd/mm/yyyy.
