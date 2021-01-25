variable "aws_region" {
  type        = string
  description = "The AWS region resources are created in"
  default     = "eu-west-2"
}
variable "ecs_task_execution_role_name" {
  type        = string
  description = "ECS task execution role name"
  default     = "McaEcsTaskExecutionRole"
}
variable "ecs_auto_scale_role_name" {
  type        = string
  description = "ECS auto scale role Name"
  default     = "McaEcsAutoScaleRole"
}
variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}
variable "app_name" {
  type        = string
  description = "Name of the application"
  default     = "Beacons Registation Application"
}
# TODO: get updated task docker image from registry of choice. 
variable "webapp_image" {
  type        = string
  description = "Docker image to run in the ECS cluster for the Beacons Webapp"
  default     = "261219435789.dkr.ecr.eu-west-2.amazonaws.com/mca-beacons-webapp:main"
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
  default     = 1024
}
variable "webapp_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Webapp"
  default     = 2048
}
# TODO: get updated task docker image from registry of choice. 
variable "service_image" {
  type        = string
  description = "Docker image to run in the ECS cluster"
  default     = "261219435789.dkr.ecr.eu-west-2.amazonaws.com/mca-beacons-service:main"
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
  default     = "/actuator/health"
}
variable "service_fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units) Beacons Service"
  default     = 1024
}
variable "service_fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB) for the Beacons Service"
  default     = 2048
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