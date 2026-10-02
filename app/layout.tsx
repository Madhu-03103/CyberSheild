import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CyberShield AI - Cyber Threat Detection Platform',
  description: 'AI-Powered Cyber Threat Detection & Intelligence Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
