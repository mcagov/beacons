resource "aws_cloudwatch_dashboard" "service_health" {
  dashboard_name = "${terraform.workspace}-beacons-dashboard"

  dashboard_body = <<-EOT
{
    "widgets": [
        {
            "height": 2,
            "width": 24,
            "y": 0,
            "x": 0,
            "type": "text",
            "properties": {
                "markdown": "# Beacons Health - ${terraform.workspace}\n## Health Check Alarms"
            }
        },
        {
            "height": 2,
            "width": 24,
            "y": 5,
            "x": 0,
            "type": "text",
            "properties": {
                "markdown": "# Database Health\n## Alarms"
            }
        },
        {
            "height": 2,
            "width": 24,
            "y": 13,
            "x": 0,
            "type": "text",
            "properties": {
                "markdown": "# ECS Cluster Health\n## Alarms"
            }
        },
        {
            "height": 2,
            "width": 24,
            "y": 19,
            "x": 0,
            "type": "text",
            "properties": {
                "markdown": "# ElasticCache Health\n## Alarms"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 7,
            "x": 0,
            "type": "metric",
            "properties": {
                "title": "CPU Credit Balance",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_cpu_credit_balance_too_low[0].arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 10,
            "x": 6,
            "type": "metric",
            "properties": {
                "title": "Freeable Memory",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_memory_freeable_too_low.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 10,
            "x": 0,
            "type": "metric",
            "properties": {
                "title": "Free Storage Space",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_disk_free_storage_space_too_low.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 7,
            "x": 6,
            "type": "metric",
            "properties": {
                "title": "Swap Usage",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_memory_swap_usage_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 10,
            "x": 12,
            "type": "metric",
            "properties": {
                "title": "CPU Utilization",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_cpu_utilization_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 7,
            "x": 12,
            "type": "metric",
            "properties": {
                "title": "Disk Queue Depth",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_disk_queue_depth_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 6,
            "width": 6,
            "y": 7,
            "x": 18,
            "type": "metric",
            "properties": {
                "title": "Anomalous Connection Count",
                "annotations": {
                    "alarms": [
                        "${module.aws-rds-alarms.alarm_connection_count_anomalous.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 2,
            "x": 0,
            "type": "metric",
            "properties": {
                "title": "Webapp Health",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.webapp_health.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 2,
            "x": 6,
            "type": "metric",
            "properties": {
                "title": "API Health",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.service_health.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "height": 3,
            "width": 6,
            "y": 2,
            "x": 12,
            "type": "metric",
            "properties": {
                "title": "Webapp Task Count",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.ecs_webapp_task_count_too_low.arn}"
                    ]
                },
                "view": "singleValue"
            }
        },
        {
            "type": "metric",
            "x": 18,
            "y": 2,
            "width": 6,
            "height": 3,
            "properties": {
                "title": "API Task Count",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.ecs_service_task_count_too_low.arn}"
                    ]
                },
                "view": "singleValue"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 15,
            "width": 6,
            "height": 3,
            "properties": {
                "title": "Webapp Memory Utilization",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.ecs_webapp_memory_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "type": "metric",
            "x": 6,
            "y": 15,
            "width": 6,
            "height": 3,
            "properties": {
                "title": "API Memory Utilization",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.ecs_service_memory_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 15,
            "width": 6,
            "height": 3,
            "properties": {
                "title": "Webapp CPU Utilization",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.ecs_webapp_cpu_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "type": "metric",
            "x": 18,
            "y": 15,
            "width": 6,
            "height": 3,
            "properties": {
                "title": "API CPU Utilization",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.ecs_service_cpu_too_high.arn}"
                    ]
                },
                "view": "singleValue",
                "stacked": false,
                "type": "chart"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 22,
            "width": 6,
            "height": 3,
            "properties": {
                "title": "Memory Utilization",
                "annotations": {
                    "alarms": [
                        "${aws_cloudwatch_metric_alarm.redis_memory_too_high.arn}"
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
