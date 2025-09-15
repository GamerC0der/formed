"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface LocationPickerProps {
  value?: { lat: number; lng: number; address?: string }
  onChange?: (location: { lat: number; lng: number; address?: string }) => void
  disabled?: boolean
  className?: string
}

export function LocationPicker({ value, onChange, disabled = false, className = "" }: LocationPickerProps) {
  const [lat, setLat] = useState(value?.lat?.toString() || "")
  const [lng, setLng] = useState(value?.lng?.toString() || "")

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLat = e.target.value
    setLat(newLat)
    const latNum = parseFloat(newLat)
    const lngNum = parseFloat(lng)
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      onChange?.({ lat: latNum, lng: lngNum })
    }
  }

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLng = e.target.value
    setLng(newLng)
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(newLng)
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      onChange?.({ lat: latNum, lng: lngNum })
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-gray-200">Location Coordinates</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-300">Latitude</label>
          <div className="relative">
            <input
              type="number"
              step="any"
              value={lat}
              onChange={handleLatChange}
              placeholder="40.7128"
              disabled={disabled}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xs text-gray-500">°N</span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-300">Longitude</label>
          <div className="relative">
            <input
              type="number"
              step="any" 
              value={lng}
              onChange={handleLngChange}
              placeholder="-74.0060"
              disabled={disabled}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xs text-gray-500">°E</span>
            </div>
          </div>
        </div>
      </div>
      {(lat || lng) && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Lat: {lat || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Lng: {lng || '—'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
