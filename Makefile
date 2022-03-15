backoffice-dev:
	@echo "🛠 Starting the Backoffice application and backing services in development mode..."
	docker compose up --build postgres opensearch opensearch-proxy service --detach
	cd ./backoffice && npm run start