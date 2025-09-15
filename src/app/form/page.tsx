"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Confetti } from "@/components/ui/confetti"
import { MorphingSquare } from "@/components/molecule-ui/morphing-square"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Rating } from "@/components/ui/rating"
import { ColorPicker } from "@/components/ui/color-picker"
import { LocationPicker } from "@/components/ui/location-picker"
import { ChevronDown } from "lucide-react"

export default function FormPage() {
  const [formData, setFormData] = useState<{ formName: string; formComponents: Array<{ id: string; type: string; label: string; placeholder?: string; required?: boolean; options?: string[]; min?: number; max?: number; value?: number | string; allowedDomains?: string[]; comment?: string; disallowDecimals?: boolean; allowHalf?: boolean; src?: string; width?: string; height?: string; colorValue?: string; locationValue?: { lat: number; lng: number; address?: string } }> } | null>(null)
  const [showConfetti] = useState(false)
  const [formKey] = useState(0)
  const [errors] = useState<{[key: string]: boolean}>({})
  const [showLoading] = useState(false)
  const [selectedValues, setSelectedValues] = useState<{[key: string]: string}>({})
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const formCookie = cookies.find(c => c.trim().startsWith('formData='))
    if (formCookie) {
      const data = JSON.parse(decodeURIComponent(formCookie.split('=')[1]))
      setFormData(data)
    }
  }, [])

  if (!formData) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <div className="bg-blue-600 text-white text-center py-3 w-full">
        This is a preview form.
      </div>
      <div className="max-w-2xl mx-auto p-8 pb-16">
        <h1 className="text-3xl font-bold mb-8">{formData.formName || 'Form'}</h1>
        <div key={formKey} className="space-y-6">
          {formData.formComponents.map((component) => (
            <div key={component.id} className="space-y-2">
              {component.type !== 'divider' && <label className="block text-white font-medium">{component.label}</label>}
              {component.type === 'text' && <div className="space-y-2"><input type="text" placeholder={component.placeholder || "Enter text..."} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white" />{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}</div>}
              {component.type === 'email' && <div className="space-y-2"><input type="email" placeholder={component.placeholder || "Enter email..."} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white" />{component.allowedDomains && component.allowedDomains.length > 0 && <div className="text-xs text-gray-400">Allowed domains: {component.allowedDomains.join(", ")}</div>}</div>}
              {component.type === 'number' && <div className="space-y-2"><input type="number" placeholder={component.placeholder || "Enter number..."} step={component.disallowDecimals ? "1" : "any"} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white" />{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}{component.disallowDecimals && <div className={`text-xs ${errors[component.id] ? 'text-red-400' : 'text-gray-400'}`}>Only whole numbers allowed</div>}</div>}
              {component.type === 'textarea' && <div className="space-y-2"><textarea placeholder={component.placeholder || "Enter text..."} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white h-20 resize-none" />{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}</div>}
              {component.type === 'select' && <DropdownMenu><DropdownMenuTrigger className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white flex items-center justify-between"><span>{selectedValues[component.id] || "Select an option..."}</span><ChevronDown size={16} /></DropdownMenuTrigger><DropdownMenuContent className="w-full bg-gray-800 border-gray-700" align="start"><DropdownMenuItem className="text-white" onClick={() => setSelectedValues(prev => ({...prev, [component.id]: "Select an option..."}))}>Select an option...</DropdownMenuItem>{component.options?.map((option: string, i: number) => <DropdownMenuItem key={i} className="text-white" onClick={() => setSelectedValues(prev => ({...prev, [component.id]: option}))}>{option}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
              {component.type === 'checkbox' && <div className="space-y-3">{component.options?.map((option: string, i: number) => <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"><Checkbox /><span className="text-gray-300 text-sm">{option}</span></div>)}</div>}
              {component.type === 'radio' && <div className="space-y-2">{component.options?.map((option: string, i: number) => <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-800/30 transition-all duration-200"><input type="radio" name={component.id} className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" /><span className="text-gray-200 text-sm font-medium">{option}</span></div>)}</div>}
              {component.type === 'slider' && <div className="space-y-2"><input type="range" min={component.min || 0} max={component.max || 100} defaultValue={component.value || 50} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider" /><div className="flex justify-between text-sm text-gray-400"><span>{component.min || 0}</span><span>{component.max || 100}</span></div></div>}
              {component.type === 'divider' && <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-600"></div><div className="flex-1 h-px bg-gray-600"></div></div>}
              {component.type === 'date' && <div className="space-y-2"><input type="date" className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white" />{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}</div>}
              {component.type === 'time' && <div className="space-y-2"><input type="time" className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white" />{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}</div>}
              {component.type === 'url' && <div className="space-y-2"><input type="url" placeholder={component.placeholder || "https://example.com"} onFocus={(e) => { if (!e.target.value) e.target.value = 'https://www.' }} className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white" />{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}</div>}
              {component.type === 'rating' && <div className="space-y-2"><Rating value={0} allowHalf={component.allowHalf} disabled /><div className="text-xs text-gray-400 italic">{component.comment}</div></div>}
              {component.type === 'iframe' && <div className="space-y-2">{component.src ? <div className="relative"><iframe src={component.src} width={component.width || "100%"} height={component.height || "400px"} className="w-full border border-gray-700 rounded-md shadow-sm" title={component.label} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" onLoad={(e) => { const iframe = e.target as HTMLIFrameElement; const errorDiv = iframe.nextElementSibling as HTMLElement; if (errorDiv) errorDiv.style.display = 'none'; iframe.style.display = 'block' }} /><div className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-md shadow-sm items-center justify-center flex"><div className="text-center"><p className="text-red-400 text-sm font-medium">Refused to connect</p><p className="text-gray-500 text-xs mt-1">The website blocked this iframe</p></div></div></div> : <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors"><p className="text-gray-400 text-sm">Iframe Preview</p><p className="text-gray-500 text-xs mt-1">No URL specified</p></div>}{component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}</div>}
              {component.type === 'color' && <div className="space-y-2"><ColorPicker value={component.colorValue || "#000000"} onChange={() => {}} disabled /><div className="text-xs text-gray-400 italic">{component.comment}</div></div>}
              {component.type === 'location' && <div className="space-y-2"><LocationPicker value={component.locationValue} onChange={() => {}} disabled /><div className="text-xs text-gray-400 italic">{component.comment}</div></div>}
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowPreviewModal(true)}
          disabled
          className="w-full bg-gray-600 text-gray-400 px-6 py-3 rounded-lg font-medium cursor-not-allowed mt-8"
        >
          Submit (Preview Mode)
        </button>
        {showLoading && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"><MorphingSquare className="bg-blue-600" message="Submitting..." /></div>}
        {showConfetti && <Confetti className="fixed inset-0 w-full h-full pointer-events-none z-50" options={{ origin: { x: 0.5, y: 1 }, particleCount: 200, spread: 120, startVelocity: 60 }} />}
        
        {showPreviewModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-white text-lg font-semibold mb-4">Preview Mode</h3>
              <p className="text-gray-300 mb-6">
                This is a preview of your form. To make it submittable and collect responses, you need to publish it first.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    window.close()
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go to Builder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
