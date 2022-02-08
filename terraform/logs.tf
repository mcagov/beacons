resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/${terraform.workspace}/mca/beacons"
  retention_in_days = 30
}

resource "aws_s3_bucket" "logs" {
  bucket = "${module.beacons_label.namespace}-${module.beacons_label.name}-${module.beacons_label.environment}-logs"
}