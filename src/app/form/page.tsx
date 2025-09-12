"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Type, Sliders, ChevronDown, Link } from "lucide-react"

export default function FormEditor() {
  const router = useRouter()
  const [formName, setFormName] = useState("")
  const [formBlocks, setFormBlocks] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTextBlock = () => {
    const newBlock = {
      id: Date.now(),
      type: "text",
      label: "Text Input",
      placeholder: "Enter text..."
    }
    setFormBlocks([...formBlocks, newBlock])
  }

  const addSliderBlock = () => {
    const newBlock = {
      id: Date.now(),
      type: "slider",
      label: "Slider",
      min: 0,
      max: 100,
      value: 50
    }
    setFormBlocks([...formBlocks, newBlock])
    setShowDropdown(false)
  }

  const addLinkBlock = () => {
    const newBlock = {
      id: Date.now(),
      type: "link",
      label: "Link",
      url: "https://example.com",
      text: "Click here"
    }
    setFormBlocks([...formBlocks, newBlock])
    setShowDropdown(false)
  }

  const handleAddBlock = (type) => {
    if (type === "text") {
      addTextBlock()
    } else if (type === "slider") {
      addSliderBlock()
    } else if (type === "link") {
      addLinkBlock()
    }
  }

  const updateBlockLabel = (blockId, newLabel) => {
    setFormBlocks(blocks => 
      blocks.map(block => 
        block.id === blockId ? { ...block, label: newLabel } : block
      )
    )
  }

  const updateSliderRange = (blockId, field, value) => {
    setFormBlocks(blocks => 
      blocks.map(block => 
        block.id === blockId ? { ...block, [field]: parseInt(value) || 0 } : block
      )
    )
  }

  const updateLinkField = (blockId, field, value) => {
    setFormBlocks(blocks => 
      blocks.map(block => 
        block.id === blockId ? { ...block, [field]: value } : block
      )
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 rounded-lg mx-4 mt-4 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-white font-semibold cursor-pointer hover:text-gray-300" onClick={() => router.push('/')}>Home</span>
          <span className="text-gray-300 hover:text-white cursor-pointer flex items-center gap-2">
            <Type size={16} />
            Create Form
          </span>
        </div>
        <button className="text-white hover:text-gray-300 flex items-center gap-2">
          <Plus size={16} />
          Login
        </button>
      </nav>

      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl mx-4">
          <div className="text-left mb-8 relative" ref={dropdownRef}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name..."
                className="bg-transparent text-white text-2xl font-bold text-left border-none outline-none placeholder-gray-500 flex-1"
              />
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
                <button
                  onClick={() => handleAddBlock("text")}
                  className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center gap-3 rounded-t-lg"
                >
                  <Type size={16} />
                  Text Input
                </button>
                 <button
                   onClick={() => handleAddBlock("slider")}
                   className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center gap-3"
                 >
                   <Sliders size={16} />
                   Slider
                 </button>
                 <button
                   onClick={() => handleAddBlock("link")}
                   className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 flex items-center gap-3 rounded-b-lg"
                 >
                   <Link size={16} />
                   Link
                 </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {formBlocks.length === 0 ? (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg">No items yet</p>
                <p className="text-gray-500 text-sm mt-2">Use the + button above to add form elements</p>
              </div>
            ) : (
              formBlocks.map((block) => (
                <div key={block.id} className="bg-gray-900 rounded-lg p-6">
                  {block.type === "text" ? (
                    <div>
                      <input
                        type="text"
                        value={block.label}
                        onChange={(e) => updateBlockLabel(block.id, e.target.value)}
                        className="block text-white font-medium mb-2 bg-transparent border-none outline-none w-full"
                        placeholder="Field label..."
                      />
                      <input
                        type="text"
                        placeholder={block.placeholder}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                      />
                    </div>
                  ) : block.type === "slider" ? (
                    <div>
                      <input
                        type="text"
                        value={block.label}
                        onChange={(e) => updateBlockLabel(block.id, e.target.value)}
                        className="block text-white font-medium mb-2 bg-transparent border-none outline-none w-full"
                        placeholder="Field label..."
                      />
                      <input
                        type="range"
                        min={block.min}
                        max={block.max}
                        defaultValue={block.value}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <input
                          type="number"
                          value={block.min}
                          onChange={(e) => updateSliderRange(block.id, 'min', e.target.value)}
                          className="bg-transparent border-none outline-none text-gray-400 w-12 text-center"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          value={block.max}
                          onChange={(e) => updateSliderRange(block.id, 'max', e.target.value)}
                          className="bg-transparent border-none outline-none text-gray-400 w-12 text-center"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={block.label}
                        onChange={(e) => updateBlockLabel(block.id, e.target.value)}
                        className="block text-white font-medium mb-2 bg-transparent border-none outline-none w-full"
                        placeholder="Field label..."
                      />
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={block.text}
                          onChange={(e) => updateLinkField(block.id, 'text', e.target.value)}
                          placeholder="Link text..."
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                        />
                        <input
                          type="url"
                          value={block.url}
                          onChange={(e) => updateLinkField(block.id, 'url', e.target.value)}
                          placeholder="https://example.com"
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
