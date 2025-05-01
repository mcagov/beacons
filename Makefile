###
# Makefile for local development - Start developing Beacons with just one command
#
# $ make
#
###

# Run jobs in parallel so we can see log output
MAKEFLAGS += -j

.PHONY: setup
setup: setup-root setup-backoffice setup-webapp

.PHONY: setup-root
setup-root:
	@echo "⏭ Installing root level dependencies and commit hooks..."
	@cd ./ && npm install

.PHONY: setup-backoffice
setup-backoffice:
	@echo "⏭ Installing backoffice dependencies..."
	@cd ./backoffice && npm install

.PHONY: setup-webapp
setup-webapp:
	@echo "⏭ Installing webapp dependencies..."
	@cd ./webapp && npm install

##
# Applications
##
.PHONY: all
all: backing-services webapp service backoffice backoffice-stubs

.PHONY: webapp
webapp:
	@echo "⏭ Starting the NextJS Webapp in dev mode..."
	@cd ./webapp && npm run dev

.PHONY: backoffice
backoffice:
	@echo "💅 Starting the Backoffice in dev mode..."
	@cd ./backoffice && npm run start

##
# Backing services
##
.PHONY: backing-services
backing-services:
	@echo "🐳 Starting Postgres, Redis and OpenSearch..."
	# Don't try separating these. Docker compose does not like working in parallel, so they all need to come up at once
	@docker compose up postgres redis opensearch opensearch-proxy opensearch-dashboards service --build

.PHONY: backoffice-stubs
backoffice-stubs:
	@echo "🎫 Starting the Backoffice stub server..."
	@node ./backoffice/stubs.js

##
# Utils
##
.PHONY: clean
clean:
	docker compose down
