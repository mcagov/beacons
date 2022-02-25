aws_region                              = "eu-west-2"
az_count                                = 2
ecs_fargate_version                     = "1.4.0"
webapp_count                            = 1
webapp_fargate_cpu                      = 256
webapp_fargate_memory                   = 512
webapp_next_auth_url                    = "https://staging.406beacons.com"
webapp_azure_b2c_tenant_id              = "da0cadc6-44c5-4830-bb04-82bddfd2f040"
webapp_azure_b2c_client_id              = "43557393-7cd2-416e-8bb2-96283dbdbcbc"
webapp_azure_b2c_tenant_name            = "B2CMCGA"
webapp_azure_b2c_login_flow             = "B2C_1_login_beacons"
webapp_azure_b2c_signup_flow            = "B2C_1_signup_beacons"
webapp_azure_ad_tenant_id               = "3fd408b5-82e6-4dc0-a36c-6e2aa815db3e"
webapp_azure_ad_client_id               = "dfda519e-fa87-4676-8a79-d1b71f06052c"
service_count                           = 1
service_spring_active_profiles          = "default,migration"
service_fargate_cpu                     = 1024
service_fargate_memory                  = 2048
service_azure_ad_api_id                 = "8fb0f9ea-6351-4251-bcca-85e298bda8e7"
service_beacon_search_scheduler_timeout = "20000"
db_storage                              = 50
db_max_storage                          = 50
db_delete_protection                    = false
db_instance_class                       = "db.t3.micro"
db_storage_encrypted                    = false
db_skip_final_snapshot                  = true
nat_gateway_count                       = 1
backup_window                           = "23:00-23:55"
backup_retention_period                 = 5
performance_insights_enabled            = true
apply_immediately                       = true
rds_multi_az                            = false
api_service_minimum_task_count          = 1
webapp_minimum_task_count               = 1
public_fqdn                             = "staging.406beacons.com"
gov_notify_feedback_email_address       = "beacons_test_feedback@mailsac.com"
low_disk_burst_balance_threshold        = 75
opensearch_dedicated_master_type        = "t3.small.elasticsearch"
opensearch_instance_type                = "t3.small.elasticsearch"
opensearch_master_node_count            = 3
opensearch_instance_count               = 2
opensearch_ebs_volume_size              = 10
ssl_certificate_arn                     = "arn:aws:acm:eu-west-2:232705206979:certificate/0f4f1931-97d3-4504-88a7-ad28f1fb1d44"