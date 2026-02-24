"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

const statusCodes = [
  { code: "100", range: "1xx", meaning: "Continue", when: "Starting a new task or feature", example: 'status(100): init project structure', color: "text-status-1xx", bgColor: "bg-status-1xx/10" },
  { code: "101", range: "1xx", meaning: "Switching Protocols", when: "Changing approach mid-development", example: 'status(101): switch from REST to GraphQL', color: "text-status-1xx", bgColor: "bg-status-1xx/10" },
  { code: "102", range: "1xx", meaning: "Processing", when: "Work in progress, not yet functional", example: 'status(102): scaffold payment flow', color: "text-status-1xx", bgColor: "bg-status-1xx/10" },
  { code: "200", range: "2xx", meaning: "OK", when: "Code works as expected", example: 'status(200): API endpoint working', color: "text-status-2xx", bgColor: "bg-status-2xx/10" },
  { code: "201", range: "2xx", meaning: "Created", when: "New feature is complete and working", example: 'status(201): add user registration', color: "text-status-2xx", bgColor: "bg-status-2xx/10" },
  { code: "204", range: "2xx", meaning: "No Content (Fully Tested)", when: "All tests pass, ready to ship", example: 'status(204): fully tested — ship it', color: "text-status-2xx", bgColor: "bg-status-2xx/10" },
  { code: "301", range: "3xx", meaning: "Moved Permanently", when: "Code migrated or refactored", example: 'status(301): migrate to new API', color: "text-status-3xx", bgColor: "bg-status-3xx/10" },
  { code: "302", range: "3xx", meaning: "Found (Temporary)", when: "Temporary workaround in place", example: 'status(302): temp workaround for auth', color: "text-status-3xx", bgColor: "bg-status-3xx/10" },
  { code: "304", range: "3xx", meaning: "Not Modified", when: "Refactor with no behavior change", example: 'status(304): refactor — no logic change', color: "text-status-3xx", bgColor: "bg-status-3xx/10" },
  { code: "500", range: "5xx", meaning: "Internal Error", when: "Something is broken", example: 'status(500): checkout broken', color: "text-status-5xx", bgColor: "bg-status-5xx/10" },
  { code: "502", range: "5xx", meaning: "Bad Gateway", when: "External dependency failing", example: 'status(502): third-party API down', color: "text-status-5xx", bgColor: "bg-status-5xx/10" },
  { code: "503", range: "5xx", meaning: "Service Unavailable", when: "Feature temporarily disabled", example: 'status(503): disable payments', color: "text-status-5xx", bgColor: "bg-status-5xx/10" },
  { code: "600", range: "6xx", meaning: "Hotfix Applied", when: "Quick fix for critical issue", example: 'status(600): hotfix applied', color: "text-status-6xx", bgColor: "bg-status-6xx/10" },
  { code: "601", range: "6xx", meaning: "Bug Resolved", when: "Bug fully fixed and verified", example: 'status(601): fix race condition', color: "text-status-6xx", bgColor: "bg-status-6xx/10" },
  { code: "\u221E", range: "\u221E", meaning: "Gold Master", when: "Production-ready release", example: 'status(\u221E): v1.0.0 gold master', color: "text-status-inf", bgColor: "bg-status-inf/10" },
  { code: "infinity", range: "\u221E", meaning: "Gold Master (alias)", when: "Same as \u221E \u2014 use either form", example: 'status(infinity): v2.0.0 stable release', color: "text-status-inf", bgColor: "bg-status-inf/10" },
]

export function CheatSheet() {
  const [copied, setCopied] = useState(false)

  const copyAll = () => {
    const text = statusCodes
      .map((s) => `${s.code.padEnd(5)} ${s.meaning.padEnd(28)} ${s.example}`)
      .join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="cheatsheet" className="px-4 py-24 md:py-32 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Quick reference
            </h2>
            <p className="text-lg text-muted-foreground">
              All STATUS codes at a glance.
            </p>
          </div>
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
            aria-label="Copy all status codes"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-status-2xx" />
                <span className="text-status-2xx">Copied all</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy all
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border bg-secondary/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Code</span>
            <span>Meaning</span>
            <span className="hidden md:block">When to use</span>
            <span className="hidden lg:block">Example</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {statusCodes.map((status) => (
              <div
                key={status.code + status.meaning}
                className="grid grid-cols-[60px_1fr] md:grid-cols-[60px_1fr_1fr] lg:grid-cols-[60px_1fr_1fr_1fr] gap-4 px-4 py-3 items-center hover:bg-secondary/30 transition-colors"
              >
                <span className={`font-mono font-bold text-sm ${status.color}`}>
                  {status.code}
                </span>
                <span className="text-sm text-foreground">{status.meaning}</span>
                <span className="hidden md:block text-sm text-muted-foreground">{status.when}</span>
                <span className="hidden lg:block font-mono text-xs text-foreground/60 truncate">
                  {status.example}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
