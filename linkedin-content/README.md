# Quannex LinkedIn Content System

Simple system to share POC progress on LinkedIn.

## Structure

```
LinkedIn/
├── knowledge/          # Memory & learning
│   ├── posts.json      # All published posts
│   ├── concepts.json   # Concepts to introduce
│   └── config.json     # Settings
├── drafts/             # Generated drafts (review before posting)
├── published/          # Archive of posted content
├── screenshots/        # Visual assets
└── engine/             # Scripts
```

## Workflow

1. **Monday morning**: Philosophy post draft generated
2. **Wednesday morning**: Feature post draft generated
3. **You**: Review draft, copy to LinkedIn, post
4. **After posting**: Move draft to published/

## Schedule

- **Monday**: Philosophy (sacred geometry, coherence theory)
- **Wednesday**: Feature updates (what's new in POC)

## Not automated (by design)

- Actual posting to LinkedIn (you do this - keeps it authentic)
- The 15 seconds of review ensures YOUR voice

## Commands

```bash
# Generate today's draft
node engine/generate.js

# Generate specific type
node engine/generate.js --type=philosophy
node engine/generate.js --type=feature
```
