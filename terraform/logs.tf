resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/${terraform.workspace}/mca/beacons"
  tags              = module.beacons_label.tags
  retention_in_days = 30
}
