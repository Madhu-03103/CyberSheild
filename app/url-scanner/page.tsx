'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Search, AlertTriangle, CheckCircle, Globe, Shield, Clock, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { scanURL } from '@/lib/api'
import type { URLScanResponse } from '@/lib/api'

export default function URLScanner() {
  const [url, setUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<URLScanResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to scan')
      return
    }

    setScanning(true)
    setError(null)
    setResult(null)

    try {
      const scanResult = await scanURL(url)
      setResult(scanResult)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to scan URL. Please try again.')
      console.error('Scan error:', err)
    } finally {
      setScanning(false)
    }
  }

  const getThreatColor = (threatType: string) => {
    switch (threatType?.toLowerCase()) {
      case 'phishing': return 'text-danger'
      case 'malware': return 'text-critical'
      case 'suspicious': return 'text-warning'
      case 'spam': return 'text-warning'
      case 'safe': return 'text-success'
      default: return 'text-textSecondary'
    }
  }

  const getThreatBg = (threatType: string) => {
    switch (threatType?.toLowerCase()) {
      case 'phishing': return 'bg-danger/20 border-danger'
      case 'malware': return 'bg-critical/20 border-critical'
      case 'suspicious': return 'bg-warning/20 border-warning'
      case 'spam': return 'bg-warning/20 border-warning'
      case 'safe': return 'bg-success/20 border-success'
      default: return 'bg-secondary border-border'
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-critical'
    if (score >= 60) return 'text-danger'
    if (score >= 40) return 'text-warning'
    return 'text-success'
  }

  const getRiskBg = (score: number) => {
    if (score >= 80) return 'bg-critical'
    if (score >= 60) return 'bg-danger'
    if (score >= 40) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">URL Scanner</h1>
          <p className="text-textSecondary">ML-powered URL threat detection and analysis</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Enter URL to scan (e.g., https://example.com)"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary transition-colors"
                disabled={scanning}
              />
            </div>
            <button
              onClick={handleScan}
              disabled={scanning || !url.trim()}
              className="px-6 py-3 bg-primary hover:bg-primary/80 disabled:bg-primary/50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              {scanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan URL
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className={`bg-card border-2 rounded-xl p-6 ${getThreatBg(result.threat_type)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {result.threat_type?.toLowerCase() === 'safe' ? (
                    <div className="p-3 bg-success/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                  ) : (
                    <div className="p-3 bg-danger/20 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-danger" />
                    </div>
                  )}
                  <div>
                    <h2 className={`text-2xl font-bold ${getThreatColor(result.threat_type)}`}>
                      {result.threat_type?.toUpperCase()}
                    </h2>
                    <p className="text-textSecondary text-sm">Threat Classification</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getRiskColor(result.risk_score)}`}>
                    {result.risk_score}
                  </div>
                  <div className="text-sm text-textSecondary">Risk Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm text-textSecondary">Confidence</span>
                  </div>
                  <div className="text-2xl font-bold text-textPrimary">
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm text-textSecondary">URL Length</span>
                  </div>
                  <div className="text-2xl font-bold text-textPrimary">
                    {result.features?.url_length || result.url?.length || 0}
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm text-textSecondary">Scan Time</span>
                  </div>
                  <div className="text-2xl font-bold text-textPrimary">
                    {new Date(result.scanned_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-textPrimary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  URL Features
                </h3>
                <div className="space-y-3">
                  {result.features && Object.entries(result.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-textSecondary capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`font-semibold ${
                        typeof value === 'boolean' 
                          ? value ? 'text-success' : 'text-danger'
                          : 'text-textPrimary'
                      }`}>
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-textPrimary mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Recommendations
                </h3>
                <div className="space-y-3">
                  {result.recommendations && result.recommendations.length > 0 ? (
                    result.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-textPrimary text-sm">{rec}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-textPrimary text-sm">
                          {result.threat_type?.toLowerCase() === 'safe' 
                            ? 'URL appears safe based on analysis'
                            : 'Do not visit this URL or enter credentials'}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-textPrimary text-sm">
                          {result.threat_type?.toLowerCase() === 'safe'
                            ? 'Always verify sender authenticity'
                            : 'Report to security team immediately'}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-textPrimary text-sm">
                          {result.threat_type?.toLowerCase() === 'safe'
                            ? 'Check for HTTPS and valid certificates'
                            : 'Block domain at firewall level'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-textPrimary mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-textSecondary">Overall Risk</span>
                    <span className={`text-sm font-semibold ${getRiskColor(result.risk_score)}`}>
                      {result.risk_score}/100
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getRiskBg(result.risk_score)} transition-all duration-500`}
                      style={{ width: `${result.risk_score}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-textSecondary mb-1">Scanned URL</div>
                    <div className="text-textPrimary font-mono text-xs break-all">
                      {result.url || url}
                    </div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="text-sm text-textSecondary mb-1">Scan ID</div>
                    <div className="text-textPrimary font-mono text-sm">
                      #{result.scan_id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && !scanning && (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Ready to Scan</h3>
            <p className="text-textSecondary">
              Enter a URL above to analyze it for potential threats using our ML-powered detection system
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
