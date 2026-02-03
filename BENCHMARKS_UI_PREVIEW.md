# Benchmarks Dashboard - UI Preview

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Dashboard > Benchmarks                                    [User] 👤 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  AI Benchmarks                                                        │
│  Run comprehensive evaluations across medical, academic, and          │
│  biomedical benchmarks                                                │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─── Select Benchmarks ──────────────────────────────────────┐    │
│  │                                                               │    │
│  │  Quick Select                                                 │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                           │    │
│  │  │🏥Medical│ │📚Academic│ │🧬BigBIO│                         │    │
│  │  │   (4)   │ │   (10)  │ │  (20)  │                           │    │
│  │  └────────┘ └────────┘ └────────┘                           │    │
│  │                                                               │    │
│  │  BigBIO Task Types                                            │    │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │    │
│  │  │❓QA │ │🏷️NER│ │🔗RE │ │🔍SIM│ │📋CLS│                    │    │
│  │  │ (3)│ │ (1)│ │ (2)│ │ (1)│ │ (1)│                        │    │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘                        │    │
│  │                                                               │    │
│  │  Detailed Selection                                           │    │
│  │  ┌─▶ 🏥 Medical Benchmarks ───────── 2/4 ─────────┐         │    │
│  │  │   ┌───────────────────────────────────────────┐ │         │    │
│  │  │   │ ✓ [1] PubMedQA                            │ │         │    │
│  │  │   │   Medical question answering              │ │         │    │
│  │  │   └───────────────────────────────────────────┘ │         │    │
│  │  │   ┌───────────────────────────────────────────┐ │         │    │
│  │  │   │ ✓ [2] MedHallu                            │ │         │    │
│  │  │   │   Medical hallucination detection         │ │         │    │
│  │  │   └───────────────────────────────────────────┘ │         │    │
│  │  │   ┌───────────────────────────────────────────┐ │         │    │
│  │  │   │   [3] MedCalc-Bench                       │ │         │    │
│  │  │   │   Medical calculations                    │ │         │    │
│  │  │   └───────────────────────────────────────────┘ │         │    │
│  │  └─────────────────────────────────────────────────┘         │    │
│  │                                                               │    │
│  │  ┌─▷ 📚 Academic Benchmarks ────────── 0/10 ───────┐        │    │
│  │  ┌─▷ 🧬 BigBIO Benchmarks ─────────── 20 available ┐        │    │
│  │                                                               │    │
│  │  Selection Summary                                            │    │
│  │  Categories: medical                                          │    │
│  │  Individual: 2 selected                                       │    │
│  │                                                               │    │
│  │  ┌─────────────────────┐  ┌─────────────────────┐           │    │
│  │  │ Select Model        │  │ Sample Limit        │           │    │
│  │  │ Claude 3.5 Sonnet ▼ │  │ 100                 │           │    │
│  │  └─────────────────────┘  └─────────────────────┘           │    │
│  │                                                               │    │
│  │  ┌────────────────────────┐                                  │    │
│  │  │   Run Benchmarks       │                                  │    │
│  │  └────────────────────────┘                                  │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─── Benchmark Progress ─────────────────────────────────────┐    │
│  │                                             [Running]        │    │
│  │  Progress: 2 / 4                                   50%       │    │
│  │  ████████████░░░░░░░░░░░░░                                  │    │
│  │                                                               │    │
│  │  Started: 2:30:45 PM                                          │    │
│  │  ● Benchmarks are running. This may take several minutes...  │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─── Results ────────────────────────────────────────────────┐    │
│  │  [Show History] [Export CSV] [Export JSON]                  │    │
│  │                                                               │    │
│  │  ┌──────────────────────────────────────────────────────┐   │    │
│  │  │ Benchmark    │ Model           │ Score    │ Timestamp │   │    │
│  │  ├──────────────────────────────────────────────────────┤   │    │
│  │  │ PubMedQA     │ Claude 3.5 Sonnet│ 87.5% 🟢 │ 2:30 PM   │   │    │
│  │  │ MedHallu     │ Claude 3.5 Sonnet│ 92.3% 🟢 │ 2:31 PM   │   │    │
│  │  └──────────────────────────────────────────────────────┘   │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Quick Select Badges

```
┌────────┐  ┌────────┐  ┌────────┐
│🏥Medical│  │📚Academic│  │🧬BigBIO│
│   (4)   │  │   (10)  │  │  (20)  │
└────────┘  └────────┘  └────────┘
     ↓           ↓           ↓
  Selected   Unselected  Unselected
 (Primary)   (Outline)   (Outline)
```

**Interaction:**
- Click to toggle selection
- Primary color when selected
- Outline style when unselected
- Shows count in parentheses

### 2. Subcategory Badges

```
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│❓QA │ │🏷️NER│ │🔗RE │ │🔍SIM│ │📋CLS│
│ (3)│ │ (1)│ │ (2)│ │ (1)│ │ (1)│
└────┘ └────┘ └────┘ └────┘ └────┘
```

**Features:**
- Emoji icons for visual identification
- Count shows number of benchmarks
- Works independently of category selection
- Smaller size than category badges

### 3. Accordion Selection

```
┌─▶ 🏥 Medical Benchmarks ───────── 2/4 ─────────┐  ← Expanded
│   ┌───────────────────────────────────────────┐ │
│   │ ✓ [1] PubMedQA                            │ │  ← Selected
│   │   Medical question answering              │ │
│   └───────────────────────────────────────────┘ │
│   ┌───────────────────────────────────────────┐ │
│   │   [3] MedCalc-Bench                       │ │  ← Unselected
│   │   Medical calculations                    │ │
│   └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

┌─▷ 📚 Academic Benchmarks ────────── 0/10 ───────┐  ← Collapsed
```

**States:**
- **Expanded**: Shows all benchmarks in category
- **Collapsed**: Shows only category name and count
- **Selected Item**: Green border, checkmark visible
- **Unselected Item**: Gray border, no checkmark

### 4. Model Selector

```
┌─────────────────────┐
│ Select Model        │
│ Claude 3.5 Sonnet ▼ │  ← Dropdown
└─────────────────────┘

When opened:
┌─────────────────────────────────────────┐
│ ✓ Claude 3.5 Sonnet                     │  ← Selected
│   Anthropic - Most capable Claude model │
├─────────────────────────────────────────┤
│   Claude 3.5 Haiku                      │
│   Anthropic - Fast and efficient        │
├─────────────────────────────────────────┤
│   GPT-4o                                │
│   OpenAI - Latest GPT-4 Omni           │
└─────────────────────────────────────────┘
```

**Features:**
- Checkmark shows current selection
- Provider name in description
- Model description shown
- Keyboard navigable

### 5. Progress Bar

```
Running:
Progress: 2 / 4                                   50%
████████████░░░░░░░░░░░░░
● Benchmarks are running...

Completed:
Progress: 4 / 4                                   100%
████████████████████████████
✓ All benchmarks completed successfully!

Failed:
Progress: 2 / 4                                   50%
████████████░░░░░░░░░░░░░
✗ Benchmark run failed. Please try again.
```

**Colors:**
- Blue: Running
- Green: Completed
- Red: Failed

### 6. Results Table

```
┌──────────────────────────────────────────────────────┐
│ Benchmark    │ Model           │ Score    │ Timestamp │
├──────────────────────────────────────────────────────┤
│ PubMedQA     │ Claude 3.5      │ 87.5% 🟢 │ 2:30 PM   │
│ MedHallu     │ Claude 3.5      │ 92.3% 🟢 │ 2:31 PM   │
│ MMLU         │ Claude 3.5      │ 84.1% 🟡 │ 2:32 PM   │
│ HellaSwag    │ Claude 3.5      │ 68.5% 🔴 │ 2:33 PM   │
└──────────────────────────────────────────────────────┘
```

**Score Indicators:**
- 🟢 Green: 90%+
- 🟡 Yellow: 70-90%
- 🔴 Red: <70%

**Features:**
- Sortable columns
- Hover effects
- Responsive layout
- Empty state message

## Color Scheme

### Light Mode
```
Background: White (#FFFFFF)
Card: Light Gray (#F9FAFB)
Border: Gray (#E5E7EB)
Primary: Blue (#3B82F6)
Text: Dark Gray (#111827)
Muted: Gray (#6B7280)
```

### Dark Mode
```
Background: Dark (#0F172A)
Card: Dark Gray (#1E293B)
Border: Slate (#334155)
Primary: Blue (#3B82F6)
Text: White (#F8FAFC)
Muted: Slate (#94A3B8)
```

## Responsive Breakpoints

### Desktop (>1024px)
```
┌─────────────────────────────────────────────┐
│  [Model Selector]  │  [Sample Limit Input]  │
│  [────────Run Benchmarks────────]           │
└─────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌─────────────────────────────────┐
│  [Model Selector]               │
│  [Sample Limit Input]           │
│  [──────Run Benchmarks──────]   │
└─────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────┐
│ [Model Select]  │
│ [Sample Limit]  │
│ [Run Benchmarks]│
└─────────────────┘
```

## Interactive States

### Badge States
```
Default:   ┌────────┐
           │ Medical │  (Outline, gray)
           └────────┘

Hover:     ┌────────┐
           │ Medical │  (Background highlight)
           └────────┘

Selected:  ┌────────┐
           │ Medical │  (Primary color, filled)
           └────────┘

Disabled:  ┌────────┐
           │ Medical │  (Opacity 50%, no hover)
           └────────┘
```

### Button States
```
Default:   ┌────────────────┐
           │ Run Benchmarks │
           └────────────────┘

Hover:     ┌────────────────┐
           │ Run Benchmarks │  (Slightly darker)
           └────────────────┘

Active:    ┌────────────────┐
           │ Run Benchmarks │  (Darker, scale 98%)
           └────────────────┘

Disabled:  ┌────────────────┐
           │   Running...   │  (Opacity 50%)
           └────────────────┘
```

## Animation Details

### Progress Bar
- Smooth width transition (0.3s)
- Color change based on status
- Pulse animation when running

### Loading States
- Spinner on model selector
- Skeleton loaders for table
- Pulse on running indicator

### Transitions
- Accordion expand/collapse: 0.2s ease
- Badge selection: 0.15s ease
- Button hover: 0.15s ease
- Table row hover: 0.1s ease

## Accessibility

### Keyboard Navigation
```
Tab        → Focus next element
Shift+Tab  → Focus previous element
Enter      → Select/activate
Space      → Toggle selection
Escape     → Close dropdown/modal
```

### Screen Reader Announcements
```
Badge selected      → "Medical category selected"
Model changed       → "Model changed to Claude 3.5 Sonnet"
Progress updated    → "Progress: 2 of 4 benchmarks completed"
Benchmark completed → "All benchmarks completed successfully"
```

### Focus Indicators
```
┌────────┐
│ Medical │  ← Focus ring (blue outline, 2px)
└────────┘
```

## Empty States

### No Benchmarks Selected
```
┌────────────────────────────────────────┐
│                                        │
│           ⚠️                           │
│                                        │
│    No benchmarks selected              │
│                                        │
│    Select at least one benchmark       │
│    to get started                      │
│                                        │
└────────────────────────────────────────┘
```

### No Results Yet
```
┌────────────────────────────────────────┐
│                                        │
│           📊                           │
│                                        │
│    No results yet                      │
│                                        │
│    Run benchmarks to see results       │
│                                        │
└────────────────────────────────────────┘
```

---

**UI Framework:** Shadcn UI + Tailwind CSS
**Design System:** Consistent with existing dashboard
**Responsive:** Mobile-first approach
**Accessible:** WCAG 2.1 AA compliant
