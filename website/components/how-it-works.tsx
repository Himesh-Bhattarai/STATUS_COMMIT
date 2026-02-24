"use client"

import { useState } from "react"

const categories = [
  {
    range: "1xx",
    label: "In Progress",
    color: "border-status-1xx text-status-1xx bg-status-1xx/10",
    dotColor: "bg-status-1xx",
    description: "Work is underway. Code is incomplete, experimental, or not yet functional.",
    codes: [
      { code: "100", meaning: "Continue", msg: "status(100): init project structure" },
      { code: "101", meaning: "Switching Protocols", msg: "status(101): switch from REST to GraphQL" },
      { code: "102", meaning: "Processing", msg: "status(102): scaffold payment flow" },
    ],
  },
  {
    range: "2xx",
    label: "Stable",
    color: "border-status-2xx text-status-2xx bg-status-2xx/10",
    dotColor: "bg-status-2xx",
    description: "Code is working, tested, and ready to ship. Safe to deploy.",
    codes: [
      { code: "200", meaning: "OK", msg: "status(200): API endpoint working" },
      { code: "201", meaning: "Created", msg: "status(201): add user registration" },
      { code: "204", meaning: "No Content (Fully Tested)", msg: "status(204): fully tested \u2014 ship it" },
    ],
  },
  {
    range: "3xx",
    label: "Changed",
    color: "border-status-3xx text-status-3xx bg-status-3xx/10",
    dotColor: "bg-status-3xx",
    description: "Code has been moved, refactored, or redirected. It works, but something shifted.",
    codes: [
      { code: "301", meaning: "Moved Permanently", msg: "status(301): migrate to new API" },
      { code: "302", meaning: "Found (Temporary)", msg: "status(302): temp workaround in place" },
      { code: "304", meaning: "Not Modified", msg: "status(304): refactor \u2014 no logic change" },
    ],
  },
  {
    range: "5xx",
    label: "Broken",
    color: "border-status-5xx text-status-5xx bg-status-5xx/10",
    dotColor: "bg-status-5xx",
    description: "Something is broken. Do not deploy. Needs immediate attention.",
    codes: [
      { code: "500", meaning: "Internal Error", msg: "status(500): checkout broken" },
      { code: "502", meaning: "Bad Gateway", msg: "status(502): third-party API down" },
      { code: "503", meaning: "Service Unavailable", msg: "status(503): disable payments" },
    ],
  },
  {
    range: "6xx",
    label: "Fixed",
    color: "border-status-6xx text-status-6xx bg-status-6xx/10",
    dotColor: "bg-status-6xx",
    description: "Previously broken code has been repaired. Recovered from a 5xx state.",
    codes: [
      { code: "600", meaning: "Hotfix Applied", msg: "status(600): hotfix applied" },
      { code: "601", meaning: "Bug Resolved", msg: "status(601): fix race condition" },
    ],
  },
  {
    range: "\u221E",
    label: "Gold Master",
    color: "border-status-inf text-status-inf bg-status-inf/10",
    dotColor: "bg-status-inf",
    description: "The final, production-ready release. The gold standard. Use \u221E or the infinity symbol interchangeably.",
    codes: [
      { code: "\u221E", meaning: "Gold Master", msg: "status(\u221E): v1.0.0 gold master" },
      { code: "infinity", meaning: "Gold Master (alias)", msg: "status(infinity): v2.0.0 stable release" },
    ],
  },
]

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="how-it-works" className="px-4 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How it works
        </h2>
        <p className="text-lg text-muted-foreground mb-4 max-w-2xl text-pretty">
          STATUS Commit maps HTTP status code categories to code states.
          The format is simple:
        </p>
        <div className="font-mono text-lg text-foreground bg-secondary px-4 py-3 rounded-lg border border-border mb-12 inline-block">
          status(###): short description
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <button
              key={cat.range}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              className={`text-left p-5 rounded-lg border transition-all duration-200 cursor-default ${
                activeIndex === i
                  ? cat.color
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`} />
                <span className="font-mono text-2xl font-bold">
                  {cat.range}
                </span>
                <span className="text-sm text-muted-foreground">{cat.label}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {cat.description}
              </p>
              <div className="space-y-2">
                {cat.codes.map((c, j) => (
                  <div key={j} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground/90">{c.code}</span>
                      <span className="text-xs text-muted-foreground">{c.meaning}</span>
                    </div>
                    <div className="font-mono text-xs text-foreground/50 truncate">
                      {c.msg}
                    </div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
