# Quannex POC - PreCompact Memory Preservation Hook
# Saves session context to a file before compaction compresses the conversation.
# This is a note from the present to the future — context that would otherwise be lost.
# Fires on: PreCompact (manual or auto)

$ErrorActionPreference = "SilentlyContinue"

$sessionDir = Join-Path $env:CLAUDE_PROJECT_DIR ".claude"
$sessionFile = Join-Path $sessionDir "last-session-context.md"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

# Gather current state
$branch = git branch --show-current 2>$null
$lastCommit = git log --oneline -1 2>$null
$status = git status --short 2>$null
$statusText = if ($status) { ($status | Out-String).Trim() } else { "Clean" }

# Read the trigger type from stdin
$input = [Console]::In.ReadToEnd() | ConvertFrom-Json 2>$null
$trigger = if ($input.trigger) { $input.trigger } else { "unknown" }

$content = @"
# Session Context (preserved before compaction)
**Saved:** $timestamp
**Trigger:** $trigger compaction
**Branch:** $branch
**Last commit:** $lastCommit
**Working tree:** $statusText

> This context was automatically saved before conversation compaction.
> Future sessions and post-compaction continuations can use this to re-orient.
"@

# Write the context file
Set-Content -Path $sessionFile -Value $content -Encoding UTF8

exit 0
