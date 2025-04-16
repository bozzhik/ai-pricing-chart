import type React from 'react'
import type {Metadata} from 'next'
import {Analytics} from '@vercel/analytics/react'
import {ThemeProvider} from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Model Pricing Comparison',
  description: 'Compare input and output costs across different AI models',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          {children}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}

import './globals.css'
