/**
* Logging entries that are likely to mean a P2 has occurred.
*
* A P2 means "An essential user journey cannot be completed by a subset of users (e.g. subset of users cannot register
* a beacon)."
*/
resource "aws_cloudwatch_query_definition" "priority-2" {
  name = "${terraform.workspace}-p2-logs"

  log_group_names = [aws_cloudwatch_log_group.log_group.name]

  query_string = <<EOF
fields @timestamp, @message, @logStream
| sort @timestamp desc
| parse @logStream "*/*" as application
| filter @message like "${local.spreadsheet_export_failed}"
| display @timestamp, application, @message
  EOF
}

locals {
  spreadsheet_export_failed = "[SPREADSHEET_EXPORT_FAILED]"
}