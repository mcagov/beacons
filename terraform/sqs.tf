resource "aws_sqs_queue" "beacons_queue" {
  name                        = "beacons-queue.fifo"
  fifo_queue                  = true
  tags = {
    Environment = "development"
  }
}