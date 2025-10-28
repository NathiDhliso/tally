import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class StorageStack extends cdk.Stack {
  public readonly audioBucket: s3.Bucket;
  public readonly invoiceBucket: s3.Bucket;
  public readonly websiteBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Audio bucket with 24-hour expiration
    this.audioBucket = new s3.Bucket(this, 'AudioBucket', {
      bucketName: `voice-to-invoice-audio-${cdk.Aws.ACCOUNT_ID}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      lifecycleRules: [
        {
          id: 'DeleteOldAudio',
          enabled: true,
          expiration: cdk.Duration.days(1),
        },
      ],
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ['*'], // Will be restricted to specific domain in production
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Invoice bucket with intelligent tiering
    this.invoiceBucket = new s3.Bucket(this, 'InvoiceBucket', {
      bucketName: `voice-to-invoice-invoices-${cdk.Aws.ACCOUNT_ID}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      lifecycleRules: [
        {
          id: 'TransitionToIntelligentTiering',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(30),
            },
          ],
        },
      ],
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Website bucket for static hosting
    this.websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `voice-to-invoice-website-${cdk.Aws.ACCOUNT_ID}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      }),
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'AudioBucketName', {
      value: this.audioBucket.bucketName,
      description: 'Audio bucket name',
      exportName: 'VoiceToInvoiceAudioBucket',
    });

    new cdk.CfnOutput(this, 'InvoiceBucketName', {
      value: this.invoiceBucket.bucketName,
      description: 'Invoice bucket name',
      exportName: 'VoiceToInvoiceInvoiceBucket',
    });

    new cdk.CfnOutput(this, 'WebsiteBucketName', {
      value: this.websiteBucket.bucketName,
      description: 'Website bucket name',
      exportName: 'VoiceToInvoiceWebsiteBucket',
    });
  }
}
