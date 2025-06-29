
import React from 'react'

export function DataVizLogo({ className = "h-8 w-auto" }) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        {/* Background rounded square - professional black design */}
        <div className="w-10 h-10 rounded-lg bg-foreground border border-border flex items-center justify-center shadow-sm">
          {/* Data visualization icon - clean bar chart style */}
          <div className="w-6 h-6 flex items-end justify-center gap-0.5">
            <div className="w-1 h-2 bg-background rounded-sm"></div>
            <div className="w-1 h-4 bg-background/80 rounded-sm"></div>
            <div className="w-1 h-3 bg-background rounded-sm"></div>
            <div className="w-1 h-5 bg-background/80 rounded-sm"></div>
            <div className="w-1 h-2 bg-background rounded-sm"></div>
          </div>
        </div>
        
        {/* Analytics trend arrow - minimalist styling */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-foreground border border-border rounded-full flex items-center justify-center shadow-sm">
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-background"
          >
            <path 
              d="M7 17L17 7M17 7H7M17 7V17" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      {/* Brand Text - Clean Professional Typography */}
      <div className="ml-3">
        <span className="text-xl font-bold">
          Data<span className="font-extrabold">Viz</span>
        </span>
        <div className="text-xs text-muted-foreground font-medium -mt-1">
          Professional Suite
        </div>
      </div>
    </div>
  )
}
