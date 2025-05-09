variable "public_fqdn" {
  type        = string
  description = "The fully qualified domain name of the publicly accessible parts of the application"
}
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
// See docs for ecs task definition: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
variable "webapp_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) for the Beacons Webapp"
}
variable "webapp_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Webapp"
}
variable "webapp_azure_ad_client_secret" {
  sensitive   = true
  type        = string
  description = "The client secret for the consumer-facing web app, provided in Azure AD"
}
variable "webapp_azure_ad_client_id" {
  type        = string
  description = "The client identifier for the consumer-facing web app, provided in Azure AD"
}
variable "azure_ad_tenant_id" {
  sensitive   = true
  type        = string
  description = "The UUID for the Azure AD tenant, provided in Azure AD"
}
variable "webapp_next_auth_url" {
  type        = string
  description = "The NEXT AUTH environment variable used by NextAuth"
}
variable "webapp_azure_b2c_client_id" {
  type        = string
  description = "The Azure B2C Client ID for the B2C App Registration"
}
variable "webapp_azure_b2c_client_secret" {
  type        = string
  sensitive   = true
  description = "The client secret for the B2C App Registration"
}
variable "webapp_azure_b2c_tenant_name" {
  type        = string
  description = "The name of the Azure B2C tenant"
}
variable "webapp_azure_b2c_tenant_id" {
  type        = string
  description = "The UUID for the Azure B2C tenant"
}
variable "webapp_azure_b2c_login_flow" {
  type        = string
  description = "The Sign In User Flow defined in Azure B2C"
}
variable "webapp_azure_b2c_signup_flow" {
  type        = string
  description = "The Sign Up User Flow defined in Azure B2C"
}
variable "webapp_azure_b2c_next_auth_jwt_secret" {
  type        = string
  sensitive   = true
  description = "The random string used to hash tokens, sign cookies, and generate crytographic keys for NextAuth"
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
variable "service_basic_auth_username" {
  sensitive   = true
  type        = string
  description = "The Basic Auth username for the Spring API migration endpoints"
}
variable "service_basic_auth_password" {
  sensitive   = true
  type        = string
  description = "The Basic Auth username for the Spring API migration endpoints"
}
variable "service_spring_active_profiles" {
  sensitive   = true
  type        = string
  description = "A comma-separated list of Spring Boot profiles that are active"
}
// See docs for ecs task definition: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
variable "service_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) Beacons Service"
}
variable "service_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Service"
}
variable "service_azure_ad_api_id" {
  sensitive   = true
  type        = string
  description = "The GUID for the Service API, provided in Azure AD"
}
variable "service_beacon_search_scheduler_timeout" {
  type        = string
  description = "The amount of time to wait, in milliseconds, between refreshing the beacon search view which contains beacon and legacy beacon records"
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
variable "gov_notify_feedback_email_address" {
  type        = string
  description = "The email address to which feedback should be sent"
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
variable "redis_port" {
  type        = number
  description = "Port on which to serve Redis"
  default     = 6379
}
variable "nat_gateway_count" {
  type        = number
  description = "Number of NAT gateways"
  default     = 2
}
variable "backup_window" {
  type        = string
  description = "Time period e.g 23:00-23:55"
  default     = ""
}
variable "backup_retention_period" {
  type        = number
  description = "Days to retain backups"
  default     = 0
}
variable "performance_insights_enabled" {
  type        = bool
  description = "Enable performance insights"
  default     = false
}
variable "rds_multi_az" {
  type        = bool
  description = "Enable multiple availabilty zones for RDS"
  default     = false
}
variable "apply_immediately" {
  type        = bool
  description = "Apply changes to infrastrucure immediatly"
  default     = true
}
variable "alert_email_address" {
  sensitive   = true
  type        = string
  description = "Email Address subscribed to alerts"
}
variable "aws_account_number" {
  sensitive   = true
  type        = string
  description = "AWS Account Number"
  default     = ""
}
variable "enable_alerts" {
  type        = bool
  description = "When enabled CloudWatch alarm events are sent to the Alerts SNS Topic"
  default     = false
}
variable "low_disk_burst_balance_threshold" {
  type        = number
  description = "Alarm threshold for low RDS disk burst balance"
  default     = 100
}
variable "api_service_minimum_task_count" {
  type        = number
  description = "Minimum number of expected tasks to be running for the API Service"
  default     = 1
}
variable "webapp_minimum_task_count" {
  type        = number
  description = "Minimum number of expected tasks to be running for the Webapp"
  default     = 1
}
variable "trello_token" {
  type        = string
  description = "Token for Trello API"
}
variable "trello_api_key" {
  type        = string
  description = "Key for Trello API"
}
variable "trello_board_email_address" {
  type        = string
  description = "Email address for the Beacons Support user in Trello"
}
variable "trello_list_id" {
  type        = string
  description = "Unique identifier for list in Trello"
}
variable "opensearch_master_user_name" {
  type        = string
  description = "Master username for opensearch"
}
variable "opensearch_master_user_password" {
  type        = string
  description = "Master password for opensearch"
}
variable "opensearch_instance_type" {
  type        = string
  description = "Instance type for Opensearch data nodes"
}
variable "opensearch_dedicated_master_type" {
  type        = string
  description = "Instance type for Opensearch master nodes"
}
variable "opensearch_master_node_count" {
  type        = number
  description = "Dedicated master node count for Opensearch - must be correct number of nodes for master election"
}
variable "opensearch_instance_count" {
  type        = number
  description = "Data node count for Opensearch"
}
variable "opensearch_ebs_volume_size" {
  type        = number
  description = "Size of Elastic Block Store backing each data node in GB - min 10, max 100"
}
variable "opensearch_proxy_image_tag" {
  type        = string
  description = "Image tag of the Opensearch proxy container in ECR"
}
variable "ssl_certificate_arn" {
  type        = string
  description = "ARN of ssl certificate generated in the AWS dashboard"
}
variable "backoffice_azure_ad_client_id" {
  type        = string
  description = "The Client ID of the app registration in Azure AD for the Backoffice SPA"
}
variable "backoffice_image" {
  type        = string
  description = "The name of the image for the Backoffice application"
  default     = "beacons-backoffice"
}
variable "backoffice_image_tag" {
  type        = string
  description = "The image tag of the Backoffice application to be deployed"
}
variable "backoffice_count" {
  type        = number
  description = "Number of docker containers to run for the Backoffice application"
  default     = 1
}
variable "backoffice_port" {
  type        = number
  description = "Port exposed by the docker image to redirect traffic to for the Beacons Service"
  default     = 80
}
variable "backoffice_health_check_path" {
  type        = string
  description = "Health check path used by the Application Load Balancer for the Backoffice app"
  default     = "/health"
}
variable "backoffice_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) for the Backoffice app"
  default     = 1024
}
variable "backoffice_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Backoffice app"
  default     = 2048
}

/**
* This secret is created and managed manually via the Azure portal (https://portal.azure.com) inside the relevant
* environment's tenant.
*
* See https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-how-applications-are-added
*/
variable "opensearch_proxy_sso_client_id" {
  type        = string
  description = "App registration client ID for the OpenSearch Proxy single sign-on"
}
/**
* As for opensearch_proxy_sso_client_id.
*/
variable "opensearch_proxy_sso_client_secret" {
  type        = string
  description = "Client secret for OpenSearch Proxy single sign-on"
}

variable "microsoft_graph_client_id" {
  type        = string
  description = "Client id for the beacons service API to call the Microsoft Graph API"
  sensitive   = true
}

variable "microsoft_graph_client_secret" {
  type        = string
  description = "Client secret for the beacons service API to call the Microsoft Graph API"
  sensitive   = true
}

variable "microsoft_graph_b2c_tenant_id" {
  type        = string
  description = "Id of the Azure AD B2C tenant. Used by the beacons service API to call the Microsoft Graph API"
  sensitive   = true
}

variable "microsoft_graph_b2c_tenant_name" {
  type        = string
  description = "Name of the Azure AD B2C tenant. Used by the beacons service API to call the Microsoft Graph API"
  sensitive   = true
}
