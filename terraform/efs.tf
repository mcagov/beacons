# Networked file system for the Service application to store export files etc.
resource "aws_efs_file_system" "service-filesystem" {
  creation_token = "${terraform.workspace}-service-filesystem"
  encrypted      = true
}

resource "aws_efs_mount_target" "service-filesystem" {
  count           = length(aws_subnet.service-filesystem.*.id)
  file_system_id  = aws_efs_file_system.service-filesystem.id
  subnet_id       = element(aws_subnet.service-filesystem.*.id, count.index)
  security_groups = [aws_security_group.service-filesystem.id]
}


resource "aws_security_group" "service-filesystem" {
  name        = "${terraform.workspace}-service-filesystem"
  description = "Permit access from ${aws_ecs_cluster.main.name} to ${aws_efs_file_system.service-filesystem.creation_token}"
  vpc_id      = aws_vpc.main.id

  ingress {
    security_groups = [aws_security_group.ecs_tasks.id]
    from_port       = 2049 // NFS reserved port
    to_port         = 2049 // NFS reserved port
    protocol        = "tcp"
  }

  egress {
    security_groups = [aws_security_group.ecs_tasks.id]
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
  }
}