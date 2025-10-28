#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { DatabaseStack } from '../lib/database-stack';
import { StorageStack } from '../lib/storage-stack';
import { CDNStack } from '../lib/cdn-stack';
import { AuthStack } from '../lib/auth-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'eu-west-1',
};

// Network infrastructure
const networkStack = new NetworkStack(app, 'VoiceToInvoiceNetworkStack', {
  env,
  description: 'VPC and networking infrastructure for Voice-to-Invoice MVP',
});

// Database infrastructure
const databaseStack = new DatabaseStack(app, 'VoiceToInvoiceDatabaseStack', {
  env,
  vpc: networkStack.vpc,
  description: 'RDS PostgreSQL database for Voice-to-Invoice MVP',
});

// Storage infrastructure (S3 buckets)
const storageStack = new StorageStack(app, 'VoiceToInvoiceStorageStack', {
  env,
  description: 'S3 buckets for audio, invoices, and website hosting',
});

// CDN infrastructure (CloudFront)
const cdnStack = new CDNStack(app, 'VoiceToInvoiceCDNStack', {
  env,
  websiteBucket: storageStack.websiteBucket,
  description: 'CloudFront distribution for Voice-to-Invoice MVP',
});

// Authentication infrastructure (Cognito)
const authStack = new AuthStack(app, 'VoiceToInvoiceAuthStack', {
  env,
  description: 'Cognito user pool for Voice-to-Invoice MVP',
});

// Add tags to all stacks
cdk.Tags.of(app).add('Project', 'VoiceToInvoice');
cdk.Tags.of(app).add('Environment', process.env.ENVIRONMENT || 'development');
