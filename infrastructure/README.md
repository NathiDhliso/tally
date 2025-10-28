# Voice-to-Invoice Infrastructure

AWS CDK infrastructure for the Voice-to-Invoice MVP application.

## Prerequisites

- Node.js 18+ installed
- AWS CLI installed and configured
- AWS account with appropriate permissions

## Setup

1. Install dependencies:
```bash
cd infrastructure
npm install
```

2. Configure AWS credentials:
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and default region (eu-west-1)
```

3. Bootstrap CDK (first time only):
```bash
npm run bootstrap
```

## Deployment

Deploy all stacks:
```bash
npm run deploy
```

Deploy specific stack:
```bash
npx cdk deploy VoiceToInvoiceNetworkStack
```

## Stacks

- **NetworkStack**: VPC with public and private subnets
- **DatabaseStack**: RDS PostgreSQL 15 instance
- **StorageStack**: S3 buckets for audio, invoices, and website
- **CDNStack**: CloudFront distribution
- **AuthStack**: Cognito user pool

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run synth` - Synthesize CloudFormation template
- `npm run deploy` - Deploy all stacks
- `npm run destroy` - Destroy all stacks
