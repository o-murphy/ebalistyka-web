import React from 'react'
import { Target } from 'lucide-react'

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Target className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">eBalistyka</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Ballistics calculator — migration to Vite + Tailwind in progress
        </p>
        <div className="flex gap-2 justify-center text-sm text-muted-foreground">
          <span className="px-2 py-1 rounded bg-secondary">Vite</span>
          <span className="px-2 py-1 rounded bg-secondary">React</span>
          <span className="px-2 py-1 rounded bg-secondary">Tailwind CSS v4</span>
          <span className="px-2 py-1 rounded bg-secondary">shadcn/ui</span>
        </div>
      </div>
    </div>
  )
}
