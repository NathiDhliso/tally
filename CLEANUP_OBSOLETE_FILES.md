# Cleanup: Obsolete Files

## Files That Can Be Safely Deleted

Now that we have a true single-page application, several files are no longer needed.

---

## 1. Layout Files (No Longer Used)

### src/layouts/MainLayout.tsx
**Status:** ❌ Obsolete  
**Reason:** The unified homepage manages all states internally. No layout wrapper needed.  
**Safe to delete:** Yes

---

## 2. Old Page Files (Replaced)

### src/pages/HomePage.tsx
**Status:** ❌ Obsolete  
**Reason:** Completely replaced by `HomePageUnified.tsx`  
**Safe to delete:** Yes

### src/pages/InvoiceReviewPage.tsx
**Status:** ❌ Obsolete  
**Reason:** Review functionality integrated into `HomePageUnified.tsx`  
**Safe to delete:** Yes

---

## 3. Unused Components

### src/components/AloePattern.tsx
**Status:** ❌ Obsolete  
**Reason:** Was only used by old HomePage. Caused visual distraction. Removed in favor of subtle gradient orbs.  
**Safe to delete:** Yes

---

## Files to Keep

### Core Application
- ✅ `src/pages/HomePageUnified.tsx` - Main application component
- ✅ `src/App.tsx` - Simplified routing
- ✅ `src/pages/InvoicesPage.tsx` - Rendered in panel
- ✅ `src/pages/ClientsPage.tsx` - Rendered in panel
- ✅ `src/pages/SettingsPage.tsx` - Rendered in panel

### Components
- ✅ All other components in `src/components/` - Still used
- ✅ `src/hooks/useSwipeGesture.ts` - Used for gestures
- ✅ All theme files - Still used

---

## How to Delete

### Option 1: Manual Deletion
```bash
# Delete obsolete files
rm src/layouts/MainLayout.tsx
rm src/pages/HomePage.tsx
rm src/pages/InvoiceReviewPage.tsx
rm src/components/AloePattern.tsx
```

### Option 2: Move to Archive (Safer)
```bash
# Create archive directory
mkdir -p .archive/obsolete

# Move files to archive
mv src/layouts/MainLayout.tsx .archive/obsolete/
mv src/pages/HomePage.tsx .archive/obsolete/
mv src/pages/InvoiceReviewPage.tsx .archive/obsolete/
mv src/components/AloePattern.tsx .archive/obsolete/
```

---

## Verification

After deletion, verify the app still works:

```bash
# Check for TypeScript errors
npm run type-check

# Run the app
npm run dev

# Run tests
npm test
```

All should pass without errors.

---

## Impact Analysis

### Bundle Size Reduction
- MainLayout.tsx: ~15KB
- HomePage.tsx: ~8KB
- InvoiceReviewPage.tsx: ~10KB
- AloePattern.tsx: ~3KB
- **Total saved:** ~36KB

### Code Complexity Reduction
- Fewer files to maintain
- Simpler routing logic
- Single source of truth
- Easier to understand

---

## Rollback Plan

If you need to revert:

1. **Restore from archive:**
   ```bash
   mv .archive/obsolete/* src/
   ```

2. **Revert App.tsx:**
   ```bash
   git checkout HEAD -- src/App.tsx
   ```

3. **Revert routing:**
   - Add back MainLayout wrapper
   - Add back separate routes

---

## Recommendation

**Start with Option 2 (Archive)** to be safe. After a week of testing in production, if everything works perfectly, you can permanently delete the archived files.

---

## Status

- [ ] Files moved to archive
- [ ] App tested and working
- [ ] Production deployment successful
- [ ] One week monitoring period complete
- [ ] Files permanently deleted

---

**Next Steps:**
1. Move files to archive
2. Test thoroughly
3. Deploy to production
4. Monitor for issues
5. Permanently delete after confidence period
