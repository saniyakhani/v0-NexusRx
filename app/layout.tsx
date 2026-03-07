import type { Metadata } from 'next'
import { Poppins, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: 'NexusRx | Drug Repurposing Platform',
  description: 'AI-Enabled Pharmaceutical Intelligence - Evaluate unconventional drug candidates for disease targets, analyze patient-specific applicability, and deliver OTC ingredient-matched alternatives.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
