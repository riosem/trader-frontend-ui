provider "aws" {
  region = var.region
  default_tags {
    tags = {
      app_name = var.app
      environment = var.env
      region = var.region
      blue_green = var.blue_green
    }
  }
}
