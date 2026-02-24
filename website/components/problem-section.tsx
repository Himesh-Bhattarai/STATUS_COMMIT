"use client"

const ambiguousLog = [
  { hash: "e7f2a1c", msg: "add user authentication" },
  { hash: "d4b8e3a", msg: "resolve login redirect" },
  { hash: "c9a1f7b", msg: "add password reset flow" },
  { hash: "b3e5d2c", msg: "handle token expiry" },
  { hash: "a8c4b6d", msg: "add two-factor auth" },
  { hash: "f1d9e5a", msg: "session persistence bug" },
  { hash: "e2c7a8b", msg: "add OAuth integration" },
  { hash: "d6b3f1c", msg: "rate limiting issue" },
]

export function ProblemSection() {
  return (
    <section id="problem" className="px-4 py-24 md:py-32">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Your git log describes <span className="italic text-muted-foreground">what</span> changed.
          <br />
          Not whether it <span className="text-status-5xx">works</span>.
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl text-pretty">
          Commit messages tell you what the developer did, but nothing about the state of the code.
          Is it tested? Is it broken? Is it safe to deploy? You have to dig in and find out.
        </p>

        {/* Ambiguous git log */}
        <div className="rounded-lg border border-border bg-card overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-border">
            <span className="font-mono text-xs text-muted-foreground">$ git log --oneline</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-1.5">
            {ambiguousLog.map((commit) => (
              <div key={commit.hash} className="flex gap-2">
                <span className="text-muted-foreground/60">{commit.hash}</span>
                <span className="text-muted-foreground">{commit.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg border border-status-5xx/30 bg-status-5xx/5">
          <div className="shrink-0 w-1 h-12 bg-status-5xx rounded-full" />
          <div>
            <p className="text-foreground font-medium">
              Quick: which commit is safe to deploy?
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              You can{"'"}t tell. Nothing in this log signals the reliability of the code.
              That{"'"}s the problem STATUS Commit solves.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
