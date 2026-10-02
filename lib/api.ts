import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export type ThreatType = 'safe' | 'phishing' | 'malware' | 'suspicious' | 'spam'
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface DashboardSummary {
  total_events_today: number
  active_threats: number
  critical_alerts: number
  open_incidents: number
  resolved_incidents: number
  threats_last_hour: number
  safe_count: number
  threat_count: number
  detection_rate: number
  avg_risk_score: number
  avg_confidence: number
  url_scans_count: number
  email_scans_count: number
  system_status: {
    frontend: string
    backend: string
    database: string
    ml_service: string
    websocket: string
  }
  timestamp: string
}

export interface ThreatEvent {
  id: number
  event_id: string
  timestamp: string
  source: string
  event_type: string
  severity: Severity
  threat_type: ThreatType
  entity: string
  risk_score: number
  status: string
}

export interface URLScanResponse {
  scan_id: number
  url: string
  threat_type: ThreatType
  risk_score: number
  confidence: number
  features: {
    url_length: number
    domain_age: number
    has_https: boolean
    has_ip_in_url: boolean
    redirect_count: number
  }
  recommendations: string[]
  scanned_at: string
}

export interface EmailScanResponse {
  scan_id: number
  sender: string
  recipient: string
  subject: string
  threat_type: ThreatType
  risk_score: number
  confidence: number
  authentication: {
    spf: boolean
    dkim: boolean
    dmarc: boolean
  }
  indicators: string[]
  recommendations: string[]
  scanned_at: string
}

export interface Incident {
  id: number
  incident_id: string
  title: string
  description: string
  status: string
  priority: string
  assignee?: string
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface AnalyticsData {
  threat_distribution: Array<{ name: string; value: number }>
  severity_breakdown: Array<{ name: string; value: number }>
  hourly_detections: Array<{ hour: string; threats: number; safe: number }>
  top_threat_sources: Array<{ source: string; count: number; percentage: number }>
  detection_accuracy: {
    true_positives: number
    false_positives: number
    accuracy: number
  }
}

// Dashboard APIs
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get('/api/dashboard/summary')
  return response.data
}

export async function getLiveTimeline(limit: number = 20): Promise<{ events: ThreatEvent[]; count: number }> {
  const response = await api.get('/api/dashboard/live-timeline', { params: { limit } })
  return response.data
}

// Threat Scanning APIs
export async function scanURL(url: string): Promise<URLScanResponse> {
  const response = await api.post('/api/threats/scan/url', { url })
  return response.data
}

export async function scanEmail(emailData: {
  sender: string
  recipient: string
  subject: string
  body: string
}): Promise<EmailScanResponse> {
  const response = await api.post('/api/threats/scan/email', emailData)
  return response.data
}

export async function getRecentScans(scan_type?: string, limit: number = 50) {
  const response = await api.get('/api/threats/scans/recent', {
    params: { scan_type, limit }
  })
  return response.data
}

// Analytics APIs
export async function getAnalytics(timeRange: string = '24h'): Promise<AnalyticsData> {
  const response = await api.get('/api/analytics/overview', { params: { time_range: timeRange } })
  return response.data
}

export async function getThreatTrends(days: number = 7) {
  const response = await api.get('/api/analytics/trends', { params: { days } })
  return response.data
}

export async function getMLMetrics() {
  const response = await api.get('/api/analytics/ml-metrics')
  return response.data
}

// Incident APIs
export async function getIncidents(status?: string) {
  const response = await api.get('/api/incidents/', { params: { status } })
  return response.data
}

export async function getIncident(incidentId: string): Promise<Incident> {
  const response = await api.get(`/api/incidents/${incidentId}`)
  return response.data
}

export async function createIncident(data: {
  title: string
  description: string
  priority: string
  assignee?: string
}) {
  const response = await api.post('/api/incidents/', data)
  return response.data
}

export async function updateIncident(incidentId: string, data: Partial<Incident>) {
  const response = await api.put(`/api/incidents/${incidentId}`, data)
  return response.data
}

export async function updateIncidentStatus(incidentId: string, status: string) {
  const response = await api.patch(`/api/incidents/${incidentId}/status`, { status })
  return response.data
}

// Authentication APIs
export async function login(email: string, password: string) {
  const formData = new FormData()
  formData.append('username', email)
  formData.append('password', password)
  
  const response = await api.post('/api/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return response.data
}

export async function register(userData: {
  email: string
  username: string
  password: string
  full_name: string
}) {
  const response = await api.post('/api/auth/register', userData)
  return response.data
}

export async function getCurrentUser(token: string) {
  const response = await api.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

// WebSocket connection
export function createWebSocket(onMessage: (data: any) => void): WebSocket {
  const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws'
  const ws = new WebSocket(wsUrl)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
    // Send ping every 30 seconds to keep connection alive
    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)
  }
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }
  
  return ws
}

// Health check
export async function healthCheck() {
  const response = await api.get('/health')
  return response.data
}

export default api
