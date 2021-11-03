output snapshots_bucket {
  value = module.s3_bucket_snapshots
}

output csv_bucket {
  value = module.s3_bucket_csv
}

output layer_store_bucket {
  value = module.s3_bucket_lambda_layer_store
}
