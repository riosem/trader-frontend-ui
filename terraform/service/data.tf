data "aws_caller_identity" "current" {}

locals {
    backend_s3_key = "${var.env}/terraform.tfstate"
    app_name = "${var.app}"
    env = "${var.env}"

    cloudfront_distribution_url_list = jsondecode(file("distributions.json"))

}