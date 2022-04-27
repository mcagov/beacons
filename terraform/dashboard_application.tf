resource "aws_cloudwatch_dashboard" "application_health" {
  dashboard_name = "${terraform.workspace}-beacons-application-dashboard"

  dashboard_body = <<-EOT
{
  "widgets": [
      {
          "height": 6,
          "width": 24,
          "y": 2,
          "x": 0,
          "type": "log",
          "properties": {
              "query": "SOURCE '/${terraform.workspace}/mca/beacons' | fields @timestamp, @message\n| sort @timestamp desc\n| filter @message like /Failed to register/",
              "region": "${data.aws_region.current.name}",
              "stacked": false,
              "view": "table"
          }
      },
      {
          "height": 2,
          "width": 24,
          "y": 0,
          "x": 0,
          "type": "text",
          "properties": {
              "markdown": "# Attempted Registrations\n\nAn \"attempt\" to register a beacon is defined as the attempt to persist a registration at the moment the user confirms that they have completed the registration form and clicks \"Accept and send\". This therefore does not track failures earlier in the user journey such as \"failure to create an account.\""
          }
      },
      {
          "type": "log",
          "x": 0,
          "y": 8,
          "width": 24,
          "height": 6,
          "properties": {
              "query": "SOURCE '/${terraform.workspace}/mca/beacons' | fields @timestamp, @message\n| fields strcontains(@message, \"Registration sent\") as registration_succeeded\n| fields strcontains(@message, \"Failed to register\") as registration_failed\n| stats sum(registration_succeeded) as registrations_succeeded, sum(registration_failed) as registrations_failed by bin(1d) as day\n| sort day asc",
              "region": "${data.aws_region.current.name}",
              "stacked": false,
              "title": "Attempted registrations per day",
              "view": "bar"
          }
      }
  ]
}
EOT
}
