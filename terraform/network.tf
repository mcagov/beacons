data "aws_availability_zones" "available" {
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_subnet" "public" {
  count                   = var.az_count
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}

resource "aws_subnet" "app" {
  count             = var.az_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, var.az_count + count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

resource "aws_subnet" "db" {
  count             = var.az_count
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, (2 * var.az_count) + count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

resource "aws_db_subnet_group" "db" {
  subnet_ids = aws_subnet.db.*.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.main.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

# resource "aws_vpc_endpoint" "ecr_api" {
#   vpc_id       = aws_vpc.main.id
#   service_name = "com.amazonaws.${var.aws_region}.ecr.api"
#   vpc_endpoint_type = "Interface"

#   subnet_ids = aws_subnet.app[*].id

#   security_group_ids = [
#     aws_security_group.vpc_endpoints.id,
#   ]
# }

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_endpoint_type = "Interface"

  subnet_ids = aws_subnet.app[*].id

  security_group_ids = [
    aws_security_group.vpc_endpoints.id,
  ]

  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
}

resource "aws_vpc_endpoint" "cloud_watch_logs" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.${var.aws_region}.logs"
  vpc_endpoint_type = "Interface"

  subnet_ids = aws_subnet.app[*].id

  security_group_ids = [
    aws_security_group.vpc_endpoints.id,
  ]
}

# resource "aws_vpc_endpoint" "ecs_agent" {
#   vpc_id       = aws_vpc.main.id
#   service_name = "com.amazonaws.${var.aws_region}.ecs-agent"
#   vpc_endpoint_type = "Interface"

#   subnet_ids = aws_subnet.app[*].id

#   security_group_ids = [
#     aws_security_group.vpc_endpoints.id,
#   ]
# }

# resource "aws_vpc_endpoint" "ecs_telemetry" {
#   vpc_id       = aws_vpc.main.id
#   service_name = "com.amazonaws.${var.aws_region}.ecs-telemetry"
#   vpc_endpoint_type = "Interface"

#   subnet_ids = aws_subnet.app[*].id

#   security_group_ids = [
#     aws_security_group.vpc_endpoints.id,
#   ]
# }

# resource "aws_vpc_endpoint" "ecs" {
#   vpc_id       = aws_vpc.main.id
#   service_name = "com.amazonaws.${var.aws_region}.ecs"
#   vpc_endpoint_type = "Interface"

#   subnet_ids = aws_subnet.app[*].id

#   security_group_ids = [
#     aws_security_group.vpc_endpoints.id,
#   ]
# }
