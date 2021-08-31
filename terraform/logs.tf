resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/${terraform.workspace}/mca/beacons"
  retention_in_days = 30
}
