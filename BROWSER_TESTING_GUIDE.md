# Browser Testing Guide

## Quick Start

### Access the Browser Test Panel

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the test panel:
   ```
   http://localhost:5173/browser-test
   ```

3. The panel will automatically detect your browser and display:
   - Browser information
   - Feature support status
   - Visual tests for glassmorphism and animations
   - System information

## Manual Testing Checklist

### Chrome/Edge (Chromium) - Desktop

#### Visual Features
- [ ] Glassmorphism effects render with blur
- [ ] Backdrop blur is smooth and performant
- [ ] All animations run at 60fps
- [ ] Framer Motion animations are smooth
- [ ] SVG gradients render correctly
- [ ] AloeBloom animation plays smoothly
- [ ] AloeRoot component displays correctly
- [ ] AloeGrowthPulse animation works
- [ ] AloePattern background is visible (subtle)
- [ ] WaveformVisualizer displays during recording

#### Interactive Features
- [ ] Button hover effects work (scale + glow)
- [ ] Button press effects work (scale down)
- [ ] Card hover effects work (lift + glow)
- [ ] Modal animations work (slide/scale in)
- [ ] Toast notifications stack correctly
- [ ] Navigation hover effects work
- [ ] Form input focus effects work
- [ ] ConfidenceIndicator animates smoothly

#### Audio Features
- [ ] Microphone permission request works
- [ ] Audio recording starts successfully
- [ ] Waveform visualization reacts to audio
- [ ] Recording stops and processes correctly

#### Performance
- [ ] Open DevTools > Performance
- [ ] Record during animations
- [ ] Verify 60fps maintained
- [ ] Check for layout thrashing
- [ ] Verify GPU acceleration (green bars in timeline)

### Firefox - Desktop

#### Visual Features
- [ ] Glassmorphism renders correctly
- [ ] Backdrop blur works (Firefox 103+)
- [ ] All animations are smooth
- [ ] SVG rendering is crisp
- [ ] Colors match Chrome version

#### Known Differences
- Firefox may render backdrop-filter slightly differently
- Scrollbar styling uses scrollbar-width/scrollbar-color
- Performance is generally comparable to Chrome

#### Testing Steps
1. Open browser test panel
2. Verify all features show as "Supported"
3. Run visual tests
4. Test audio recording
5. Check console for errors

### Safari - macOS

#### Visual Features
- [ ] Glassmorphism with -webkit-backdrop-filter works
- [ ] Backdrop blur renders correctly
- [ ] All animations are smooth
- [ ] SVG rendering is crisp
- [ ] Colors are accurate

#### Known Issues
- Safari requires -webkit- prefix for backdrop-filter
- Audio recording requires user gesture (handled)
- May have slight performance differences

#### Testing Steps
1. Open browser test panel
2. Verify backdrop-filter support shows "Supported"
3. Test glassmorphism effect
4. Test all animations
5. Test audio recording (tap to start)
6. Check Web Inspector for errors

#### Safari-Specific Checks
- [ ] Input fields don't zoom on focus (font-size: 16px)
- [ ] Tap highlight color is appropriate
- [ ] Scrolling is smooth
- [ ] No webkit-specific rendering issues

### Safari - iOS (iPhone/iPad)

#### Visual Features
- [ ] Glassmorphism works on mobile
- [ ] Backdrop blur is performant
- [ ] Animations run smoothly (55-60fps)
- [ ] Touch interactions are responsive
- [ ] Bottom navigation displays correctly
- [ ] Safe area insets are respected

#### Mobile-Specific Features
- [ ] Touch targets are 44px minimum
- [ ] Swipe gestures work correctly
- [ ] Tap feedback is immediate
- [ ] No 300ms tap delay
- [ ] Viewport height handles address bar correctly

#### Audio Features
- [ ] Microphone permission works
- [ ] Audio recording starts after tap
- [ ] Waveform visualization works
- [ ] Recording stops correctly

#### Testing Steps
1. Open Safari on iOS device
2. Navigate to test panel
3. Test touch interactions
4. Test audio recording
5. Test navigation
6. Rotate device (test landscape)
7. Check for any layout issues

#### iOS-Specific Checks
- [ ] No zoom on input focus
- [ ] Safe area insets work (notch devices)
- [ ] Bottom navigation doesn't overlap home indicator
- [ ] Scrolling is smooth with momentum
- [ ] No webkit-specific bugs

### Chrome - Android

#### Visual Features
- [ ] Glassmorphism renders correctly
- [ ] Animations are smooth
- [ ] Touch interactions work
- [ ] Bottom navigation works

#### Testing Steps
1. Open Chrome on Android device
2. Navigate to test panel
3. Test all features
4. Check performance on lower-end devices

## Feature-Specific Testing

### Glassmorphism Testing

**What to Check:**
- Blur effect is visible behind glass surfaces
- Border is subtle and visible
- Background shows through with transparency
- Hover states increase opacity slightly

**How to Test:**
1. Navigate to any page with glass components
2. Verify blur effect behind cards, buttons, modals
3. Test hover states
4. Check fallback on unsupported browsers

**Expected Behavior:**
- Chrome/Edge: Full support
- Firefox 103+: Full support
- Safari: Full support with -webkit- prefix
- Older browsers: Fallback to solid background

### Animation Testing

**What to Check:**
- All animations run at 60fps
- No jank or stuttering
- Smooth transitions between states
- Reduced motion is respected

**How to Test:**
1. Open DevTools > Performance
2. Start recording
3. Trigger animations (hover, click, page transitions)
4. Stop recording
5. Check FPS graph (should be solid green at 60fps)

**Performance Targets:**
- Desktop: 60fps consistently
- Mobile (high-end): 55-60fps
- Mobile (low-end): 30fps minimum with reduced effects

### Audio Recording Testing

**What to Check:**
- Permission request works
- Recording starts successfully
- Waveform reacts to audio
- Recording stops and processes

**How to Test:**
1. Click voice recorder button
2. Grant microphone permission
3. Speak into microphone
4. Verify waveform visualization
5. Stop recording
6. Verify processing state

**Browser-Specific Notes:**
- Safari: Requires user gesture (tap button)
- Chrome: May show permission prompt
- Firefox: May show permission prompt
- iOS: Requires user gesture

### SVG Rendering Testing

**What to Check:**
- Gradients render smoothly
- Shapes are crisp
- Animations are smooth
- No rendering artifacts

**How to Test:**
1. Navigate to pages with Aloe components
2. Verify AloeBloom renders correctly
3. Verify AloeRoot displays properly
4. Check AloePattern background
5. Test WaveformVisualizer

## Automated Testing

### Run All Tests

```bash
npm test
```

### Run Browser Detection Tests

```bash
npm test -- src/utils/__tests__/browserDetection.test.ts
```

### Run Component Tests

```bash
npm test -- src/components/__tests__/
```

## Performance Testing

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Performance" category
4. Click "Generate report"

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+

### Manual FPS Testing

1. Open DevTools > Performance
2. Enable "Screenshots" and "Memory"
3. Start recording
4. Interact with the app (scroll, hover, click)
5. Stop recording after 10 seconds
6. Check FPS graph

**What to Look For:**
- Solid green bars at 60fps
- No red bars (dropped frames)
- No yellow bars (long tasks)
- Smooth animation curves

### Bundle Size Testing

```bash
npm run build
npm run preview
```

Check dist/ folder size:
- Target: <500KB total (gzipped)
- JS bundle: <300KB (gzipped)
- CSS bundle: <50KB (gzipped)

## Accessibility Testing

### Screen Reader Testing

**Windows:**
- NVDA + Chrome/Firefox
- JAWS + Chrome/Edge

**macOS:**
- VoiceOver + Safari

**iOS:**
- VoiceOver + Safari

**What to Check:**
- All interactive elements are announced
- Focus order is logical
- ARIA labels are present
- Form inputs have labels

### Keyboard Navigation Testing

**What to Check:**
- Tab order is logical
- Focus indicators are visible
- All interactive elements are keyboard accessible
- Modal trapping works
- Escape key closes modals

**How to Test:**
1. Use Tab to navigate forward
2. Use Shift+Tab to navigate backward
3. Use Enter/Space to activate buttons
4. Use Escape to close modals
5. Verify focus is visible at all times

### Color Contrast Testing

Use browser DevTools or online tools:
- Chrome DevTools > Lighthouse > Accessibility
- WebAIM Contrast Checker
- Stark plugin (Figma/Browser)

**WCAG AA Requirements:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Our Colors:**
- Sage on dark: 4.8:1 ✅
- Gold on dark: 7.2:1 ✅
- Terracotta on dark: 5.1:1 ✅

### Reduced Motion Testing

**How to Test:**

**Windows:**
1. Settings > Accessibility > Visual effects
2. Turn off animations

**macOS:**
1. System Preferences > Accessibility > Display
2. Check "Reduce motion"

**What to Check:**
- Animations are disabled or simplified
- Functionality still works
- No jarring transitions
- Content is still accessible

## Common Issues and Solutions

### Issue: Backdrop blur not working

**Symptoms:**
- Glass surfaces appear solid
- No blur effect visible

**Solutions:**
1. Check browser support (Firefox 103+, Safari with -webkit-)
2. Verify CSS is loaded correctly
3. Check for conflicting styles
4. Test fallback styles

### Issue: Animations are janky

**Symptoms:**
- Stuttering during animations
- Dropped frames
- Slow performance

**Solutions:**
1. Check FPS in DevTools
2. Verify GPU acceleration (use transform/opacity)
3. Reduce particle count on low-end devices
4. Enable reduced motion for low-end devices
5. Check for layout thrashing

### Issue: Audio recording not working

**Symptoms:**
- Permission denied
- No audio captured
- Waveform not displaying

**Solutions:**
1. Verify HTTPS or localhost (required for getUserMedia)
2. Check browser permissions
3. Ensure user gesture triggered request (Safari)
4. Check microphone hardware
5. Test in different browser

### Issue: SVG not rendering

**Symptoms:**
- Aloe components not visible
- Gradients not displaying
- Shapes are broken

**Solutions:**
1. Check SVG syntax
2. Verify viewBox attribute
3. Check gradient definitions
4. Test in different browser
5. Verify CSS not hiding elements

## Reporting Issues

When reporting browser-specific issues, include:

1. **Browser Information:**
   - Name and version
   - Operating system
   - Device (if mobile)

2. **Steps to Reproduce:**
   - Exact steps to trigger issue
   - Expected behavior
   - Actual behavior

3. **Screenshots/Videos:**
   - Visual evidence of issue
   - DevTools console errors
   - Network tab (if relevant)

4. **Environment:**
   - Development or production
   - URL where issue occurs
   - Any browser extensions enabled

## Continuous Testing

### CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Run Lighthouse
  run: npm run lighthouse

- name: Check bundle size
  run: npm run build && npm run size-check
```

### Browser Testing Services

Consider using:
- **BrowserStack**: Cross-browser testing
- **Sauce Labs**: Automated testing
- **Percy**: Visual regression testing
- **Chromatic**: Storybook visual testing

## Conclusion

Cross-browser testing ensures the Voice-to-Invoice application works consistently across all major browsers and devices. Follow this guide to verify all features work correctly and provide a great user experience regardless of the browser or device used.

**Key Takeaways:**
- Test on real devices when possible
- Use browser test panel for quick checks
- Monitor performance metrics
- Respect user preferences (reduced motion)
- Provide appropriate fallbacks
- Test accessibility features

**Next Steps:**
1. Complete manual testing checklist
2. Run automated tests
3. Fix any issues found
4. Document browser-specific quirks
5. Set up continuous testing
