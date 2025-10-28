# Requirements Document

## Introduction

The Voice-to-Invoice MVP is a mobile-first web application designed for South African small businesses, freelancers, and consultants to create professional invoices in seconds using voice input. The system captures voice recordings, transcribes them using AI, extracts invoice details with confidence scoring, and generates professional PDF invoices in South African format with VAT compliance.

The application prioritizes speed (10-20 second end-to-end target), ease of use (single-tap voice recording), and flexibility (manual entry fallback). It supports both anonymous local-only usage and optional cloud sync with AWS infrastructure.

## Requirements

### Requirement 1: Voice Recording and Audio Capture

**User Story:** As a small business owner, I want to record invoice details by speaking naturally into my device, so that I can create invoices quickly without typing.

#### Acceptance Criteria

1. WHEN the user taps the microphone button THEN the system SHALL request microphone permissions with a clear privacy message
2. WHEN microphone access is granted THEN the system SHALL start recording audio with visual feedback (pulsing animation, timer, audio level meter)
3. WHEN the user taps the microphone button again THEN the system SHALL stop recording and begin processing
4. WHEN recording duration exceeds 90 seconds THEN the system SHALL display a countdown indicator
5. WHEN recording reaches 2 minutes THEN the system SHALL automatically stop and begin processing
6. IF microphone permission is denied THEN the system SHALL display an error modal with platform-specific instructions and offer manual entry as fallback
7. IF microphone hardware is not detected THEN the system SHALL hide the voice button and show manual entry as primary input
8. WHEN the user long-presses the microphone button for 500ms THEN the system SHALL display an overlay with "Recent Clients" and "Type Instead" options
9. WHEN recording fails due to browser incompatibility THEN the system SHALL automatically switch to manual entry mode
10. WHEN audio is captured THEN the system SHALL compress the file to 50-70% of original size before upload

### Requirement 2: Voice Transcription with AI

**User Story:** As a user, I want my voice recording to be accurately transcribed into text, so that the system can extract invoice details from what I said.

#### Acceptance Criteria

1. WHEN audio recording completes THEN the system SHALL upload the compressed audio file to S3 storage
2. WHEN audio is uploaded THEN the system SHALL trigger OpenAI Whisper API for transcription within 30 seconds
3. WHEN transcription is in progress THEN the system SHALL display a progress indicator showing "Uploading audio..." (0-2s) and "Transcribing..." (2-8s)
4. IF Whisper API fails after 3 retry attempts THEN the system SHALL automatically fallback to Deepgram API
5. IF transcription returns empty or unintelligible text THEN the system SHALL display error message "I couldn't understand the recording. Please speak clearly and try again."
6. WHEN transcription succeeds THEN the system SHALL cache the result for 24 hours to avoid re-processing
7. IF network timeout occurs THEN the system SHALL save recording locally and display "Recording saved locally. Tap to retry upload."
8. IF API quota is exceeded THEN the system SHALL display "Daily limit reached. Upgrade to Pro or try again tomorrow."
9. WHEN transcription completes THEN the system SHALL automatically trigger invoice data extraction
10. WHEN audio file is processed THEN the system SHALL schedule deletion after 24 hours unless user has enabled voice retention

### Requirement 3: Invoice Data Extraction with Confidence Scoring

**User Story:** As a user, I want the system to automatically extract invoice fields from my transcription with confidence indicators, so that I know which fields need verification.

#### Acceptance Criteria

1. WHEN transcription completes THEN the system SHALL send the text to Claude/GPT-4o-mini for structured data extraction
2. WHEN extraction is in progress THEN the system SHALL display "Extracting invoice details..." status
3. WHEN extraction completes THEN the system SHALL return JSON with fields: client_name, item_description, quantity, unit_price, date, each with confidence scores (0-100)
4. IF confidence score is above 90% THEN the system SHALL auto-fill the field with green border and no warning
5. IF confidence score is 70-90% THEN the system SHALL auto-fill the field with yellow border and display confidence percentage
6. IF confidence score is below 70% THEN the system SHALL leave field empty with "[unclear]" placeholder and red border
7. WHEN extraction fails after 3 attempts THEN the system SHALL offer manual entry with message "Having trouble? Try typing instead."
8. IF required fields are missing or unclear THEN the system SHALL trigger follow-up voice recording with specific questions
9. WHEN extraction completes THEN the system SHALL calculate total amount automatically (quantity × unit_price)
10. WHEN extraction data is saved THEN the system SHALL track extraction_attempts count in database

### Requirement 4: Editable Invoice Review Form

**User Story:** As a user, I want to review and edit extracted invoice details before generating the PDF, so that I can correct any errors or add missing information.

#### Acceptance Criteria

1. WHEN extraction completes THEN the system SHALL display a review form with all extracted fields
2. WHEN displaying fields THEN the system SHALL apply confidence-based styling (green/yellow/red borders)
3. WHEN user types in client name field THEN the system SHALL show autocomplete suggestions from recent clients using fuzzy matching
4. WHEN user selects a recent client THEN the system SHALL auto-fill client details and update usage tracking
5. WHEN user edits quantity or unit price THEN the system SHALL recalculate total amount in real-time
6. WHEN user edits any field THEN the system SHALL auto-save draft every 2 seconds to local storage
7. IF field validation fails THEN the system SHALL display inline error message below the field
8. WHEN total amount exceeds R1,000,000 THEN the system SHALL display warning "Amount seems unusually high. Please verify."
9. WHEN date is more than 30 days in future THEN the system SHALL display error "Date cannot be more than 30 days in the future"
10. WHEN user clicks "Ask AI Again" button on unclear field THEN the system SHALL trigger follow-up voice recording for that specific field

### Requirement 5: Client Management with Fuzzy Matching

**User Story:** As a user, I want to manage my client list with smart suggestions and duplicate detection, so that I maintain clean data and save time on repeat invoices.

#### Acceptance Criteria

1. WHEN user long-presses microphone button THEN the system SHALL display overlay showing last 5 recently used clients
2. WHEN user selects a recent client THEN the system SHALL auto-fill client name and increment usage_count
3. WHEN user types client name THEN the system SHALL perform fuzzy search with 70% similarity threshold
4. WHEN user adds new client THEN the system SHALL check for duplicates using Levenshtein distance algorithm
5. IF duplicate client detected (80%+ similarity) THEN the system SHALL show confirmation dialog "A client named X already exists. Add anyway?"
6. WHEN user accesses client list THEN the system SHALL display clients sorted alphabetically with search functionality
7. WHEN user searches clients THEN the system SHALL search across name, email, and phone fields
8. WHEN user adds client THEN the system SHALL require only name field, with email, phone, and address as optional
9. WHEN user creates invoice for client THEN the system SHALL update last_used timestamp and usage_count
10. WHEN user views client list THEN the system SHALL display usage count and last used date for each client

### Requirement 6: PDF Generation in South African Format

**User Story:** As a South African business owner, I want to generate professional PDF invoices that comply with local tax requirements, so that I can send legally compliant invoices to clients.

#### Acceptance Criteria

1. WHEN user clicks "Generate PDF" THEN the system SHALL create A4 PDF with 20mm margins using react-pdf/renderer
2. WHEN generating PDF THEN the system SHALL include business logo (if uploaded) or business name in header
3. WHEN generating PDF THEN the system SHALL display "TAX INVOICE" title prominently in header
4. WHEN generating PDF THEN the system SHALL include business details: name, address, phone, email, VAT number (if registered)
5. WHEN generating PDF THEN the system SHALL include invoice number in format: PREFIX-YYYY-NNN (e.g., INV-2025-001)
6. WHEN generating PDF THEN the system SHALL include client details in "BILL TO" section
7. WHEN generating PDF THEN the system SHALL display line items table with columns: Description, Quantity, Unit Price, Total
8. WHEN business is VAT registered THEN the system SHALL calculate and display 15% VAT separately
9. WHEN generating PDF THEN the system SHALL include payment terms and banking details in footer
10. WHEN PDF is generated THEN the system SHALL display preview modal with "Edit Invoice" and "Approve & Send" buttons

### Requirement 7: Invoice Sharing and Distribution

**User Story:** As a user, I want to easily share invoices via email, WhatsApp, or download, so that I can quickly deliver invoices to clients.

#### Acceptance Criteria

1. WHEN user clicks "Approve & Send" THEN the system SHALL check if Web Share API is supported
2. IF Web Share API is supported THEN the system SHALL open native share sheet with PDF file
3. IF Web Share API is not supported THEN the system SHALL display modal with email, WhatsApp, download, and copy link options
4. WHEN user selects email option THEN the system SHALL display email form pre-filled with client email, subject, and message
5. WHEN user sends email THEN the system SHALL upload PDF to S3, generate presigned URL (7-day expiry), and send via AWS SES
6. WHEN user selects WhatsApp option THEN the system SHALL open WhatsApp Web/App with pre-filled message and PDF link
7. WHEN user selects download THEN the system SHALL trigger browser download with filename: Invoice_NUMBER_CLIENT_DATE.pdf
8. WHEN user selects copy link THEN the system SHALL generate shareable S3 URL and copy to clipboard
9. WHEN invoice is sent THEN the system SHALL update database with sent_at, sent_to, sent_via, and status='sent'
10. WHEN invoice is sent successfully THEN the system SHALL display confirmation toast with recipient and method

### Requirement 8: Local and Cloud Storage Architecture

**User Story:** As a user, I want to use the app without creating an account, with the option to sync my data to the cloud later, so that I can start quickly and upgrade when ready.

#### Acceptance Criteria

1. WHEN user first opens app THEN the system SHALL work in anonymous mode using IndexedDB for local storage
2. WHEN user creates invoice in anonymous mode THEN the system SHALL save to local IndexedDB with synced=false flag
3. WHEN user views invoices THEN the system SHALL display sync status badge (Local Only, Syncing, Synced, Sync Failed)
4. WHEN user has local data THEN the system SHALL display cloud sync prompt offering account creation
5. WHEN user creates account THEN the system SHALL authenticate via AWS Cognito and generate JWT tokens
6. WHEN user authenticates THEN the system SHALL automatically sync all local data to cloud database
7. IF sync conflict occurs THEN the system SHALL use last-write-wins strategy based on updated_at timestamp
8. WHEN user is offline THEN the system SHALL queue actions in IndexedDB and auto-retry on reconnection
9. WHEN user exports data THEN the system SHALL generate JSON file with all invoices, clients, and business info
10. WHEN user deletes account THEN the system SHALL delete all cloud data and anonymize analytics (GDPR compliance)

### Requirement 9: Business Information Setup

**User Story:** As a new user, I want to set up my business information through a simple onboarding flow, so that my invoices look professional and include all necessary details.

#### Acceptance Criteria

1. WHEN user first creates invoice THEN the system SHALL trigger onboarding wizard if business info is not set
2. WHEN onboarding starts THEN the system SHALL display progress bar showing step X of 5
3. WHEN onboarding displays step THEN the system SHALL ask one question at a time: business name, contact details, address, VAT number, logo
4. WHEN user completes required fields THEN the system SHALL enable "Next" button to proceed
5. WHEN user reaches optional fields THEN the system SHALL display "Skip Setup" button
6. WHEN user uploads logo THEN the system SHALL optimize image to max 400×200px and upload to S3 via presigned URL
7. WHEN user completes onboarding THEN the system SHALL save business info and generate first invoice number
8. WHEN user accesses settings THEN the system SHALL allow editing all business information fields
9. WHEN user updates invoice numbering THEN the system SHALL show preview of next invoice number format
10. WHEN user saves business info THEN the system SHALL update updated_at timestamp and sync to cloud if authenticated

### Requirement 10: Error Handling and Network Resilience

**User Story:** As a user, I want clear error messages and automatic recovery when things go wrong, so that I don't lose my work and know how to proceed.

#### Acceptance Criteria

1. WHEN network error occurs THEN the system SHALL display toast with message and retry button
2. WHEN API request times out after 30 seconds THEN the system SHALL display "Request timed out. Please check your connection and try again."
3. WHEN user is offline THEN the system SHALL display banner "You're offline" with pending actions count
4. WHEN user goes back online THEN the system SHALL display "Back online! Syncing pending actions..." and process queue
5. IF microphone is blocked THEN the system SHALL display modal with platform-specific instructions to enable access
6. IF API quota is exceeded THEN the system SHALL display "Daily limit reached. Upgrade to Pro or try again tomorrow."
7. IF audio format is unsupported THEN the system SHALL display "Audio format not supported. Please record again."
8. IF extraction fails 3 times THEN the system SHALL offer manual entry with "Having trouble? Try typing instead."
9. WHEN error occurs THEN the system SHALL log to Sentry with context (user ID, feature, error details)
10. WHEN critical error occurs THEN the system SHALL save user's current work to local storage before displaying error

### Requirement 11: Manual Entry Fallback

**User Story:** As a user, I want to manually type invoice details when voice input is not suitable, so that I can still create invoices quickly in any situation.

#### Acceptance Criteria

1. WHEN user clicks "Type Instead" button THEN the system SHALL display manual entry form with all invoice fields
2. WHEN manual entry form displays THEN the system SHALL auto-focus on client name field
3. WHEN user presses Enter or Tab THEN the system SHALL move focus to next field in sequence
4. WHEN user fills quantity and unit price THEN the system SHALL calculate and display total in real-time
5. WHEN user submits manual entry THEN the system SHALL set all confidence scores to 100%
6. WHEN user types client name THEN the system SHALL show autocomplete suggestions from recent clients
7. WHEN user completes manual entry THEN the system SHALL proceed directly to PDF preview
8. WHEN user is in manual entry mode THEN the system SHALL display "Switch to Voice Input" button
9. IF user switches modes THEN the system SHALL save current form data as draft
10. WHEN manual entry validation fails THEN the system SHALL display inline error messages below invalid fields

### Requirement 12: Performance and Optimization

**User Story:** As a user, I want the app to be fast and responsive, so that I can create invoices in 10-20 seconds from start to finish.

#### Acceptance Criteria

1. WHEN user starts recording THEN the system SHALL respond within 100ms with visual feedback
2. WHEN audio is uploaded THEN the system SHALL compress file to reduce upload time by 50-70%
3. WHEN transcription completes THEN the system SHALL trigger extraction immediately without user action
4. WHEN user types in search field THEN the system SHALL debounce input by 300ms to reduce API calls
5. WHEN user updates invoice field THEN the system SHALL use optimistic UI updates before server confirmation
6. WHEN user scrolls invoice history THEN the system SHALL implement infinite scroll with lazy loading (20 items per page)
7. WHEN app loads THEN the system SHALL display loading skeletons instead of blank screens
8. WHEN static assets are requested THEN the system SHALL serve from CloudFront CDN with cache headers
9. WHEN user performs action THEN the system SHALL track end-to-end performance metrics in CloudWatch
10. IF total time exceeds 20 seconds THEN the system SHALL log slow performance event with bottleneck identification

### Requirement 13: Mobile-First Responsive Design

**User Story:** As a mobile user, I want the app to work perfectly on my phone with touch-optimized controls, so that I can create invoices on the go.

#### Acceptance Criteria

1. WHEN app renders on mobile THEN the system SHALL use single-column layout with full-width components
2. WHEN user taps interactive element THEN the system SHALL ensure minimum touch target size of 44×44px
3. WHEN user taps button THEN the system SHALL provide haptic feedback (on supported devices)
4. WHEN modal appears on mobile THEN the system SHALL use bottom sheet animation sliding up from bottom
5. WHEN user views app on iOS THEN the system SHALL respect safe area insets for notch and home indicator
6. WHEN keyboard appears THEN the system SHALL scroll active input field into view
7. WHEN user performs action THEN the system SHALL provide active state with scale-down animation (scale: 0.95)
8. WHEN app loads on mobile THEN the system SHALL use responsive typography scale (14px base on mobile, 16px on desktop)
9. WHEN user shares invoice on mobile THEN the system SHALL use native share sheet when available
10. WHEN user installs as PWA THEN the system SHALL display app icon and splash screen with brand colors

### Requirement 14: Security and Data Protection

**User Story:** As a user, I want my business and client data to be secure and private, so that I can trust the app with sensitive financial information.

#### Acceptance Criteria

1. WHEN user authenticates THEN the system SHALL use AWS Cognito with JWT tokens (24-hour expiry)
2. WHEN sensitive data is stored THEN the system SHALL encrypt using AES-256-GCM encryption
3. WHEN API request is made THEN the system SHALL validate and sanitize all inputs to prevent SQL injection
4. WHEN user exceeds rate limit THEN the system SHALL return 429 status and display "Rate limit exceeded. Please try again later."
5. WHEN user accesses protected resource THEN the system SHALL verify JWT token and user permissions
6. WHEN password is set THEN the system SHALL require minimum 8 characters with uppercase, lowercase, and digits
7. WHEN user requests data export THEN the system SHALL generate JSON file with all user data (GDPR compliance)
8. WHEN user deletes account THEN the system SHALL permanently delete all data and anonymize analytics
9. WHEN app loads THEN the system SHALL enforce Content Security Policy to prevent XSS attacks
10. WHEN error occurs THEN the system SHALL log to Sentry without exposing sensitive data (PII, tokens, passwords)

### Requirement 15: Analytics and Monitoring

**User Story:** As a product owner, I want to track user behavior and system performance, so that I can identify issues and improve the product.

#### Acceptance Criteria

1. WHEN user performs key action THEN the system SHALL track event in PostHog (voice_recording_started, invoice_created, etc.)
2. WHEN user creates account THEN the system SHALL identify user in PostHog with anonymized ID
3. WHEN invoice generation completes THEN the system SHALL track end-to-end performance metrics (recording_to_pdf time)
4. WHEN error occurs THEN the system SHALL send exception to Sentry with context (user ID, feature, stack trace)
5. WHEN Lambda function executes THEN the system SHALL log structured JSON to CloudWatch with timestamp and context
6. WHEN API latency exceeds 25 seconds THEN the system SHALL trigger CloudWatch alarm
7. WHEN error rate exceeds 10 per 5 minutes THEN the system SHALL trigger CloudWatch alarm
8. WHEN user completes funnel step THEN the system SHALL track conversion rates (recording → transcription → invoice → sent)
9. WHEN performance degrades THEN the system SHALL log slow_performance_detected event with bottleneck identification
10. WHEN dashboard is viewed THEN the system SHALL display real-time metrics: invocations, errors, duration (p50, p90, p99)
