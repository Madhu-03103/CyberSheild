'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ThreatLocation {
  id: number
  country: string
  city: string
  threats: number
  lat: number
  lng: number
}

export default function ThreatMap() {
  const [locations, setLocations] = useState<ThreatLocation[]>([
    { id: 1, country: 'USA', city: 'New York', threats: 142, lat: 40, lng: -74 },
    { id: 2, country: 'UK', city: 'London', threats: 98, lat: 51, lng: 0 },
    { id: 3, country: 'Germany', city: 'Berlin', threats: 76, lat: 52, lng: 13 },
    { id: 4, country: 'Japan', city: 'Tokyo', threats: 134, lat: 35, lng: 139 },
    { id: 5, country: 'Australia', city: 'Sydney', threats: 54, lat: -33, lng: 151 },
    { id: 6, country: 'Brazil', city: 'São Paulo', threats: 89, lat: -23, lng: -46 },
    { id: 7, country: 'India', city: 'Mumbai', threats: 112, lat: 19, lng: 72 },
    { id: 8, country: 'Russia', city: 'Moscow', threats: 67, lat: 55, lng: 37 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(prev => 
        prev.map(loc => ({
          ...loc,
          threats: loc.threats + Math.floor(Math.random() * 5) - 2
        }))
      )
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getThreatColor = (threats: number) => {
    if (threats > 120) return 'bg-critical'
    if (threats > 80) return 'bg-danger'
    if (threats > 50) return 'bg-warning'
    return 'bg-primary'
  }

  const getThreatSize = (threats: number) => {
    if (threats > 120) return 'w-6 h-6'
    if (threats > 80) return 'w-5 h-5'
    if (threats > 50) return 'w-4 h-4'
    return 'w-3 h-3'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-textPrimary">Global Threat Distribution</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
          <span className="text-xs text-textSecondary">Live Updates</span>
        </div>
      </div>
      
      <div className="bg-secondary rounded-xl p-6 relative h-96 overflow-hidden">
        {/* Simplified world map representation */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <path d="M 100 150 L 250 120 L 350 180 L 300 250 L 150 280 Z" fill="currentColor" className="text-border" />
            <path d="M 400 100 L 600 80 L 650 150 L 580 200 L 420 180 Z" fill="currentColor" className="text-border" />
            <path d="M 700 150 L 850 130 L 900 200 L 800 280 L 720 240 Z" fill="currentColor" className="text-border" />
            <path d="M 200 300 L 400 280 L 450 380 L 300 420 L 180 380 Z" fill="currentColor" className="text-border" />
            <path d="M 700 300 L 850 320 L 870 400 L 750 420 L 680 370 Z" fill="currentColor" className="text-border" />
          </svg>
        </div>

        {/* Threat markers */}
        <div className="absolute inset-0">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="absolute group cursor-pointer"
              style={{
                left: `${((loc.lng + 180) / 360) * 100}%`,
                top: `${((90 - loc.lat) / 180) * 100}%`,
              }}
            >
              <div className={`${getThreatSize(loc.threats)} ${getThreatColor(loc.threats)} rounded-full animate-pulse`} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                  <div className="text-sm font-bold text-textPrimary">{loc.city}, {loc.country}</div>
                  <div className="text-xs text-textSecondary">{loc.threats} active threats</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {locations.slice(0, 4).map((loc) => (
          <div key={loc.id} className="bg-secondary rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold text-textPrimary">{loc.city}</div>
              <AlertTriangle className={`w-4 h-4 ${
                loc.threats > 120 ? 'text-critical' :
                loc.threats > 80 ? 'text-danger' :
                loc.threats > 50 ? 'text-warning' : 'text-primary'
              }`} />
            </div>
            <div className="text-xs text-textSecondary">{loc.threats} threats</div>
          </div>
        ))}
      </div>
    </div>
  )
}
