aws_region                              = "eu-west-2"
az_count                                = 2
ecs_fargate_version                     = "1.4.0"
webapp_count                            = 1
webapp_fargate_cpu                      = 256
webapp_fargate_memory                   = 512
webapp_next_auth_url                    = "https://production.406beacons.com"
webapp_azure_b2c_tenant_id              = "da0cadc6-44c5-4830-bb04-82bddfd2f040"
webapp_azure_b2c_client_id              = "43557393-7cd2-416e-8bb2-96283dbdbcbc"
webapp_azure_b2c_tenant_name            = "B2CMCGA"
webapp_azure_b2c_login_flow             = "B2C_1_login_beacons"
webapp_azure_b2c_signup_flow            = "B2C_1_signup_beacons"
webapp_azure_ad_tenant_id               = "513fb495-9a90-425b-a49a-bc6ebe2a429e"
webapp_azure_ad_client_id               = "1ccbe14d-00e3-43ac-a434-8f7a38e03366"
service_count                           = 1
service_spring_active_profiles          = "default,migration"
service_fargate_cpu                     = 1024
service_fargate_memory                  = 2048
service_azure_ad_api_id                 = "5cdcbb41-958a-43b6-baa1-bbafd80b4f70"
service_beacon_search_scheduler_timeout = 10000
db_storage                              = 20
db_max_storage                          = 20
db_delete_protection                    = true
db_instance_class                       = "db.t3.micro"
db_storage_encrypted                    = true
db_skip_final_snapshot                  = false
backup_window                           = "23:00-23:55"
backup_retention_period                 = 30
performance_insights_enabled            = true
apply_immediately                       = false
rds_multi_az                            = true
enable_alerts                           = true
api_service_minimum_task_count          = 1
webapp_minimum_task_count               = 1
webapp_fqdn                             = "production.406beacons.com"
