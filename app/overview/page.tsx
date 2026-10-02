'use client'

import DashboardLayout from '@/components/DashboardLayout'
import ThreatMap from '@/components/ThreatMap'
import { Activity, Shield, AlertTriangle, CheckCircle, Search, Mail, TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useEffect, useState } from 'react'
import { getDashboardSummary, getLiveTimeline, createWebSocket } from '@/lib/api'
import type { DashboardSummary, ThreatEvent } from '@/lib/api'

const threatDistributionData = [
  { name: 'Safe', value: 140, color: '#22C55E' },
  { name: 'Phishing', value: 52, color: '#EF4444' },
  { name: 'Malware', value: 39, color: '#DC2626' },
  { name: 'Spam', value: 38, color: '#F59E0B' },
  { name: 'Suspicious', value: 31, color: '#38BDF8' },
]

const threatActivityData = [
  { time: '00:00', threats: 12, suspicious: 8, safe: 45 },
  { time: '04:00', threats: 8, suspicious: 5, safe: 38 },
  { time: '08:00', threats: 18, suspicious: 12, safe: 52 },
  { time: '12:00', threats: 24, suspicious: 16, safe: 68 },
  { time: '16:00', threats: 32, suspicious: 22, safe: 78 },
  { time: '20:00', threats: 21, suspicious: 14, safe: 61 },
]

export default function Overview() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [liveFeed, setLiveFeed] = useState<ThreatEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, timelineData] = await Promise.all([
          getDashboardSummary(),
          getLiveTimeline(10)
        ])
        setSummary(summaryData)
        setLiveFeed(timelineData.events)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Unable to connect to backend. Using demo mode.')
        // Use fallback demo data
        setSummary({
          total_events_today: 1284,
          active_threats: 324,
          critical_alerts: 84,
          open_incidents: 23,
          resolved_incidents: 12,
          threats_last_hour: 45,
          safe_count: 960,
          threat_count: 324,
          detection_rate: 94.7,
          avg_risk_score: 76.5,
          avg_confidence: 89.3,
          url_scans_count: 722,
          email_scans_count: 562,
          system_status: {
            frontend: 'ONLINE',
            backend: 'OFFLINE',
            database: 'DISCONNECTED',
            ml_service: 'OFFLINE',
            websocket: 'UNAVAILABLE'
          },
          timestamp: new Date().toISOString()
        })
      }
    }

    fetchData()
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // WebSocket connection for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null

    try {
      ws = createWebSocket((data) => {
        if (data.type === 'connection') {
          setIsConnected(true)
          console.log('WebSocket connected')
        } else if (data.type === 'threat_event') {
          // Add new threat to live feed
          setLiveFeed(prev => [data.data, ...prev.slice(0, 9)])
        } else if (data.type === 'dashboard_update') {
          // Update dashboard summary
          setSummary(data.data)
        }
      })
    } catch (err) {
      console.error('WebSocket connection failed:', err)
      setIsConnected(false)
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-critical/20 text-critical border-critical'
      case 'high': return 'bg-danger/20 text-danger border-danger'
      case 'medium': return 'bg-warning/20 text-warning border-warning'
      case 'low': return 'bg-info/20 text-info border-info'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">Security Operations Console</h1>
            <p className="text-textSecondary">Real-time threat detection and intelligence</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isConnected ? 'bg-success/20' : 'bg-gray-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-gray-500'}`} />
              <span className={`text-xs font-medium ${isConnected ? 'text-success' : 'text-gray-400'}`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-warning/10 border border-warning/30 text-warning px-4 py-3 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-1">
              {summary ? summary.total_events_today.toLocaleString() : '...'}
            </div>
            <div className="text-sm text-textSecondary">Total Events Today</div>
            <div className="text-xs text-success mt-2">Real-time monitoring</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-danger/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-danger/10 rounded-lg group-hover:bg-danger/20 transition-all">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
              <TrendingUp className="w-5 h-5 text-danger" />
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-1">
              {summary ? summary.active_threats.toLocaleString() : '...'}
            </div>
            <div className="text-sm text-textSecondary">Active Threats</div>
            <div className="text-xs text-danger mt-2">
              {summary ? `${summary.threats_last_hour} in last hour` : '...'}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-critical/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-critical/10 rounded-lg group-hover:bg-critical/20 transition-all">
                <Shield className="w-6 h-6 text-critical" />
              </div>
              <AlertTriangle className="w-5 h-5 text-critical" />
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-1">
              {summary ? summary.critical_alerts.toLocaleString() : '...'}
            </div>
            <div className="text-sm text-textSecondary">Critical Alerts</div>
            <div className="text-xs text-critical mt-2">Requires attention</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-success/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-success/10 rounded-lg group-hover:bg-success/20 transition-all">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-1">
              {summary ? `${summary.detection_rate.toFixed(1)}%` : '...'}
            </div>
            <div className="text-sm text-textSecondary">Detection Rate</div>
            <div className="text-xs text-success mt-2">
              {summary ? `${summary.avg_confidence.toFixed(1)}% confidence` : '...'}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-1">
              {summary ? summary.url_scans_count.toLocaleString() : '...'}
            </div>
            <div className="text-sm text-textSecondary">URLs Scanned</div>
            <div className="text-xs text-primary mt-2">ML-powered analysis</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-textPrimary mb-1">
              {summary ? summary.email_scans_count.toLocaleString() : '...'}
            </div>
            <div className="text-sm text-textSecondary">Emails Analyzed</div>
            <div className="text-xs text-primary mt-2">Phishing detection</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">Threat Activity (24h)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={threatActivityData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#202938" />
                <XAxis dataKey="time" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#121925', border: '1px solid #202938' }} />
                <Area type="monotone" dataKey="threats" stroke="#EF4444" fill="url(#colorThreats)" />
                <Area type="monotone" dataKey="safe" stroke="#22C55E" fill="url(#colorSafe)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">Threat Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={threatDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {threatDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121925', border: '1px solid #202938' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <ThreatMap />
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-danger animate-pulse' : 'bg-gray-500'}`} />
              Live Threat Feed
            </h2>
            <span className="text-xs text-textSecondary">
              {liveFeed.length} events
            </span>
          </div>
          <div className="space-y-3">
            {liveFeed.length === 0 ? (
              <div className="text-center py-8 text-textSecondary">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Waiting for threat events...</p>
              </div>
            ) : (
              liveFeed.map(event => (
                <div key={event.id} className="flex items-center gap-4 p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-all">
                  <div className={`w-1 h-12 rounded-full ${
                    event.severity === 'critical' ? 'bg-critical' :
                    event.severity === 'high' ? 'bg-danger' :
                    event.severity === 'medium' ? 'bg-warning' : 'bg-info'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor(event.severity)}`}>
                        {event.severity?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/20 text-primary border border-primary">
                        {event.threat_type?.toUpperCase()}
                      </span>
                      <span className="text-xs text-textSecondary">{formatTimeAgo(event.timestamp)}</span>
                    </div>
                    <div className="text-sm text-textPrimary">{event.entity}</div>
                    <div className="text-xs text-textSecondary mt-1">
                      Risk Score: {event.risk_score} | Source: {event.source} | ID: {event.event_id}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
