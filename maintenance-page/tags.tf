module "beacons_label" {
  source      = "git::https://github.com/cloudposse/terraform-null-label.git?ref=cf38625a5dde227db04c9cfedc1327d610229fec"
  namespace   = "mca"
  environment = terraform.workspace
  name        = "mca-beacons-maintenance-page"

  tags = {
    Owner                  = "BeaconRegistry@mcga.onmicrosoft.com"
    GovtServiceName        = "Beacons"
    ApplicationServiceName = "Beacons Maintenance Page"
  }
}
