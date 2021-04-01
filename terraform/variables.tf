variable "env" {
  type        = string
  description = "The environment the resources are deployed into"
}
variable "aws_region" {
  type        = string
  description = "The AWS region resources are created in"
}
variable "az_count" {
  type        = number
  description = "Number of AZs to cover in a given region"
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
  default     = "/"
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
