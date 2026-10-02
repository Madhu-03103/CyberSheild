'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Bot, Send } from 'lucide-react'
import { useState } from 'react'

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am CyberShield Copilot, your AI security assistant. How can I help you analyze threats today?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])

    setTimeout(() => {
      const response = { 
        role: 'assistant', 
        content: 'I can help you analyze threats, explain ML predictions, and provide security insights. Please note that this is a demo interface. In production, I would connect to the actual threat analysis engine and provide detailed security intelligence based on your investigation data.' 
      }
      setMessages(prev => [...prev, response])
    }, 500)

    setInput('')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Security Copilot</h1>
            <p className="text-textSecondary">AI-powered security assistant</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary text-textPrimary border border-border'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about threats, investigations, or security insights..."
                className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
            <div className="text-xs text-textSecondary mb-2">Suggested Questions:</div>
            <div className="flex flex-wrap gap-2">
              {[
                'Why was this URL classified as phishing?',
                'What evidence supports this threat?',
                'Summarize recent incidents',
                'Analyze threat patterns'
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 bg-card hover:bg-border text-xs text-textPrimary rounded transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
