output transform_lambda_role {
  value = aws_iam_role.iam_for_lambda 
}

output export_lambda_role {
  value = aws_iam_role.iam_for_export
}
