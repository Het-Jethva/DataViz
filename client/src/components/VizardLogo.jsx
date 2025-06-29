
import React from 'react'

export function VizardLogo({ className = "h-8 w-8" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Wizard hat background */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-black border border-gray-300 flex items-center justify-center shadow-lg">
        {/* Wizard hat icon */}
        <svg 
          width="60%" 
          height="60%" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-white"
        >
          {/* Wizard hat */}
          <path 
            d="M12 2L4 20h16L12 2z" 
            fill="currentColor" 
            stroke="currentColor" 
            strokeWidth="1"
          />
          {/* Hat brim */}
          <ellipse 
            cx="12" 
            cy="20" 
            rx="8" 
            ry="1.5" 
            fill="currentColor"
          />
          {/* Stars on hat */}
          <circle cx="10" cy="12" r="0.5" fill="white" />
          <circle cx="14" cy="8" r="0.5" fill="white" />
          <circle cx="8" cy="16" r="0.5" fill="white" />
        </svg>
      </div>
      
      {/* Magic sparkle effect */}
      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-black border border-gray-300 rounded-full flex items-center justify-center">
        <svg 
          width="8" 
          height="8" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-white"
        >
          <path 
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  )
}
