'use client'

import { useState, useEffect } from 'react'

const hours = ['00', '04', '08', '12', '16', '20']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ThreatHeatmap() {
  const [heatmapData, setHeatmapData] = useState<number[][]>(() => 
    days.map(() => hours.map(() => Math.floor(Math.random() * 100)))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setHeatmapData(prev => 
        prev.map((row, dayIdx) => 
          row.map((value, hourIdx) => {
            if (dayIdx === days.length - 1 && hourIdx === hours.length - 1) {
              return Math.floor(Math.random() * 100)
            }
            return value
          })
        )
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getColor = (value: number) => {
    if (value > 80) return 'bg-critical'
    if (value > 60) return 'bg-danger'
    if (value > 40) return 'bg-warning'
    if (value > 20) return 'bg-primary'
    return 'bg-secondary'
  }

  const getOpacity = (value: number) => {
    return Math.min(value / 100 + 0.2, 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center justify-between">
        <div className="text-sm text-textSecondary">Threat Activity Heatmap (Last 7 Days)</div>
        <div className="flex items-center gap-2 text-xs text-textSecondary">
          <span>Low</span>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map(v => (
              <div 
                key={v} 
                className={`w-4 h-4 rounded ${getColor(v)}`}
                style={{ opacity: getOpacity(v) }}
              />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="flex flex-col justify-around pr-2">
          {days.map(day => (
            <div key={day} className="text-xs text-textSecondary h-8 flex items-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            {hours.map(hour => (
              <div key={hour} className="text-xs text-textSecondary text-center w-12">
                {hour}
              </div>
            ))}
          </div>
          
          <div className="space-y-1">
            {heatmapData.map((row, dayIdx) => (
              <div key={dayIdx} className="flex gap-1">
                {row.map((value, hourIdx) => (
                  <div
                    key={`${dayIdx}-${hourIdx}`}
                    className={`w-12 h-8 rounded ${getColor(value)} transition-all hover:ring-2 hover:ring-primary cursor-pointer`}
                    style={{ opacity: getOpacity(value) }}
                    title={`${days[dayIdx]} ${hours[hourIdx]}:00 - ${value} threats`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
