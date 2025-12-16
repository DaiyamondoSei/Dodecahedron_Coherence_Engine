# 🧪 Test Custom Data Flow

**Quick way to test demo-orchestrator → DNA helix data flow**

---

## Method 1: Use Console Helper (Fastest!)

**Open octave-dna.html, then paste this into console:**

```javascript
// Create test custom data (12 KPIs in quick mode)
const testData = {
    id: 'custom',
    name: 'Test Company',
    description: 'Console-generated test data',
    faceConfig: {
        templateName: 'Standard Business Model',
        faces: [
            { id: 1, name: 'Financial Capital' },
            { id: 2, name: 'Intellectual Capital' },
            { id: 3, name: 'Human Capital' },
            { id: 4, name: 'Structural Capital' },
            { id: 5, name: 'Market Resonance' },
            { id: 6, name: 'Community & Partners' },
            { id: 7, name: 'Brand & Reputation' },
            { id: 8, name: 'Core Operations' },
            { id: 9, name: 'Regenerative Flow' },
            { id: 10, name: 'Foundational Values' },
            { id: 11, name: 'Funding Pipeline' },
            { id: 12, name: 'Risk & Resilience' }
        ]
    },
    kpis: [
        { id: 'F1_K1', faceId: 1, name: 'Cash Flow', value: 65, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F2_K1', faceId: 2, name: 'Innovation Index', value: 72, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F3_K1', faceId: 3, name: 'Team Morale', value: 58, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F4_K1', faceId: 4, name: 'Process Efficiency', value: 80, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F5_K1', faceId: 5, name: 'Customer Satisfaction', value: 45, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F6_K1', faceId: 6, name: 'Partner Strength', value: 70, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F7_K1', faceId: 7, name: 'Brand Recognition', value: 55, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F8_K1', faceId: 8, name: 'Delivery Speed', value: 85, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F9_K1', faceId: 9, name: 'Sustainability Score', value: 68, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F10_K1', faceId: 10, name: 'Values Alignment', value: 90, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F11_K1', faceId: 11, name: 'Funding Secured', value: 40, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' },
        { id: 'F12_K1', faceId: 12, name: 'Risk Mitigation', value: 75, direction: '↑', targetMin: 0, targetIdeal: 100, element: 'Earth' }
    ],
    isCustomData: true,
    timestamp: new Date().toISOString()
};

// Save to sessionStorage
sessionStorage.setItem('customCompanyData', JSON.stringify(testData));
sessionStorage.setItem('selectedCompanyId', 'custom');

console.log('✅ Test data loaded! Refresh page to see it.');
```

**Then refresh the page (F5)**

---

## Method 2: Clear SessionStorage (Start Fresh)

**If you want to clear old test data:**

```javascript
// Clear all custom data
sessionStorage.removeItem('customCompanyData');
sessionStorage.removeItem('selectedCompanyId');
console.log('✅ Custom data cleared');
```

**Then refresh and test from demo-orchestrator.html**

---

## Method 3: Wizard Flow (Full Test)

**Complete step-by-step:**

1. **Go to:** `http://localhost:8000/demo-orchestrator.html`

2. **Step 1:** Choose template (e.g., "Standard Business Model")
   - Click "Continue to Step 2"

3. **Step 2:** Select "Quick Mode" (12 KPIs - easier to test)

4. **Fill in at least a few KPIs:**
   - Face 1 (Financial): "Cash Reserves" = 50
   - Face 2 (Intellectual): "Patents Filed" = 5
   - Face 3 (Human): "Team Size" = 12
   - (Fill more if you want, but at least 3)

5. **Click "Continue to Step 3"**

6. **Click "Calculate Coherence"**
   - Wait for calculation (~2 seconds)

7. **Click "Launch DNA Helix" button**

8. **Check console:**
   - Should see: "✅ Transformed X KPIs to engine format"
   - Should see: "✅ Quannex initialized with custom company"
   - Should see: "📊 Loaded 12 faces with X KPIs"

---

## What to Look For

### ✅ SUCCESS Indicators:

**Console:**
```
[DNA View] 🎨 Loading CUSTOM data from orchestrator
[DNA View] 📊 Custom company has 12 KPIs  ← Should be 12, not 1!
[DNA View] ✅ Transformed 12 KPIs to engine format
[DNA View] ✅ Quannex initialized with custom company
[DNA View] 📊 Loaded 12 faces with 12 KPIs
🧬 DNA Visualization Complete!
```

**Visual:**
- All 6 DNA helices render
- Spiral colors reflect your KPI values
- Click a helix → Breath analysis shows YOUR data
- Breath ratios calculated from YOUR faces

---

### ❌ FAILURE Indicators:

**Console:**
```
[DNA View] ⚠️ Custom company has 1 KPIs  ← Only 1! Bug or incomplete form
⚙️ Initializing with company: Quannex  ← Falling back to hardcoded data
```

**If this happens:**
1. Check if you filled in all KPI fields in wizard
2. Try Method 1 (console helper) to test with known-good data
3. Check browser console for errors

---

## Expected Behavior (Fixed!)

**Before Fix:**
- Custom data loaded from sessionStorage ✅
- But only 1 KPI collected (if wizard incomplete)
- Fell back to loading Quannex hardcoded data ❌

**After Fix:**
- Custom data loaded from sessionStorage ✅
- Transformed to engine format ✅
- Passed DIRECTLY to Quannex engine ✅
- DNA helix renders with YOUR data ✅

---

## Debugging Tips

**Check what's in sessionStorage:**

```javascript
const data = sessionStorage.getItem('customCompanyData');
if (data) {
    const parsed = JSON.parse(data);
    console.log('KPIs in storage:', parsed.kpis.length);
    console.log('First KPI:', parsed.kpis[0]);
} else {
    console.log('No custom data in storage');
}
```

**Force reload custom data:**

```javascript
// Trigger custom data load manually
checkSessionStorageDNA();
```

---

**Created:** 2025-01-16
**Purpose:** Test custom data flow after fixes
**Status:** Ready to test ✅
