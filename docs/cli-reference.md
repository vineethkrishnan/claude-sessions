# CLI Reference

## Synopsis

```
claude-sessions [options]
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--agent <name>` | Specify the AI agent (`claude`, `gemini`, `codex`, `cursor`) | `(selector)` |
| `--fzf` | Use fzf for session selection | `false` |
| `--delete` | Enable delete mode | `false` |
| `--no-splash` | Skip the splash screen animation | `false` |
| `-v, --version` | Print version and exit | — |
| `-h, --help` | Print help and exit | — |

## Examples

```bash
# Launch interactive TUI (shows Agent Selector)
claude-sessions

# Launch directly for Gemini
claude-sessions --agent gemini

# Use fzf picker for Cursor
claude-sessions --agent cursor --fzf

# Enable deletion with no splash for Claude
claude-sessions --agent claude --delete --no-splash

# Check version
claude-sessions --version
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Normal exit or session resumed |
| `1` | No sessions found for selected agent |
