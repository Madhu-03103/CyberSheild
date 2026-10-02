'use client'

import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

export default function TopNav() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-secondary/80 backdrop-blur-lg border-b border-border z-40 px-6">
      <div className="h-full flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threats, URLs, domains, incidents..."
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-2 text-textSecondary hover:text-textPrimary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-textSecondary">Operational</span>
          </div>
        </div>
      </div>
    </header>
  )
}
