'use client'

import DashboardLayout from '@/components/DashboardLayout'
import RealTimeChart from '@/components/RealTimeChart'
import ThreatHeatmap from '@/components/ThreatHeatmap'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState, useEffect } from 'react'

const threatTrendData = [
  { date: 'Jan', phishing: 45, malware: 32, spam: 28, suspicious: 25 },
  { date: 'Feb', phishing: 52, malware: 38, spam: 35, suspicious: 29 },
  { date: 'Mar', phishing: 48, malware: 35, spam: 32, suspicious: 27 },
  { date: 'Apr', phishing: 61, malware: 42, spam: 38, suspicious: 34 },
  { date: 'May', phishing: 55, malware: 39, spam: 36, suspicious: 31 },
]

const severityData = [
  { name: 'Low', value: 120, color: '#38BDF8' },
  { name: 'Medium', value: 85, color: '#F59E0B' },
  { name: 'High', value: 52, color: '#EF4444' },
  { name: 'Critical', value: 43, color: '#DC2626' },
]

const scanTypeData = [
  { name: 'URL Scans', value: 7225 },
  { name: 'Email Scans', value: 5621 },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7days')
  const [liveMetrics, setLiveMetrics] = useState({
    currentScans: 0,
    avgRiskScore: 0,
    detectionRate: '0',
    activeThreats: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics({
        currentScans: Math.floor(Math.random() * 50) + 20,
        avgRiskScore: Math.floor(Math.random() * 30) + 40,
        detectionRate: (Math.random() * 10 + 90).toFixed(1),
        activeThreats: Math.floor(Math.random() * 15) + 5
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">Security Analytics</h1>
            <p className="text-textSecondary">Real-time threat intelligence and trends</p>
          </div>
          <div className="flex gap-2">
            {['24h', '7days', '30days'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-textSecondary hover:text-textPrimary'
                }`}
              >
                {range === '24h' ? '24 Hours' : range === '7days' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-textSecondary">Scans/Hour</div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-textPrimary">{liveMetrics.currentScans}</div>
            <div className="text-xs text-success mt-1">↑ Live</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-2">Avg Risk Score</div>
            <div className="text-3xl font-bold text-textPrimary">{liveMetrics.avgRiskScore}</div>
            <div className="text-xs text-warning mt-1">Medium</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-2">Detection Rate</div>
            <div className="text-3xl font-bold text-textPrimary">{liveMetrics.detectionRate}%</div>
            <div className="text-xs text-success mt-1">↑ Excellent</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm text-textSecondary mb-2">Active Threats</div>
            <div className="text-3xl font-bold text-danger">{liveMetrics.activeThreats}</div>
            <div className="text-xs text-danger mt-1">Monitoring</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-textPrimary">Real-Time Activity</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-textSecondary">Live</span>
              </div>
            </div>
            <RealTimeChart />
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">Severity Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#121925', border: '1px solid #202938' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <ThreatHeatmap />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">Threat Trends Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#202938" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#121925', border: '1px solid #202938' }} />
                <Legend />
                <Line type="monotone" dataKey="phishing" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="malware" stroke="#DC2626" strokeWidth={2} />
                <Line type="monotone" dataKey="spam" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="suspicious" stroke="#38BDF8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-textPrimary mb-4">Top Threat Indicators</h2>
            <div className="space-y-4">
              {['Suspicious domain age', 'Multiple redirects', 'Unusual URL length', 'Missing HTTPS', 'Authentication failures'].map((indicator, i) => (
                <div key={indicator}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-textPrimary">{indicator}</span>
                    <span className="text-textSecondary">{65 - i * 8}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${65 - i * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
