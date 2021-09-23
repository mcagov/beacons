variable "aws_region" {
  type        = string
  description = "The AWS region in which to create resources"
}

variable "cloudfront_domain_name" {
  type        = string
  description = "The domain name where CloudFront will be presented from"
}