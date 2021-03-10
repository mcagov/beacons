resource "aws_cloudwatch_log_group" "log_group" {
  name              = "${var.env}/mca/beacons"
  retention_in_days = 30

  tags = {
    Name = "${var.env}-mca-log-group"
  }
}
