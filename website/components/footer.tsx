import { Github, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="px-4 py-12 border-t border-border">
      {/* Discussion Box */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="rounded-lg border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-status-2xx/10 border border-status-2xx/20">
            <MessageCircle className="w-6 h-6 text-status-2xx" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">
              Join the Discussion
            </h3>
            <p className="text-sm text-muted-foreground text-pretty">
              Have questions, suggestions, or want to share how you use STATUS Commit?
              Head over to GitHub Discussions to connect with the community.
            </p>
          </div>
          <a
            href="https://github.com/Himesh-Bhattarai/STATUS_COMMIT/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-medium text-sm rounded-lg hover:opacity-90 transition-opacity shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            Open Discussions
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-foreground">STATUS</span>
          <span className="text-muted-foreground text-sm">
            Created by{" "}
            <a
              href="https://github.com/Himesh-Bhattarai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Himeshchanchal Bhattarai
            </a>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-mono text-muted-foreground">
            Apache-2.0
          </span>
          <a
            href="https://github.com/Himesh-Bhattarai/STATUS_COMMIT"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="View STATUS Commit on GitHub"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border">
        <p className="text-center text-xs text-muted-foreground font-mono">
          status(204): this website is fully tested and ready to ship
        </p>
      </div>
    </footer>
  )
}
