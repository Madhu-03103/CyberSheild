'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Search, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import type { Threat } from '@/lib/store'
import Link from 'next/link'

export default function ThreatLibrary() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [liveStats, setLiveStats] = useState({
    total: 0,
    critical: 0,
    investigating: 0,
    resolved: 0
  })

  useEffect(() => {
    const updateThreats = () => {
      const allThreats = store.getThreats()
      setThreats(allThreats)
      setLiveStats({
        total: allThreats.length,
        critical: allThreats.filter(t => t.severity === 'critical').length,
        investigating: allThreats.filter(t => t.status === 'investigating').length,
        resolved: allThreats.filter(t => t.status === 'resolved').length
      })
    }
    
    updateThreats()
    const interval = setInterval(updateThreats, 3000)
    return () => clearInterval(interval)
  }, [])

  const filteredThreats = threats.filter(threat => 
    threat.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    threat.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'critical'
      case 'high': return 'danger'
      case 'medium': return 'warning'
      default: return 'primary'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">Threat Library</h1>
            <p className="text-textSecondary">Comprehensive database of detected threats</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <div className="text-2xl font-bold text-textPrimary">
              {liveStats.total} Threats
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-1">Total Threats</div>
            <div className="text-3xl font-bold text-textPrimary">{liveStats.total}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-1">Critical</div>
            <div className="text-3xl font-bold text-critical">{liveStats.critical}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-1">Investigating</div>
            <div className="text-3xl font-bold text-warning">{liveStats.investigating}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-1">Resolved</div>
            <div className="text-3xl font-bold text-success">{liveStats.resolved}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threats..."
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary"
            />
          </div>

          {filteredThreats.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-textSecondary mb-2">No threats found</div>
              <Link href="/url-scanner" className="text-primary hover:underline">
                Run a URL or email analysis to begin investigation
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Threat ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Indicator</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Risk Score</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-textSecondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredThreats.map((threat) => (
                    <tr key={threat.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-textPrimary font-mono">{threat.id}</td>
                      <td className="py-3 px-4 text-sm text-textPrimary truncate max-w-xs">{threat.indicator}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-danger/20 text-danger rounded text-xs font-semibold uppercase">
                          {threat.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 bg-${getSeverityColor(threat.severity)}/20 text-${getSeverityColor(threat.severity)} rounded text-xs font-semibold uppercase`}>
                          {threat.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-textPrimary font-semibold">{threat.riskScore}</td>
                      <td className="py-3 px-4 text-sm text-textSecondary capitalize">{threat.status}</td>
                      <td className="py-3 px-4">
                        <Link href={`/investigation?id=${threat.id}`}>
                          <button className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
