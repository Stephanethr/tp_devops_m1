provider "aws" {
  region = "eu-west-3"  # Paris
}

# VPC et sous-réseaux
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name = "adcampaign-vpc"
  cidr = "10.0.0.0/16"
  azs             = ["eu-west-3a", "eu-west-3b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  enable_nat_gateway = true
}

# Cluster EKS
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  cluster_name = "adcampaign-cluster"
  cluster_version = "1.27"
  vpc_id  = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    main = {
      desired_capacity = 2
      max_capacity     = 5
      min_capacity     = 1
      instance_types   = ["t3.medium"]
    }
  }
}

# Base de données MongoDB
resource "aws_docdb_cluster" "mongodb" {
  cluster_identifier = "adcampaign-db"
  engine             = "docdb"
  master_username    = var.db_username
  master_password    = var.db_password
  backup_retention_period = 5
  db_subnet_group_name = aws_docdb_subnet_group.default.name
  vpc_security_group_ids = [aws_security_group.mongodb.id]
}

resource "aws_docdb_subnet_group" "default" {
  name       = "adcampaign-db-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "mongodb" {
  name        = "mongodb-sg"
  description = "Allow MongoDB traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# S3 bucket pour le frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "adcampaign-frontend-${random_string.suffix.result}"
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  
  index_document {
    suffix = "index.html"
  }
  
  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Variables
variable "db_username" {
  description = "Username for MongoDB"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Password for MongoDB"
  type        = string
  sensitive   = true
}

# Outputs
output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "frontend_url" {
  value = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "mongodb_endpoint" {
  value = aws_docdb_cluster.mongodb.endpoint
}