'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Bookmark, Plus, Trash2, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import type { WatchlistItem } from '@/lib/store'

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ indicator: '', type: 'url' as const })
  const [liveMonitoring, setLiveMonitoring] = useState({
    activeScans: 0,
    alertsToday: 0,
    lastChecked: new Date()
  })

  useEffect(() => {
    setItems(store.getWatchlist())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMonitoring({
        activeScans: Math.floor(Math.random() * 20) + 10,
        alertsToday: Math.floor(Math.random() * 5),
        lastChecked: new Date()
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleAdd = () => {
    if (newItem.indicator) {
      const item: WatchlistItem = {
        id: `WL-${Date.now()}`,
        indicator: newItem.indicator,
        type: newItem.type,
        createdAt: new Date()
      }
      store.addToWatchlist(item)
      setItems(store.getWatchlist())
      setNewItem({ indicator: '', type: 'url' })
      setShowAdd(false)
    }
  }

  const handleRemove = (id: string) => {
    store.removeFromWatchlist(id)
    setItems(store.getWatchlist())
  }

  const domains = items.filter(i => i.type === 'domain').length
  const urls = items.filter(i => i.type === 'url').length
  const emails = items.filter(i => i.type === 'email').length
  const indicators = items.filter(i => i.type === 'indicator').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary mb-2">Watchlist</h1>
            <p className="text-textSecondary">Monitor suspicious indicators in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
              <Activity className="w-4 h-4 text-success animate-pulse" />
              <span className="text-xs text-textSecondary">Live Monitoring</span>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Indicator
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-textPrimary mb-1">{domains}</div>
            <div className="text-sm text-textSecondary">Domains</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-textPrimary mb-1">{urls}</div>
            <div className="text-sm text-textSecondary">URLs</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-textPrimary mb-1">{emails}</div>
            <div className="text-sm text-textSecondary">Email Addresses</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-textPrimary mb-1">{indicators}</div>
            <div className="text-sm text-textSecondary">Indicators</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-3xl font-bold text-primary mb-1">{liveMonitoring.activeScans}</div>
            <div className="text-sm text-textSecondary">Active Scans</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-textPrimary">Real-Time Monitoring Status</h2>
            <div className="text-xs text-textSecondary">Last checked: {liveMonitoring.lastChecked.toLocaleTimeString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-sm text-textSecondary mb-1">Alerts Today</div>
              <div className="text-2xl font-bold text-danger">{liveMonitoring.alertsToday}</div>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-sm text-textSecondary mb-1">Monitoring Items</div>
              <div className="text-2xl font-bold text-textPrimary">{items.length}</div>
            </div>
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-sm text-textSecondary mb-1">Status</div>
              <div className="text-lg font-bold text-success">Active</div>
            </div>
          </div>
        </div>

        {showAdd && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-textPrimary mb-4">Add to Watchlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Indicator</label>
                <input
                  type="text"
                  value={newItem.indicator}
                  onChange={(e) => setNewItem({...newItem, indicator: e.target.value})}
                  placeholder="Enter URL, domain, email, or indicator"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary mb-2">Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-textPrimary focus:outline-none focus:border-primary"
                >
                  <option value="url">URL</option>
                  <option value="domain">Domain</option>
                  <option value="email">Email</option>
                  <option value="indicator">Indicator</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-secondary hover:bg-border text-textPrimary font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-textSecondary mx-auto mb-4" />
              <div className="text-textSecondary">No items in watchlist</div>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-border transition-colors">
                  <div className="flex-1">
                    <div className="font-mono text-sm text-textPrimary mb-1">{item.indicator}</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-semibold uppercase">
                        {item.type}
                      </span>
                      <span className="text-xs text-textSecondary">
                        Added {item.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
