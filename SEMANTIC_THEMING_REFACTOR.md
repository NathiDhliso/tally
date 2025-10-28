# Semantic Theming Refactor - Implementation Guide

## 🎯 Goal
Eliminate hardcoded colors and mock data to create a scalable, theme-able, and realistic application.

## ✅ Phase 1: Semantic Color Tokens (COMPLETE)

### What Was Done
1. **Added semantic color tokens to `tailwind.config.js`**:
   - `background-primary`, `background-secondary`, `background-tertiary`
   - `surface-primary`, `surface-secondary`, `surface-hover`
   - `text-primary`, `text-secondary`, `text-tertiary`, `text-placeholder`
   - `border-primary`, `border-secondary`, `border-accent`
   - `accent-primary`, `accent-secondary`, `accent-tertiary`

2. **Created utility classes in `src/index.css`**:
   - `.glass-surface` - Replaces `bg-white/10 backdrop-blur-2xl border border-sage-500/30`
   - `.glass-surface-hover` - Hover state for glass surfaces
   - `.text-gradient-brand` - Replaces `bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent`
   - `.bg-gradient-brand` - Replaces `bg-gradient-to-br from-sage-500 to-gold-500`
   - `.panel-background` - Replaces `bg-[#0f172a]/95`

## ✅ Phase 2: Development Data Seeder (COMPLETE)

### What Was Done
1. **Created `src/utils/devData.ts`**:
   - `seedStores()` - Populates stores with sample data in DEV mode only
   - `clearDevData()` - Clears all development data for testing empty states
   - Console helpers: `window.devData.seed()` and `window.devData.clear()`

2. **Updated `src/main.tsx`**:
   - Automatically seeds data in development mode
   - Production builds remain clean

## 🔄 Phase 3: Refactor Components (TODO)

### Priority Files to Refactor

#### 1. HomePageUnified.tsx
**Hardcoded Colors to Replace:**
- `bg-[#0f172a]` → Use `panel-background` utility or remove (body already has bg)
- `bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent` → `text-gradient-brand`
- `text-gray-300` → `text-text-secondary`
- `bg-white/10 backdrop-blur-2xl border border-sage-500/30` → `glass-surface`
- `bg-gradient-to-br from-sage-500 to-gold-500` → `bg-gradient-brand`

**Mock Data to Remove:**
```typescript
// DELETE THIS:
const businessData = {
  name: 'Your Business Name',
  // ...
};

// DELETE THIS:
const mockData: ExtractedInvoiceData = {
  clientName: 'Acme Corp',
  // ...
};

// REPLACE WITH:
// TODO: Load from settings store
// const { businessData } = useSettingsStore();
```

#### 2. InvoicesPage.tsx
**Already Clean!** ✅
- Uses store data correctly
- No hardcoded mock data
- Could benefit from semantic color refactor

**Minor Improvements:**
- `text-gray-600 dark:text-gray-400` → `text-text-secondary`
- `bg-white/10 dark:bg-white/5` → `glass-surface`

#### 3. ClientsPage.tsx
**Already Clean!** ✅
- Uses store data correctly
- No hardcoded mock data
- Could benefit from semantic color refactor

**Minor Improvements:**
- `text-gray-600 dark:text-gray-400` → `text-text-secondary`
- `bg-white/10 dark:bg-white/5` → `glass-surface`

#### 4. VoiceRecorder.tsx
**Check for:**
- Inline `style` props with hardcoded gradients
- Replace with `bg-gradient-brand` utility

#### 5. MainLayout.tsx (if still in use)
**Check for:**
- `bg-white/10` → `glass-surface`
- `border-sage-500/20` → `border-border-primary`
- `text-gray-300` → `text-text-secondary`
- `from-sage-500` → `from-accent-primary`

## 📋 Refactoring Checklist

### Color Replacements
- [ ] Replace all `bg-[#0f172a]` with semantic tokens
- [ ] Replace all `bg-white/10` with `glass-surface`
- [ ] Replace all `text-gray-300` with `text-text-secondary`
- [ ] Replace all `text-gray-400` with `text-text-tertiary`
- [ ] Replace all `border-sage-500/30` with `border-border-primary`
- [ ] Replace all gradient combinations with utility classes
- [ ] Remove inline `style` props with hardcoded colors

### Mock Data Removal
- [ ] Remove `businessData` object from HomePageUnified.tsx
- [ ] Remove `mockData` from handleRecordingComplete
- [ ] Create `useSettingsStore` for business data
- [ ] Update handleRecordingComplete to only show loading state

### Testing
- [ ] Test empty states (use `window.devData.clear()`)
- [ ] Test with seeded data (use `window.devData.seed()`)
- [ ] Verify all colors are consistent
- [ ] Check dark mode (should be primary experience)
- [ ] Test production build (no mock data should appear)

## 🎨 Quick Reference: Semantic Tokens

### Backgrounds
```tsx
// OLD
className="bg-[#0f172a]"
// NEW
className="bg-background-primary"

// OLD
className="bg-white/10"
// NEW
className="bg-surface-primary"
// OR
className="glass-surface"
```

### Text
```tsx
// OLD
className="text-gray-300"
// NEW
className="text-text-secondary"

// OLD
className="text-gray-400"
// NEW
className="text-text-tertiary"
```

### Borders
```tsx
// OLD
className="border-sage-500/30"
// NEW
className="border-border-primary"

// OLD
className="border-white/20"
// NEW
className="border-border-secondary"
```

### Gradients
```tsx
// OLD
className="bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent"
// NEW
className="text-gradient-brand"

// OLD
className="bg-gradient-to-br from-sage-500 to-gold-500"
// NEW
className="bg-gradient-brand"
```

### Glass Surfaces
```tsx
// OLD
className="bg-white/10 backdrop-blur-2xl border border-sage-500/30 rounded-2xl"
// NEW
className="glass-surface rounded-2xl"
```

## 🚀 Next Steps

1. **Create Settings Store** (if not exists):
   ```typescript
   // src/store/settingsStore.ts
   export const useSettingsStore = create<SettingsStore>((set) => ({
     businessData: {
       name: '',
       email: '',
       // ... load from localStorage or API
     },
     updateBusinessData: (data) => set({ businessData: data }),
   }));
   ```

2. **Refactor HomePageUnified.tsx**:
   - Remove mock businessData
   - Remove mock invoice data from handleRecordingComplete
   - Use semantic color tokens
   - Use utility classes

3. **Refactor Remaining Components**:
   - Search for hardcoded colors: `bg-white/`, `text-gray-`, `border-sage-`
   - Replace with semantic tokens
   - Test thoroughly

4. **Document Theme Customization**:
   - Create guide for changing color scheme
   - Show how to add light mode support
   - Explain semantic token system

## 💡 Benefits

✅ **Single Source of Truth**: All colors defined in one place  
✅ **Easy Theme Changes**: Update tokens, not hundreds of components  
✅ **Consistent Design**: No more random color values  
✅ **Better DX**: Semantic names are self-documenting  
✅ **Production Ready**: No mock data in production builds  
✅ **Testable**: Easy to test empty states and edge cases  

## 🔧 Dev Tools

In development mode, you have access to:

```javascript
// Seed sample data
window.devData.seed()

// Clear all data (test empty states)
window.devData.clear()
```

## 📝 Notes

- The body background is already set in `src/index.css`, so you don't need `bg-[#0f172a]` on root elements
- Dark mode is the primary experience (not an afterthought)
- All semantic tokens support future light mode with minimal changes
- Production builds automatically exclude dev data seeder
