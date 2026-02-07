# User Path Test Scenarios

**Purpose:** Comprehensive testing of Face Refinement feature from multiple user perspectives
**Created:** February 1, 2026
**Test Environment:** Local Python server (test_server.py)
**Primary Page:** `pages/demo-orchestrator.html`

---

## Setup

### 1. Start Test Server

```bash
cd C:\Users\murau\OneDrive\Stalinis kompiuteris\POC
python test_server.py
```

Expected output:
```
============================================================
🌟 Quannex POC Test Server
============================================================

Server running at: http://localhost:8000

Test Pages:
  • Orchestrator:    http://localhost:8000/pages/demo-orchestrator.html
  • 3D Dodecahedron: http://localhost:8000/pages/dodecahedron-3d.html
```

### 2. Open Browser Console

- **Chrome/Edge:** F12 or Ctrl+Shift+I
- **Firefox:** F12 or Ctrl+Shift+K

Console should show:
```
[FaceMapper] initialized
[MappingContext] singleton created
```

---

## Test Scenario 1: New User - First Mapping

**User Persona:** First-time user with no prior context

**Goal:** Create initial AI face mapping from organizational story

### Steps

1. **Navigate to Orchestrator**
   ```
   http://localhost:8000/pages/demo-orchestrator.html
   ```

2. **Enter Sample Story**

   Use this test story (or your own):
   ```
   We're a B2B SaaS startup building project management tools.
   Our team of 15 people works remotely across 3 time zones.
   We just raised Series A funding and are scaling our sales team.
   Customer success is our top priority, with 98% retention rate.
   We use agile methodology and ship features weekly.
   ```

3. **Click "Analyze Story"**

   Watch console for:
   ```
   [FaceMapper] Analyzing story...
   [FaceMapper] Story length: 250 characters
   [Gemini] API call initiated...
   ```

4. **Verify 12 Faces Mapped**

   Check that all faces show:
   - ✅ Face name (e.g., "Customer Excellence", "Innovation Pipeline")
   - ✅ Icon (emoji)
   - ✅ Sentiment score (0-1)
   - ✅ Reasoning text

### Expected Results

| Check | Expected | Pass/Fail |
|-------|----------|-----------|
| All 12 faces mapped | ✅ | |
| Face names relevant to story | ✅ | |
| Sentiments between 0-1 | ✅ | |
| No console errors | ✅ | |
| UI responsive | ✅ | |

### Success Criteria

- ✅ Mapping completes in <5 seconds
- ✅ Face names make sense for the story
- ✅ UI shows all 12 faces clearly
- ✅ No JavaScript errors in console

---

## Test Scenario 2: Refinement Flow - Single Face

**User Persona:** User wants to refine one AI-suggested face name

**Goal:** Successfully refine a face name with user feedback

### Prerequisites

- Complete Scenario 1 (have mapped faces)

### Steps

1. **Identify Target Face**

   Look at the 12 mapped faces. Pick one that feels "close but not quite right."

   Example: Face 5 might be "Market Resonance" but you're B2B-focused.

2. **Open Refinement Dialog**

   Click on Face 5 → Refinement UI should appear

3. **Enter User Feedback**

   ```
   We're B2B SaaS, not consumer-focused. "Market Resonance"
   sounds too consumer-oriented. We think "Enterprise Alignment"
   or "Client Partnership" would be better.
   ```

4. **Submit Refinement**

   Click "Refine" button

   Watch console:
   ```
   [FaceMapper] Refining Face 5: "Market Resonance"
   [FaceMapper] User feedback: "We're B2B SaaS, not consumer-focused..."
   [Gemini] Refinement prompt sent...
   [FaceMapper] ✓ Face 5 refined: "Market Resonance" → "Enterprise Alignment" (92% confidence)
   ```

5. **Verify Before/After Display**

   UI should show:
   - **Before:** "Market Resonance" (original)
   - **After:** "Enterprise Alignment" (refined)
   - **Confidence:** 92%
   - **Reasoning:** Why the change was made
   - **Preserved Concept:** What stayed the same

6. **Check Refinement History**

   Open browser console:
   ```javascript
   const face = window.quannexEngine.context.getFace(5);
   console.log(face.refinementHistory);
   ```

   Should show:
   ```javascript
   [
     {
       timestamp: "2026-02-01T...",
       userFeedback: "We're B2B SaaS...",
       originalName: "Market Resonance",
       refinedName: "Enterprise Alignment",
       confidence: 0.92,
       preservedConcept: "External relationship and connection"
     }
   ]
   ```

### Expected Results

| Check | Expected | Pass/Fail |
|-------|----------|-----------|
| Refinement completes successfully | ✅ | |
| New name reflects user feedback | ✅ | |
| Confidence score displayed (0-1) | ✅ | |
| Original name preserved | ✅ | |
| History array has 1 entry | ✅ | |
| UI updates to show new name | ✅ | |

### Success Criteria

- ✅ Refinement completes in <3 seconds
- ✅ New name incorporates user feedback
- ✅ Preserved concept makes sense
- ✅ No console errors

---

## Test Scenario 3: Multiple Refinements

**User Persona:** Power user refining multiple faces iteratively

**Goal:** Test refinement history tracking and context preservation

### Prerequisites

- Complete Scenario 2 (one refinement done)

### Steps

1. **Refine Face 1**

   Feedback: "We prefer 'Strategic Vision' instead of 'Future Planning'"

   Expected: New name incorporates "Strategic Vision"

2. **Refine Face 8**

   Feedback: "Change to 'Team Culture' - we're small and close-knit"

   Expected: New name reflects team culture concept

3. **Refine Face 5 Again** (second refinement of same face)

   Feedback: "Actually, let's soften it to 'Client Collaboration'"

   Expected:
   - ✅ History array now has 2 entries for Face 5
   - ✅ Each entry preserves the chain of refinements

4. **Verify Refinement History**

   ```javascript
   const face5 = window.quannexEngine.context.getFace(5);
   console.log(face5.refinementHistory.length); // Should be 2

   // Check chronological order
   const h = face5.refinementHistory;
   console.log(h[0].refinedName); // "Enterprise Alignment"
   console.log(h[1].refinedName); // "Client Collaboration"
   console.log(h[1].originalName); // "Enterprise Alignment" (not "Market Resonance")
   ```

### Expected Results

| Check | Expected | Pass/Fail |
|-------|----------|-----------|
| All 3 refinements succeed | ✅ | |
| Face 5 history has 2 entries | ✅ | |
| History entries are chronological | ✅ | |
| Each refinement uses previous as baseline | ✅ | |
| All original names preserved | ✅ | |
| No memory leaks or slowdowns | ✅ | |

### Success Criteria

- ✅ Multiple refinements work smoothly
- ✅ History chain is correct
- ✅ UI remains responsive
- ✅ No console errors

---

## Test Scenario 4: Error Handling

**User Persona:** Testing edge cases and validation

**Goal:** Verify robust error handling

### Test Cases

#### 4.1: Empty Feedback

**Steps:**
1. Click Face 3
2. Leave feedback field empty
3. Click "Refine"

**Expected:**
```
❌ Error: "additionalContext must be a non-empty string"
```

**UI Should:**
- Show clear error message
- Not crash or freeze
- Allow retry

#### 4.2: Too Short Feedback

**Steps:**
1. Click Face 7
2. Enter: "Change it"
3. Click "Refine"

**Expected:**
```
❌ Error: "additionalContext too short (minimum 10 characters for meaningful refinement)"
```

#### 4.3: Invalid Face ID

**Console test:**
```javascript
await window.faceMapper.refineFaceName(99, "This face doesn't exist");
```

**Expected:**
```
❌ Error: "Face 99 not found"
```

#### 4.4: AI Provider Offline

**Steps:**
1. Disconnect internet (or block Gemini API)
2. Try to refine any face

**Expected:**
- Graceful error message
- No UI crash
- Option to retry

### Expected Results

| Check | Expected | Pass/Fail |
|-------|----------|-----------|
| Empty feedback rejected | ✅ | |
| Short feedback rejected | ✅ | |
| Invalid face ID rejected | ✅ | |
| Offline handled gracefully | ✅ | |
| Error messages are clear | ✅ | |
| UI doesn't crash | ✅ | |

---

## Test Scenario 5: Integration with 3D Visualization

**User Persona:** Visual explorer wanting to see refined faces in 3D

**Goal:** Verify Face Refinement integrates with dodecahedron visualization

### Steps

1. **Complete Scenario 2** (have refined faces)

2. **Navigate to 3D Visualization**
   ```
   http://localhost:8000/pages/dodecahedron-3d.html
   ```

3. **Load Face Configuration**

   The 3D page should pull face data from MappingContext

   Verify:
   - ✅ Refined face names appear on dodecahedron
   - ✅ Original names are NOT shown (refined ones are)
   - ✅ Clicking a face shows refinement history

4. **Test Cross-Page Persistence**

   - Navigate back to orchestrator
   - Verify refined faces still show refined names
   - Navigate to 3D again
   - Verify consistency

### Expected Results

| Check | Expected | Pass/Fail |
|-------|----------|-----------|
| 3D shows refined names | ✅ | |
| Data persists across pages | ✅ | |
| Hover shows confidence score | ✅ | |
| Refinement history accessible | ✅ | |

---

## Console Verification Commands

**Check Current Face State:**
```javascript
// Get all faces
const faces = window.quannexEngine.context.getAllFaces();
console.table(faces.map(f => ({
  id: f.id,
  name: f.name,
  source: f.source,
  refinements: f.refinementHistory?.length || 0
})));
```

**Get Specific Face Details:**
```javascript
const face5 = window.quannexEngine.context.getFace(5);
console.log('Name:', face5.name);
console.log('Source:', face5.source);
console.log('Confidence:', face5.confidence);
console.log('History:', face5.refinementHistory);
```

**Test Refinement Manually:**
```javascript
// Initialize FaceMapper if needed
const mapper = new FaceMapper();
await mapper.init();

// Refine Face 5
const result = await mapper.refineFaceName(5,
  "We need a more technical name for our engineering team."
);

console.log('Result:', result);
```

---

## Pass/Fail Criteria

### Overall Test Suite Passes If:

1. ✅ All 5 scenarios complete without critical errors
2. ✅ Face Refinement feature works end-to-end
3. ✅ Error handling prevents crashes
4. ✅ Data persists correctly across pages
5. ✅ Console shows no unhandled exceptions
6. ✅ UI remains responsive throughout

### Critical Failures:

- ❌ JavaScript errors that crash the page
- ❌ Refinement doesn't update face names
- ❌ History not preserved
- ❌ UI freezes or becomes unresponsive
- ❌ Data loss on page navigation

---

## Test Log Template

```
TEST SESSION: [Date/Time]
TESTER: [Name]
BROWSER: [Chrome/Firefox/Edge/Safari + Version]

┌─────────────┬──────────────────┬──────┬────────────────┐
│ Scenario    │ Test Case        │ Pass │ Notes          │
├─────────────┼──────────────────┼──────┼────────────────┤
│ Scenario 1  │ First Mapping    │      │                │
│ Scenario 2  │ Single Refinement│      │                │
│ Scenario 3  │ Multiple Refine  │      │                │
│ Scenario 4  │ Error Handling   │      │                │
│ Scenario 5  │ 3D Integration   │      │                │
└─────────────┴──────────────────┴──────┴────────────────┘

OVERALL RESULT: [ ] PASS  [ ] FAIL

NOTES:
```

---

*Test scenarios designed with love for Deimantas's thesis defense.*
*May your refinements be swift and your confidence scores high.* 🌟
