# Code Cleanup Plan - Remove Old/Unused Code

## Components to Remove

### 1. Unused Spinner Components
- **Spinner.tsx** - Old generic spinner (replaced by AloeSpinner)
- **LoadingSpinner.tsx** - Redundant with AloeSpinner
- **Status:** Not imported anywhere in production code

### 2. Unused Toast Component
- **ToastContainer.tsx** - Not used (Toast context handles this)
- **Status:** Not imported anywhere in production code

### 3. Development-Only Components (Keep but document)
- **BrowserTestPanel.tsx** - Development testing tool
- **FPSMonitorDisplay.tsx** - Performance monitoring tool
- **Status:** Used in development routes only

## Actions

### Remove Unused Components ✅
1. Delete `src/components/Spinner.tsx`
2. Delete `src/components/LoadingSpinner.tsx`
3. Delete `src/components/ToastContainer.tsx`
4. Update `src/components/index.ts` to remove exports

### Document Development Tools
1. Add comment in App.tsx about development routes
2. Keep BrowserTestPanel and FPSMonitorDisplay for development

## Verification

After cleanup:
- ✅ No broken imports
- ✅ Build still successful
- ✅ All production features work
- ✅ Only Aloe design system components remain
