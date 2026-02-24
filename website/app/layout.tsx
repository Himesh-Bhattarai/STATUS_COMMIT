import type { Metadata, Viewport } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: 'STATUS Commit — Know if your code works, right from git log',
  description: 'A git commit convention that uses HTTP status codes to describe the state and reliability of code at each commit. Stop guessing which commit is safe to deploy.',
  keywords: ['git', 'commit convention', 'HTTP status codes', 'CI/CD', 'developer tools', 'STATUS Commit'],
  authors: [{ name: 'Himeshchanchal Bhattarai' }],
  openGraph: {
    title: 'STATUS Commit — Know if your code works, right from git log',
    description: 'A git commit convention that uses HTTP status codes to describe the state and reliability of code at each commit.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
