variable "env" {
  type        = string
  description = "The environment the resources are deployed into"
}
variable "aws_region" {
  type        = string
  description = "The AWS region resources are created in"
  default     = "eu-west-2"
}
variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}
variable "app_name" {
  type        = string
  description = "Name of the application"
  default     = "Beacons Registration Application"
}
// TODO: Create ECR for webapp in MCA aws and update this to use that value
variable "webapp_image" {
  type        = string
  description = "Docker image to run in the ECS cluster for the Beacons Webapp"
  default     = "261219435789.dkr.ecr.eu-west-2.amazonaws.com/mca-beacons-webapp"
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
  default     = 1
}
variable "webapp_health_check_path" {
  type        = string
  description = "Health check path used by the Application Load Balancer for the Beacons Webapp"
  default     = "/"
}
variable "webapp_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) for the Beacons Webapp"
  default     = 256
}
variable "webapp_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Webapp"
  default     = 512
}
// TODO: Create ECR for service in MCA aws and update this to use that value
variable "service_image" {
  type        = string
  description = "Docker image to run in the ECS cluster"
  default     = "261219435789.dkr.ecr.eu-west-2.amazonaws.com/mca-beacons-service"
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
  default     = 1
}
variable "service_health_check_path" {
  type        = string
  description = "Health check path used by the Application Load Balancer for the Beacons Service"
  default     = "/spring-api/actuator/health"
}
variable "service_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) Beacons Service"
  default     = 256
}
variable "service_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Service"
  default     = 512
}
variable "create_webapp_ecr" {
  type        = bool
  description = "Determines if the webapp ECR should be created"
  default     = false
}
variable "create_service_ecr" {
  type        = bool
  description = "Determines if the service ECR should be created"
  default     = false
}
variable "db_storage" {
  type        = number
  description = "Allocated storage, in GB, for the PostgreSQL instance"
  default     = 20
}
variable "db_max_storage" {
  type        = number
  description = "The upper limit, in GB, to which PostgreSQL can automatically scale the storage of the DB"
  default     = 20
}
variable "db_delete_protection" {
  type        = bool
  description = "Determines if the DB can be deleted. If true, the database cannot be deleted"
  default     = false
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
variable "db_instance_class" {
  type        = string
  description = "The database instance class"
  default     = "db.t2.micro"
}
# See: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html#Overview.Encryption.Availability for storage tiers that support encryption
variable "db_storage_encrypted" {
  type        = bool
  description = "Specifies whether the database instances data is encrypted"
  default     = false
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
