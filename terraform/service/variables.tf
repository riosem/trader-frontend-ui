variable "app" {
    type    = string
    default = "trader-frontend"
}

variable "region" {
    type    = string
    default = "us-east-1"
}

variable "env" {
    type    = string
    default = "dev"
}

variable "blue_green" {
    type    = string
    default = "blue"
}

variable "terraform_state_bucket" {
    description = "S3 bucket for Terraform state"
    type        = string
    default     = "YOUR-TERRAFORM-STATE-BUCKET"
}

variable "terraform_state_key" {
    description = "S3 key for Terraform state"  
    type        = string
    default     = "frontend-ui/terraform.tfstate"
}