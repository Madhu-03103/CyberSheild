export type ThreatType = 'safe' | 'phishing' | 'malware' | 'spam' | 'suspicious'

export interface Threat {
  id: string
  indicator: string
  type: ThreatType
  severity: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  detected: Date
  status: 'investigating' | 'confirmed' | 'resolved'
}

export interface ScanResult {
  id: string
  input: string
  scanType: 'url' | 'email'
  prediction: ThreatType
  riskScore: number
  confidence: number
  features: Record<string, any>
  featureImportance: Array<{ feature: string; importance: number }>
  timestamp: Date
}

export interface Investigation {
  id: string
  threatId: string
  status: 'investigating' | 'confirmed' | 'contained' | 'resolved'
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface WatchlistItem {
  id: string
  indicator: string
  type: 'url' | 'domain' | 'email' | 'indicator'
  createdAt: Date
}

export interface Incident {
  id: string
  threatId: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'detected' | 'investigating' | 'confirmed' | 'contained' | 'resolved'
  evidenceCount: number
  createdAt: Date
  updatedAt: Date
}

class Store {
  private threats: Threat[] = []
  private scanHistory: ScanResult[] = []
  private investigations: Investigation[] = []
  private watchlist: WatchlistItem[] = []
  private incidents: Incident[] = []

  // Threats
  addThreat(threat: Threat) {
    this.threats.push(threat)
  }

  getThreats(): Threat[] {
    return this.threats
  }

  getThreatById(id: string): Threat | undefined {
    return this.threats.find(t => t.id === id)
  }

  // Scan History
  addScan(scan: ScanResult) {
    this.scanHistory.push(scan)
  }

  getScans(): ScanResult[] {
    return this.scanHistory
  }

  getScanById(id: string): ScanResult | undefined {
    return this.scanHistory.find(s => s.id === id)
  }

  // Investigations
  addInvestigation(investigation: Investigation) {
    this.investigations.push(investigation)
  }

  getInvestigations(): Investigation[] {
    return this.investigations
  }

  updateInvestigation(id: string, updates: Partial<Investigation>) {
    const index = this.investigations.findIndex(i => i.id === id)
    if (index !== -1) {
      this.investigations[index] = { ...this.investigations[index], ...updates }
    }
  }

  // Watchlist
  addToWatchlist(item: WatchlistItem) {
    this.watchlist.push(item)
  }

  getWatchlist(): WatchlistItem[] {
    return this.watchlist
  }

  removeFromWatchlist(id: string) {
    this.watchlist = this.watchlist.filter(item => item.id !== id)
  }

  // Incidents
  addIncident(incident: Incident) {
    this.incidents.push(incident)
  }

  getIncidents(): Incident[] {
    return this.incidents
  }

  updateIncident(id: string, updates: Partial<Incident>) {
    const index = this.incidents.findIndex(i => i.id === id)
    if (index !== -1) {
      this.incidents[index] = { ...this.incidents[index], ...updates }
    }
  }
}

export const store = new Store()
