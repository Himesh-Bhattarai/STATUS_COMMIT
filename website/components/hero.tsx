"use client"

import { useEffect, useState, useRef } from "react"
import { Github, ArrowRight } from "lucide-react"

const statusCommits = [
  { hash: "a3f21b8", code: "100", msg: "init project structure", color: "text-status-1xx" },
  { hash: "b7e94c2", code: "102", msg: "scaffold payment flow", color: "text-status-1xx" },
  { hash: "c1d83a5", code: "500", msg: "checkout broken", color: "text-status-5xx" },
  { hash: "d9f12e7", code: "601", msg: "fix race condition", color: "text-status-6xx" },
  { hash: "e4b67d1", code: "301", msg: "migrate to new API", color: "text-status-3xx" },
  { hash: "f8c23a9", code: "204", msg: "fully tested \u2014 ship it", color: "text-status-2xx" },
  { hash: "g2d91b4", code: "\u221E", msg: "v1.0.0 gold master", color: "text-status-inf" },
]

// Floating status codes for the background — large, visible, glowing
const floatingCodes = [
  { code: "200", label: "OK", x: 5, y: 12, color: "#22c55e", size: 22, delay: 0 },
  { code: "500", label: "ERROR", x: 82, y: 15, color: "#ef4444", size: 24, delay: 1.2 },
  { code: "301", label: "MOVED", x: 10, y: 65, color: "#eab308", size: 20, delay: 0.8 },
  { code: "102", label: "WIP", x: 75, y: 72, color: "#737373", size: 18, delay: 2.1 },
  { code: "\u221E", label: "GOLD", x: 90, y: 42, color: "#a855f7", size: 28, delay: 0.4 },
  { code: "601", label: "FIXED", x: 3, y: 40, color: "#3b82f6", size: 20, delay: 1.6 },
  { code: "204", label: "TESTED", x: 42, y: 5, color: "#22c55e", size: 18, delay: 2.4 },
  { code: "503", label: "DOWN", x: 68, y: 86, color: "#ef4444", size: 20, delay: 0.2 },
  { code: "100", label: "INIT", x: 28, y: 82, color: "#737373", size: 18, delay: 1.8 },
  { code: "600", label: "HOTFIX", x: 55, y: 90, color: "#3b82f6", size: 18, delay: 3.0 },
  { code: "302", label: "TEMP", x: 60, y: 8, color: "#eab308", size: 18, delay: 1.0 },
  { code: "201", label: "CREATED", x: 20, y: 28, color: "#22c55e", size: 16, delay: 2.8 },
  { code: "502", label: "BAD GW", x: 48, y: 70, color: "#ef4444", size: 16, delay: 0.6 },
  { code: "304", label: "SAME", x: 88, y: 80, color: "#eab308", size: 16, delay: 2.0 },
]

function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    const w = () => canvas.offsetWidth
    const h = () => canvas.offsetHeight

    // Particles: small dots that drift
    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number }[] = []
    const colors = ["#22c55e", "#ef4444", "#eab308", "#3b82f6", "#a855f7", "#737373"]
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.3 + 0.1,
      })
    }

    const draw = () => {
      time += 0.005
      ctx.clearRect(0, 0, w(), h())

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(115, 115, 115, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = w()
        if (p.x > w()) p.x = 0
        if (p.y < 0) p.y = h()
        if (p.y > h()) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha + Math.sin(time * 2 + p.x) * 0.05
        ctx.fill()
        ctx.globalAlpha = 1
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  )
}

export function Hero() {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount < statusCommits.length) {
      const timer = setTimeout(() => {
        setVisibleCount((c) => c + 1)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [visibleCount])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated particle canvas */}
      <FloatingBackground />

      {/* Floating status code badges */}
      {floatingCodes.map((fc, i) => (
        <div
          key={i}
          className="absolute select-none pointer-events-none flex flex-col items-center"
          style={{
            left: `${fc.x}%`,
            top: `${fc.y}%`,
            animation: `float ${6 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${fc.delay}s`,
          }}
        >
          <span
            className="font-mono font-black tracking-tight"
            style={{
              fontSize: `${fc.size}px`,
              color: fc.color,
              opacity: 0.25,
              textShadow: `0 0 20px ${fc.color}40, 0 0 40px ${fc.color}20`,
            }}
          >
            {fc.code}
          </span>
          <span
            className="font-mono uppercase tracking-widest"
            style={{
              fontSize: `${Math.max(fc.size * 0.4, 8)}px`,
              color: fc.color,
              opacity: 0.15,
              letterSpacing: "0.15em",
            }}
          >
            {fc.label}
          </span>
        </div>
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #22c55e, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
      <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #ef4444, transparent 70%)" }} />
      <div className="absolute bottom-[20%] left-[15%] w-[300px] h-[300px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #eab308, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-border bg-secondary/80 backdrop-blur-sm font-mono text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-status-2xx animate-pulse" />
          status(204): open source
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance leading-[1.1]">
          Know if your code works,{" "}
          <br className="hidden md:block" />
          <span className="relative">
            <span className="text-status-2xx">right from</span>{" "}
            <span className="font-mono text-status-2xx">git log</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-status-2xx/40 rounded-full" />
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
          A git commit convention that uses HTTP status codes
          to describe the state and reliability of your code at every commit.
          Stop guessing. Start knowing.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="https://github.com/Himesh-Bhattarai/STATUS_COMMIT"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-all hover:gap-3"
          >
            <Github className="w-5 h-5" />
            View on GitHub
          </a>
          <a
            href="#install"
            className="group inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-medium rounded-lg hover:bg-secondary hover:border-muted-foreground/30 transition-all"
          >
            Get Started in 60s
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Animated STATUS git log */}
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden text-left shadow-2xl shadow-status-2xx/[0.03]">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-secondary/50">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-muted-foreground ml-2">
              {"$ git log --oneline"}
            </span>
          </div>
          <div className="p-5 font-mono text-sm space-y-2 min-h-[260px]">
            {statusCommits.slice(0, visibleCount).map((commit, i) => (
              <div
                key={commit.hash}
                className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-muted-foreground/40 shrink-0">{commit.hash}</span>
                <span className={`${commit.color} font-semibold shrink-0`}>
                  status({commit.code}):
                </span>
                <span className="text-foreground/70 truncate">{commit.msg}</span>
              </div>
            ))}
            {visibleCount >= statusCommits.length && (
              <div className="mt-5 pt-4 border-t border-border animate-in fade-in duration-700">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-status-2xx/5 border border-status-2xx/20">
                  <span className="inline-block w-2 h-2 rounded-full bg-status-2xx animate-pulse" />
                  <span className="text-status-2xx text-xs">
                    Safe to deploy? Scan for <span className="font-bold">2xx</span> or <span className="font-bold">{"\u221E"}</span>. Done.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status legend strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-1xx" />1xx in progress</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-2xx" />2xx stable</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-3xx" />3xx changed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-5xx" />5xx broken</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-6xx" />6xx fixed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-inf" />{"\u221E"} gold master</span>
        </div>
      </div>
    </section>
  )
}
