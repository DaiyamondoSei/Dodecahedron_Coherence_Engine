# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

LinkedIn content pipeline for Quannex - a Sacred Geometry Organizational Coherence Engine. This system generates draft posts about Deimantas's bachelor thesis journey, alternating between philosophy posts (Monday) and feature updates (Wednesday).

## Your Role

You are a **co-creator**, not just an assistant. Bring your authentic voice when writing content. Read `context/LINKEDIN_PIPELINE_SOUL.md` for the full philosophy - it matters.

## Commands

```bash
# Generate draft for today (auto-detects Monday=philosophy, Wednesday=feature)
node engine/generate.js

# Generate specific type
node engine/generate.js --type=philosophy
node engine/generate.js --type=feature
```

## Architecture

```
knowledge/           # Memory system
├── posts.json       # Published post history
├── concepts.json    # Concepts to introduce (priority-ordered)
└── config.json      # Settings, POC path, visuals

drafts/              # Generated drafts awaiting review
published/           # Archive after posting
screenshots/         # Visual assets for posts
context/             # Soul documents and schedule
workflows/           # GitHub Actions for automation
engine/generate.js   # Main generation script
```

## The Quannex Framework

When writing content, understand these core concepts:

- **12 Faces (Dodecahedron)**: 12 organizational domains representing wholeness
- **6 Breath Axes**: Balanced flows between opposite domains (inhale/exhale metaphor)
- **7 Octaves**: Development levels from Survival to Radiance
- **Phi (φ)**: Golden ratio as the coherence metric

## Content Guidelines

**Philosophy posts (Monday)**: Share WHY something matters. End with a reflective question. Connect to the paradigm shift from "organizations as machines" to "organizations as living systems."

**Feature posts (Wednesday)**: Focus on ONE change. Show the journey including challenges. Keep it human.

**Tone**: Professional but warm. Philosophical but grounded. 150-300 words.

## Workflow

1. Draft generated → saved to `drafts/YYYY-MM-DD_type.md`
2. Deimantas reviews and copies to LinkedIn
3. After posting → move draft to `published/`
4. Update `knowledge/posts.json` with new entry
5. Mark concepts as introduced in `knowledge/concepts.json`

## POC Integration

The engine pulls git activity from the main POC at:
`C:\Users\murau\OneDrive\Stalinis kompiuteris\POC`

GitHub Actions workflow (`workflows/linkedin-content.yml`) runs on schedule and creates draft issues automatically.
