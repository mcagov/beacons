###
# Makefile for local development - Start developing Beacons with just one command
#
# $ make
#
###

# Run jobs in parallel so we can see log output
MAKEFLAGS += -j

##
# Applications
##
.PHONY: all
all: backing-services webapp service backoffice backoffice-stubs

.PHONY: webapp
webapp:
	@echo "⏭ Starting the NextJS Webapp in dev mode..."
	@open http://localhost:3000
	@cd ./webapp && npm run dev

.PHONY: service
service:
	@echo "🌱 Starting the Spring Service API in dev mode..."
	@cd ./service && (trap 'kill 0' SIGINT; while true; do ./gradlew bootRun --args='--spring.profiles.active=dev,seed'; sleep 2; done)

.PHONY: backoffice
backoffice:
	@echo "💅 Starting the Backoffice in dev mode..."
	@open http://localhost:3001
	@cd ./backoffice && npm run start

##
# Backing services
##
.PHONY: backing-services
backing-services:
	@echo "🐳 Starting Postgres, Redis and OpenSearch..."
	# Don't try separating these. Docker compose does not like working in parallel, so they all need to come up at once
	@docker compose up postgres redis opensearch opensearch-proxy opensearch-dashboards

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
	rm dev.logs