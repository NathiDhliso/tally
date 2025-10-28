# Migration Guide: Hardcoded Colors → Semantic Tokens

## Quick Reference

### Common Replacements

#### Backgrounds
```tsx
// ❌ OLD
className="bg-[#0f172a]"
className="bg-[#0f172a]/95"

// ✅ NEW
// Remove entirely (body already has background)
className="panel-background"
```

```tsx
// ❌ OLD
className="bg-white/10 backdrop-blur-2xl border border-sage-500/30"
className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20"

// ✅ NEW
className="glass-surface"
```

#### Text Colors
```tsx
// ❌ OLD
className="text-gray-100"
className="text-white"

// ✅ NEW
className="text-text-primary"
```

```tsx
// ❌ OLD
className="text-gray-300"
className="text-gray-600 dark:text-gray-400"

// ✅ NEW
className="text-text-secondary"
```

```tsx
// ❌ OLD
className="text-gray-400"
className="text-gray-500 dark:text-gray-400"

// ✅ NEW
className="text-text-tertiary"
```

```tsx
// ❌ OLD
className="text-gray-500"
className="placeholder:text-gray-500"

// ✅ NEW
className="text-text-placeholder"
className="placeholder:text-text-placeholder"
```

#### Gradients
```tsx
// ❌ OLD
className="bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent"
className="bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent"

// ✅ NEW
className="text-gradient-brand"
```

```tsx
// ❌ OLD
className="bg-gradient-to-br from-sage-500 to-gold-500"
style={{ background: 'linear-gradient(135deg, #6b8e23, #daa520)' }}

// ✅ NEW
className="bg-gradient-brand"
```

#### Borders
```tsx
// ❌ OLD
className="border-sage-500/30"
className="border-sage-500/20"

// ✅ NEW
className="border-border-primary"
```

```tsx
// ❌ OLD
className="border-white/20"
className="border-white/10"

// ✅ NEW
className="border-border-secondary"
```

## Search & Replace Patterns

Use these regex patterns to find instances in your codebase:

### Find Hardcoded Hex Colors
```regex
bg-\[#[0-9a-fA-F]{6}\]
```

### Find White/Opacity Backgrounds
```regex
bg-white/\d+
```

### Find Gray Text Colors
```regex
text-gray-[0-9]+
```

### Find Sage Border Colors
```regex
border-sage-\d+/\d+
```

## Component-by-Component Guide

### Already Refactored ✅
- `src/pages/HomePageUnified.tsx`

### Ready to Refactor

#### InvoicesPage.tsx
**Low Priority** - Already uses store data correctly

Minor improvements:
```tsx
// Line ~XX
className="text-gray-600 dark:text-gray-400"
// Replace with:
className="text-text-secondary"

// Line ~XX
className="bg-white/10 dark:bg-white/5 backdrop-blur-xl"
// Replace with:
className="glass-surface"
```

#### ClientsPage.tsx
**Low Priority** - Already uses store data correctly

Minor improvements:
```tsx
// Similar to InvoicesPage
className="text-gray-600 dark:text-gray-400" → "text-text-secondary"
className="bg-white/10 dark:bg-white/5" → "glass-surface"
```

#### VoiceRecorder.tsx
**Medium Priority** - Check for inline styles

Look for:
```tsx
// ❌ OLD
style={{ background: 'linear-gradient(135deg, #6b8e23, #daa520)' }}

// ✅ NEW
className="bg-gradient-brand"
// Remove style prop
```

#### Other Components
Search for these patterns:
1. `bg-white/10` → `glass-surface`
2. `text-gray-` → `text-text-*`
3. `border-sage-` → `border-border-primary`
4. Inline `style` props with colors

## Testing Checklist

After refactoring a component:

- [ ] Component renders without errors
- [ ] Colors look identical to before
- [ ] Dark mode works (if applicable)
- [ ] Hover states work correctly
- [ ] No console warnings
- [ ] Build succeeds (`npm run build`)

## Tips

### 1. Use Find & Replace Carefully
- Always review changes before committing
- Test after each file refactor
- Use git to track changes

### 2. Preserve Functionality
- Don't change behavior, only colors
- Keep all existing classes except color-related ones
- Maintain responsive classes (sm:, md:, lg:)

### 3. When in Doubt
- Check `HomePageUnified.tsx` for examples
- Refer to `REFACTOR_COMPLETE_SUMMARY.md`
- Use semantic token names that describe purpose

### 4. Batch Similar Changes
- Refactor all text colors in one pass
- Then all backgrounds
- Then all borders
- Easier to review and test

## Common Mistakes to Avoid

### ❌ Don't Mix Old and New
```tsx
// BAD - mixing approaches
className="glass-surface text-gray-400"

// GOOD - consistent approach
className="glass-surface text-text-tertiary"
```

### ❌ Don't Remove Non-Color Classes
```tsx
// BAD - removed important classes
className="glass-surface"

// GOOD - kept layout/spacing classes
className="glass-surface rounded-2xl p-6 shadow-lg"
```

### ❌ Don't Change Semantic Meaning
```tsx
// BAD - wrong semantic token
className="text-text-primary" // for placeholder text

// GOOD - correct semantic token
className="text-text-placeholder" // for placeholder text
```

## Verification

After refactoring, verify:

1. **Visual Check**: App looks identical
2. **Build Check**: `npm run build` succeeds
3. **Search Check**: No more hardcoded colors
   ```bash
   # Should return 0 results in refactored files
   grep -r "bg-\[#" src/pages/YourComponent.tsx
   ```

## Need Help?

- Check `SEMANTIC_THEMING_REFACTOR.md` for detailed guide
- Check `REFACTOR_COMPLETE_SUMMARY.md` for examples
- Look at `HomePageUnified.tsx` for reference implementation

## Quick Win: One-Line Replacements

These can be done with simple find & replace:

```
Find: text-gray-100
Replace: text-text-primary

Find: text-gray-300
Replace: text-text-secondary

Find: text-gray-400
Replace: text-text-tertiary

Find: text-gray-500
Replace: text-text-placeholder
```

**Note:** Always review changes before committing!
