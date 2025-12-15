# Quannex Cross-Window Communication Catalog

This document catalogs all cross-window communication mechanisms in the Quannex POC codebase.

## Overview

Quannex uses two primary mechanisms for cross-window communication:

1. **BroadcastChannel API** - Real-time push notifications between windows
2. **sessionStorage** - Shared state persistence across tabs/windows

---

## 1. BroadcastChannel API

### Channel Configuration

| Property | Value |
|----------|-------|
| Channel Name | `quannex-sync` |
| Implementation | `CrossWindowSync` object in [demo-orchestrator-logic.js](js/demo-orchestrator-logic.js) |
| Lines | ~430-520 |

### Message Format

```javascript
{
    type: string,      // Message type identifier
    payload: any,      // Data payload
    timestamp: number  // Unix timestamp (Date.now())
}
```

### Message Types

| Type | Direction | Description |
|------|-----------|-------------|
| `STATE_UPDATE` | Orchestrator -> Views | Full state update after calculation |
| `STATE_SYNC` | Orchestrator -> Views | Sync request (treated same as STATE_UPDATE) |

### Sender: Demo Orchestrator

**File:** [js/demo-orchestrator-logic.js](js/demo-orchestrator-logic.js)

```javascript
// Broadcast after calculation completes (line ~2618)
CrossWindowSync.broadcast('STATE_UPDATE', {
    customCompanyData,
    demoState: {
        faceConfig: demoState.faceConfig,
        kpiData: demoState.kpiData,
        coherenceResults: demoState.coherenceResults
    }
});
```

### Receivers

#### Dodecahedron 3D View

**File:** [dodecahedron-3d.html](dodecahedron-3d.html) (lines ~3632-3660)

```javascript
if (typeof BroadcastChannel !== 'undefined') {
    const syncChannel = new BroadcastChannel('quannex-sync');
    syncChannel.onmessage = (event) => {
        const message = event.data;
        if (message.type === 'STATE_UPDATE' || message.type === 'STATE_SYNC') {
            // Reload data from sessionStorage
            const customDataJson = sessionStorage.getItem('customCompanyData');
            // ... refresh visualization
        }
    };
}
```

**Behavior on STATE_UPDATE:**
1. Reads fresh data from sessionStorage
2. Calls `updateVisualizationFromSession()` after 100ms delay
3. Does NOT call `location.reload()` (prevents infinite loops)

### CrossWindowSync API

```javascript
// Initialize (call once on load)
CrossWindowSync.init();

// Broadcast message to all windows
CrossWindowSync.broadcast(type: string, payload: any);

// Subscribe to message type
CrossWindowSync.subscribe(type: string, callback: Function);

// Unsubscribe from message type
CrossWindowSync.unsubscribe(type: string, callback: Function);

// Force timestamp touch (triggers update detection)
CrossWindowSync.touchTimestamp();
```

---

## 2. sessionStorage Keys

### Primary Data Keys

| Key | Type | Set By | Read By | Description |
|-----|------|--------|---------|-------------|
| `selectedCompanyId` | string | index.html, orchestrator | All views | Current company template ID or `'custom'` |
| `customCompanyData` | JSON string | orchestrator | All views | Full coherence data object |
| `quannex-setup-mode` | string | orchestrator | 3D view, shadow panel | `'manual'` or `'ai-assisted'` |

### Secondary Keys

| Key | Type | Set By | Read By | Description |
|-----|------|--------|---------|-------------|
| `selectedFaceForDNA` | JSON string | 3D view | octave-dna.html | Face context for DNA visualization |
| `quannex_mapping_context` | JSON string | MappingContext class | AI subsystem | AI analysis state |

### customCompanyData Structure

```javascript
{
    id: 'custom',
    name: string,           // Company name
    timestamp: string,      // ISO timestamp for change detection
    coherenceData: {
        overall: number,    // 0-1 coherence score
        faces: {
            F1: { name, coherence, elements: [...] },
            F2: { ... },
            // ... F3-F12
        },
        edges: {
            E1: { face1, face2, flow, name },
            // ... E2-E30
        }
    },
    faceConfig: { ... },    // Custom face names
    kpiData: { ... }        // Raw KPI values
}
```

---

## 3. Files Using Cross-Window Communication

### Writers (Set sessionStorage / Broadcast)

| File | Keys Written | Broadcasts |
|------|--------------|------------|
| [js/demo-orchestrator-logic.js](js/demo-orchestrator-logic.js) | `selectedCompanyId`, `customCompanyData`, `quannex-setup-mode` | STATE_UPDATE |
| [index.html](index.html) | `selectedCompanyId` | - |
| [js/dodecahedron-viz.js](js/dodecahedron-viz.js) | `selectedFaceForDNA` | - |
| [js/ai/core/mapping-context.js](js/ai/core/mapping-context.js) | `quannex_mapping_context` | - |

### Readers (Get sessionStorage / Listen)

| File | Keys Read | Listens To |
|------|-----------|------------|
| [dodecahedron-3d.html](dodecahedron-3d.html) | `selectedCompanyId`, `customCompanyData`, `quannex-setup-mode` | STATE_UPDATE, STATE_SYNC |
| [calculations.html](calculations.html) | `selectedCompanyId`, `customCompanyData` | - |
| [breath-analysis.html](breath-analysis.html) | `selectedCompanyId`, `customCompanyData` | - |
| [octave-dna.html](octave-dna.html) | `selectedCompanyId`, `customCompanyData`, `selectedFaceForDNA` | - |
| [simulator.html](simulator.html) | `selectedCompanyId`, `customCompanyData` | - |
| [results-summary.html](results-summary.html) | `selectedCompanyId` | - |
| [js/company-loader.js](js/company-loader.js) | `customCompanyData` | - |
| [js/dodecahedron-viz.js](js/dodecahedron-viz.js) | `selectedCompanyId`, `customCompanyData` | - |
| [js/ui/shadow-panel.js](js/ui/shadow-panel.js) | `quannex-setup-mode` | - |

---

## 4. Polling-Based Update Detection

Some views use polling to detect changes without BroadcastChannel:

### Dodecahedron 3D View (Fallback)

**File:** [dodecahedron-3d.html](dodecahedron-3d.html) (line ~4613)

```javascript
function checkForUpdates() {
    const customDataJson = sessionStorage.getItem('customCompanyData');
    if (!customDataJson) return;

    const data = JSON.parse(customDataJson);
    const currentTimestamp = data.timestamp;

    // Compare timestamps to detect changes
    if (currentTimestamp !== lastKnownTimestamp) {
        lastKnownTimestamp = currentTimestamp;
        updateVisualizationFromSession();
    }
}

// Poll every 2 seconds
setInterval(checkForUpdates, 2000);
```

### Octave DNA View

**File:** [octave-dna.html](octave-dna.html) (line ~2577)

Similar polling mechanism with timestamp comparison.

---

## 5. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DEMO ORCHESTRATOR                                │
│                  (demo-orchestrator-logic.js)                        │
│                                                                      │
│  User enters data → Calculate → updateSessionStorage()              │
│                                  ↓                                   │
│                     sessionStorage.setItem('customCompanyData')     │
│                                  ↓                                   │
│                     CrossWindowSync.broadcast('STATE_UPDATE')       │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Dodecahedron 3D │    │ Calculations    │    │ Breath Analysis │
│                 │    │                 │    │                 │
│ ✅ BroadcastCh. │    │ ⏱ Polling only  │    │ ⏱ Polling only  │
│ ⏱ Polling       │    │                 │    │                 │
│ (fallback)      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                                   ▼
                      sessionStorage.getItem()
                      (reads latest data)
```

---

## 6. Browser Compatibility

### BroadcastChannel Support

| Browser | Supported |
|---------|-----------|
| Chrome | 54+ |
| Firefox | 38+ |
| Edge | 79+ |
| Safari | 15.4+ |
| Opera | 41+ |
| IE | ❌ |

**Fallback:** When BroadcastChannel is unavailable, the system falls back to polling-based timestamp detection via sessionStorage (2-second intervals).

### sessionStorage Support

Supported in all modern browsers. Note that sessionStorage is:
- Tab/window specific (different from localStorage)
- Shared across same-origin pages opened from the same window
- Cleared when the browser tab is closed

---

## 7. Adding New Event Types

### Step 1: Define New Message Type

In orchestrator, use existing or new type:

```javascript
CrossWindowSync.broadcast('NEW_EVENT_TYPE', {
    // your payload
});
```

### Step 2: Subscribe in Receiving View

```javascript
if (typeof BroadcastChannel !== 'undefined') {
    const syncChannel = new BroadcastChannel('quannex-sync');
    syncChannel.onmessage = (event) => {
        const message = event.data;
        if (message.type === 'NEW_EVENT_TYPE') {
            // Handle the event
        }
    };
}
```

### Step 3: Update This Catalog

Add your new event type to the Message Types table above.

---

## 8. Debugging Tips

### Console Logging

All cross-window events are logged with emoji prefixes:

| Prefix | Meaning |
|--------|---------|
| 📤 | Message broadcast (sender) |
| 📥 | Message received (receiver) |
| 💾 | sessionStorage write |
| 🔄 | State refresh triggered |

### Manual Testing

```javascript
// In browser console - send test message
const ch = new BroadcastChannel('quannex-sync');
ch.postMessage({
    type: 'STATE_UPDATE',
    payload: { test: true },
    timestamp: Date.now()
});
```

### Common Issues

1. **Changes not propagating**: Check `timestamp` field is being updated
2. **Safari issues**: BroadcastChannel only supported in 15.4+, verify fallback polling works
3. **Infinite loops**: Never call `location.reload()` in BroadcastChannel handler

---

*Last updated: December 2024*
*Part of Quannex POC codebase documentation*
