resource "aws_ecr_repository" "webapp" {
  count = var.create_webapp_ecr ? 1 : 0
  name  = "mca-beacons-webapp"
}

resource "aws_ecr_repository" "service" {
  count = var.create_service_ecr ? 1 : 0
  name  = "mca-beacons-service"
}