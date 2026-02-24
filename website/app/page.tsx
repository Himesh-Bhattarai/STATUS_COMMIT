import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorks } from "@/components/how-it-works"
import { ComparisonSection } from "@/components/comparison-section"
import { CiCdSection } from "@/components/cicd-section"
import { InstallSection } from "@/components/install-section"
import { CheatSheet } from "@/components/cheat-sheet"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ComparisonSection />
        <CiCdSection />
        <InstallSection />
        <CheatSheet />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
