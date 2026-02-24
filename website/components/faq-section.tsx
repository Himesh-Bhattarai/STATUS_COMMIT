"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What problem does STATUS Commit solve?",
    answer:
      "Traditional git logs tell you what changed, but not whether the code works. STATUS Commit makes code reliability visible at a glance. You can instantly see if a commit is in-progress (1xx), stable (2xx), changed (3xx), broken (5xx), fixed (6xx), or a gold master (\u221E) \u2014 directly from git log.",
  },
  {
    question: "Do I have to use it on every commit?",
    answer:
      "No. Use it where it matters \u2014 feature work, bug fixes, releases. For trivial changes like typo fixes or dependency bumps, a regular commit message is fine. The convention is most powerful when it gives your team (and your CI) signal about code reliability.",
  },
  {
    question: "What about teams and onboarding?",
    answer:
      "The mapping to HTTP status codes makes it intuitive for any developer who\u2019s ever seen a 500 error. The cheat sheet fits on a sticky note. Most teams report onboarding takes about 5 minutes \u2014 the convention is small enough to learn in one sitting and useful enough to remember.",
  },
  {
    question: "Can I use both \u221E and \"infinity\" for Gold Master?",
    answer:
      "Yes. Both status(\u221E) and status(infinity) are valid for marking a production-ready release. Use whichever is easier to type in your environment. The git hooks recognize both forms.",
  },
  {
    question: "Can I combine it with semantic versioning?",
    answer:
      "Absolutely. The \u221E (infinity) code is designed exactly for this. Use status(\u221E) to mark tagged releases: \"status(\u221E): v1.0.0 gold master\". Other codes track the work between versions. It pairs naturally with semver for release management.",
  },
  {
    question: "How does it help CI/CD pipelines?",
    answer:
      "STATUS codes are machine-readable. A single grep in your pipeline can block deploys when status(5xx) appears in recent commits, or only allow shipping when the latest commit is status(2xx) or status(\u221E). This gives your automation a built-in safety net without any extra tooling.",
  },
  {
    question: "What tools support STATUS Commit?",
    answer:
      "STATUS Commit works with any git client \u2014 it\u2019s just a commit message format. The repo includes git hooks for message validation, and the bash/CI scripts work out of the box. A VS Code extension with autocomplete is in development.",
  },
  {
    question: "What about the 4xx range?",
    answer:
      "The 4xx range (client errors in HTTP) doesn\u2019t have a direct mapping in code state. STATUS Commit intentionally skips it to keep the convention focused. The 5 categories (1xx, 2xx, 3xx, 5xx, 6xx) plus \u221E cover the full lifecycle of code from inception to production.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-24 md:py-32 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          FAQ
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          Common questions about STATUS Commit.
        </p>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
