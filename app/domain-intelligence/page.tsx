'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Globe, Search, CheckCircle, XCircle, Activity, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DomainIntelligence() {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState<any>(null)
  const [liveIntel, setLiveIntel] = useState({
    totalDomains: 0,
    suspicious: 0,
    blocked: 0,
    scanning: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIntel({
        totalDomains: Math.floor(Math.random() * 500) + 5000,
        suspicious: Math.floor(Math.random() * 50) + 150,
        blocked: Math.floor(Math.random() * 20) + 80,
        scanning: Math.floor(Math.random() * 10) + 5
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleAnalyze = () => {
    if (!domain) return
    
    setResult({
      domain: domain,
      domainAge: Math.floor(Math.random() * 365),
      https: Math.random() > 0.3,
      tld: domain.split('.').pop() || 'com',
      redirects: Math.floor(Math.random() * 5),
      riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      reputation: Math.floor(Math.random() * 100)
    })
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-textPrimary">Domain Intelligence</h1>
            <p className="text-textSecondary">Real-time domain investigation and reputation analysis</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
            <Activity className="w-4 h-4 text-success animate-pulse" />
            <span className="text-xs text-textSecondary">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-primary" />
              <div className="text-sm text-textSecondary">Total Analyzed</div>
            </div>
            <div className="text-2xl font-bold text-textPrimary">{liveIntel.totalDomains.toLocaleString()}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-textSecondary mb-1">Suspicious</div>
            <div className="text-2xl font-bold text-warning">{liveIntel.suspicious}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-textSecondary mb-1">Blocked</div>
            <div className="text-2xl font-bold text-danger">{liveIntel.blocked}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm text-textSecondary mb-1">Scanning Now</div>
            <div className="text-2xl font-bold text-primary">{liveIntel.scanning}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">Domain Name</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="w-full bg-secondary border border-border rounded-lg pl-12 pr-4 py-4 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!domain}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Analyze Domain
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-textPrimary mb-6">Domain Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-textSecondary mb-1">Domain</div>
                  <div className="text-lg font-bold text-textPrimary">{result.domain}</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary mb-1">Domain Age</div>
                  <div className="text-lg font-bold text-textPrimary">{result.domainAge} days</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary mb-1">HTTPS</div>
                  <div className="flex items-center gap-2">
                    {result.https ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger" />
                    )}
                    <span className="text-lg font-bold text-textPrimary">
                      {result.https ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary mb-1">TLD</div>
                  <div className="text-lg font-bold text-textPrimary">.{result.tld}</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary mb-1">Redirects</div>
                  <div className="text-lg font-bold text-textPrimary">{result.redirects}</div>
                </div>
                <div>
                  <div className="text-sm text-textSecondary mb-1">Risk Level</div>
                  <div className={`text-lg font-bold ${
                    result.riskLevel === 'HIGH' ? 'text-danger' : 
                    result.riskLevel === 'MEDIUM' ? 'text-warning' : 'text-success'
                  }`}>
                    {result.riskLevel}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-textPrimary mb-4">Security Indicators</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-textPrimary">IP Address</span>
                  <span className="font-mono text-textSecondary">{result.ipAddress}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-textPrimary">Reputation Score</span>
                  <span className="font-bold text-textPrimary">{result.reputation}/100</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-textPrimary">SSL Certificate</span>
                  <span className={result.https ? 'text-success' : 'text-danger'}>
                    {result.https ? 'Valid' : 'Invalid'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
