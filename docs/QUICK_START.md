# 🚀 QUANNEX DEMO - QUICK START GUIDE

## **Step 1: Start Local Server**

CORS policies prevent `file://` from loading resources. You **must** use a web server.

### Option A: Python (Recommended)
```bash
cd "c:\Users\murau\OneDrive\Stalinis kompiuteris\Dodecahedron Code\POC"
python -m http.server 8000
```

### Option B: Node.js (if Python not available)
```bash
cd "c:\Users\murau\OneDrive\Stalinis kompiuteris\Dodecahedron Code\POC"
npx http-server -p 8000
```

### Option C: VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click `demo.html`
3. Select "Open with Live Server"

---

## **Step 2: Open Demo**

**Navigate to:** `http://localhost:8000/demo.html`

**⚠️ DO NOT open the file directly (file://...)** - this causes CORS errors!

---

## **Step 3: Explore**

### **Welcome Screen**
- Read the introduction
- Click **"ENTER DEMO"**

### **Main Navigation (4 Views)**

**1. 📊 Dashboard** (Press 1)
- Overview of all 12 organizational faces
- Global coherence score
- Breath analysis summary

**2. 🔷 3D Geometry** (Press 2)
- Interactive 3D dodecahedron
- Click faces for deep dive

**3. 🧬 DNA Helix** (Press 3)
- 6 double helices (breath axes)
- Click any strand to analyze
- Switch between Breath & Pentagram tabs

**4. ⚙️ Simulator** (Press 4)
- Coming in Week 2
- Preview mockup with interactive sliders

### **Keyboard Shortcuts**
- **← / →** : Navigate between views
- **1-4** : Jump directly to a view
- **ESC** : Close modals

---

## **What You Should See**

### **For Quannex Company:**

**Global Coherence:** ~4.8% (Survival Mode 🚨)

**Strongest Areas:**
- 🌱 Regenerative Flow (F9): 67%
- 💎 Foundational Values (F10): 67%
- 📚 Intellectual Capital (F2): 61%

**Weakest Areas:**
- 📣 Market Resonance (F5): 13%
- 💰 Funding Pipeline (F11): 19%
- ⚙️ Core Operations (F8): 41%

**Primary Issue:** Aspiration-Actuality Gap
- High vision (O6-O7) but survival-mode execution (O1)
- Over-inhaling (ideas, refinement) / Under-exhaling (market, funding)
- Burnout Engine pattern detected

**Breath Dynamics:**
All 6 axes should show imbalances reflecting the gap between being and doing.

**Pentagram Analysis:**
Click any DNA helix strand, then the ⭐ Pentagram tab to see:
- 5 elemental pillars (Earth, Water, Fire, Air, Ether)
- Glowing star pair connections
- Pulsing intersection nodes
- Rotating center composite
- φ-proportioned sacred geometry

---

## **Troubleshooting**

### **Issue: CORS Errors in Console**
**Solution:** Make sure you're accessing via `http://localhost:8000`, NOT `file://`

### **Issue: "Company not found" or "Data not loading"**
**Check:**
1. Is the server running? (Check terminal)
2. Is the path correct? `http://localhost:8000/demo.html`
3. Do these files exist?
   - `POC/companies/quannex/company.json`
   - `POC/companies/quannex/kpis.csv`

### **Issue: Pentagram doesn't render**
**Try:**
1. Click a different helix strand
2. Switch to Breath tab, then back to Pentagram tab
3. Close and reopen the modal
4. Check console for errors

### **Issue: Animations are laggy**
**Solutions:**
- Close other tabs/applications
- Try a different browser
- Check if GPU acceleration is enabled

### **Issue: iframes not loading**
**Check:**
- All HTML files exist in POC folder
- Server is running
- No JavaScript errors in console

---

## **Files You're Using**

### **Main Demo Shell:**
- `demo.html` - Unified navigation
- Loads 4 views as iframes

### **Individual Views:**
- `index.html` - Dashboard & 3D Geometry
- `octave-dna.html` - DNA Helix visualization
- `simulator.html` - Coherence Simulator (mockup)

### **JavaScript Engines:**
- `js/main.js` - Core Quannex engine
- `js/company-loader.js` - Multi-company support
- `js/breath-analyzer.js` - Breath dynamics calculation
- `js/pentagram-overlay.js` - Sacred geometry rendering

### **Data Files:**
- `companies/quannex/company.json` - Company metadata
- `companies/quannex/kpis.csv` - KPI values (60 rows)
- `data/*.csv` - Reference models & templates

---

## **Expected Console Output (Clean)**

When everything works, console should show:

```
🌟 QUANNEX DEMO initialized
📌 Navigation: Use arrow keys or tabs
🔢 Quick switch: Press 1-4 for each view
✨ Sacred geometry meets organizational science

Company Loader ready
🏢 Loading default company: Quannex
Loaded Quannex
1 employees
60 KPIs
Octaves: O1: Survival

✅ Engine initialized
DNA Visualization Complete!
✨ Simplicity is the ultimate sophistication
🌟 Port 1618 = Golden Ratio φ = 1.618...
```

**❌ NO red error messages!**

---

## **Next Steps After Testing**

Once Phase 1 works perfectly:

### **Week 1 Remaining Tasks:**
- [ ] Test with other companies (Nova Tech, Apex, Zenith)
- [ ] Add data validation
- [ ] Create 2-3 more sample datasets

### **Week 2: Build Simulator**
- [ ] Real-time slider updates
- [ ] 3D dodecahedron morphing
- [ ] AI-powered insights
- [ ] Scenario save/load

### **Week 3: Academic Packaging**
- [ ] Landing page
- [ ] Academic paper
- [ ] Presentation deck
- [ ] Outreach templates

---

## **Support**

If you encounter issues:
1. Check [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
2. Review console for error messages
3. Verify server is running on port 8000
4. Try different browser

**For development help:**
- See [DEMO_ROADMAP.md](DEMO_ROADMAP.md) for full plan
- Check [COMPLETE_PROJECT_KNOWLEDGE_MAP.md](../COMPLETE_PROJECT_KNOWLEDGE_MAP.md) for architecture

---

**Let's build conscious organizations together!** 🌟

φ = 1.618033988749895
