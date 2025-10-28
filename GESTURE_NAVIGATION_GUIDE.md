# Gesture Navigation Guide

## Overview
The Voice to Invoice app now supports intuitive gesture-based navigation, making it feel like a native mobile app.

---

## Supported Gestures

### 1. Swipe Down to Dismiss 👇

**When:** Invoice review panel is open  
**Action:** Swipe down from anywhere on the panel  
**Result:** Panel slides down, returns to microphone

**How it works:**
- Touch the review panel
- Drag your finger down
- Panel follows your finger
- Release when you've swiped far enough
- Panel dismisses and microphone expands

**Thresholds:**
- **Distance:** Must swipe at least 100px
- **Velocity:** OR swipe fast enough (0.5 px/ms)
- **Visual feedback:** Panel follows finger during swipe

**Desktop equivalent:**
- Click and hold on the panel
- Drag mouse down
- Release when far enough

---

### 2. Click Microphone to Dismiss 🎤

**When:** Invoice review panel is open  
**Action:** Click the microphone icon in top-left corner  
**Result:** Panel slides down, returns to microphone

**Visual cues:**
- Microphone icon visible in top-left
- Hover effect (scales up)
- Tooltip: "Back to microphone"

---

### 3. Swipe Down Indicator 📍

**When:** Invoice review panel first opens  
**Action:** Visual hint at top of panel  
**Result:** Shows users they can swipe down

**Appearance:**
- Chevron down icon
- Text: "Swipe down to dismiss"
- Subtle bounce animation
- Fades in after panel opens

---

## Gesture Behavior

### Smooth Following
The panel follows your finger/mouse during the swipe:

```
Touch position → Panel position
0px down       → Panel at 0px
50px down      → Panel at 50px
100px down     → Panel at 100px
150px down     → Panel at 150px (threshold met)
```

### Snap Back
If you don't swipe far enough, the panel snaps back:

```
Swipe 80px → Release → Panel snaps back to 0px
Swipe 120px → Release → Panel dismisses (slides to 100%)
```

### Velocity Detection
Fast swipes trigger dismissal even if distance is short:

```
Slow swipe 80px → Snaps back
Fast swipe 80px → Dismisses (velocity > 0.5 px/ms)
```

---

## Platform-Specific Behavior

### Mobile (Touch)
- **Primary:** Swipe down gesture
- **Secondary:** Tap microphone icon
- **Feel:** Natural, follows finger
- **Feedback:** Haptic (future enhancement)

### Desktop (Mouse)
- **Primary:** Click microphone icon
- **Secondary:** Mouse drag down
- **Feel:** Smooth, follows cursor
- **Feedback:** Visual only

### Tablet
- **Primary:** Swipe down gesture
- **Secondary:** Tap microphone icon
- **Feel:** Same as mobile
- **Feedback:** Visual only

---

## Accessibility

### Keyboard Navigation
- `Esc` key: Dismiss panel (future enhancement)
- `Tab`: Navigate through form fields
- `Enter`: Submit form

### Screen Readers
- Microphone button: "Back to microphone"
- Swipe indicator: "Swipe down to dismiss"
- Panel: "Invoice review panel"

### Reduced Motion
- Gestures still work
- Animations are instant (no smooth transitions)
- Respects `prefers-reduced-motion` setting

---

## Visual Feedback

### During Swipe
```
State: Idle
Panel: y = 0px
Opacity: 1

State: Swiping (50px)
Panel: y = 50px
Opacity: 1

State: Swiping (150px)
Panel: y = 150px
Opacity: 0.8 (future enhancement)

State: Released (threshold met)
Panel: y = 100% (slides out)
Opacity: 0
```

### Microphone Icon
```
State: Idle (panel open)
Icon: Visible in top-left
Scale: 1
Shadow: Normal

State: Hover
Icon: Visible in top-left
Scale: 1.1
Shadow: Enhanced

State: Click
Icon: Visible in top-left
Scale: 0.95
Shadow: Reduced
```

---

## Edge Cases

### Scroll Conflict
**Problem:** Swipe down might trigger scroll  
**Solution:** Gesture only triggers when scrolled to top

### Accidental Swipes
**Problem:** User might swipe accidentally  
**Solution:** Threshold prevents accidental dismissal

### Slow Devices
**Problem:** Animations might lag  
**Solution:** Uses GPU-accelerated transforms

### Small Screens
**Problem:** Limited swipe space  
**Solution:** Threshold scales with screen size (future)

---

## Implementation Details

### Gesture Detection
```typescript
const swipeState = useSwipeGesture(reviewPanelRef, {
  onSwipeDown: handleDismissReview,
  threshold: 100,        // Minimum distance
  velocityThreshold: 0.5, // Minimum velocity
});
```

### Animation
```typescript
animate={{ 
  y: swipeState.isSwiping && swipeState.direction === 'down' 
    ? Math.min(swipeState.distance, window.innerHeight * 0.5)
    : 0 
}}
```

### Event Handling
```typescript
// Touch events (mobile)
element.addEventListener('touchstart', handleTouchStart);
element.addEventListener('touchmove', handleTouchMove);
element.addEventListener('touchend', handleTouchEnd);

// Mouse events (desktop)
element.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mouseup', handleMouseUp);
```

---

## Future Enhancements

### Horizontal Swipes
- **Swipe left:** Go to invoices list
- **Swipe right:** Go to clients list
- **Swipe up:** Expand to full screen

### Haptic Feedback
- Vibrate when threshold reached
- Vibrate on successful dismissal
- Different patterns for different actions

### Customization
- Adjust threshold in settings
- Enable/disable gestures
- Choose preferred dismissal method

### Advanced Gestures
- **Pinch to zoom:** Preview invoice
- **Two-finger swipe:** Navigate history
- **Long press:** Show context menu

---

## Troubleshooting

### Gesture doesn't work
1. Check if panel is open
2. Try clicking microphone icon instead
3. Check if touch events are supported
4. Try mouse drag on desktop

### Panel snaps back
1. Swipe farther (> 100px)
2. Swipe faster (velocity matters)
3. Check if threshold is met

### Conflicts with scroll
1. Scroll to top of panel first
2. Gesture only works at top
3. Use microphone icon instead

### Laggy animations
1. Check device performance
2. Disable other animations
3. Enable reduced motion

---

## Best Practices

### For Users
- **Mobile:** Use swipe down (most natural)
- **Desktop:** Click microphone icon (most reliable)
- **Tablet:** Either method works well

### For Developers
- Test on real devices (not just emulators)
- Test with different screen sizes
- Test with reduced motion enabled
- Test with keyboard only

### For Designers
- Keep swipe indicator visible
- Make microphone icon prominent
- Provide visual feedback during swipe
- Consider haptic feedback

---

## Conclusion

Gesture navigation makes the Voice to Invoice app feel **modern, intuitive, and delightful**. Users can naturally swipe down to dismiss the review panel, just like they would in a native mobile app. The implementation is robust, accessible, and works across all devices.

🎉 **Swipe away!**
