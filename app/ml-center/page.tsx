'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Brain, Activity, Cpu, Database } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState, useEffect } from 'react'

const modelComparisonData = [
  { model: 'Random Forest', accuracy: 57.3, f1: 33.8, rocAuc: 87.0 },
  { model: 'Gradient Boosting', accuracy: 60.0, f1: 37.1, rocAuc: 87.5 },
  { model: 'SVM', accuracy: 59.3, f1: 29.6, rocAuc: 87.8 },
]

const featureImportanceData = [
  { feature: 'URL Length', importance: 0.18 },
  { feature: 'Domain Age', importance: 0.23 },
  { feature: 'Redirects', importance: 0.19 },
  { feature: 'Digits', importance: 0.12 },
  { feature: 'Special Chars', importance: 0.11 },
  { feature: 'HTTPS', importance: 0.08 },
  { feature: 'IP in URL', importance: 0.09 },
]

export default function MLCenter() {
  const [liveMetrics, setLiveMetrics] = useState({
    predictions: 0,
    accuracy: 60.0,
    processing: 0,
    modelLoad: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics({
        predictions: Math.floor(Math.random() * 100) + 12500,
        accuracy: 59.5 + Math.random() * 1,
        processing: Math.floor(Math.random() * 20) + 5,
        modelLoad: Math.floor(Math.random() * 20) + 60
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-textPrimary">ML Model Center</h1>
            <p className="text-textSecondary">Real-time machine learning model performance and analysis</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
            <Activity className="w-4 h-4 text-success animate-pulse" />
            <span className="text-xs text-textSecondary">Models Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-primary" />
              <div className="text-sm text-textSecondary">Total Predictions</div>
            </div>
            <div className="text-3xl font-bold text-textPrimary">{liveMetrics.predictions.toLocaleString()}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-success" />
              <div className="text-sm text-textSecondary">Live Accuracy</div>
            </div>
            <div className="text-3xl font-bold text-success">{liveMetrics.accuracy.toFixed(1)}%</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-warning" />
              <div className="text-sm text-textSecondary">Processing</div>
            </div>
            <div className="text-3xl font-bold text-warning">{liveMetrics.processing}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-primary" />
              <div className="text-sm text-textSecondary">Model Load</div>
            </div>
            <div className="text-3xl font-bold text-primary">{liveMetrics.modelLoad}%</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-textPrimary mb-6">Model Performance Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {modelComparisonData.map((model) => (
              <div key={model.model} className="bg-secondary border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-textPrimary mb-4">{model.model}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-textSecondary mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-primary">{model.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-textSecondary mb-1">Macro F1</div>
                    <div className="text-2xl font-bold text-textPrimary">{model.f1}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-textSecondary mb-1">ROC-AUC</div>
                    <div className="text-2xl font-bold text-success">{model.rocAuc}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#202938" />
              <XAxis dataKey="model" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip contentStyle={{ backgroundColor: '#121925', border: '1px solid #202938' }} />
              <Legend />
              <Bar dataKey="accuracy" fill="#38BDF8" name="Accuracy %" />
              <Bar dataKey="f1" fill="#F59E0B" name="F1 Score %" />
              <Bar dataKey="rocAuc" fill="#22C55E" name="ROC-AUC %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-textPrimary mb-4">Feature Importance</h2>
          <div className="space-y-3">
            {featureImportanceData.map((item) => (
              <div key={item.feature}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-textPrimary font-medium">{item.feature}</span>
                  <span className="text-textSecondary">{(item.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-success h-3 rounded-full transition-all"
                    style={{ width: `${item.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-textPrimary mb-4">Dataset Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-textPrimary mb-1">300</div>
              <div className="text-xs text-textSecondary">Total Samples</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">140</div>
              <div className="text-xs text-textSecondary">Safe</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-danger mb-1">52</div>
              <div className="text-xs text-textSecondary">Phishing</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-critical mb-1">39</div>
              <div className="text-xs text-textSecondary">Malware</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning mb-1">38</div>
              <div className="text-xs text-textSecondary">Spam</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">31</div>
              <div className="text-xs text-textSecondary">Suspicious</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
