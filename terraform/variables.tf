variable "aws_region" {
  type        = string
  description = "The AWS region things are created in"
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
variable "app_image" {
  type        = string
  description = "Docker image to run in the ECS cluster"
  default     = "261219435789.dkr.ecr.eu-west-2.amazonaws.com/mca-beacons-webapp:main"
}

variable "app_port" {
  type        = number
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 3000
}

variable "app_count" {
  type        = number
  description = "Number of docker containers to run"
  default     = 1
}

variable "health_check_path" {
  type    = string
  default = "/"
}

variable "fargate_cpu" {
  type        = number
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = 1024
}

variable "fargate_memory" {
  type        = number
  description = "Fargate instance memory to provision (in MiB)"
  default     = 2048
}
