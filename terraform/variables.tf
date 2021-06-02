variable "aws_region" {
  type        = string
  description = "The AWS region resources are created in"
}
variable "az_count" {
  type        = number
  description = "Number of AZs to cover in a given region"
}
# See docs: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
variable "ecs_fargate_version" {
  type        = string
  description = "The version of fargate to run the ECS tasks on"
}
variable "webapp_image" {
  type        = string
  description = "Docker image to run in the ECS cluster for the Beacons Webapp"
  default     = "beacons-webapp"
}
variable "webapp_image_tag" {
  type        = string
  description = "Hash of the relevant commit to the mca-beacons-webapp repo"
}
variable "webapp_port" {
  type        = number
  description = "Port exposed by the docker image to redirect traffic to for the Beacons Webapp"
  default     = 3000
}
variable "webapp_count" {
  type        = number
  description = "Number of docker containers to run for the Beacons Webapp"
}
variable "webapp_health_check_path" {
  type        = string
  description = "Health check path used by the Application Load Balancer for the Beacons Webapp"
  default     = "/api/health"
}
variable "webapp_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) for the Beacons Webapp"
}
variable "webapp_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Webapp"
}
variable "service_image" {
  type        = string
  description = "Docker image to run in the ECS cluster"
  default     = "beacons-service"
}
variable "service_image_tag" {
  type        = string
  description = "Hash of the relevant commit to the mca-beacons-service repo"
}
variable "service_port" {
  type        = number
  description = "Port exposed by the docker image to redirect traffic to for the Beacons Service"
  default     = 8080
}
variable "service_count" {
  type        = number
  description = "Number of docker containers to run for the Beacons Service"
}
variable "service_health_check_path" {
  type        = string
  description = "Health check path used by the Application Load Balancer for the Beacons Service"
  default     = "/spring-api/actuator/health"
}
variable "service_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) Beacons Service"
}
variable "service_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Service"
}
variable "db_storage" {
  type        = number
  description = "Allocated storage, in GB, for the PostgreSQL instance"
}
variable "db_max_storage" {
  type        = number
  description = "The upper limit, in GB, to which PostgreSQL can automatically scale the storage of the DB"
}
variable "db_delete_protection" {
  type        = bool
  description = "Determines if the DB can be deleted. If true, the database cannot be deleted"
}
variable "db_name" {
  type        = string
  description = "The name of the database to create when the db instance is created"
  default     = "beacons"
}
variable "db_username" {
  type        = string
  description = "The username for the master database user"
  default     = "beacons_service"
  sensitive   = true
}
variable "db_password" {
  type        = string
  description = "The password used for the master database user"
  sensitive   = true
}
variable "gov_notify_api_key" {
  type        = string
  description = "The API key for Gov Notify"
  sensitive   = true
}
variable "gov_notify_customer_email_template" {
  type        = string
  description = "The template ID for the customer confirmation email"
  sensitive   = true
}
variable "basic_auth" {
  type        = string
  description = "A | separated list of username:passwords describing basic auth credentials"
  sensitive   = true
}
variable "db_instance_class" {
  type        = string
  description = "The database instance class"
}
# See: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html#Overview.Encryption.Availability for storage tiers that support encryption
variable "db_storage_encrypted" {
  type        = bool
  description = "Specifies whether the database instances data is encrypted"
}
variable "db_logs_exported" {
  type        = list(string)
  description = "Set of logs types to enable for exporting to CloudWatch logs. If empty, no logs will be exported"
  default     = ["postgresql", "upgrade"]

  validation {
    condition     = length(var.db_logs_exported) >= 0 && length(var.db_logs_exported) <= 2
    error_message = "Exported log options are either: postgresql or upgrade."
  }
}
variable "db_skip_final_snapshot" {
  type        = bool
  description = "Determines whether a final DB snapshot is created before the DB instance is deleted"
}
variable "webapp_client_secret" {
  sensitive   = true
  type        = string
  description = "The client secret for the consumer-facing web app, provided in Azure AD"
}
variable "webapp_client_id" {
  type        = string
  description = "The client identifier for the consumer-facing web app, provided in Azure AD"
}
variable "service_api_id" {
  sensitive   = true
  type        = string
  description = "The GUID for the Service API, provided in Azure AD"
}
variable "mca_azure_ad_tenant_id" {
  sensitive   = true
  type        = string
  description = "The UUID for the Azure AD tenant, provided in Azure AD"
}
variable "next_auth_url" {
  type        = string
  description = "The NEXT AUTH environment variable used by NextAuth"
}
variable "mca_azure_b2c_client_id" {
  type        = string
  description = "The Azure B2C Client ID for the B2C App Registration"
}
variable "mca_azure_b2c_client_secret" {
  type        = string
  sensitive   = true
  description = "The client secret for the B2C App Registration"
}
variable "mca_azure_b2c_tenant_name" {
  type        = string
  description = "The name of the Azure B2C tenant"
}
variable "mca_azure_b2c_tenant_id" {
  type        = string
  description = "The UUID for the Azure B2C tenant"
}
variable "mca_azure_b2c_login_flow" {
  type        = string
  description = "The Sign In User Flow defined in Azure B2C"
}
variable "mca_azure_b2c_auth_jwt_secret" {
  type        = string
  sensitive   = true
  descriptoin = "The random string used to hash tokens, sign cookies, and generate crytographic keys for Next Auth"
}
variable "redis_port" {
  type        = number
  description = "Port on which to serve Redis"
  default     = 6379
}