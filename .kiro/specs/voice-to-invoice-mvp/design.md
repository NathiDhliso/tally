# Design Document

## Overview

The Voice-to-Invoice MVP is a serverless, mobile-first web application built on AWS infrastructure that enables South African small businesses to create professional invoices through voice input in 10-20 seconds. The system uses a progressive enhancement approach, starting with local-only anonymous usage and offering optional cloud sync.

### Key Design Principles

1. **Speed First**: Target 10-20 second end-to-end invoice creation
2. **Progressive Enhancement**: Work offline-first, sync when available
3. **Graceful Degradation**: Always provide manual entry fallback
4. **Mobile-First**: Optimize for touch interfaces and small screens
5. **Cost-Optimized**: Leverage AWS free tier and serverless architecture
6. **Privacy-Focused**: Anonymous by default, opt-in cloud sync

### Technology Stack

**Frontend:**
- React 18 with Vite (fast dev server, optimized builds)
- Tailwind CSS for styling
- Zustand for state management
- React Hook Form + Zod for validation
- @react-pdf/renderer for PDF generation
- Fuse.js for fuzzy search
- IndexedDB (idb) for local storage

**Backend (AWS):**
- API Gateway (REST + WebSocket)
- Lambda (Node.js 18.x)
- RDS PostgreSQL 15
- S3 + CloudFront CDN
- Cognito for authentication
- SES for email
- Secrets Manager for API keys
- CloudWatch for monitoring

**Third-Party APIs:**
- OpenAI Whisper API (transcription)
- Claude 3.5 Sonnet / GPT-4o-mini (extraction)
- Deepgram (fallback transcription)

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ React Web App│  │ React Native │  │  IndexedDB   │     │
│  │   (Vite)     │  │   (Expo)     │  │  (Local)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN Layer                                │
│              CloudFront Distribution                        │
│         (Static Assets + PDF Delivery)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  REST API    │  │  WebSocket   │  │   Cognito    │     │
│  │  Endpoints   │  │  (Real-time) │  │ Authorizer   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Compute Layer (Lambda)                     │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ process-voice-   │  │ extract-invoice- │               │
│  │ recording        │  │ data             │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ send-invoice-    │  │ sync-user-data   │               │
│  │ email            │  │                  │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ RDS Postgres │  │  S3 Buckets  │  │   Secrets    │     │
│  │  (Primary)   │  │ (Audio/PDFs) │  │   Manager    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Whisper    │  │    Claude    │  │   Deepgram   │     │
│  │     API      │  │  / GPT-4o    │  │  (Fallback)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow: Voice to Invoice

```
1. User taps mic → Start recording
2. Audio captured → Compress (50-70% reduction)
3. Upload to S3 → Trigger Lambda (S3 event)
4. Lambda → Call Whisper API (3-8s)
5. Transcription → Call Claude API (2-5s)
6. Extraction → Return JSON with confidence scores
7. Display review form → User edits if needed
8. Generate PDF → Upload to S3
9. Share/Send → Email via SES or native share
```

### Offline-First Architecture

The application implements a progressive web app (PWA) pattern with offline-first capabilities:

1. **Anonymous Mode**: All data stored in IndexedDB, no server required
2. **Sync Queue**: Failed requests queued and retried on reconnection
3. **Optimistic UI**: Immediate feedback, background sync
4. **Service Worker**: Cache static assets for offline access

## Components and Interfaces

### Frontend Component Hierarchy

```
App
├── AuthProvider (Cognito integration)
├── SyncProvider (Online/offline state)
├── ToastProvider (Global notifications)
└── Router
    ├── HomePage
    │   ├── VoiceRecorder
    │   │   ├── MicrophoneButton
    │   │   ├── AudioLevelMeter
    │   │   ├── RecordingTimer
    │   │   └── ProcessingOverlay
    │   ├── RecentClientsOverlay
    │   └── ManualEntryButton
    ├── InvoiceReviewPage
    │   ├── InvoiceForm
    │   │   ├── ClientAutocomplete
    │   │   ├── ConfidenceIndicator
    │   │   ├── FieldInput (with validation)
    │   │   └── TotalCalculator
    │   └── PDFPreviewModal
    ├── ClientsPage
    │   ├── ClientList
    │   ├── ClientSearch (fuzzy)
    │   └── AddClientModal
    ├── InvoiceHistoryPage
    │   ├── InvoiceList (infinite scroll)
    │   ├── InvoiceFilters
    │   └── InvoiceCard
    ├── SettingsPage
    │   ├── BusinessInfoForm
    │   ├── LogoUpload
    │   ├── InvoiceNumbering
    │   └── SyncSettings
    └── OnboardingWizard
        └── StepIndicator
```

### Key Component Designs

#### VoiceRecorder Component

**Responsibilities:**
- Request and manage microphone permissions
- Capture audio using MediaRecorder API (web) or expo-av (mobile)
- Display real-time audio visualization
- Handle recording states (idle, recording, processing, error)
- Compress audio before upload
- Trigger transcription pipeline

**State Management:**
```typescript
interface VoiceRecorderState {
  status: 'idle' | 'recording' | 'uploading' | 'transcribing' | 'extracting' | 'complete' | 'error';
  duration: number;
  audioBlob: Blob | null;
  audioLevel: number;
  error: Error | null;
  progress: number; // 0-100
}
```

**Key Methods:**
- `startRecording()`: Request permissions and begin capture
- `stopRecording()`: Finalize recording and trigger upload
- `compressAudio(blob)`: Reduce file size using ffmpeg.wasm
- `uploadToS3(blob)`: Get presigned URL and upload
- `handleError(error)`: Display appropriate error message and fallback

#### InvoiceForm Component

**Responsibilities:**
- Display extracted fields with confidence indicators
- Provide inline validation and error messages
- Auto-save drafts every 2 seconds
- Calculate total amount in real-time
- Integrate client autocomplete with fuzzy matching
- Trigger follow-up voice recording for unclear fields

**Props:**
```typescript
interface InvoiceFormProps {
  extractedData: ExtractedInvoiceData;
  confidence: ConfidenceScores;
  onSubmit: (invoice: Invoice) => void;
  onFieldUpdate: (field: string, value: any) => void;
}
```

**Validation Rules:**
- Client name: Required, 1-255 characters
- Item description: Required, 1-1000 characters
- Quantity: Required, positive number, max 1,000,000
- Unit price: Required, positive number, max R1,000,000
- Date: Valid date, not more than 30 days in future

#### ClientAutocomplete Component

**Responsibilities:**
- Fuzzy search across client name, email, phone
- Display recent clients with usage stats
- Detect and warn about duplicate entries
- Update client usage tracking on selection

**Algorithm:**
Uses Fuse.js with configuration:
```javascript
{
  keys: ['name', 'email', 'phone'],
  threshold: 0.3, // 70% similarity required
  distance: 100,
  minMatchCharLength: 2
}
```

#### PDFGenerator Component

**Responsibilities:**
- Generate A4 PDF using @react-pdf/renderer
- Apply South African invoice format
- Include business logo or fallback to text
- Calculate VAT (15%) if business is registered
- Format currency as ZAR with proper separators
- Include payment terms and banking details

**PDF Structure:**
- Header: Logo, business info, invoice number, dates
- Bill To: Client details
- Line Items: Table with description, qty, price, total
- Totals: Subtotal, VAT (if applicable), Grand Total
- Footer: Payment terms, banking details, custom notes

### Backend Lambda Functions

#### process-voice-recording Lambda

**Trigger:** S3 upload event (audio bucket)
**Runtime:** Node.js 18.x
**Timeout:** 30 seconds
**Memory:** 512 MB

**Flow:**
1. Extract user ID from S3 key
2. Download audio from S3
3. Get OpenAI API key from Secrets Manager
4. Call Whisper API with retry logic (3 attempts)
5. Save transcription to voice_recordings table
6. Trigger extract-invoice-data Lambda
7. Return transcription result

**Error Handling:**
- Retry on 429, 500, 503 status codes
- Fail fast on 400, 401 status codes
- Fallback to Deepgram after 3 Whisper failures
- Log all errors to CloudWatch

#### extract-invoice-data Lambda

**Trigger:** API Gateway POST /extract
**Runtime:** Node.js 18.x
**Timeout:** 30 seconds
**Memory:** 256 MB

**Flow:**
1. Receive transcription text and user ID
2. Get Claude/GPT API key from Secrets Manager
3. Send prompt with transcription to LLM
4. Parse JSON response with confidence scores
5. Validate extracted data
6. Generate invoice number (auto-increment)
7. Save to invoices table
8. Return structured invoice data

**LLM Prompt Strategy:**
- System prompt defines SA context and JSON structure
- Include today's date for date inference
- Specify confidence scoring guidelines
- Request only valid JSON output (no markdown)

#### send-invoice-email Lambda

**Trigger:** API Gateway POST /send-email
**Runtime:** Node.js 18.x
**Timeout:** 30 seconds
**Memory:** 256 MB

**Flow:**
1. Receive invoice data and recipient email
2. Generate PDF from invoice data
3. Upload PDF to S3 (invoices bucket)
4. Generate presigned URL (7-day expiry)
5. Send email via AWS SES with PDF link
6. Update invoice record (sent_at, sent_to, status)
7. Return success confirmation

**Email Template:**
- HTML email with branded header
- Invoice summary (number, amount, date)
- Download button with presigned URL
- Plain text fallback for email clients

## Data Models

### Database Schema (PostgreSQL)

#### business_info Table
```sql
CREATE TABLE business_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  physical_address TEXT,
  vat_number VARCHAR(50),
  logo_url TEXT,
  invoice_prefix VARCHAR(20) DEFAULT 'INV',
  invoice_next_number INTEGER DEFAULT 1,
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  branch_code VARCHAR(20),
  payment_terms TEXT DEFAULT 'Payment due within 30 days',
  footer_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_business_info_user_id ON business_info(user_id);
```

#### clients Table
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  last_used TIMESTAMP DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_last_used ON clients(user_id, last_used DESC);
CREATE INDEX idx_clients_name_search ON clients USING gin(name gin_trgm_ops);
```

#### invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  item_description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(20) DEFAULT 'draft',
  pdf_url TEXT,
  transcription_text TEXT,
  confidence_scores JSONB,
  extraction_attempts INTEGER DEFAULT 1,
  sent_to VARCHAR(255),
  sent_at TIMESTAMP,
  sent_via VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_created_at ON invoices(user_id, created_at DESC);
CREATE INDEX idx_invoices_status ON invoices(user_id, status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
```

#### voice_recordings Table
```sql
CREATE TABLE voice_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  audio_url TEXT NOT NULL,
  transcription TEXT,
  file_size INTEGER,
  duration INTEGER,
  format VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL
);

CREATE INDEX idx_voice_recordings_deleted_at 
  ON voice_recordings(deleted_at) 
  WHERE deleted_at IS NULL;
```

#### app_settings Table
```sql
CREATE TABLE app_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_enabled BOOLEAN DEFAULT FALSE,
  date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
  auto_save_drafts BOOLEAN DEFAULT TRUE,
  voice_retention_enabled BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'dark',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row-Level Security (RLS)

All tables implement RLS policies to ensure users can only access their own data:

```sql
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own data"
  ON invoices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### IndexedDB Schema (Local Storage)

```typescript
interface LocalDB {
  invoices: {
    key: string; // UUID
    value: {
      id: string;
      clientName: string;
      itemDescription: string;
      quantity: number;
      unitPrice: number;
      totalAmount: number;
      date: string;
      status: 'draft' | 'sent' | 'paid';
      synced: boolean;
      created_at: string;
      updated_at: string;
    };
    indexes: {
      'created_at': string;
      'status': string;
      'synced': boolean;
    };
  };
  
  clients: {
    key: string;
    value: {
      id: string;
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      last_used: string;
      usage_count: number;
      synced: boolean;
    };
    indexes: {
      'last_used': string;
      'name': string;
    };
  };
  
  business_info: {
    key: 'main';
    value: BusinessInfo;
  };
  
  pending_actions: {
    key: string;
    value: {
      id: string;
      action: () => Promise<void>;
      timestamp: number;
      retries: number;
    };
  };
}
```

## Error Handling

### Error Classification

**1. Recoverable Errors (Auto-retry)**
- Network timeouts
- API rate limits (429)
- Server errors (500, 503)
- Temporary service unavailability

**2. User-Actionable Errors (Show instructions)**
- Microphone permission denied
- Invalid audio format
- Validation failures
- Quota exceeded

**3. Critical Errors (Log and fallback)**
- Authentication failures
- Database connection errors
- Unhandled exceptions

### Error Response Strategy

```typescript
interface ErrorResponse {
  code: string; // e.g., 'NETWORK_ERROR', 'MIC_BLOCKED'
  title: string;
  message: string;
  action?: string; // Button text
  actionHandler?: () => void;
  retryable: boolean;
  alternativeAction?: {
    label: string;
    handler: () => void;
  };
}
```

### Retry Logic

**Exponential Backoff:**
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Offline Queue Management

```typescript
interface QueuedAction {
  id: string;
  type: 'create_invoice' | 'update_client' | 'send_email';
  payload: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

class OfflineQueue {
  async add(action: QueuedAction): Promise<void>;
  async process(): Promise<void>;
  async retry(actionId: string): Promise<void>;
  async clear(): Promise<void>;
  getCount(): number;
}
```

## Testing Strategy

### Unit Testing

**Framework:** Jest + React Testing Library

**Coverage Targets:**
- Utility functions: 90%+
- Components: 80%+
- State management: 85%+

**Key Test Suites:**
1. **VoiceRecorder Tests**
   - Permission handling
   - Recording state transitions
   - Audio compression
   - Error scenarios

2. **InvoiceForm Tests**
   - Field validation
   - Real-time calculations
   - Confidence indicator display
   - Auto-save functionality

3. **ClientAutocomplete Tests**
   - Fuzzy search accuracy
   - Duplicate detection
   - Usage tracking

4. **PDF Generator Tests**
   - Layout rendering
   - VAT calculations
   - Currency formatting
   - Logo display/fallback

### Integration Testing

**Framework:** Jest + MSW (Mock Service Worker)

**Test Scenarios:**
1. Complete voice-to-invoice flow
2. Manual entry to PDF generation
3. Client selection and auto-fill
4. Offline queue and sync
5. Authentication and authorization
6. Error recovery and retry

### End-to-End Testing

**Framework:** Playwright

**Critical User Journeys:**
1. **Happy Path:** Voice recording → Extraction → Review → PDF → Send
2. **Fallback Path:** Permission denied → Manual entry → PDF
3. **Offline Path:** Create invoice offline → Go online → Auto-sync
4. **Client Management:** Add client → Detect duplicate → Merge
5. **Business Setup:** Onboarding → Logo upload → First invoice

**Test Environments:**
- Chrome (desktop + mobile)
- Safari (iOS)
- Firefox (desktop)
- Edge (desktop)

### Performance Testing

**Framework:** Artillery

**Load Test Scenarios:**
1. Concurrent voice uploads (50 users)
2. Simultaneous transcriptions (20 requests)
3. PDF generation under load (100 requests/min)
4. Database query performance (1000 invoices)

**Performance Budgets:**
- Time to Interactive: < 3s
- First Contentful Paint: < 1.5s
- Voice to PDF: < 20s (p95)
- API response time: < 500ms (p90)

### Security Testing

**Tools:** OWASP ZAP, npm audit

**Test Areas:**
1. SQL injection prevention
2. XSS vulnerability scanning
3. CSRF token validation
4. Rate limiting enforcement
5. Authentication bypass attempts
6. Data encryption verification

## Performance Optimization

### Frontend Optimizations

**1. Code Splitting**
```javascript
// Lazy load heavy components
const PDFPreview = lazy(() => import('./components/PDFPreview'));
const InvoiceHistory = lazy(() => import('./pages/InvoiceHistory'));
```

**2. Asset Optimization**
- Images: WebP format with fallback
- Fonts: Subset to required characters
- Icons: SVG sprites
- Bundle size target: < 200KB (gzipped)

**3. Caching Strategy**
```javascript
// Service Worker cache strategy
const CACHE_STRATEGY = {
  static: 'cache-first', // HTML, CSS, JS
  api: 'network-first',  // API calls
  images: 'cache-first', // Logos, icons
  pdfs: 'network-only'   // Always fresh
};
```

**4. Debouncing and Throttling**
- Search input: 300ms debounce
- Scroll events: 100ms throttle
- Auto-save: 2000ms debounce

### Backend Optimizations

**1. Lambda Cold Start Reduction**
- Keep functions warm with CloudWatch Events
- Minimize dependencies
- Use Lambda layers for shared code

**2. Database Query Optimization**
- Indexed columns for frequent queries
- Connection pooling (RDS Proxy)
- Query result caching (Redis if needed)

**3. S3 Performance**
- Multipart upload for large files
- CloudFront CDN for global delivery
- Presigned URLs to avoid Lambda proxy

**4. API Gateway Optimization**
- Enable caching for GET requests
- Compress responses (gzip)
- Use WebSocket for real-time updates

### Monitoring and Alerting

**CloudWatch Metrics:**
- Lambda invocations, errors, duration
- API Gateway request count, latency
- RDS connections, CPU, storage
- S3 bucket size, request count

**Custom Application Metrics:**
- Voice recording success rate
- Transcription accuracy (confidence avg)
- Invoice creation time (end-to-end)
- User funnel conversion rates

**Alarms:**
- Error rate > 5% (5 min window)
- P99 latency > 25s
- Database connections > 80%
- Failed transcriptions > 10/hour

## Security Considerations

### Authentication and Authorization

**AWS Cognito Configuration:**
- Email-based sign-up with verification
- Password policy: 8+ chars, mixed case, digits
- MFA optional (TOTP)
- JWT tokens with 24-hour expiry
- Refresh token rotation

**API Authorization:**
```javascript
// Lambda authorizer validates JWT
const authorizer = async (event) => {
  const token = event.headers.Authorization.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  return {
    principalId: decoded.userId,
    policyDocument: {
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: event.methodArn
      }]
    },
    context: { userId: decoded.userId }
  };
};
```

### Data Encryption

**At Rest:**
- RDS: AES-256 encryption enabled
- S3: Server-side encryption (SSE-S3)
- Secrets Manager: Automatic encryption

**In Transit:**
- HTTPS/TLS 1.2+ for all connections
- CloudFront with SSL certificate
- API Gateway with custom domain + SSL

**Application-Level:**
```javascript
// Encrypt sensitive fields before storage
const encryptedBankDetails = encrypt(JSON.stringify({
  accountNumber: '62XXXXXXXXXX',
  branchCode: '250655'
}));
```

### Input Validation and Sanitization

**Zod Schemas:**
```typescript
const InvoiceSchema = z.object({
  clientName: z.string().min(1).max(255).trim(),
  itemDescription: z.string().min(1).max(1000).trim(),
  quantity: z.number().positive().max(1000000),
  unitPrice: z.number().positive().max(1000000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  email: z.string().email().optional()
});
```

**SQL Injection Prevention:**
- Always use parameterized queries
- Never concatenate user input into SQL
- Use ORM/query builder when possible

### Rate Limiting

**API Gateway Throttling:**
- Rate limit: 100 requests/second per user
- Burst limit: 200 concurrent requests
- Quota: 10,000 requests/day (free tier)

**Application-Level:**
```javascript
// Redis-based rate limiter
const rateLimiter = new RateLimiterRedis({
  points: 100,      // Number of requests
  duration: 3600,   // Per hour
  blockDuration: 300 // Block for 5 min if exceeded
});
```

### GDPR Compliance

**Data Subject Rights:**
1. **Right to Access:** Export all user data as JSON
2. **Right to Erasure:** Delete all data on request
3. **Right to Portability:** Download data in standard format
4. **Right to Rectification:** Edit personal information

**Implementation:**
```javascript
// Data export endpoint
GET /api/user/export
Response: {
  user: {...},
  invoices: [...],
  clients: [...],
  businessInfo: {...}
}

// Data deletion endpoint
DELETE /api/user/account
- Deletes all database records
- Removes S3 files
- Anonymizes analytics data
```

## Deployment Strategy

### Infrastructure as Code (AWS CDK)

**Stack Components:**
1. **NetworkStack:** VPC, subnets, security groups
2. **DatabaseStack:** RDS PostgreSQL instance
3. **StorageStack:** S3 buckets with lifecycle policies
4. **ComputeStack:** Lambda functions
5. **APIStack:** API Gateway, Cognito
6. **CDNStack:** CloudFront distribution
7. **MonitoringStack:** CloudWatch dashboards, alarms

### CI/CD Pipeline (GitHub Actions)

**Workflow Stages:**
1. **Test:** Lint, unit tests, integration tests
2. **Build:** Compile frontend, package Lambdas
3. **Deploy Infrastructure:** CDK deploy (staging)
4. **Deploy Application:** Upload to S3, update Lambdas
5. **E2E Tests:** Run Playwright tests
6. **Deploy Production:** Promote to prod if tests pass
7. **Monitor:** Check error rates for 1 hour

### Environment Strategy

**Environments:**
- **Development:** Local (Docker Compose)
- **Staging:** AWS (separate account)
- **Production:** AWS (main account)

**Configuration Management:**
- Environment variables via AWS Secrets Manager
- Feature flags via environment config
- Database migrations via Flyway/Liquibase

### Rollback Strategy

**Automated Rollback Triggers:**
- Error rate > 10% for 5 minutes
- P99 latency > 30s for 10 minutes
- Health check failures > 3 consecutive

**Manual Rollback:**
```bash
# Revert Lambda to previous version
aws lambda update-function-code \
  --function-name process-voice-recording \
  --s3-bucket lambda-versions \
  --s3-key previous-version.zip

# Revert CloudFront to previous S3 version
aws s3 sync s3://backup-bucket s3://website-bucket
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

## Cost Optimization

### AWS Free Tier Utilization

**12-Month Free Tier:**
- RDS: 750 hours/month (db.t3.micro)
- S3: 5GB storage + 20,000 GET requests
- Lambda: 1M requests + 400,000 GB-seconds
- CloudFront: 1TB data transfer out
- API Gateway: 1M API calls

**Always Free:**
- Cognito: 50,000 MAUs
- CloudWatch: 10 custom metrics + 10 alarms

### Cost Reduction Strategies

**1. Audio Compression**
- Reduce S3 storage by 80%
- Reduce data transfer costs
- Faster uploads = lower Lambda duration

**2. Transcription Caching**
- Cache results for 24 hours
- Avoid duplicate Whisper API calls
- Save $0.006/minute per cached request

**3. Lambda Optimization**
- Right-size memory allocation
- Minimize cold starts
- Use Lambda layers for shared dependencies

**4. S3 Lifecycle Policies**
```javascript
{
  Rules: [{
    Id: 'DeleteOldAudio',
    Status: 'Enabled',
    Expiration: { Days: 1 },
    Filter: { Prefix: 'audio/' }
  }, {
    Id: 'TransitionOldPDFs',
    Status: 'Enabled',
    Transitions: [{
      Days: 30,
      StorageClass: 'INTELLIGENT_TIERING'
    }],
    Filter: { Prefix: 'invoices/' }
  }]
}
```

### Estimated Monthly Costs (100 Users, 1000 Invoices)

- **AWS Services:** $20-30
- **OpenAI Whisper:** $12
- **Claude/GPT:** $15
- **Total:** ~$50-60/month

**Scaling Projections:**
- 1,000 users: ~$200/month
- 10,000 users: ~$1,500/month
- 100,000 users: ~$12,000/month

## Design Decisions and Rationale

### Why React over Vue/Angular?
- Largest ecosystem and community
- Best mobile support (React Native)
- Excellent TypeScript integration
- Rich component libraries

### Why AWS over GCP/Azure?
- Most comprehensive free tier
- Best serverless offerings (Lambda, API Gateway)
- Mature RDS PostgreSQL support
- Global CDN with CloudFront

### Why PostgreSQL over MongoDB?
- ACID compliance for financial data
- Strong relational data model (invoices ↔ clients)
- Excellent full-text search (pg_trgm)
- Row-level security built-in

### Why Whisper over Google Speech-to-Text?
- Better accuracy for natural speech
- Supports multiple accents (SA English)
- Simple API with no setup
- Cost-effective ($0.006/minute)

### Why Claude over GPT-4?
- Better structured output (JSON)
- Lower cost ($3/M tokens vs $30/M)
- Faster response times
- Strong reasoning for extraction tasks

### Why IndexedDB over LocalStorage?
- Larger storage capacity (50MB+ vs 5MB)
- Structured data with indexes
- Asynchronous API (non-blocking)
- Better for offline-first apps

### Why Tailwind over CSS-in-JS?
- Smaller bundle size
- Better performance (no runtime)
- Easier responsive design
- Consistent design system

## Future Enhancements

### Phase 2 (Months 2-3)
- Multi-line item invoices
- Recurring invoice templates
- Payment status tracking
- WhatsApp direct send integration

### Phase 3 (Months 4-6)
- React Native mobile apps (iOS + Android)
- Multi-currency support
- Quote generation
- Expense tracking
- Basic reporting dashboard

### Phase 4 (Months 7-12)
- Team accounts with role-based permissions
- Client portal (view/pay invoices)
- Payment gateway integration (PayFast, Yoco)
- API for third-party integrations
- Advanced analytics and forecasting
