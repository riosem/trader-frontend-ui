# Deployment Guide

This document provides comprehensive instructions for deploying the Trading Platform Frontend UI to AWS using Terraform and GitHub Actions.

## Prerequisites

### Required Tools
1. **Node.js 16+** and npm
2. **AWS CLI** configured with appropriate permissions
3. **Terraform** v1.0+ installed
4. **Git** for version control

### AWS Requirements
- AWS account with appropriate permissions
- AWS CLI configured with credentials
- S3 bucket for Terraform state (will be created if needed)

### External Services
- **Auth0 Account**: For authentication services
- **GitHub Repository**: For CI/CD workflows

## Architecture Overview

The application uses a microfrontend architecture deployed to AWS:

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐
│   CloudFront    │    │   CloudFront     │    │  CloudFront    │
│   (App Shell)   │    │   (Auth MFE)     │    │ (Positions MFE)│
└─────────────────┘    └──────────────────┘    └────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐
│   S3 Bucket     │    │   S3 Bucket      │    │  S3 Bucket     │
│   (App Assets)  │    │   (Auth Assets)  │    │(Position Assets)│
└─────────────────┘    └──────────────────┘    └────────────────┘
```

Each microfrontend is:
- Built independently
- Deployed to its own S3 bucket
- Served through CloudFront CDN
- Connected via Module Federation at runtime

## Environment Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd trader-frontend-ui
```

### 2. Install Dependencies

Install dependencies for each microfrontend:
```bash
# App shell
cd mfes/app
npm install
cd ../..

# Authentication service
cd mfes/auth  
npm install
cd ../..

# Positions service
cd mfes/positions
npm install
cd ../..
```

### 3. Configure AWS Credentials

Option A: AWS CLI Configuration
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

Option B: Environment Variables
```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

### 4. Set Up Auth0

1. Create an Auth0 account at https://auth0.com
2. Create a new Application (Single Page Application)
3. Configure the following settings:
   - **Allowed Callback URLs**: `https://your-domain.com/callback, http://localhost:3007/callback`
   - **Allowed Logout URLs**: `https://your-domain.com, http://localhost:3007`
   - **Allowed Web Origins**: `https://your-domain.com, http://localhost:3007`

## Local Development

### 1. Environment Variables

Create environment files for each service:

#### Auth Service Environment
```bash
cd mfes/auth
cat > .env << EOF
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_SCOPE=openid profile email
PROXY_API_BASE_URL=http://localhost:8000
EOF
cd ../..
```

#### App Shell Environment
```bash
cd mfes/app
cat > .env << EOF
AUTH_SERVICE_URL=http://localhost:3005
POSITIONS_SERVICE_URL=http://localhost:3006
EOF
cd ../..
```

### 2. Start Development Servers

Open three terminal windows:

**Terminal 1 - Auth Service:**
```bash
cd mfes/auth
npm start
# Runs on http://localhost:3005
```

**Terminal 2 - Positions Service:**
```bash
cd mfes/positions  
npm start
# Runs on http://localhost:3006
```

**Terminal 3 - App Shell:**
```bash
cd mfes/app
npm start
# Runs on http://localhost:3007
```

### 3. Access Application
- **Main Application**: http://localhost:3007
- **Auth Service**: http://localhost:3005
- **Positions Service**: http://localhost:3006

## AWS Infrastructure Setup

### 1. Configure Terraform Backend

First, you need to set up the Terraform backend variables. The providers.tf file references variables that need to be defined:

```bash
cd terraform/service
```

Create or update `variables.tf` to include the backend variables:
```hcl
variable "terraform_state_bucket" {
  description = "S3 bucket for Terraform state"
  type        = string
  default     = "your-terraform-state-bucket"
}

variable "terraform_state_key" {
  description = "S3 key for Terraform state"
  type        = string
  default     = "frontend-ui/terraform.tfstate"
}
```

### 2. Initialize Terraform

```bash
cd terraform/service

# Initialize Terraform
terraform init

# Create workspace for environment (optional)
terraform workspace new dev
```

### 3. Configure Variables

Create environment-specific variable files:

**Development Environment (`dev.tfvars`):**
```hcl
app = "trader-frontend"
env = "dev"
region = "us-east-1"
blue_green = "blue"
```

**Production Environment (`prod.tfvars`):**
```hcl
app = "trader-frontend"
env = "prod"
region = "us-east-1"  
blue_green = "blue"
```

### 4. Deploy Infrastructure

#### Development Environment
```bash
# Plan deployment
terraform plan -var-file="variables/dev.tfvars"

# Apply changes
terraform apply -var-file="variables/dev.tfvars"
```

#### Production Environment
```bash
# Plan deployment
terraform plan -var-file="variables/prod.tfvars"

# Apply changes
terraform apply -var-file="variables/prod.tfvars"
```

## Manual Deployment

### 1. Build Applications

Build each microfrontend for production:

```bash
# Build auth service
cd mfes/auth
AUTH0_DOMAIN=your-domain.auth0.com \
AUTH0_CLIENT_ID=your-client-id \
AUTH0_SCOPE="openid profile email" \
PROXY_API_BASE_URL=https://api.your-domain.com \
npm run build

# Build positions service
cd ../positions
npm run build

# Build app shell
cd ../app
AUTH_SERVICE_URL=https://auth.your-domain.com \
POSITIONS_SERVICE_URL=https://positions.your-domain.com \
npm run build

cd ../..
```

### 2. Upload to S3

Upload built assets to their respective S3 buckets:

```bash
# Upload auth service
aws s3 sync mfes/auth/dist/ s3://your-auth-bucket --delete

# Upload positions service  
aws s3 sync mfes/positions/dist/ s3://your-positions-bucket --delete

# Upload app shell
aws s3 sync mfes/app/dist/ s3://your-app-bucket --delete
```

### 3. Invalidate CloudFront Cache

```bash
# Get CloudFront distribution IDs (from Terraform output or AWS console)
AUTH_DISTRIBUTION_ID="E1234567890ABC"
POSITIONS_DISTRIBUTION_ID="E0987654321XYZ"  
APP_DISTRIBUTION_ID="E1111111111AAA"

# Invalidate caches
aws cloudfront create-invalidation --distribution-id $AUTH_DISTRIBUTION_ID --paths "/*"
aws cloudfront create-invalidation --distribution-id $POSITIONS_DISTRIBUTION_ID --paths "/*"
aws cloudfront create-invalidation --distribution-id $APP_DISTRIBUTION_ID --paths "/*"
```

## GitHub Actions CI/CD

### 1. Repository Secrets

Configure the following secrets in your GitHub repository:

#### AWS Credentials
- `AWS_ACCESS_KEY_ID` - AWS access key for development
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for development
- `AWS_ACCESS_KEY_ID_PROD` - AWS access key for production
- `AWS_SECRET_ACCESS_KEY_PROD` - AWS secret key for production

#### S3 Bucket Names
- `FRONTEND_APP_BUCKET` - S3 bucket for app shell (dev)
- `FRONTEND_AUTH_BUCKET` - S3 bucket for auth service (dev)
- `FRONTEND_POSITIONS_BUCKET` - S3 bucket for positions service (dev)
- `FRONTEND_APP_BUCKET_PROD` - S3 bucket for app shell (prod)
- `FRONTEND_AUTH_BUCKET_PROD` - S3 bucket for auth service (prod)  
- `FRONTEND_POSITIONS_BUCKET_PROD` - S3 bucket for positions service (prod)

#### Service URLs
- `AUTH_SERVICE_URL_PROD` - Production Auth0 configuration
- `POSITIONS_SERVICE_URL_PROD` - Production positions service URL

### 2. Workflow Usage

The repository includes pre-configured GitHub Actions workflows:

#### Build and Upload Workflows
- `build_upload_dev_app.yml` - Deploy app shell to development
- `build_upload_dev_auth.yml` - Deploy auth service to development  
- `build_upload_dev_positions.yml` - Deploy positions service to development
- `build_upload_prod_*` - Production equivalents

#### Infrastructure Workflows
- `deploy_dev_app_cloudfront.yml` - Deploy CloudFront infrastructure (dev)
- `deploy_prod_app_cloudfront.yml` - Deploy CloudFront infrastructure (prod)

#### Trigger Deployments

**Development Deployment:**
1. Go to Actions tab in GitHub
2. Select "Deploy DEV App Cloudfront"
3. Click "Run workflow"
4. Choose region and action (deploy/destroy)

**Production Deployment:**
1. Select "Deploy PROD App Cloudfront"  
2. Choose region and action
3. Confirm deployment

## Environment Configuration

### Development Environment

**Service URLs:**
- App Shell: `https://d1234567890abc.cloudfront.net`
- Auth Service: `https://d0987654321xyz.cloudfront.net`
- Positions Service: `https://d1111111111aaa.cloudfront.net`

**Environment Variables:**
```bash
AUTH0_DOMAIN=dev-tenant.auth0.com
AUTH0_CLIENT_ID=dev-client-id
PROXY_API_BASE_URL=https://dev-api.your-domain.com
```

### Production Environment

**Service URLs:**
- App Shell: `https://app.your-domain.com`
- Auth Service: `https://auth.your-domain.com`  
- Positions Service: `https://positions.your-domain.com`

**Environment Variables:**
```bash
AUTH0_DOMAIN=prod-tenant.auth0.com
AUTH0_CLIENT_ID=prod-client-id
PROXY_API_BASE_URL=https://api.your-domain.com
```

## Custom Domain Setup

### 1. Route 53 Configuration

If using custom domains, configure Route 53:

```bash
# Create hosted zone (if not exists)
aws route53 create-hosted-zone --name your-domain.com --caller-reference $(date +%s)

# Create CNAME records pointing to CloudFront distributions
aws route53 change-resource-record-sets --hosted-zone-id Z1234567890ABC --change-batch file://dns-changes.json
```

### 2. SSL Certificates

Request SSL certificates through AWS Certificate Manager:

```bash
# Request certificate for your domain
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names "*.your-domain.com" \
  --validation-method DNS \
  --region us-east-1
```

## Monitoring and Troubleshooting

### 1. CloudWatch Logs

Monitor CloudFront and S3 access logs:

```bash
# View CloudFront logs
aws logs filter-log-events --log-group-name /aws/cloudfront/access-logs

# Monitor S3 access patterns
aws s3api get-bucket-logging --bucket your-bucket-name
```

### 2. Performance Monitoring

- **CloudFront Analytics**: Monitor cache hit ratios and origin requests
- **S3 Metrics**: Track request patterns and storage usage
- **Browser DevTools**: Monitor Core Web Vitals and loading performance

### 3. Common Issues

#### Module Federation Errors
**Problem**: `Loading chunk failed` or `Script error`
**Solution**: 
- Verify all service URLs are correct in environment variables
- Check CORS configuration on S3 buckets
- Ensure CloudFront distributions are deployed and accessible

#### Authentication Issues  
**Problem**: Auth0 login redirect fails
**Solution**:
- Verify Auth0 callback URLs include your domain
- Check Auth0 client ID and domain configuration
- Ensure HTTPS is used for production Auth0 callbacks

#### Build Failures
**Problem**: npm build fails with module errors
**Solution**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Verify all environment variables are set correctly
- Check for version conflicts in package.json

### 4. Rollback Procedures

#### Application Rollback
```bash
# Revert to previous S3 version
aws s3api list-object-versions --bucket your-bucket --prefix index.html
aws s3api get-object --bucket your-bucket --key index.html --version-id previous-version-id index.html
aws s3 cp index.html s3://your-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

#### Infrastructure Rollback
```bash
# Terraform rollback
cd terraform/service
terraform plan -destroy -var-file="variables/prod.tfvars"
terraform apply -destroy -var-file="variables/prod.tfvars"
```

## Security Considerations

### 1. S3 Bucket Security
- Enable versioning for rollback capability
- Configure bucket policies for CloudFront-only access
- Enable access logging for audit trails

### 2. CloudFront Security
- Configure Origin Access Identity (OAI)
- Enable security headers (HSTS, CSP, etc.)
- Set up Web Application Firewall (WAF) if needed

### 3. Auth0 Security
- Use secure redirect URLs (HTTPS only for production)
- Configure appropriate scopes and permissions
- Enable multifactor authentication where required

## Cost Optimization

### 1. CloudFront Configuration
- Configure appropriate caching behaviors
- Use compression for text assets
- Set up appropriate TTL values

### 2. S3 Optimization  
- Enable S3 Transfer Acceleration if needed
- Use appropriate storage classes
- Configure lifecycle policies for old versions

### 3. Monitoring Costs
- Set up billing alerts
- Monitor CloudFront and S3 usage
- Use AWS Cost Explorer for cost analysis

## Advanced Configuration

### 1. Multi-Region Deployment

For global applications, consider multi-region deployment:

```bash
# Deploy to multiple regions
terraform apply -var-file="variables/prod.tfvars" -var="region=us-east-1"
terraform apply -var-file="variables/prod.tfvars" -var="region=eu-west-1"
terraform apply -var-file="variables/prod.tfvars" -var="region=ap-southeast-1"
```

### 2. Blue-Green Deployment

Use the blue_green variable for zero-downtime deployments:

```bash
# Deploy to green environment
terraform apply -var-file="variables/prod.tfvars" -var="blue_green=green"

# Test green environment
# Switch traffic to green
# Destroy blue environment when confident
```

### 3. Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle sizes
cd mfes/app
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js
```

#### Preloading Strategy
Configure module preloading in webpack:
```javascript
// webpack.config.js
plugins: [
  new ModuleFederationPlugin({
    // ... other config
    exposes: {
      './Component': './src/Component',
    },
    shared: {
      react: { singleton: true, eager: true },
      'react-dom': { singleton: true, eager: true },
    },
  }),
],
```

## Support and Maintenance

### 1. Regular Updates
- Monitor for security updates in dependencies
- Update Node.js and npm versions regularly
- Keep AWS CLI and Terraform updated

### 2. Backup Procedures
- S3 versioning enabled for automatic backups
- Terraform state backup to separate S3 bucket
- Environment configuration backup

### 3. Disaster Recovery
- Multi-region deployment for high availability
- Automated backup and restore procedures
- Infrastructure as Code for rapid recovery

---

## Additional Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)

For questions or issues:
1. Check this deployment guide
2. Review GitHub Issues for known problems  
3. Create new issue with detailed error logs
4. Follow security guidelines when sharing information
