###
# Makefile for local development - Start developing Beacons with just one command
#
# $ make
#
###

MAKEFLAGS += -j

.PHONY: setup
setup: setup-root setup-backoffice setup-webapp

.PHONY: setup-root
setup-root:
	@echo "\n==================================================="
	@echo "Installing root level dependencies and commit hooks\n"
	cd . && \
		asdf install && \
		node --version && \
		npm install

.PHONY: setup-backoffice
setup-backoffice:
	@echo "\n=================================="
	@echo "Installing backoffice dependencies\n"
	cd ./backoffice && \
		asdf install && \
		node --version && \
		npm install

.PHONY: setup-webapp
setup-webapp:
	@echo "\n=============================="
	@echo "Installing webapp dependencies\n"
	cd ./webapp && \
		asdf install && \
		node --version && \
		npm install

##
# Applications
##

# Parralel docker-compose
.PHONY: serve
serve: serve-backing-services serve-webapp serve-backoffice serve-backoffice-stubs

.PHONY: serve-webapp
serve-webapp:
	@echo "⏭ Starting the NextJS Webapp in dev mode..."
	@cd ./webapp && npm run dev

.PHONY: serve-backoffice
serve-backoffice:
	@echo "💅 Starting the Backoffice in dev mode..."
	@cd ./backoffice && npm run start

##
# Backing services
##
.PHONY: serve-backing-services
serve-backing-services:
	@echo "🐳 Starting Postgres, Redis and OpenSearch..."
	# Don't try separating these. Docker compose does not like working in parallel, so they all need to come up at once
	@docker compose up postgres redis opensearch opensearch-proxy opensearch-dashboards service --build

.PHONY: serve-backoffice-stubs
serve-backoffice-stubs:
	@echo "🎫 Starting the Backoffice stub server..."
	@node ./backoffice/stubs.js

##
# Utils
##
.PHONY: clean
clean:
	docker compose down
