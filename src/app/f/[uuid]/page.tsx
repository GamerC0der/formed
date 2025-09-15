"use client"

import { useState, useEffect, use } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Confetti } from "@/components/ui/confetti"
import { MorphingSquare } from "@/components/molecule-ui/morphing-square"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Rating } from "@/components/ui/rating"
import { ColorPicker } from "@/components/ui/color-picker"
import { LocationPicker } from "@/components/ui/location-picker"
import { ChevronDown } from "lucide-react"

interface FormComponent {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
  value?: number | string
  allowedDomains?: string[]
  comment?: string
  disallowDecimals?: boolean
  allowHalf?: boolean
  src?: string
  width?: string
  height?: string
  colorValue?: string
  locationValue?: { lat: number; lng: number; address?: string }
}

interface FormData {
  formName: string
  formComponents: FormComponent[]
}

export default function PublishedForm({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showLoading, setShowLoading] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string | number | string[] | { lat: number; lng: number; address?: string }>>({})

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${uuid}`)
        if (!response.ok) throw new Error('Failed to fetch form')
        
        const data = await response.json()
        setFormData(data.content)
      } catch (error) {
        console.error('Error fetching form:', error)
      }
    }
    
    if (uuid) fetchForm()
  }, [uuid])

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {}
    let hasErrors = false
    
    formData?.formComponents.forEach((comp) => {
      if (comp.type === 'number' && comp.disallowDecimals) {
        const input = document.querySelector(`input[type="number"]`) as HTMLInputElement
        if (input?.value && !Number.isInteger(parseFloat(input.value))) {
          newErrors[comp.id] = true
          hasErrors = true
        }
      }
    })
    
    setErrors(newErrors)
    if (hasErrors) return
    
    setShowLoading(true)
    try {
      const response = await fetch(`/api/forms/${uuid}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues)
      })
      
      if (response.ok) {
        setTimeout(() => {
          setShowLoading(false)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
          setFormKey(prev => prev + 1)
          setFormValues({})
        }, 1000)
      } else {
        const error = await response.json()
        alert(error.error || 'Submission failed')
        setShowLoading(false)
      }
    } catch {
      alert('Submission failed')
      setShowLoading(false)
    }
  }

  if (!formData) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-800 text-white text-center py-3 w-full">
        Published Form
      </div>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">{formData.formName || 'Form'}</h1>
        <div key={formKey} className="space-y-6">
          {formData.formComponents.map((component) => {
            const inputClass = "w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
            const updateValue = (value: string | number | string[] | { lat: number; lng: number; address?: string }) => setFormValues(prev => ({ ...prev, [component.id]: value }))
            const getStringValue = () => {
              const val = formValues[component.id]
              return typeof val === 'string' ? val : ''
            }
            const getNumberValue = () => {
              const val = formValues[component.id]
              return typeof val === 'number' ? val : 0
            }
            const getArrayValue = () => {
              const val = formValues[component.id]
              return Array.isArray(val) ? val : []
            }
            const getObjectValue = () => {
              const val = formValues[component.id]
              return typeof val === 'object' && val !== null && !Array.isArray(val) ? val : undefined
            }
            
            return (
              <div key={component.id} className="space-y-2">
                {component.type !== 'divider' && <label className="block text-white font-medium">{component.label}</label>}
                
                {component.type === 'text' && (
                  <div className="space-y-2">
                    <input type="text" placeholder={component.placeholder || "Enter text..."} value={getStringValue()} onChange={(e) => updateValue(e.target.value)} className={inputClass} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'email' && (
                  <div className="space-y-2">
                    <input type="email" placeholder={component.placeholder || "Enter email..."} value={getStringValue()} onChange={(e) => updateValue(e.target.value)} className={inputClass} />
                    {component.allowedDomains && component.allowedDomains.length > 0 && <div className="text-xs text-gray-400">Allowed domains: {component.allowedDomains.join(", ")}</div>}
                  </div>
                )}
                
                {component.type === 'number' && (
                  <div className="space-y-2">
                    <input type="number" placeholder={component.placeholder || "Enter number..."} step={component.disallowDecimals ? "1" : "any"} value={getStringValue()} onChange={(e) => updateValue(e.target.value)} className={inputClass} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                    {component.disallowDecimals && <div className={`text-xs ${errors[component.id] ? 'text-red-400' : 'text-gray-400'}`}>Only whole numbers allowed</div>}
                  </div>
                )}
                
                {component.type === 'textarea' && (
                  <div className="space-y-2">
                    <textarea placeholder={component.placeholder || "Enter text..."} value={getStringValue()} onChange={(e) => updateValue(e.target.value)} className={`${inputClass} h-20 resize-none`} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'select' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className={`${inputClass} flex items-center justify-between`}>
                      <span>{getStringValue() || "Select an option..."}</span>
                      <ChevronDown size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full bg-gray-800 border-gray-700" align="start">
                      <DropdownMenuItem className="text-white" onClick={() => updateValue("")}>Select an option...</DropdownMenuItem>
                      {component.options?.map((option: string, i: number) => (
                        <DropdownMenuItem key={i} className="text-white" onClick={() => updateValue(option)}>{option}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                {component.type === 'checkbox' && (
                  <div className="space-y-3">
                    {component.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <Checkbox 
                          checked={getArrayValue().includes(option)} 
                          onCheckedChange={(checked) => {
                            const currentValues = getArrayValue()
                            const newValues = checked 
                              ? [...currentValues, option]
                              : currentValues.filter((v: string) => v !== option)
                            updateValue(newValues)
                          }} 
                        />
                        <span className="text-gray-300 text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {component.type === 'radio' && (
                  <div className="space-y-2">
                    {component.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-800/30 transition-all duration-200">
                        <input 
                          type="radio" 
                          name={component.id} 
                          checked={getStringValue() === option} 
                          onChange={() => updateValue(option)} 
                          className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" 
                        />
                        <span className="text-gray-200 text-sm font-medium">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {component.type === 'slider' && (
                  <div className="space-y-2">
                    <input type="range" min={component.min || 0} max={component.max || 100} value={getStringValue() || component.value || 50} onChange={(e) => updateValue(e.target.value)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider" />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{component.min || 0}</span>
                      <span>{component.max || 100}</span>
                    </div>
                  </div>
                )}
                
                {component.type === 'divider' && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-600"></div>
                    <div className="flex-1 h-px bg-gray-600"></div>
                  </div>
                )}
                
                {component.type === 'date' && (
                  <div className="space-y-2">
                    <input type="date" value={getStringValue()} onChange={(e) => updateValue(e.target.value)} className={inputClass} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'time' && (
                  <div className="space-y-2">
                    <input type="time" value={getStringValue()} onChange={(e) => updateValue(e.target.value)} className={inputClass} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'url' && (
                  <div className="space-y-2">
                    <input 
                      type="url" 
                      placeholder={component.placeholder || "https://example.com"} 
                      value={getStringValue()} 
                      onFocus={(e) => { 
                        if (!e.target.value) { 
                          e.target.value = 'https://www.'
                          updateValue('https://www.') 
                        } 
                      }} 
                      onChange={(e) => updateValue(e.target.value)} 
                      className={inputClass} 
                    />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'rating' && (
                  <div className="space-y-2">
                    <Rating value={getNumberValue()} allowHalf={component.allowHalf} onChange={updateValue} size="lg" />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'iframe' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <iframe 
                        src={component.src} 
                        width={component.width || "100%"} 
                        height={component.height || "400px"} 
                        className="w-full border border-gray-700 rounded-md shadow-sm" 
                        title={component.label} 
                        loading="lazy" 
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups" 
                        onLoad={(e) => { 
                          const iframe = e.target as HTMLIFrameElement
                          const errorDiv = iframe.nextElementSibling as HTMLElement
                          if (errorDiv) errorDiv.style.display = 'none'
                          iframe.style.display = 'block' 
                        }} 
                      />
                      <div className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-md shadow-sm items-center justify-center flex">
                        <div className="text-center">
                          <p className="text-red-400 text-sm font-medium">Refused to connect</p>
                          <p className="text-gray-500 text-xs mt-1">The website blocked this iframe</p>
                        </div>
                      </div>
                    </div>
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'color' && (
                  <div className="space-y-2">
                    <ColorPicker value={getStringValue() || component.colorValue || "#000000"} onChange={updateValue} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
                
                {component.type === 'location' && (
                  <div className="space-y-2">
                    <LocationPicker value={getObjectValue() || component.locationValue} onChange={updateValue} />
                    {component.comment && <div className="text-xs text-gray-400 italic">{component.comment}</div>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-8"
        >
          Submit
        </button>
        {showLoading && <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"><MorphingSquare className="bg-blue-600" message="Submitting..." /></div>}
        {showConfetti && <Confetti className="fixed inset-0 w-full h-full pointer-events-none z-50" options={{ origin: { x: 0.5, y: 1 }, particleCount: 200, spread: 120, startVelocity: 60 }} />}
      </div>
    </div>
  )
}
