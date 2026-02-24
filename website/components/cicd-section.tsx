"use client"

import { useState } from "react"
import { Check, Copy, ShieldAlert } from "lucide-react"

const bashScript = `#!/bin/bash
# Block deploys if any recent commit has status(5xx)

RECENT_COMMITS=$(git log --oneline -10)

if echo "$RECENT_COMMITS" | grep -q "status(5[0-9][0-9])"; then
  echo "DEPLOY BLOCKED: Found status(5xx) in recent commits"
  echo "Fix the issue and commit with status(6xx) before deploying."
  exit 1
fi

echo "All clear. No broken commits found."
echo "Proceeding with deployment..."
exit 0`

const ghAction = `# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  check-status:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 10
      - name: Block broken deploys
        run: |
          if git log --oneline -10 | grep -q "status(5[0-9][0-9])"; then
            echo "::error::Found status(5xx) — deploy blocked"
            exit 1
          fi
      - name: Deploy
        run: echo "Deploying..."
`

export function CiCdSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section id="cicd" className="px-4 py-24 md:py-32 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start gap-4 mb-8">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-status-5xx/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-status-5xx" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Block broken deploys automatically
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              STATUS Commit makes broken code machine-readable.
              A simple grep in your CI pipeline can block deploys when{" "}
              <code className="font-mono text-status-5xx bg-status-5xx/10 px-1.5 py-0.5 rounded text-sm">status(5xx)</code>{" "}
              appears in recent history, and only allow shipping when{" "}
              <code className="font-mono text-status-2xx bg-status-2xx/10 px-1.5 py-0.5 rounded text-sm">status(2xx)</code>{" "}
              or{" "}
              <code className="font-mono text-status-inf bg-status-inf/10 px-1.5 py-0.5 rounded text-sm">{"status(\u221E)"}</code>{" "}
              is the latest commit.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Bash script */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">pre-deploy.sh</span>
              <button
                onClick={() => copyToClipboard(bashScript, "bash")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy bash script"
              >
                {copied === "bash" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-status-2xx" />
                    <span className="text-status-2xx">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 font-mono text-sm text-foreground/80 overflow-x-auto">
              <code>{bashScript}</code>
            </pre>
          </div>

          {/* GitHub Actions */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">GitHub Actions</span>
              <button
                onClick={() => copyToClipboard(ghAction, "gh")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy GitHub Actions workflow"
              >
                {copied === "gh" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-status-2xx" />
                    <span className="text-status-2xx">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 font-mono text-sm text-foreground/80 overflow-x-auto">
              <code>{ghAction}</code>
            </pre>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-status-2xx/20 bg-status-2xx/5">
          <p className="text-sm text-muted-foreground">
            <span className="text-status-2xx font-medium">Why this matters:</span>{" "}
            STATUS codes are machine-readable by design. Your pipeline can distinguish between
            {" "}<code className="font-mono text-status-5xx">5xx</code> (broken),{" "}
            <code className="font-mono text-status-6xx">6xx</code> (fixed),{" "}
            <code className="font-mono text-status-2xx">2xx</code> (stable), and{" "}
            <code className="font-mono text-status-inf">{"\u221E"}</code> (gold master) with a single grep.
          </p>
        </div>
      </div>
    </section>
  )
}
