# Aloe Components Quick Reference

## When to Use Each Component

### 🌸 AloeBloom
**Use for**: Success celebrations and completion moments

```tsx
import { AloeBloom } from '@/components';

// Invoice submitted successfully
<AloeBloom 
  onComplete={() => navigate('/invoices')}
  size={200}
/>
```

**Perfect for**:
- ✅ Invoice submission success
- ✅ Data saved confirmation
- ✅ Task completion
- ✅ Payment received
- ✅ Any "win" moment

---

### 🌿 AloeRoot
**Use for**: Security, persistence, and foundation messaging

```tsx
import { AloeRoot } from '@/components';

// Security section decoration
<div className="relative">
  <AloeRoot 
    animate={dataSaved}
    size={200}
    className="absolute bottom-4 right-4 opacity-20"
  />
  <h2>Your Data is Secure</h2>
</div>
```

**Perfect for**:
- 🔒 Security sections
- 💾 Data persistence indicators
- ⚙️ Settings pages
- 🛡️ Trust/reliability messaging
- 📊 Stability features

---

### 💫 AloeGrowthPulse
**Use for**: AI processing and "thinking" states

```tsx
import { AloeGrowthPulse } from '@/components';

// Voice recorder processing
<div className="relative">
  <VoiceRecorder />
  {isProcessing && <AloeGrowthPulse size={200} />}
</div>
```

**Perfect for**:
- 🎤 Voice processing
- 🤖 AI/LLM thinking
- 🔄 Background processing
- 📝 Transcription in progress
- 🧠 Smart features working

---

### 🍃 AloePattern
**Use for**: Subtle background texture

```tsx
import { AloePattern } from '@/components';

// Page background
<div className="relative min-h-screen bg-space-dark">
  <AloePattern opacity={0.05} />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

**Perfect for**:
- 🏠 Homepage backgrounds
- 📄 Page sections
- 🎨 Hero sections
- 🖼️ Any area needing subtle texture
- 🌌 Deep space backgrounds

---

## Color Palette Quick Reference

```tsx
// Sage Green (Stability, Primary)
sage: {
  500: '#6b8e23',  // Primary
  400: '#8ba888',  // Light
  600: '#5a7a1e',  // Medium
  700: '#4a6619',  // Deep
}

// Terracotta (Success, Warmth)
terracotta: {
  500: '#d2691e',  // Primary
  400: '#e8a87c',  // Light
  600: '#b8591a',  // Medium
}

// Gold (Highlights, Accents)
gold: {
  500: '#daa520',  // Primary
  400: '#f4d03f',  // Light
  600: '#c19420',  // Medium
}

// Space (Backgrounds)
space: {
  dark: '#0f172a',    // Primary
  medium: '#1e293b',  // Medium
  light: '#334155',   // Light
}
```

---

## Common Patterns

### Success Flow
```tsx
const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = async () => {
  await submitInvoice();
  setShowSuccess(true);
};

return (
  <>
    {showSuccess && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <AloeBloom 
          onComplete={() => {
            setShowSuccess(false);
            navigate('/invoices');
          }}
        />
      </div>
    )}
  </>
);
```

### Processing State
```tsx
const [isProcessing, setIsProcessing] = useState(false);

return (
  <div className="relative">
    <button 
      onClick={handleProcess}
      className="relative z-10"
    >
      Process
    </button>
    {isProcessing && <AloeGrowthPulse size={150} />}
  </div>
);
```

### Secure Section
```tsx
<section className="relative p-8 bg-space-dark rounded-lg">
  <AloeRoot 
    animate={dataSaved}
    size={200}
    className="absolute bottom-4 right-4 opacity-20"
  />
  <h2>Data Security</h2>
  <p>Your data is encrypted and stored locally.</p>
</section>
```

### Themed Page
```tsx
<div className="relative min-h-screen bg-space-dark">
  <AloePattern opacity={0.05} color="#6b8e23" />
  
  <div className="relative z-10 container mx-auto py-12">
    <h1 className="text-4xl bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent">
      Welcome
    </h1>
    {/* Content */}
  </div>
</div>
```

---

## Props Cheat Sheet

### AloeBloom
```tsx
interface AloeBloomProps {
  onComplete?: () => void;  // Callback when animation completes
  size?: number;            // Size in pixels (default: 200)
}
```

### AloeRoot
```tsx
interface AloeRootProps {
  animate?: boolean;        // Enable growth animation (default: false)
  size?: number;            // Size in pixels (default: 300)
  className?: string;       // Additional CSS classes
}
```

### AloeGrowthPulse
```tsx
interface AloeGrowthPulseProps {
  size?: number;            // Size in pixels (default: 200)
  className?: string;       // Additional CSS classes
}
```

### AloePattern
```tsx
interface AloePatternProps {
  className?: string;       // Additional CSS classes
  opacity?: number;         // Pattern opacity (default: 0.05)
  color?: string;           // Pattern color (default: '#6b8e23')
}
```

---

## Accessibility Notes

All components:
- ✅ Respect `prefers-reduced-motion`
- ✅ Use semantic SVG elements
- ✅ Meet WCAG AA contrast ratios
- ✅ Work without JavaScript
- ✅ Screen reader friendly

---

## Performance Tips

1. **AloePattern**: Already optimized (static, no animation)
2. **AloeBloom**: Use sparingly for special moments
3. **AloeGrowthPulse**: Conditional rendering (only when processing)
4. **AloeRoot**: Animate only on specific events

---

## Testing

```bash
# Test all Aloe components
npm test -- src/components/__tests__/Aloe --run

# Test specific component
npm test -- src/components/__tests__/AloeBloom.test.tsx --run
```

---

## Import Shortcuts

```tsx
// Individual imports
import { AloeBloom } from '@/components/AloeBloom';
import { AloeRoot } from '@/components/AloeRoot';
import { AloeGrowthPulse } from '@/components/AloeGrowthPulse';
import { AloePattern } from '@/components/AloePattern';

// Batch import
import { 
  AloeBloom, 
  AloeRoot, 
  AloeGrowthPulse, 
  AloePattern 
} from '@/components';
```

---

## Design Philosophy

Remember the Aloe metaphor:
- 🌸 **Bloom** = Success & Celebration
- 🌿 **Root** = Security & Foundation
- 💫 **Pulse** = Growth & Processing
- 🍃 **Pattern** = Identity & Theme

Each component tells a story of resilience, stability, and South African heritage.
