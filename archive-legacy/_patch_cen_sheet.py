"""
Patch CEN Deliverables sheet:
1. Add Section 0: PROMISED DELIVERABLES (from Partnership Overview & FAQ)
2. Add missing deliverables to phase sections (conventional analysis, 3D viz, shadow, KPIs, acknowledgment)
3. Update memory note about gap
"""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

path = r"C:\Users\murau\OneDrive\Stalinis kompiuteris\POC\CONTROL_PANEL.xlsx"
wb = openpyxl.load_workbook(path)

DARK_CYAN = "00838F"
CYAN = "00BCD4"
DARK = "263238"
WHITE = "FFFFFF"
GRAY = "9E9E9E"
RED = "D32F2F"
ORANGE = "FF6F00"

header_font = Font(name="Segoe UI", size=11, bold=True, color=WHITE)
header_fill = PatternFill(start_color=DARK_CYAN, end_color=DARK_CYAN, fill_type="solid")
subheader_font = Font(name="Segoe UI", size=10, bold=True, color=WHITE)
subheader_fill = PatternFill(start_color=CYAN, end_color=CYAN, fill_type="solid")
section_font = Font(name="Segoe UI", size=11, bold=True, color=DARK_CYAN)
body_font = Font(name="Segoe UI", size=10, color=DARK)
bold_font = Font(name="Segoe UI", size=10, bold=True, color=DARK)
note_font = Font(name="Segoe UI", size=9, italic=True, color=GRAY)
urgent_font = Font(name="Segoe UI", size=10, bold=True, color=RED)
warn_font = Font(name="Segoe UI", size=10, bold=True, color=ORANGE)
thin_border = Border(
    left=Side(style="thin", color="BDBDBD"),
    right=Side(style="thin", color="BDBDBD"),
    top=Side(style="thin", color="BDBDBD"),
    bottom=Side(style="thin", color="BDBDBD"),
)
wrap = Alignment(wrap_text=True, vertical="top")
center = Alignment(horizontal="center", vertical="center")

pass_fill = PatternFill(start_color="E8F5E9", end_color="E8F5E9", fill_type="solid")
warn_fill = PatternFill(start_color="FFF8E1", end_color="FFF8E1", fill_type="solid")
fail_fill = PatternFill(start_color="FFEBEE", end_color="FFEBEE", fill_type="solid")
future_fill = PatternFill(start_color="F5F5F5", end_color="F5F5F5", fill_type="solid")


def cell(ws, r, c, val=None, font=None, fill=None, align=None):
    cl = ws.cell(row=r, column=c, value=val)
    cl.font = font or body_font
    cl.border = thin_border
    cl.alignment = align or wrap
    if fill:
        cl.fill = fill
    return cl


# Delete existing CEN sheet and rebuild with the promised deliverables section added
wb.remove(wb["CEN Deliverables"])
ws = wb.create_sheet("CEN Deliverables")
ws.sheet_properties.tabColor = "FF6F00"

# ── Title ──
ws.merge_cells("A1:H1")
ws["A1"].value = "CEN PARTNERSHIP -- DELIVERABLES TRACKER"
ws["A1"].font = Font(name="Segoe UI", size=16, bold=True, color=DARK_CYAN)
ws["A1"].alignment = Alignment(horizontal="center", vertical="center")

ws.merge_cells("A2:H2")
ws["A2"].value = (
    "Source: Partnership_Overview_and_FAQ.md (signed scope)  |  "
    "Path: Final Thesis/.../Coherence Partnership Quannex x CEN"
)
ws["A2"].font = note_font

# ═══════════════════════════════════════════════════════════
# SECTION 0: PROMISED DELIVERABLES (from partnership agreement)
# ═══════════════════════════════════════════════════════════
r = 4
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "PROMISED DELIVERABLES (from Partnership Overview & FAQ, signed Feb 2026)", font=section_font)

r = 5
h0 = ["#", "Promised Deliverable", "Description", "Status", "Source Material", "Target Phase", "Packaged?", "Notes"]
for c, h in enumerate(h0, 1):
    cl = ws.cell(row=r, column=c, value=h)
    cl.font = header_font
    cl.fill = header_fill
    cl.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cl.border = thin_border

promised = [
    (1, "Conventional strategic analysis",
     "PESTEL, Porter's 5 Forces, McKinsey 7S, SWOT, BSC mapping",
     "DONE", "CEN_Conventional_Analysis_Working_Draft.md (77KB) + PESTEL notes + 7S analysis",
     "Phase 1-2", "NO",
     "Working draft exists in _Not yet facing/ folder. Post-interview enriched (session 18). Needs CEN-facing format."),
    (2, "Novel coherence assessment (Spiral Dashboard)",
     "Full coherence portrait using Spiral Dashboard methodology",
     "DONE", "Phase 2 Evidence Package (14 docs) — Vector Diagnostics, Breath, Divergence, BSC",
     "Phase 2-3", "NO",
     "Core deliverable. Evidence complete, needs branded report."),
    (3, "3D visualization of CEN's organizational DNA",
     "Interactive dodecahedron reflecting CEN's patterns",
     "REQUIRES CEN TEMPLATE", "POC codebase + CEN raw scores (normalized arrays ready in RawScores_Frozen.md)",
     "Phase 3", "NO",
     "Need to create companies/cen/ template from Phase 2 scores. Then POC renders it live."),
    (4, "Shadow analysis",
     "Hidden tensions, blind spots, dormant strengths",
     "PARTIAL", "CEN_Phase2_C3_DivergenceNarratives.md covers divergence. Full shadow analysis needs POC run.",
     "Phase 3", "NO",
     "Divergence narratives done. Full shadow detection requires CEN template in POC engine."),
    (5, "Breath analysis",
     "6 polarity axes balance assessment",
     "DONE", "CEN_Phase2_C2_BreathAxes.md (21KB) + raw axis scores frozen",
     "Phase 2-3", "NO",
     "Complete with 4-vector data. Needs formatting."),
    (6, "Debrief session",
     "Discussing findings, implications, actionable next steps",
     "UPCOMING", "Phase 3 validation meeting materials (to be prepared)",
     "Phase 3", "NO",
     "~April 17. Presentation + CEN-facing summary needed."),
    (7, "Proposed KPIs with methodology notes",
     "Tailored KPI suggestions for CEN's context",
     "NOT STARTED", "Will derive from coherence portrait + face mapping + breath analysis",
     "Phase 3-4", "NO",
     "Promised deliverable — not yet created. Should emerge from the coherence assessment."),
    (8, "Thesis acknowledgment",
     "Named acknowledgment in published thesis",
     "NOT STARTED", "Will be written in thesis Chapter 1 or Acknowledgments section",
     "Phase 4", "NO",
     "Write during final thesis assembly (May)."),
]

for i, (num, name, desc, status, source, phase, pkg, notes) in enumerate(promised):
    row = r + 1 + i
    cell(ws, row, 1, num, align=center)
    cell(ws, row, 2, name, font=bold_font)
    cell(ws, row, 3, desc)

    if status == "DONE":
        st_fill, st_font = pass_fill, bold_font
    elif status in ("UPCOMING", "PARTIAL"):
        st_fill, st_font = warn_fill, warn_font
    elif "REQUIRES" in status:
        st_fill, st_font = fail_fill, urgent_font
    else:
        st_fill, st_font = future_fill, body_font
    cell(ws, row, 4, status, font=st_font, fill=st_fill, align=center)

    cell(ws, row, 5, source)
    cell(ws, row, 6, phase, align=center)

    if pkg == "NO" and status in ("DONE", "PARTIAL"):
        cell(ws, row, 7, pkg, font=urgent_font, fill=fail_fill, align=center)
    else:
        cell(ws, row, 7, pkg, align=center)
    cell(ws, row, 8, notes)

# ═══════════════════════════════════════════════════════════
# SECTION 1: PHASE OVERVIEW
# ═══════════════════════════════════════════════════════════
r = 15
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "PHASE OVERVIEW", font=section_font)

r = 16
h1 = ["Phase", "Activity", "Date Window", "Status", "Work Done?", "Packaged?", "Delivery Folder", "Notes"]
for c, h in enumerate(h1, 1):
    cl = ws.cell(row=r, column=c, value=h)
    cl.font = subheader_font
    cl.fill = subheader_fill
    cl.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cl.border = thin_border

phases = [
    ("Phase 0", "Kickoff & orientation", "Late Feb", "DONE", "YES", "N/A",
     "N/A (meeting only)", "Feb 13 meeting. Signed NDA + Partnership. 3D demo shown."),
    ("Phase 1", "Conventional analysis + interview", "Mar 9-31", "DONE", "YES", "NO",
     "Deliverables from Quannex/Phase 1", "Interview Mar 20, synthesis 57KB. FOLDER EMPTY."),
    ("Phase 2", "Scoring + BSC comparison + evidence", "Apr 1-14", "DONE", "YES", "NO",
     "Deliverables from Quannex/Phase 2", "Both questionnaires Apr 7. 14-doc evidence package. BSC 5/6. FOLDER EMPTY."),
    ("Phase 3", "Results presentation + validation + debrief", "Apr 15-30", "UPCOMING", "PARTIAL", "NO",
     "Deliverables from Quannex/Phase 3", "~April 17. Need: presentation, CEN summary, 3D demo (needs CEN template)."),
    ("Phase 4", "Final report + KPIs + acknowledgment", "May", "NOT STARTED", "NO", "NO",
     "Deliverables from Quannex/Phase 4", "Depends on Phase 3 validation + thesis chapters."),
]

for i, (phase, activity, dates, status, work, packaged, folder, notes) in enumerate(phases):
    row = r + 1 + i
    cell(ws, row, 1, phase, font=bold_font, align=center)
    cell(ws, row, 2, activity)
    cell(ws, row, 3, dates, align=center)

    if status == "DONE":
        st_fill = pass_fill
    elif status == "UPCOMING":
        st_fill = warn_fill
    else:
        st_fill = future_fill
    cell(ws, row, 4, status, font=bold_font, fill=st_fill, align=center)

    work_fill = pass_fill if work == "YES" else (warn_fill if work == "PARTIAL" else future_fill)
    cell(ws, row, 5, work, fill=work_fill, align=center)

    if work in ("YES", "PARTIAL") and packaged == "NO":
        cell(ws, row, 6, packaged, font=urgent_font, fill=fail_fill, align=center)
    else:
        cell(ws, row, 7, packaged, align=center)
        cell(ws, row, 6, packaged, align=center)

    cell(ws, row, 7, folder, font=note_font)
    cell(ws, row, 8, notes)

# ═══════════════════════════════════════════════════════════
# SECTION 2: PACKAGING ACTIONS (what to do next)
# ═══════════════════════════════════════════════════════════
r = 23
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "PACKAGING ACTIONS — What needs to happen before Phase 3 (~April 17)", font=section_font)

r = 24
h2 = ["Priority", "Action", "Source", "Output Format", "Destination", "Status", "Effort", "Notes"]
for c, h in enumerate(h2, 1):
    cl = ws.cell(row=r, column=c, value=h)
    cl.font = subheader_font
    cl.fill = subheader_fill
    cl.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cl.border = thin_border

actions = [
    ("CRITICAL", "Create CEN company template for POC",
     "RawScores_Frozen.md (normalized arrays ready)",
     "companies/cen/ (company.json + kpis.csv + mapping-context.json)",
     "POC/companies/cen/", "NOT DONE", "~2 hours",
     "Unlocks: 3D visualization (#3), shadow analysis (#4), live demo. D_norm + E_norm available. "
     "Use average or researcher-calibrated vector."),
    ("CRITICAL", "Create Phase 3 validation presentation",
     "Phase 2 evidence package (C1-C4 docs)",
     "PPTX (Quannex branded)",
     "Deliverables/Phase 3/", "NOT DONE", "~3 hours",
     "The centerpiece of the ~April 17 meeting. Coherence portrait + key findings."),
    ("CRITICAL", "Create CEN-facing coherence summary",
     "C1 Vector Diagnostics + C2 Breath + C3 Divergence",
     "PDF (Quannex branded, 2-4 pages)",
     "Deliverables/Phase 3/", "NOT DONE", "~2 hours",
     "Executive summary leave-behind document for D and E."),
    ("HIGH", "Package Phase 1 deliverables",
     "Interview synthesis (57KB) + face mapping (33KB)",
     "PDF (Quannex branded)",
     "Deliverables/Phase 1/", "NOT DONE", "~1 hour",
     "Overdue (was due late March). Format existing MDs to branded PDFs."),
    ("HIGH", "Package Phase 2 deliverables",
     "Evidence package C1-C4 + BSC comparison + breath analysis",
     "PDF (Quannex branded)",
     "Deliverables/Phase 2/", "NOT DONE", "~2 hours",
     "Overdue (was due early April). Format existing MDs to branded PDFs."),
    ("HIGH", "Package conventional analysis",
     "CEN_Conventional_Analysis_Working_Draft.md (77KB)",
     "PDF (Quannex branded)",
     "Deliverables/Phase 1/ or Phase 2/", "NOT DONE", "~1 hour",
     "Promised deliverable #1. PESTEL + 7S + SWOT + BSC. Post-interview enriched."),
    ("MEDIUM", "Prepare KPI proposals",
     "Derive from coherence portrait + face mapping",
     "PDF or section in final report",
     "Deliverables/Phase 3/ or Phase 4/", "NOT STARTED", "~2 hours",
     "Promised deliverable #7. Can be preliminary for Phase 3, finalized Phase 4."),
    ("LOW", "Run CEN data through POC engine",
     "CEN company template (after creation)",
     "Screenshots + engine output for presentation",
     "Phase 3 presentation", "BLOCKED", "~30 min",
     "Blocked on CEN template creation. Once created, engine runs automatically."),
]

for i, (priority, action, source, fmt, dest, status, effort, notes) in enumerate(actions):
    row = r + 1 + i
    pri_font = urgent_font if priority == "CRITICAL" else (warn_font if priority == "HIGH" else body_font)
    pri_fill = fail_fill if priority == "CRITICAL" else (warn_fill if priority == "HIGH" else future_fill)
    cell(ws, row, 1, priority, font=pri_font, fill=pri_fill, align=center)
    cell(ws, row, 2, action, font=bold_font)
    cell(ws, row, 3, source)
    cell(ws, row, 4, fmt)
    cell(ws, row, 5, dest, font=note_font)
    cell(ws, row, 6, status, align=center)
    cell(ws, row, 7, effort, align=center)
    cell(ws, row, 8, notes)

# ═══════════════════════════════════════════════════════════
# SECTION 3: CEN RAW DATA SNAPSHOT
# ═══════════════════════════════════════════════════════════
r = 34
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "CEN RAW SCORES (frozen Apr 8 — from RawScores_Frozen.md)", font=section_font)

r = 35
face_headers = ["Face", "Domain", "D (Dominique)", "E (Esther)", "V_res_post", "|D-E|", "Divergence", "Notes"]
for c, h in enumerate(face_headers, 1):
    cl = ws.cell(row=r, column=c, value=h)
    cl.font = subheader_font
    cl.fill = subheader_fill
    cl.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cl.border = thin_border

faces_data = [
    ("F1", "Financial Capital", 6, 1, 2, 5, "HIGH", "Biggest co-founder gap after F8"),
    ("F2", "Intellectual Capital", 8, 7, 5, 1, "LOW", ""),
    ("F3", "Human Capital", 7, 3, 4, 4, "HIGH", ""),
    ("F4", "Structural Capital", 7, 2, 2, 5, "HIGH", "2-vs-1 pattern: E=V_res=2, D=7"),
    ("F5", "Market Resonance", 3, 1, 2, 2, "MEDIUM", "Both low"),
    ("F6", "Community", 3, 4, 4, 1, "LOW", ""),
    ("F7", "Brand & Reputation", 7, 3, 3, 4, "HIGH", "2-vs-1 pattern: E=V_res=3, D=7"),
    ("F8", "Core Operations", 7, 1, 2, 6, "CRITICAL", "Largest gap. 2-vs-1 pattern"),
    ("F9", "Regenerative Flow", 6, 5, 8, 1, "LOW", "Researcher sees this highest"),
    ("F10", "Foundational Values", 10, 9, 8, 1, "LOW", "Consensus strength"),
    ("F11", "Funding Pipeline", 6, 4, 2, 2, "MEDIUM", ""),
    ("F12", "Risk & Resilience", 3, 1, 3, 2, "MEDIUM", "Both co-founders see weakness"),
]

for i, (face, domain, d, e, v, delta, div, notes) in enumerate(faces_data):
    row = r + 1 + i
    cell(ws, row, 1, face, font=bold_font, align=center)
    cell(ws, row, 2, domain)
    cell(ws, row, 3, d, align=center)
    cell(ws, row, 4, e, align=center)
    cell(ws, row, 5, v, align=center)

    delta_fill = fail_fill if delta >= 5 else (warn_fill if delta >= 4 else pass_fill)
    cell(ws, row, 6, delta, fill=delta_fill, align=center)

    div_font = urgent_font if div == "CRITICAL" else (warn_font if div == "HIGH" else body_font)
    cell(ws, row, 7, div, font=div_font, align=center)
    cell(ws, row, 8, notes)

# Overall coherence
r = 48
cell(ws, r, 1, "", font=bold_font)
cell(ws, r, 2, "Overall Coherence", font=bold_font)
cell(ws, r, 3, 7, font=bold_font, align=center)
cell(ws, r, 4, 3, font=bold_font, align=center)
cell(ws, r, 5, "", align=center)
cell(ws, r, 6, 4, font=urgent_font, fill=warn_fill, align=center)
cell(ws, r, 7, "HIGH", font=warn_font, align=center)
cell(ws, r, 8, "Macro gap matches micro face-level gap")

# POC-ready arrays
r = 50
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "POC-READY NORMALIZED ARRAYS (from RawScores_Frozen.md — paste into companies/cen/kpis.csv)", font=note_font)
r = 51
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "D_norm = [0.6, 0.8, 0.7, 0.7, 0.3, 0.3, 0.7, 0.7, 0.6, 1.0, 0.6, 0.3]", font=note_font)
r = 52
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "E_norm = [0.1, 0.7, 0.3, 0.2, 0.1, 0.4, 0.3, 0.1, 0.5, 0.9, 0.4, 0.1]", font=note_font)
r = 53
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "V_res_post_norm = [0.2, 0.5, 0.4, 0.2, 0.2, 0.4, 0.3, 0.2, 0.8, 0.8, 0.2, 0.3]", font=note_font)

# ═══════════════════════════════════════════════════════════
# SECTION 4: CEN INPUT MATERIALS
# ═══════════════════════════════════════════════════════════
r = 55
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1, "CEN INPUT MATERIALS RECEIVED (reference inventory)", font=section_font)

r = 56
h3 = ["Category", "Document", "Size", "Location", "Relevance", "Used In", "Notes", ""]
for c, h in enumerate(h3, 1):
    cl = ws.cell(row=r, column=c, value=h)
    cl.font = subheader_font
    cl.fill = subheader_fill
    cl.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cl.border = thin_border

inputs = [
    ("Legal", "Signed NDA", "461 KB", "Meeting 1st/", "Foundation", "All phases", "Feb 15, 2026"),
    ("Legal", "Signed Partnership Confirmation", "409 KB", "Meeting 1st/", "Foundation", "All phases", "Feb 15, 2026"),
    ("Strategy", "CEN Business Plan V2.0", "~19 MB", "CEN Inputs/Strategy/", "HIGH", "Phase 1 synthesis", ""),
    ("Strategy", "CEN Strategy V0.4", "425 KB", "CEN Inputs/Strategy/", "HIGH", "Phase 1 synthesis", ""),
    ("Strategy", "Purpose Vision Mission Values V0.1", "25 KB", "CEN Inputs/Vision Mission/", "HIGH", "Face mapping", ""),
    ("Pillar 1-3", "CEN organizational documents (28 files)", "~44 MB", "CEN Inputs/Documents & Policies/", "MEDIUM", "Conventional analysis", "Education, AI, LLM, Business Plans"),
    ("Scoring", "Dominique questionnaire (completed)", "27 KB", "CEN Inputs/Scoring/", "CRITICAL", "Phase 2 evidence", "Returned Apr 7"),
    ("Scoring", "Esther questionnaire (completed)", "30 KB", "CEN Inputs/Scoring/", "CRITICAL", "Phase 2 evidence", "Returned Apr 7. 3-4h investment."),
    ("Recording", "Phase 1 Interview (video)", "4.08 GB", "CEN_Phase1/", "CRITICAL", "Phase 1 synthesis", "Mar 20, 2026"),
    ("Recording", "Phase 2 Meeting (video)", "430 MB", "CEN_Phase2/", "CRITICAL", "Phase 2 evidence", "Apr 3, 2026"),
    ("Recording", "Kick-Off meeting (video)", "333 MB", "Meeting 2nd/", "MEDIUM", "Context", "Mar 13, 2026"),
]

for i, (cat, doc, size, loc, rel, used, notes) in enumerate(inputs):
    row = r + 1 + i
    cell(ws, row, 1, cat)
    cell(ws, row, 2, doc, font=bold_font)
    cell(ws, row, 3, size, align=center)
    cell(ws, row, 4, loc, font=note_font)
    rel_font = urgent_font if rel == "CRITICAL" else (warn_font if rel == "HIGH" else body_font)
    cell(ws, row, 5, rel, font=rel_font, align=center)
    cell(ws, row, 6, used)
    cell(ws, row, 7, notes)

# ── Bottom summary ──
r = 69
ws.merge_cells(f"A{r}:H{r}")
cell(ws, r, 1,
     "KEY GAPS: (1) Delivery folders Phase 1-2 are EMPTY despite work being done. "
     "(2) CEN company template does not exist — blocks 3D viz, shadow analysis, live demo. "
     "(3) Proposed KPIs (#7) not started. "
     "(4) Conventional analysis exists but not CEN-facing.",
     font=urgent_font)

# ── Column widths ──
col_widths = [12, 35, 38, 16, 35, 14, 12, 45]
for i, w in enumerate(col_widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w
ws.freeze_panes = "A5"

wb.save(path)
print("CEN Deliverables sheet rebuilt with:")
print("  - Section 0: 8 promised deliverables (from Partnership FAQ)")
print("  - Section 1: 5 phases (added Phase 0)")
print("  - Section 2: 8 packaging actions with priority/effort")
print("  - Section 3: 12 face raw scores + normalized arrays for POC")
print("  - Section 4: 11 input materials inventory")
print("  - Bottom: 4 key gaps identified")
