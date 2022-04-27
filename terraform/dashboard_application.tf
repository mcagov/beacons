resource "aws_cloudwatch_dashboard" "application_health" {
  dashboard_name = "${terraform.workspace}-beacons-application-dashboard"

  dashboard_body = <<-EOT
{
    "widgets": [
        {
            "type": "log",
            "x": 0,
            "y": 2,
            "width": 24,
            "height": 6,
            "properties": {
                "query": "SOURCE '/${terraform.workspace}/mca/beacons' | fields @timestamp, @message\n| sort @timestamp desc\n| filter @message like /Failed to register/",
                "region": "${data.aws_region.current.name}",
                "stacked": false,
                "view": "table"
            }
        },
        {
            "type": "text",
            "x": 0,
            "y": 0,
            "width": 24,
            "height": 1,
            "properties": {
                "markdown": "# Registrations \n"
            }
        },
        {
            "type": "text",
            "x": 0,
            "y": 1,
            "width": 24,
            "height": 1,
            "properties": {
                "markdown": "## Failed registrations"
            }
        },
        {
            "type": "log",
            "x": 0,
            "y": 8,
            "width": 24,
            "height": 6,
            "properties": {
                "query": "SOURCE '/${terraform.workspace}/mca/beacons' | fields @timestamp, @message\n| sort @timestamp desc\n| fields strcontains(@message, \"Failed to register\") as failed_to_register\n| stats sum(failed_to_register) as failures_to_register by bin(1d) as day\n| sort day asc\n",
                "region": "${data.aws_region.current.name}",
                "stacked": false,
                "title": "Failed registrations per day",
                "view": "bar"
            }
        },
        {
            "type": "text",
            "x": 0,
            "y": 14,
            "width": 24,
            "height": 1,
            "properties": {
                "markdown": "## Successful registrations"
            }
        },
        {
            "type": "log",
            "x": 0,
            "y": 15,
            "width": 24,
            "height": 6,
            "properties": {
                "query": "SOURCE '/${terraform.workspace}/mca/beacons' | fields @timestamp, @message\n| fields strcontains(@message, \"Registration sent\") as registration_sent\n| stats sum(registration_sent) as registrations_sent by bin(1d) as day\n| sort day desc",
                "region": "${data.aws_region.current.name}",
                "title": "Successful registrations per day",
                "view": "bar"
            }
        }
    ]
}
EOT
}
