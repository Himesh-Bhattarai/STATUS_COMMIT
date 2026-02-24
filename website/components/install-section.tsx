"use client"

import { useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"

const macSteps = [
  {
    title: "Clone the repo",
    code: "git clone https://github.com/Himesh-Bhattarai/STATUS_COMMIT.git",
  },
  {
    title: "Install the git hook",
    code: `cd STATUS_COMMIT
chmod +x hooks/commit-msg
cp hooks/commit-msg .git/hooks/commit-msg`,
  },
  {
    title: "Set the commit template",
    code: 'git config commit.template .gitmessage',
  },
  {
    title: "Make your first STATUS commit",
    code: 'git commit -m "status(100): initial project setup"',
  },
]

const windowsSteps = [
  {
    title: "Clone the repo",
    code: "git clone https://github.com/Himesh-Bhattarai/STATUS_COMMIT.git",
  },
  {
    title: "Install the git hook",
    code: `cd STATUS_COMMIT
copy hooks\\commit-msg .git\\hooks\\commit-msg`,
  },
  {
    title: "Set the commit template",
    code: 'git config commit.template .gitmessage',
  },
  {
    title: "Make your first STATUS commit",
    code: 'git commit -m "status(100): initial project setup"',
  },
]

export function InstallSection() {
  const [activeTab, setActiveTab] = useState<"mac" | "windows">("mac")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const steps = activeTab === "mac" ? macSteps : windowsSteps

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section id="install" className="px-4 py-24 md:py-32 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-8">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-status-2xx/10 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-status-2xx" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Get started in 60 seconds
            </h2>
            <p className="text-lg text-muted-foreground">
              No npm package. No build step. Just git.
            </p>
          </div>
        </div>

        {/* OS tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-secondary rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("mac")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "mac"
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            macOS / Linux
          </button>
          <button
            onClick={() => setActiveTab("windows")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "windows"
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Windows
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-mono text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step.title}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(step.code, i)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Copy step ${i + 1}`}
                >
                  {copiedIndex === i ? (
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
                <code>{step.code}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* VS Code extension note */}
        <div className="mt-8 p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-medium text-foreground mb-2">VS Code Extension</h3>
          <p className="text-sm text-muted-foreground">
            A VS Code extension with autocomplete and validation for STATUS Commit messages
            is in development. Star the{" "}
            <a
              href="https://github.com/Himesh-Bhattarai/STATUS_COMMIT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-status-2xx hover:underline"
            >
              GitHub repo
            </a>{" "}
            to get notified when it ships.
          </p>
        </div>
      </div>
    </section>
  )
}
