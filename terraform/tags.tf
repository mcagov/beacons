module "beacons_label" {
  source     = "git::https://github.com/cloudposse/terraform-null-label.git?ref=master"
  namespace  = "mca"
  environment = terraform.workspace
  name       = "beacons"

  tags = {
    Owner = "@mcga.sharepoint.com"
  }
}