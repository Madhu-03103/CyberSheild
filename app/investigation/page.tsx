'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Microscope, Bookmark, FileText, CheckCircle, Clock, Activity } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { store } from '@/lib/store'
import type { Threat } from '@/lib/store'
import { useSearchParams } from 'next/navigation'

function InvestigationContent() {
  const searchParams = useSearchParams()
  const threatId = searchParams.get('id')
  const [threat, setThreat] = useState<Threat | null>(null)
  const [status, setStatus] = useState('investigating')
  const [liveActivity, setLiveActivity] = useState({
    evidenceCount: 3,
    activityScore: 0,
    lastUpdate: new Date()
  })

  useEffect(() => {
    if (threatId) {
      const foundThreat = store.getThreatById(threatId)
      if (foundThreat) {
        setThreat(foundThreat)
        setStatus(foundThreat.status)
      }
    }
  }, [threatId])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity({
        evidenceCount: Math.floor(Math.random() * 3) + 3,
        activityScore: Math.floor(Math.random() * 30) + 70,
        lastUpdate: new Date()
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleAddToWatchlist = () => {
    if (threat) {
      store.addToWatchlist({
        id: `WL-${Date.now()}`,
        indicator: threat.indicator,
        type: 'url',
        createdAt: new Date()
      })
      alert('Added to watchlist')
    }
  }

  const handleCreateIncident = () => {
    if (threat) {
      store.addIncident({
        id: `INC-${Date.now()}`,
        threatId: threat.id,
        title: `${threat.type} threat detected`,
        severity: threat.severity,
        status: 'investigating',
        evidenceCount: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      alert('Incident created')
    }
  }

  if (!threat) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Microscope className="w-16 h-16 text-textSecondary mx-auto mb-4" />
          <h2 className="text-xl font-bold text-textPrimary mb-2">No Threat Selected</h2>
          <p className="text-textSecondary">Select a threat from the Threat Library to investigate</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Microscope className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Threat Investigation</h1>
            <p className="text-textSecondary">Detailed analysis and evidence</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-textSecondary mb-1">Threat ID</div>
              <div className="text-lg font-bold text-textPrimary font-mono">{threat.id}</div>
            </div>
            <div>
              <div className="text-sm text-textSecondary mb-1">Type</div>
              <div className="text-lg font-bold text-danger capitalize">{threat.type}</div>
            </div>
            <div>
              <div className="text-sm text-textSecondary mb-1">Risk Score</div>
              <div className="text-lg font-bold text-textPrimary">{threat.riskScore}/100</div>
            </div>
            <div>
              <div className="text-sm text-textSecondary mb-1">Status</div>
              <div className="text-lg font-bold text-warning capitalize">{status}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-textPrimary">Live Investigation Metrics</h2>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-success animate-pulse" />
              <span className="text-xs text-textSecondary">Active</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-sm text-textSecondary mb-1">Evidence Items</div>
              <div className="text-2xl font-bold text-textPrimary">{liveActivity.evidenceCount}</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-sm text-textSecondary mb-1">Activity Score</div>
              <div className="text-2xl font-bold text-primary">{liveActivity.activityScore}</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-sm text-textSecondary mb-1">Last Update</div>
              <div className="text-sm font-bold text-textPrimary">{liveActivity.lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-textPrimary mb-4">Evidence</h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-textSecondary mb-2">Indicator</div>
              <div className="p-3 bg-secondary rounded-lg font-mono text-sm text-textPrimary break-all">
                {threat.indicator}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-textSecondary mb-2">Severity</div>
                <div className="p-3 bg-secondary rounded-lg">
                  <span className={`text-${threat.severity === 'critical' ? 'critical' : threat.severity === 'high' ? 'danger' : 'warning'} font-semibold uppercase`}>
                    {threat.severity}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-textSecondary mb-2">Detected</div>
                <div className="p-3 bg-secondary rounded-lg text-textPrimary">
                  {threat.detected.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-textPrimary mb-4">Investigation Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-sm font-semibold text-textPrimary">Threat Detected</div>
                <div className="text-xs text-textSecondary">{threat.detected.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Microscope className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-textPrimary">Analysis Started</div>
                <div className="text-xs text-textSecondary">{threat.detected.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                <Microscope className="w-4 h-4 text-warning" />
              </div>
              <div>
                <div className="text-sm font-semibold text-textPrimary">Investigation In Progress</div>
                <div className="text-xs text-textSecondary">Current Status</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-textPrimary mb-4">Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button 
              onClick={handleAddToWatchlist}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
            >
              <Bookmark className="w-4 h-4" />
              <span className="text-sm font-semibold">Add to Watchlist</span>
            </button>
            <button 
              onClick={handleCreateIncident}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">Create Incident</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-success/10 hover:bg-success/20 text-success rounded-lg transition-all">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">Generate Report</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-border text-textPrimary rounded-lg transition-all">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Mark Reviewed</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function Investigation() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Activity className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <div className="text-xl font-bold text-textPrimary">Loading Investigation...</div>
          </div>
        </div>
      </DashboardLayout>
    }>
      <InvestigationContent />
    </Suspense>
  )
}
