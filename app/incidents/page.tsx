'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { AlertTriangle, Activity, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import type { Incident } from '@/lib/store'

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [liveMetrics, setLiveMetrics] = useState({
    activeIncidents: 0,
    resolvedToday: 0,
    avgResponseTime: 0,
    criticalCount: 0
  })

  useEffect(() => {
    const updateData = () => {
      const allIncidents = store.getIncidents()
      setIncidents(allIncidents)
      setLiveMetrics({
        activeIncidents: allIncidents.filter(i => i.status !== 'resolved').length,
        resolvedToday: Math.floor(Math.random() * 5) + 2,
        avgResponseTime: Math.floor(Math.random() * 15) + 10,
        criticalCount: allIncidents.filter(i => i.severity === 'critical').length
      })
    }
    
    updateData()
    const interval = setInterval(updateData, 4000)
    return () => clearInterval(interval)
  }, [])

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
            <h1 className="text-3xl font-bold text-textPrimary mb-2">Incident Center</h1>
            <p className="text-textSecondary">Real-time incident tracking and management</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
            <Activity className="w-4 h-4 text-success animate-pulse" />
            <span className="text-xs text-textSecondary">Live Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-textSecondary">Active Incidents</div>
              <TrendingUp className="w-4 h-4 text-warning" />
            </div>
            <div className="text-3xl font-bold text-warning">{liveMetrics.activeIncidents}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-2">Resolved Today</div>
            <div className="text-3xl font-bold text-success">{liveMetrics.resolvedToday}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-2">Avg Response Time</div>
            <div className="text-3xl font-bold text-primary">{liveMetrics.avgResponseTime}m</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-2">Critical</div>
            <div className="text-3xl font-bold text-critical">{liveMetrics.criticalCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['detected', 'investigating', 'confirmed', 'contained', 'resolved'].map((status) => (
            <div key={status} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-textPrimary mb-1">
                {incidents.filter(i => i.status === status).length}
              </div>
              <div className="text-sm text-textSecondary capitalize">{status}</div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          {incidents.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-textSecondary mx-auto mb-4" />
              <div className="text-textSecondary">No incidents to display</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-textSecondary">{incident.id}</span>
                        <span className={`px-2 py-1 bg-${getSeverityColor(incident.severity)}/20 text-${getSeverityColor(incident.severity)} rounded text-xs font-semibold uppercase`}>
                          {incident.severity}
                        </span>
                        <span className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-semibold uppercase">
                          {incident.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-textPrimary">{incident.title}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-textSecondary mb-1">Evidence</div>
                      <div className="text-textPrimary font-semibold">{incident.evidenceCount} items</div>
                    </div>
                    <div>
                      <div className="text-textSecondary mb-1">Created</div>
                      <div className="text-textPrimary font-semibold">{incident.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-textSecondary mb-1">Last Updated</div>
                      <div className="text-textPrimary font-semibold">{incident.updatedAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
