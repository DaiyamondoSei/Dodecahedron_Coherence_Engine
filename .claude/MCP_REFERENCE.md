# MCP Server Reference Guide

This is your personal reference for all available MCP servers. Use this to expand your toolkit when needed.

---

## How to Add a Server

1. Open **`.mcp.json`** in your project ROOT (not `.claude/mcp.json`!)
2. Add the server configuration inside the `"mcpServers": { }` block
3. Restart Claude Code to load the new server

**Important:** The file must be named `.mcp.json` and placed at the project root, NOT inside the `.claude/` folder.

**Example:** Adding the `memory` server:

```json
{
  "mcpServers": {
    "existing-server": { ... },

    "memory": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-memory"]
    }
  }
}
```

**Important:** Don't forget the comma after the previous server's closing `}`!

---

## Server Categories

### Browser Automation & Testing

| Server | Use Case |
|--------|----------|
| `puppeteer` | Low-level browser control, screenshots, PDF generation |
| `chrome-devtools` | DOM inspection, network debugging, performance analysis |
| `playwright` | Cross-browser testing, visual regression, 3D viz testing |
| `browser-use` | Autonomous browsing with logins, form filling, multi-step tasks |

### Web Research & Search

| Server | Use Case |
|--------|----------|
| `firecrawl` | Crawl entire websites, scrape documentation sites |
| `fetch` | Quick single-page content retrieval |
| `brave-search` | Web search queries, finding current information |
| `context7` | Up-to-date library documentation and API references |
| `deep-research` | Academic research, literature reviews, thesis work |
| `arxiv` | Search and parse arXiv papers (search, details, PDF content) |

### Code & Development

| Server | Use Case |
|--------|----------|
| `github` | Search repos, read code, manage issues/PRs |
| `magic-ui` | Find beautiful React/Tailwind UI components |
| `shadcn-ui` | shadcn/ui component patterns and installation |
| `desktop-commander` | Enhanced terminal operations, file system search |

### Data & Visualization

| Server | Use Case |
|--------|----------|
| `chart` | Create 25+ chart types for data visualization |
| `excel` | Process CSV/Excel files, create reports |
| `markdownify` | Convert PDFs, DOCX, images to Markdown |

### AI & Reasoning

| Server | Use Case |
|--------|----------|
| `sequential-thinking` | Step-by-step problem solving, complex analysis |
| `memory` | Persistent knowledge across sessions |
| `openai` | Access GPT models for comparison |

### Productivity

| Server | Use Case |
|--------|----------|
| `notion` | Thesis organization, task tracking |
| `figma` | Pull Figma designs into code |

### Math & Computation

| Server | Use Case |
|--------|----------|
| `wolfram-alpha` | Phi ratios, eigenvalues, sacred geometry calculations |

---

## Complete Server Configurations

### Ready to Use (No API Key Needed)

```json
"puppeteer": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-puppeteer"]
}
```
**Use for:** Screenshots, PDF generation, precise browser automation.

---

```json
"chrome-devtools": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-chrome-devtools"]
}
```
**Use for:** Debugging, DOM inspection, network analysis, performance profiling.

---

```json
"playwright": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@playwright/mcp"]
}
```
**Use for:** Testing Three.js visualizations, cross-browser testing, visual regression.

---

```json
"fetch": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-fetch"]
}
```
**Use for:** Quick webpage content retrieval, reading single URLs.

---

```json
"browser-use": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-browseruse"]
}
```
**Use for:** Autonomous browsing with authentication, complex multi-step web tasks.

---

```json
"context7": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-context7"]
}
```
**Use for:** Latest library documentation, always up-to-date API references.

---

```json
"magic-ui": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@21st-dev/magic"]
}
```
**Use for:** Finding beautiful React/Tailwind UI components, design inspiration.

---

```json
"deep-research": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-deep-research"]
}
```
**Use for:** Academic research, thesis literature reviews, synthesis of sources.

---

```json
"sequential-thinking": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-sequential-thinking"]
}
```
**Use for:** Step-by-step problem solving, mathematical proofs, complex analysis.

---

```json
"memory": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-memory"]
}
```
**Use for:** Remembering project context across sessions, building knowledge graphs.

---

```json
"arxiv": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@iflow-mcp/arxiv-paper-mcp"]
}
```
**Use for:** Searching arXiv papers, getting paper details, extracting PDF content.

---

```json
"chart": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-chart"]
}
```
**Use for:** Creating visualizations, coherence graphs, data analysis charts.

---

```json
"excel": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-excel"]
}
```
**Use for:** Processing CSV data, creating reports, spreadsheet automation.

---

```json
"markdownify": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-markdownify"]
}
```
**Use for:** Converting PDFs, DOCX, images, web pages to Markdown.

---

```json
"desktop-commander": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-desktop-commander"]
}
```
**Use for:** Enhanced terminal operations, file system search, surgical code editing.

---

```json
"shadcn-ui": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-shadcn-ui"]
}
```
**Use for:** shadcn/ui component context, React/Svelte/Vue patterns, installation guides.

---

### Your Configured API Keys

```json
"firecrawl": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "firecrawl-mcp"],
  "env": {
    "FIRECRAWL_API_KEY": "fc-c5b2dbad6b134be89e9e946eb10871eb"
  }
}
```
**Use for:** Crawling entire documentation sites, scraping multiple pages, deep web research.

---

```json
"github": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_ylAMkMOBvgPxy33bKRxCMV8PM6YEKK1LMzfk"
  }
}
```
**Use for:** Searching repositories, reading code, finding issues/PRs, exploring projects.

---

```json
"brave-search": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "BSAKdGftuyPPR_oa2mn_fJ9jPun8GCm"
  }
}
```
**Use for:** Web search queries, finding current information, news, tutorials.

---

### Need API Keys (Get from respective services)

```json
"notion": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-notion"],
  "env": {
    "NOTION_API_KEY": "YOUR_NOTION_API_KEY"
  }
}
```
**Use for:** Thesis organization, research notes, task tracking.
**Get key at:** https://www.notion.so/my-integrations

---

```json
"openai": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-openai"],
  "env": {
    "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY"
  }
}
```
**Use for:** Using GPT models for comparison, specific OpenAI features.
**Get key at:** https://platform.openai.com/api-keys

---

```json
"figma": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-figma"],
  "env": {
    "FIGMA_API_KEY": "YOUR_FIGMA_API_KEY"
  }
}
```
**Use for:** Pulling Figma designs into code, design-to-code workflows.
**Get key at:** Figma Settings > Account > Personal access tokens

---

```json
"wolfram-alpha": {
  "command": "cmd",
  "args": ["/c", "npx", "-y", "@anthropic-ai/mcp-server-wolfram-alpha"],
  "env": {
    "WOLFRAM_ALPHA_APPID": "YOUR_WOLFRAM_APPID"
  }
}
```
**Use for:** Phi ratio calculations, eigenvalues, spectral analysis, sacred geometry math.
**Get key at:** https://developer.wolframalpha.com/

---

## Tips

1. **Start minimal** - Only add servers you need. More servers = slower startup.
2. **Restart after changes** - Claude Code needs to restart to load new servers.
3. **Check `/mcp`** - Use the `/mcp` command to see server status.
4. **Environment variables** - Keep API keys secure; consider using environment variables.

---

## Currently Active Servers

Your project currently has these servers in `.mcp.json` (at project root):

- puppeteer
- chrome-devtools
- playwright
- firecrawl
- github
- arxiv
- chart
- sequential-thinking

---

*Last updated: December 2025*
