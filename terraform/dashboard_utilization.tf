resource "aws_cloudwatch_dashboard" "utilization" {
  dashboard_name = "${terraform.workspace}-beacons-utilization-dashboard"

  dashboard_body = <<-EOT
{
  "widgets": [
      {
          "height": 4,
          "width": 24,
          "y": 12,
          "x": 0,
          "type": "log",
          "properties": {
              "query": "SOURCE '${aws_cloudwatch_log_group.log_group.name}' | fields @timestamp, @message\n| filter strcontains(@message, \"job\")\n| sort @timestamp desc\n| limit 200",
              "region": "${data.aws_region.current.name}",
              "stacked": false,
              "title": "Job-related logging messages",
              "view": "table"
          }
      },
      {
            "height": 6,
            "width": 6,
            "y": 0,
            "x": 0,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ "AWS/RDS", "ReadIOPS", "DBInstanceIdentifier", "${aws_db_instance.postgres.identifier}", { "id": "m1" } ],
                    [ ".", "CPUUtilization", ".", ".", { "id": "m2" } ],
                    [ ".", "DatabaseConnections", ".", ".", { "id": "m3" } ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${data.aws_region.current.name}",
                "title": "Impact to transactional database (RDS)",
                "stat": "Average",
                "period": 900
            }
      },
      {
          "height": 6,
          "width": 6,
          "y": 0,
          "x": 6,
          "type": "metric",
          "properties": {
              "metrics": [
                  [ "AWS/RDS", "CPUCreditBalance", "DBInstanceIdentifier", "${aws_db_instance.postgres.identifier}" ]
              ],
              "view": "timeSeries",
              "stacked": false,
              "region": "${data.aws_region.current.name}",
              "title": "RDS - CPUCreditBalance",
              "period": 300
          }
      },
      {
          "height": 3,
          "width": 6,
          "y": 6,
          "x": 18,
          "type": "metric",
          "properties": {
              "view": "singleValue",
              "metrics": [
                  [ "AWS/ES", "SearchableDocuments", "DomainName", "${aws_elasticsearch_domain.opensearch.domain_name}", "ClientId", "${data.aws_caller_identity.current.account_id}" ]
              ],
              "region": "${data.aws_region.current.name}",
              "title": "OpenSearch - Searchable documents"
          }
      },
      {
          "height": 6,
          "width": 6,
          "y": 6,
          "x": 6,
          "type": "metric",
          "properties": {
              "view": "timeSeries",
              "stacked": false,
              "metrics": [
                  [ "AWS/ES", "DeletedDocuments", "DomainName", "${aws_elasticsearch_domain.opensearch.domain_name}", "ClientId", "${data.aws_caller_identity.current.account_id}" ]
              ],
              "region": "${data.aws_region.current.name}",
              "title": "OpenSearch - DeletedDocuments"
          }
      },
      {
          "height": 6,
          "width": 6,
          "y": 0,
          "x": 18,
          "type": "metric",
          "properties": {
              "view": "timeSeries",
              "stacked": false,
              "metrics": [
                  [ "AWS/ES", "WriteThroughput", "DomainName", "${aws_elasticsearch_domain.opensearch.domain_name}", "ClientId", "${data.aws_caller_identity.current.account_id}" ]
              ],
              "region": "${data.aws_region.current.name}",
              "title": "OpenSearch - WriteThroughput"
          }
      },
      {
          "height": 6,
          "width": 6,
          "y": 0,
          "x": 12,
          "type": "metric",
          "properties": {
              "view": "timeSeries",
              "stacked": false,
              "metrics": [
                  [ "AWS/ECS", "CPUUtilization", "ServiceName", "${aws_ecs_service.service.name}", "ClusterName", "${aws_ecs_cluster.main.name}" ],
                  [ ".", "MemoryUtilization", ".", ".", ".", "." ]
              ],
              "region": "${data.aws_region.current.name}",
              "title": "Impact to API Service",
              "period": 300
          }
      },
      {
          "height": 6,
          "width": 6,
          "y": 6,
          "x": 0,
          "type": "metric",
          "properties": {
              "view": "timeSeries",
              "stacked": false,
              "metrics": [
                  [ "AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", "${aws_alb.main.arn_suffix}" ]
              ],
              "region": "${data.aws_region.current.name}",
              "title": "Load balancer response times",
              "period": 300,
              "annotations": {
                  "horizontal": [
                      {
                          "label": "100ms",
                          "value": 0.1
                      }
                  ]
              }
          }
      }
  ]
}
EOT
}
