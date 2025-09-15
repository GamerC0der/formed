"use client"

import { useState } from "react"
import { Palette } from "lucide-react"

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  disabled?: boolean
  className?: string
}

const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
  "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB", "#A52A2A",
  "#808080", "#000080", "#008000", "#800000", "#FFD700", "#C0C0C0"
]

export function ColorPicker({ value = "#000000", onChange, disabled = false, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState(value)

  const handleColorSelect = (color: string) => {
    setCustomColor(color)
    onChange?.(color)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded border border-gray-500"
            style={{ backgroundColor: customColor }}
          />
          <span className="text-sm">{customColor}</span>
        </div>
        <Palette size={16} className="text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md p-3 z-50 shadow-lg">
          <div className="grid grid-cols-6 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className="w-8 h-8 rounded border border-gray-500 hover:border-white transition-colors"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="border-t border-gray-700 pt-3">
            <label className="block text-xs text-gray-300 mb-2">Custom Color</label>
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-8 rounded border border-gray-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  )
}
