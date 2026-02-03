# Benchmarks Dashboard - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server

```bash
cd /Users/Owner/opencitylabs/alignhealthcare
npm run dev
```

### 2. Access the Dashboard

1. Open http://localhost:3000
2. Sign in with your account
3. Click **"Benchmarks"** in the navigation menu
4. You're now on `/dashboard/benchmarks`

## 🎯 Using the Benchmarks Dashboard

### Quick Select (Fastest)

Click the colored badges to select entire categories:

- **🏥 Medical (4)** - All MEDHELM benchmarks
- **📚 Academic (10)** - All lm-eval benchmarks
- **🧬 BigBIO (20)** - All BigBIO benchmarks

### Task-Specific Selection

Click task type badges for targeted evaluation:

- **❓ Question Answering (3)** - QA benchmarks
- **🏷️ Named Entity Recognition (1)** - NER tasks
- **🔗 Relation Extraction (2)** - RE tasks
- **🔍 Semantic Similarity (1)** - Similarity tasks
- **📋 Document Classification (1)** - Classification tasks

### Detailed Selection

Expand accordion sections to select individual benchmarks:

1. Click "Medical Benchmarks" to expand
2. Click any benchmark card to select/deselect
3. Green checkmark indicates selection

### Configure & Run

1. **Select Model**: Choose from dropdown (Claude, GPT-4, Gemini)
2. **Set Limit**: Enter number of samples (default: 100)
3. **Click "Run Benchmarks"**: Start execution

### Monitor Progress

Watch real-time updates:
- Progress bar shows completion
- Status badge shows running/completed/failed
- Timestamps show start/end times

### View Results

Results appear automatically:
- Table shows benchmark, model, score, accuracy
- Color indicators: 🟢 90%+ | 🟡 70-90% | 🔴 <70%
- Click "Export CSV" or "Export JSON" to download

### Show History

- Click "Show History" to see past runs
- Click "Hide History" to see only current run

## 🔧 Backend Integration (For Production)

### Connect to Python Backend

Edit `/src/app/api/benchmarks/run/route.ts`:

```typescript
// Line 95 - Replace simulation with:
const response = await fetch('http://localhost:8082/api/benchmarks/run', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OCL_API_KEY}`,
  },
  body: JSON.stringify({ benchmarks, model, limit }),
});
const data = await response.json();
```

### Connect to OCL Registry

Edit `/src/app/api/benchmarks/models/route.ts`:

```typescript
// Line 8 - Replace defaults with:
const response = await fetch('http://localhost:8082/api/models', {
  headers: {
    Authorization: `Bearer ${process.env.OCL_API_KEY}`,
  },
});
const data = await response.json();
```

### Add Environment Variable

Create `.env.local`:

```bash
OCL_API_KEY=your_api_key_here
```

## 📊 Selection Method Examples

### Example 1: Quick Medical Test
1. Click "🏥 Medical (4)"
2. Select "Claude 3.5 Sonnet"
3. Keep default limit (100)
4. Click "Run Benchmarks"

### Example 2: All QA Benchmarks
1. Click "❓ Question Answering (3)"
2. Click "🏥 Medical (4)" (includes PubMedQA)
3. Select model
4. Run

### Example 3: Complete Medical Suite
1. Click "🏥 Medical (4)"
2. Click "🧬 BigBIO (20)"
3. Select model
4. Run (24 benchmarks total)

### Example 4: Custom Mix
1. Expand "Medical Benchmarks"
2. Click PubMedQA
3. Expand "Academic Benchmarks"
4. Click MMLU
5. Click "❓ Question Answering (3)" for BigBIO QA
6. Run

## 🎨 UI Features

### Dark Mode
Automatically follows system preference (already configured)

### Responsive
Works on desktop, tablet, and mobile

### Keyboard Navigation
- Tab through elements
- Enter/Space to select
- Escape to close dropdowns

### Loading States
- Model dropdown shows "Loading models..."
- Run button shows "Running..." during execution
- Progress bar animates

## 🐛 Troubleshooting

### Models Not Loading
- Check if API endpoint is running
- Verify environment variables
- Fallback to default models shown

### Benchmarks Not Running
- Ensure model is selected
- Check at least one benchmark is selected
- Verify backend is accessible

### Progress Not Updating
- Check network tab for polling requests
- Verify `/api/benchmarks/progress/[id]` endpoint
- Default poll interval: 2 seconds

### Results Not Exporting
- Ensure results exist in table
- Check browser download permissions
- Try different format (CSV vs JSON)

## 📁 File Locations

```
Key Files:
├── Main Page: /src/app/[locale]/(auth)/dashboard/benchmarks/page.tsx
├── Components: /src/features/benchmarks/
│   ├── BenchmarkSelector.tsx
│   ├── ModelSelector.tsx
│   ├── BenchmarkProgress.tsx
│   └── BenchmarkResults.tsx
└── API Routes: /src/app/api/benchmarks/
    ├── models/route.ts
    ├── run/route.ts
    └── progress/[id]/route.ts
```

## 🔗 Related Documentation

- Full Implementation: `BENCHMARKS_DASHBOARD_IMPLEMENTATION.md`
- CLI Selection Methods: `/benchmarks/SELECTION_METHODS.md`
- CLI Examples: `/benchmarks/SELECTION_EXAMPLES.txt`
- BigBIO Integration: `/benchmarks/BIGBIO_INTEGRATION.md`

## 💡 Tips

1. **Start Small**: Test with 1-2 benchmarks first
2. **Use Quick Select**: Fastest way to get started
3. **Check History**: Review past runs before running again
4. **Export Early**: Download results before running new benchmarks
5. **Monitor Progress**: Don't navigate away during runs

## 🚦 Status

- ✅ UI Complete
- ✅ All Selection Methods Working
- ✅ Progress Tracking Working
- ✅ Export Working
- ⚠️ Demo Mode (simulated execution)
- 🔜 Backend Integration Needed

## 📞 Support

See full implementation details in `BENCHMARKS_DASHBOARD_IMPLEMENTATION.md`

---

**Happy Benchmarking! 🎯**
