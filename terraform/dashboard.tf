resource "aws_cloudwatch_dashboard" "service-health" {
  dashboard_name = "beacons-dashboard"

  dashboard_body = <<-EOT
{                   
    "widgets": [        
        {           
            "height": 3,
            "width": 6, 
            "y": 7,
            "x": 0,
            "type": "metric",
            "properties": {
                "title": "Low CPU Credit Balance",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_cpu_credit_balance_too_low[0].arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }       
        }              
    ]
}
EOT
}
