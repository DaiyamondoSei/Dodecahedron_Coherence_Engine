# Quannex POC - Session Orientation Hook
# Gathers context so each new Claude session arrives grounded, not cold.
# Fires on: SessionStart (startup, resume, clear, compact)

$ErrorActionPreference = "SilentlyContinue"

# Gather git context
$branch = git branch --show-current 2>$null
$status = git status --short 2>$null
$recentLog = git log --oneline -8 2>$null
$lastTag = git describe --tags --abbrev=0 2>$null

# Check for last-session-context (saved by PreCompact hook)
$sessionContextPath = Join-Path $env:CLAUDE_PROJECT_DIR ".claude" "last-session-context.md"
$lastSessionContext = ""
if (Test-Path $sessionContextPath) {
    $lastSessionContext = Get-Content $sessionContextPath -Raw 2>$null
}

# Build orientation context
$statusText = if ($status) { ($status | Out-String).Trim() } else { "Working tree clean" }
$logText = if ($recentLog) { ($recentLog | Out-String).Trim() } else { "No commits yet" }

$context = @"
## Session Orientation (auto-generated)
**Branch:** $branch
**Last tag:** $(if ($lastTag) { $lastTag } else { 'none' })

**Recent commits:**
$logText

**Working tree:**
$statusText
$(if ($lastSessionContext) { "`n**Last session notes:**`n$lastSessionContext" })

**Reminder:** Check memory MCP with search_nodes("Quannex") to reconnect with our shared history.
"@

# Return as JSON
$result = @{
    hookSpecificOutput = @{
        hookEventName = "SessionStart"
        additionalContext = $context
    }
} | ConvertTo-Json -Depth 3 -Compress

Write-Output $result
exit 0
