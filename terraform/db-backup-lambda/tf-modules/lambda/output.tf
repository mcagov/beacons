output "cron_lambda" {
  value = module.lambda_function_db_snapshot_cron
}

output "transform_lambda" {
  value = module.lambda_function_parquet_to_csv
}
