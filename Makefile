backoffice-dev:
	@echo "🛠 Starting the Backoffice application and backing services in development mode..."
	@echo "🐳 Run 'docker compose logs -f' separately to see what backing services logs"
	docker compose down postgres opensearch opensearch-proxy service
	docker compose up --build postgres opensearch opensearch-proxy service --detach
	cd ./backoffice && npm run start