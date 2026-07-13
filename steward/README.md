# The Empire Steward

`empire-steward.md` is a Claude Code **agent definition** — an outside reviewer
that carries Aaron's judgment and the empire's constitution. It runs separate
from the empire: install it on your PC once and it works in any Claude Code
session, on any clone of the repo.

## Installing on your PC

1. Install [Claude Code](https://claude.com/claude-code) if you haven't
   (`npm install -g @anthropic-ai/claude-code`, then run `claude` once to log in).

2. Copy the agent to your **user-level** agents folder so it's available
   everywhere (this is what keeps it "outside" the empire):

   ```bash
   mkdir -p ~/.claude/agents
   cp steward/empire-steward.md ~/.claude/agents/empire-steward.md
   ```

   (On Windows: copy it to `C:\Users\<you>\.claude\agents\empire-steward.md`.)

3. Open a terminal in your clone of the Buildstudio repo and run `claude`.

## Using it

Ask for the steward by name in any session:

- **"Use the empire-steward agent to do a state-of-the-empire review."**
  It surveys the repo, checks recent changes against the safety constitution,
  verifies the apps still work, and reports what needs you.

- **"Have the empire-steward review this change / this PR."**
  It reviews the way Aaron would: constitution first, style second, and it hands
  ambiguous calls back to you instead of guessing.

- **"Ask the empire-steward what we should build next."**
  It prioritizes: broken things → safety scaffolding → family friction → new
  features, in that order.

## What it will never do on its own

- Mark an Arkphone Kids card `green` or weaken any warning.
- Delete cards or features, add runtime dependencies, or add anything that
  phones home.
- Start big directional bets (ZIM wikis, offline maps) — it scopes them and
  brings them to you.

The steward's rules live in the agent file itself and in
`arkphone-kids/docs/`. If your values change, edit the agent file — it's yours.
