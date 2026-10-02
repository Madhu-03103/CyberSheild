'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Radio, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function LiveThreats() {
  const [threats, setThreats] = useState([
    { id: 1, type: 'PHISHING', message: 'Suspicious login URL detected', time: '2 min ago', severity: 'critical', source: 'URL Scanner' },
    { id: 2, type: 'SUSPICIOUS', message: 'Unusual domain behavior detected', time: '4 min ago', severity: 'warning', source: 'Domain Intel' },
    { id: 3, type: 'MALWARE', message: 'Malicious URL identified', time: '6 min ago', severity: 'critical', source: 'URL Scanner' },
    { id: 4, type: 'EMAIL', message: 'Suspicious sender authentication', time: '8 min ago', severity: 'warning', source: 'Email Inspector' },
    { id: 5, type: 'PHISHING', message: 'Fake banking website detected', time: '10 min ago', severity: 'critical', source: 'URL Scanner' },
  ])

  useEffect(() => {
    const threatPool = [
      { type: 'PHISHING', message: 'Credential harvesting attempt detected', severity: 'critical' },
      { type: 'MALWARE', message: 'Malicious JavaScript payload identified', severity: 'critical' },
      { type: 'SUSPICIOUS', message: 'TLD typosquatting detected', severity: 'warning' },
      { type: 'SPAM', message: 'Bulk email campaign from new sender', severity: 'warning' },
      { type: 'PHISHING', message: 'Brand impersonation attack blocked', severity: 'critical' },
      { type: 'MALWARE', message: 'Exploit kit delivery mechanism found', severity: 'critical' },
      { type: 'SUSPICIOUS', message: 'Homograph attack pattern detected', severity: 'warning' },
      { type: 'PHISHING', message: 'OAuth token theft attempt flagged', severity: 'critical' },
      { type: 'MALWARE', message: 'Cryptominer script detected', severity: 'critical' },
      { type: 'SUSPICIOUS', message: 'Unusual geolocation for sender', severity: 'warning' },
      { type: 'SPAM', message: 'SEO poisoning campaign identified', severity: 'warning' },
      { type: 'PHISHING', message: 'Two-factor bypass attempt detected', severity: 'critical' },
    ]

    const interval = setInterval(() => {
      const randomThreat = threatPool[Math.floor(Math.random() * threatPool.length)]
      const sources = ['URL Scanner', 'Email Inspector', 'Domain Intel', 'ML Engine', 'Threat Feed']
      const newThreat = {
        id: Date.now(),
        ...randomThreat,
        time: 'Just now',
        source: sources[Math.floor(Math.random() * sources.length)]
      }
      setThreats(prev => [newThreat, ...prev.slice(0, 11)])
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-danger/10 rounded-lg">
            <Radio className="w-8 h-8 text-danger" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-textPrimary flex items-center gap-3">
              Live Threat Feed
              <div className="w-3 h-3 bg-danger rounded-full animate-pulse" />
            </h1>
            <p className="text-textSecondary">Real-time threat detection monitoring</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-danger mb-1">{threats.filter(t => t.severity === 'critical').length}</div>
            <div className="text-sm text-textSecondary">Critical Threats</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-warning mb-1">{threats.filter(t => t.severity === 'warning').length}</div>
            <div className="text-sm text-textSecondary">Warnings</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-textPrimary mb-1">{threats.length}</div>
            <div className="text-sm text-textSecondary">Total Events</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-success mb-1">Live</div>
            <div className="text-sm text-textSecondary">Status</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-3">
            {threats.map(threat => (
              <div key={threat.id} className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-all animate-fade-in">
                <div className={`w-1 h-14 rounded-full ${threat.severity === 'critical' ? 'bg-danger' : 'bg-warning'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      threat.severity === 'critical' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                    }`}>
                      {threat.type}
                    </span>
                    <span className="text-xs text-textSecondary">{threat.time}</span>
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                      {threat.source}
                    </span>
                  </div>
                  <div className="text-sm text-textPrimary">{threat.message}</div>
                </div>
                <AlertTriangle className={`w-5 h-5 ${threat.severity === 'critical' ? 'text-danger' : 'text-warning'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-primary/50 rounded-xl p-4">
          <div className="flex items-center gap-3 text-sm text-textSecondary">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Demo Mode Active</span>
            </div>
            <span>•</span>
            <span>Simulated threat feed for demonstration purposes</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
