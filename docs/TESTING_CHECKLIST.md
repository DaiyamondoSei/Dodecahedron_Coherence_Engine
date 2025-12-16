# 🧪 PHASE 1 TESTING CHECKLIST

**Run this on: `http://localhost:8000/demo.html`**

---

## ✅ DEMO NAVIGATION

- [ ] Welcome screen displays correctly
- [ ] "ENTER DEMO" button works
- [ ] All 4 tabs are visible (Dashboard, 3D Geometry, DNA Helix, Simulator)
- [ ] Clicking each tab switches views
- [ ] Keyboard shortcuts work (←/→ arrows, keys 1-4)
- [ ] No console errors during navigation

---

## ✅ DASHBOARD VIEW (index.html)

- [ ] Loads without errors
- [ ] Global coherence score displays (should be ~4.8%)
- [ ] All 12 face cards render
- [ ] Face colors match their health levels
- [ ] Company selector shows "Quannex"
- [ ] Can click faces for details
- [ ] Breath analysis section appears
- [ ] 6 breath axes display with ratios

**Expected Data:**
- Global Coherence: **4.8%**
- Status: **SURVIVAL MODE** (red/critical)
- Strongest Faces: F10 (Values), F9 (Regeneration), F2 (IP)
- Weakest Faces: F5 (Market), F11 (Funding), F8 (Operations)

---

## ✅ 3D GEOMETRY VIEW (index.html iframe)

- [ ] Loads without errors
- [ ] Should be same as Dashboard (both use index.html)
- [ ] 3D dodecahedron visible (if implemented)
- [ ] Can rotate/interact with visualization

---

## ✅ DNA HELIX VIEW (octave-dna.html)

- [ ] Loads without errors
- [ ] 6 double helices render in 3D
- [ ] Golden ratio spiral is visible
- [ ] Can rotate camera (mouse drag)
- [ ] Auto-rotation works
- [ ] Company selector shows options
- [ ] Can click any helix strand

**When clicking a helix:**
- [ ] Modal opens showing "Breath Analysis"
- [ ] Two tabs appear: 🫁 Breath | ⭐ Pentagram
- [ ] Breath tab shows ratio calculation
- [ ] Breath insights display
- [ ] Pentagram tab shows 5-element geometry
- [ ] Pentagram canvas renders animated visualization
- [ ] 5 elemental pillars visible (Earth, Water, Fire, Air, Ether)
- [ ] Star pairs glow and pulse
- [ ] Center composite rotates
- [ ] Insights appear below pentagram

**Expected Helices:**
1. **Resource Flow** (F11 ↔ F1): Red - Funding/Finance
2. **Substance & Story** (F7 ↔ F2): Cyan - Brand/IP
3. **Being & Doing** (F8 ↔ F3): Yellow - Operations/People
4. **Form & Integrity** (F4 ↔ F9): Green - Structure/Regeneration
5. **Perception & Truth** (F5 ↔ F10): Pink - Market/Values
6. **Network & Fortress** (F6 ↔ F12): Purple - Community/Risk

---

## ✅ SIMULATOR VIEW (simulator.html)

- [ ] Loads without errors
- [ ] Shows "Under Development" message
- [ ] Feature cards display
- [ ] Interactive sliders work
- [ ] Moving sliders updates coherence calculation
- [ ] Shadow detection responds to changes

---

## ✅ DATA LOADING

- [ ] **No console errors** about missing files
- [ ] Company data loads: `companies/quannex/company.json`
- [ ] KPI data loads: `companies/quannex/kpis.csv`
- [ ] BreathAnalyzer initializes
- [ ] PentagramOverlay initializes
- [ ] Main.js Quannex engine starts

---

## ✅ CROSS-BROWSER TESTING

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

---

## ✅ PERFORMANCE

- [ ] Page loads in <3 seconds
- [ ] 3D animations are smooth (60fps)
- [ ] No lag when switching tabs
- [ ] Pentagram animation runs smoothly

---

## ⚠️ KNOWN ISSUES TO INVESTIGATE

If any of these occur, note them:

1. **Missing face data**: Check if all 12 faces load
2. **KPI mismatch**: Verify 5 KPIs per face
3. **Breath ratio errors**: Division by zero if face energy is 0
4. **Pentagram rendering**: Canvas might not initialize on first click
5. **Company switching**: May need to refresh data

---

## 📊 EXPECTED CONSOLE OUTPUT

When everything works, you should see:

```
🌟 QUANNEX DEMO initialized
📌 Navigation: Use arrow keys or tabs
🔢 Quick switch: Press 1-4 for each view
✨ Sacred geometry meets organizational science

🏢 Loading default company: Quannex
✅ Engine initialized: [state object]
✅ Switched to Quannex
🧬 DNA Visualization Complete!
✨ Simplicity is the ultimate sophistication
🌟 Port 1618 = Golden Ratio φ = 1.618...
```

**NO red errors should appear!**

---

## 🐛 IF YOU FIND BUGS

Document them here:

| Bug | View | Description | Severity |
|-----|------|-------------|----------|
|     |      |             |          |

---

## ✅ PHASE 1 COMPLETE WHEN:

- [ ] All views load without errors
- [ ] Quannex data displays correctly
- [ ] Pentagram overlay works
- [ ] Breath analysis calculates properly
- [ ] Navigation is smooth
- [ ] Console is clean (no red errors)
- [ ] Tested in 2+ browsers

**Then we can move to Phase 2: Building the Simulator!** 🚀
