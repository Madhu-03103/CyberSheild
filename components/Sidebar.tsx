'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Home, Search, Mail, Microscope, Globe, Radio, BarChart3, Brain, FolderOpen, Bookmark, AlertTriangle, Bot, FileText } from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/overview', icon: Home },
  { section: 'DETECTION' },
  { name: 'URL Scanner', href: '/url-scanner', icon: Search },
  { name: 'Email Inspector', href: '/email-inspector', icon: Mail },
  { section: 'INTELLIGENCE' },
  { name: 'Investigation', href: '/investigation', icon: Microscope },
  { name: 'Domain Intelligence', href: '/domain-intelligence', icon: Globe },
  { name: 'Live Threat Feed', href: '/live-threats', icon: Radio },
  { section: 'ANALYTICS' },
  { name: 'Security Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'ML Model Center', href: '/ml-center', icon: Brain },
  { section: 'OPERATIONS' },
  { name: 'Threat Library', href: '/threat-library', icon: FolderOpen },
  { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
  { name: 'Incident Center', href: '/incidents', icon: AlertTriangle },
  { section: 'AI' },
  { name: 'Security Copilot', href: '/copilot', icon: Bot },
  { section: 'REPORTING' },
  { name: 'Threat Reports', href: '/reports', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary border-r border-border flex flex-col z-50">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-textPrimary">CyberShield AI</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navigation.map((item, index) => {
          if ('section' in item) {
            return (
              <div key={index} className="px-3 mt-6 mb-2 text-xs font-semibold text-textSecondary uppercase tracking-wider">
                {item.section}
              </div>
            )
          }

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-textSecondary hover:bg-card hover:text-textPrimary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-textSecondary">System Operational</span>
        </div>
      </div>
    </aside>
  )
}
