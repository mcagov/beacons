variable "service_name" {
  type        = string
  description = "The name of the ECS service (e.g., 'webapp' or 'service')."
}

variable "ecs_service_resource_id" {
  type        = string
  description = "The full resource ID of the ECS service."
}

variable "cluster_name" {
  type        = string
  description = "The name of the ECS cluster."
}

variable "min_capacity" {
  type        = number
  description = "The minimum number of tasks for the service."
  default     = 1
}

variable "max_capacity" {
  type        = number
  description = "The maximum number of tasks for the service."
  default     = 6
}