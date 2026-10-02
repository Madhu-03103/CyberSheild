'use client'

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

interface DataPoint {
  time: string
  threats: number
  scans: number
}

export default function RealTimeChart() {
  const [data, setData] = useState<DataPoint[]>([
    { time: '00:00', threats: 12, scans: 65 },
    { time: '00:05', threats: 8, scans: 52 },
    { time: '00:10', threats: 15, scans: 78 },
    { time: '00:15', threats: 22, scans: 85 },
    { time: '00:20', threats: 18, scans: 72 },
    { time: '00:25', threats: 25, scans: 95 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      
      setData(prevData => {
        const newPoint: DataPoint = {
          time: timeStr,
          threats: Math.floor(Math.random() * 30) + 5,
          scans: Math.floor(Math.random() * 50) + 40
        }
        
        const updatedData = [...prevData.slice(1), newPoint]
        return updatedData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#202938" />
        <XAxis dataKey="time" stroke="#94A3B8" />
        <YAxis stroke="#94A3B8" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#121925', 
            border: '1px solid #202938',
            borderRadius: '8px'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="threats" 
          stroke="#EF4444" 
          fill="url(#colorThreats)" 
          strokeWidth={2}
          name="Threats"
        />
        <Area 
          type="monotone" 
          dataKey="scans" 
          stroke="#38BDF8" 
          fill="url(#colorScans)" 
          strokeWidth={2}
          name="Scans"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
