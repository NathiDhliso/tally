# Project Structure

## Overview
This is a React + TypeScript + Vite project with Tailwind CSS for the Voice-to-Invoice MVP.

## Directory Structure

```
src/
├── assets/          # Static assets (images, icons, etc.)
│   └── icons/       # Icon files
├── components/      # Reusable UI components
│   ├── Button.tsx
│   └── index.ts
├── contexts/        # React Context providers
│   └── AuthContext.tsx
├── hooks/           # Custom React hooks
│   ├── useAuth.ts
│   └── index.ts
├── pages/           # Page components
│   ├── HomePage.tsx
│   └── index.ts
├── services/        # API and external service integrations
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── index.ts
├── App.tsx          # Main App component
├── main.tsx         # Application entry point
└── index.css        # Global styles with Tailwind directives
```

## Key Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom SA brand colors and dark mode support
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** + **lint-staged** for pre-commit hooks

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run preview` - Preview production build

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_AWS_REGION` - AWS region
- `VITE_COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID` - Cognito Client ID
- `VITE_S3_BUCKET_NAME` - S3 bucket name

## Development Workflow

1. Create feature branches from `main`
2. Write code following ESLint and Prettier rules
3. Pre-commit hooks will automatically lint and format code
4. Submit pull requests for review

## Tailwind Configuration

Custom theme includes:
- Dark mode support (class-based)
- Primary color palette (blue shades)
- Secondary color palette (purple shades)
- Responsive breakpoints
