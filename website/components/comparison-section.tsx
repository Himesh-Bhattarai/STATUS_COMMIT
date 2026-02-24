import { ShieldCheck, Eye, GitBranch, Zap, Users, BarChart3 } from "lucide-react"

const reasons = [
  {
    icon: ShieldCheck,
    title: "Deploy with confidence",
    description:
      "Every commit carries a reliability signal. Your CI pipeline can read status codes and block broken deploys automatically -- no guesswork.",
    color: "text-status-2xx",
    bgColor: "bg-status-2xx/10",
    borderColor: "border-status-2xx/20",
  },
  {
    icon: Eye,
    title: "Instant codebase health at a glance",
    description:
      "Run git log and immediately see what's stable, what's broken, and what's in progress. Color-coded status codes make your history scannable in seconds.",
    color: "text-status-3xx",
    bgColor: "bg-status-3xx/10",
    borderColor: "border-status-3xx/20",
  },
  {
    icon: GitBranch,
    title: "Know which commit to revert to",
    description:
      "When something breaks in production, you don't need to read diffs. Find the last status(2xx) or status(\u221E) commit and roll back with certainty.",
    color: "text-status-6xx",
    bgColor: "bg-status-6xx/10",
    borderColor: "border-status-6xx/20",
  },
  {
    icon: Zap,
    title: "Automate pipeline decisions",
    description:
      "Gate deployments, trigger alerts, or skip releases based on status codes. A simple grep on your git log gives you machine-readable reliability data.",
    color: "text-status-5xx",
    bgColor: "bg-status-5xx/10",
    borderColor: "border-status-5xx/20",
  },
  {
    icon: Users,
    title: "Onboard teammates faster",
    description:
      "New developers can scan the log and understand project health without reading code. Status codes are universal -- if you know HTTP, you know STATUS Commit.",
    color: "text-status-inf",
    bgColor: "bg-status-inf/10",
    borderColor: "border-status-inf/20",
  },
  {
    icon: BarChart3,
    title: "Track project stability over time",
    description:
      "Aggregate status codes to measure how often your codebase is stable vs broken. Build dashboards, set team goals, and improve your commit-to-deploy ratio.",
    color: "text-status-1xx",
    bgColor: "bg-status-1xx/10",
    borderColor: "border-status-1xx/20",
  },
]

export function ComparisonSection() {
  return (
    <section id="why" className="px-4 py-24 md:py-32 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Why STATUS Commit?
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl text-pretty">
          Your git history already tracks what changed. STATUS Commit adds the
          missing layer: whether it works.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className={`rounded-lg border ${reason.borderColor} bg-card p-6 flex flex-col gap-4 transition-colors hover:bg-secondary/50`}
            >
              <div className={`w-10 h-10 rounded-md ${reason.bgColor} flex items-center justify-center`}>
                <reason.icon className={`w-5 h-5 ${reason.color}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
