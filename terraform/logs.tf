resource "aws_cloudwatch_log_group" "log_group" {
  name              = "mca/beacons"
  retention_in_days = 30

  tags = {
    Name = "mca-log-group"
  }
}
