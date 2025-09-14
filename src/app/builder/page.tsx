"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  Type, 
  Sliders, 
  Settings, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  GripVertical,
  ArrowLeft,
  Mail,
  Hash,
  FileText,
  ChevronDown as ChevronDownIcon,
  CheckSquare,
  Radio,
  AlignCenter,
  Calendar,
  Clock,
  Link,
  Star,
  Monitor,
  Sparkles,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Rating } from "@/components/ui/rating"

interface FormComponent {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "slider" | "divider" | "date" | "time" | "url" | "rating" | "iframe"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
  value?: number
  allowedDomains?: string[]
  comment?: string
  disallowDecimals?: boolean
  allowHalf?: boolean
  src?: string
  width?: string
  height?: string
}

interface DraggableComponent {
  id: string
  type: FormComponent["type"]
  label: string
  icon: any
}

const draggableComponents: DraggableComponent[] = [
  { id: "text", type: "text", label: "Text Input", icon: Type },
  { id: "email", type: "email", label: "Email", icon: Mail },
  { id: "number", type: "number", label: "Number", icon: Hash },
  { id: "textarea", type: "textarea", label: "Textarea", icon: FileText },
  { id: "select", type: "select", label: "Select", icon: ChevronDownIcon },
  { id: "checkbox", type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "radio", type: "radio", label: "Radio", icon: Radio },
  { id: "slider", type: "slider", label: "Slider", icon: Sliders },
  { id: "divider", type: "divider", label: "Divider", icon: AlignCenter },
  { id: "date", type: "date", label: "Date", icon: Calendar },
  { id: "time", type: "time", label: "Time", icon: Clock },
  { id: "url", type: "url", label: "URL", icon: Link },
  { id: "rating", type: "rating", label: "Rating", icon: Star },
  { id: "iframe", type: "iframe", label: "Iframe", icon: Monitor },
]

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function DraggableComponentItem({ component }: { component: DraggableComponent }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: component.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const IconComponent = component.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors border border-gray-700"
    >
      <GripVertical size={16} className="text-gray-400" />
      <IconComponent size={16} className="text-gray-300" />
      <span className="text-white text-sm">{component.label}</span>
    </div>
  )
}

function FormComponentItem({ 
  component, 
  onEdit, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown 
}: {
  component: FormComponent
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: component.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-component-id={component.id}
      className="bg-gray-900 rounded-lg p-4 border border-gray-700 group hover:border-gray-600 transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2" {...attributes} {...listeners}>
          <GripVertical size={16} className="text-gray-500 cursor-move" />
          <span className="text-sm text-gray-400">{component.type}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMoveUp(component.id)}
            disabled={!canMoveUp}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => onMoveDown(component.id)}
            disabled={!canMoveDown}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => onEdit(component.id)}
            className="p-1 text-gray-400 hover:text-white"
            title="Edit"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => onDelete(component.id)}
            className="p-1 text-gray-400 hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={component.label}
          onChange={(e) => onEdit(component.id)}
          className="w-full bg-transparent text-white font-medium border-none outline-none"
          placeholder="Field label..."
        />

        {component.type === "text" && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder={component.placeholder || "Enter text..."}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              disabled
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}

        {component.type === "email" && (
          <div className="space-y-2">
            <input
              type="email"
              placeholder={component.placeholder || "Enter email..."}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              disabled
            />
            {component.allowedDomains && component.allowedDomains.length > 0 && (
              <div className="text-xs text-gray-400">
                Allowed domains: {component.allowedDomains.join(", ")}
              </div>
            )}
          </div>
        )}

        {component.type === "number" && (
          <div className="space-y-2">
            <input
              type="number"
              placeholder={component.placeholder || "Enter number..."}
              step={component.disallowDecimals ? "1" : "any"}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              disabled
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
            {component.disallowDecimals && (
              <div className="text-xs text-gray-400">
                Only whole numbers allowed
              </div>
            )}
          </div>
        )}

        {component.type === "textarea" && (
          <div className="space-y-2">
            <textarea
              placeholder={component.placeholder || "Enter text..."}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white h-20 resize-none"
              disabled
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}

        {component.type === "select" && (
          <select
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
            disabled
          >
            <option>Select an option...</option>
            {component.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )}

        {component.type === "checkbox" && (
          <div className="space-y-3">
            {component.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <Checkbox disabled />
                <span className="text-gray-300 text-sm">{option}</span>
              </div>
            ))}
          </div>
        )}

        {component.type === "radio" && (
          <div className="space-y-3">
            {component.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="relative">
                  <input 
                    type="radio" 
                    name={component.id} 
                    className="sr-only" 
                    disabled 
                  />
                  <div className="w-4 h-4 rounded-full border-2 border-gray-500 bg-transparent flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0"></div>
                  </div>
                </div>
                <span className="text-gray-300 text-sm">{option}</span>
              </div>
            ))}
          </div>
        )}

        {component.type === "slider" && (
          <div className="space-y-2">
            <input
              type="range"
              min={component.min || 0}
              max={component.max || 100}
              defaultValue={component.value || 50}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{component.min || 0}</span>
              <span>{component.max || 100}</span>
            </div>
          </div>
        )}

        {component.type === "divider" && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-600"></div>
            <div className="text-gray-400 text-sm px-2">SECTION</div>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
        )}

        {component.type === "date" && (
          <div className="space-y-2">
            <input
              type="date"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              disabled
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}

        {component.type === "time" && (
          <div className="space-y-2">
            <input
              type="time"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              disabled
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}

        {component.type === "url" && (
          <div className="space-y-2">
            <input
              type="url"
              placeholder={component.placeholder || "https://example.com"}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              disabled
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}


        {component.type === "rating" && (
          <div className="space-y-2">
            <Rating
              value={component.value || 0}
              allowHalf={component.allowHalf}
              onChange={(value) => {
                setFormComponents(items =>
                  items.map(item =>
                    item.id === component.id
                      ? { ...item, value }
                      : item
                  )
                )
              }}
            />
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}

        {component.type === "iframe" && (
          <div className="space-y-2">
            {component.src ? (
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
                <div 
                  className="absolute inset-0 bg-gray-800 border border-gray-700 rounded-md shadow-sm items-center justify-center flex"
                >
                  <div className="text-center">
                    <Monitor className="mx-auto h-8 w-8 text-red-400 mb-2" />
                    <p className="text-red-400 text-sm font-medium">Refused to connect</p>
                    <p className="text-gray-500 text-xs mt-1">The website blocked this iframe</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <Monitor className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">Iframe Preview</p>
                <p className="text-gray-500 text-xs mt-1">Add a URL in the properties panel</p>
              </div>
            )}
            {component.comment && (
              <div className="text-xs text-gray-400 italic">
                {component.comment}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FormBuilder() {
  const router = useRouter()
  const [formName, setFormName] = useState("")
  const [formComponents, setFormComponents] = useState<FormComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [componentSearch, setComponentSearch] = useState("")
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishedForms, setPublishedForms] = useState<any[]>([])
  const [showFormsBar, setShowFormsBar] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [showCopyAlert, setShowCopyAlert] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      let storedSessionId = localStorage.getItem('formBuilderSessionId')
      
      if (!storedSessionId) {
        const response = await fetch('/api/session')
        if (response.ok) {
          const { sessionId: newSessionId } = await response.json()
          storedSessionId = newSessionId
          localStorage.setItem('formBuilderSessionId', newSessionId)
        }
      }
      
      if (storedSessionId) {
        setSessionId(storedSessionId)
        fetchPublishedForms(storedSessionId)
      }
    } catch (error) {
      console.error('Error initializing session:', error)
    }
  }

  const fetchPublishedForms = async (sessionIdToUse?: string) => {
    try {
      const currentSessionId = sessionIdToUse || sessionId
      if (!currentSessionId) return
      
      const response = await fetch('/api/forms', {
        headers: {
          'X-Session-ID': currentSessionId
        }
      })
      if (response.ok) {
        const forms = await response.json()
        setPublishedForms(forms)
        if (forms.length > 0) {
          setShowFormsBar(true)
        }
      }
    } catch (error) {
      console.error('Error fetching forms:', error)
    }
  }


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handlePreview()
      }
      if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setShowPublishModal(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [formComponents])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    const isFromPalette = draggableComponents.some(c => c.id === active.id)
    
    if (isFromPalette) {
      const componentType = draggableComponents.find(c => c.id === active.id)
      if (componentType) {
        const newComponent: FormComponent = {
          id: generateUUID(),
          type: componentType.type,
          label: componentType.label,
          placeholder: `Enter ${componentType.label.toLowerCase()}...`,
          required: false,
          options: componentType.type === "select" || componentType.type === "radio" || componentType.type === "checkbox"
            ? ["Option 1", "Option 2", "Option 3"] 
            : undefined,
          min: componentType.type === "slider" ? 0 : undefined,
          max: componentType.type === "slider" ? 100 : undefined,
          value: componentType.type === "slider" ? 50 : undefined,
        }
        setFormComponents((items) => [...items, newComponent])
      }
    } else if (over) {
      const activeIndex = formComponents.findIndex((item) => item.id === active.id)
      const overIndex = formComponents.findIndex((item) => item.id === over.id)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setFormComponents((items) => arrayMove(items, activeIndex, overIndex))
      }
    }

    setActiveId(null)
  }

  const handleEdit = (id: string) => {
    setSelectedComponent(id)
  }

  const handleDelete = (id: string) => {
    setFormComponents((items) => items.filter((item) => item.id !== id))
    if (selectedComponent === id) {
      setSelectedComponent(null)
    }
  }

  const handleMoveUp = (id: string) => {
    const index = formComponents.findIndex((item) => item.id === id)
    if (index > 0) {
      setFormComponents((items) => {
        const newItems = arrayMove(items, index, index - 1)
        setTimeout(() => {
          const element = document.querySelector(`[data-component-id="${id}"]`)
          if (element) {
            element.classList.add('transition-transform', 'duration-300', 'ease-in-out')
          }
        }, 0)
        return newItems
      })
    }
  }

  const handleMoveDown = (id: string) => {
    const index = formComponents.findIndex((item) => item.id === id)
    if (index < formComponents.length - 1) {
      setFormComponents((items) => {
        const newItems = arrayMove(items, index, index + 1)
        setTimeout(() => {
          const element = document.querySelector(`[data-component-id="${id}"]`)
          if (element) {
            element.classList.add('transition-transform', 'duration-300', 'ease-in-out')
          }
        }, 0)
        return newItems
      })
    }
  }

  const generateFormWithAI = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const systemPrompt = `You are a form builder AI. Generate a JSON response with form components based on the user's description.

Available component types: text, email, number, textarea, select, checkbox, radio, slider, divider, date, time, url, rating, iframe

Each component should have:
- id: unique string
- type: one of the available types
- label: descriptive label
- placeholder: optional placeholder text
- required: boolean
- options: array of strings (for select, radio, checkbox)
- min/max: numbers (for number, slider)
- allowHalf: boolean (for rating)
- src/width/height: strings (for iframe)

Return only valid JSON in this format:
{
  "components": [
    {
      "id": "unique-id",
      "type": "component-type",
      "label": "Component Label",
      "placeholder": "Optional placeholder",
      "required": true/false,
      "options": ["option1", "option2"]
    }
  ]
}`

      const response = await fetch('https://ai.hackclub.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2-instruct-0905',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate form, sorry...')
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      
      let jsonString = aiResponse
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        jsonString = jsonMatch[1]
      }
      const parsedResponse = JSON.parse(jsonString)
      const generatedComponents = parsedResponse.components || []

      const newComponents: FormComponent[] = generatedComponents.map((comp: any) => ({
        id: comp.id || generateUUID(),
        type: comp.type,
        label: comp.label || 'Untitled',
        placeholder: comp.placeholder,
        required: comp.required || false,
        options: comp.options,
        min: comp.min,
        max: comp.max,
        allowHalf: comp.allowHalf,
        src: comp.src,
        width: comp.width,
        height: comp.height
      }))

      setFormComponents([])
      for (let i = 0; i < newComponents.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setFormComponents(prev => [...prev, newComponents[i]])
      }

      setShowAIModal(false)
      setAiPrompt("")
    } catch (error) {
      console.error('Error generating form:', error)
      alert('Failed to generate form. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedComponentData = formComponents.find(c => c.id === selectedComponent)
  
  const filteredComponents = draggableComponents.filter(component =>
    component.label.toLowerCase().includes(componentSearch.toLowerCase())
  )

  const handlePublish = async () => {
    if (formComponents.length === 0) {
      alert('Please add at least one component to your form before publishing.')
      return
    }
    
    try {
      console.log('Publishing form:', { formName, formComponents })
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formName, formComponents, sessionId })
      })
      
      if (response.ok) {
        const { url } = await response.json()
        console.log("Form published at:", url)
        window.open(url, '_blank')
        setShowPublishModal(false)
        fetchPublishedForms()
      } else {
        console.error('Failed to publish form')
      }
    } catch (error) {
      console.error('Error publishing form:', error)
    }
  }

  const handlePreview = () => {
    if (formComponents.length === 0) return
    const data = { formName, formComponents }
    document.cookie = `formData=${encodeURIComponent(JSON.stringify(data))}; path=/`
    window.open('/form', '_blank')
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push('/')}
          className="text-white hover:text-gray-300 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handlePreview}
            disabled={formComponents.length === 0}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Preview
          </button>
          <button 
            onClick={() => setShowPublishModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Publish
          </button>
        </div>
      </nav>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[calc(100vh-80px)]">
          <div className="w-80 bg-gray-900 border-r border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4">Components</h3>
            <input
              type="text"
              value={componentSearch}
              onChange={(e) => setComponentSearch(e.target.value)}
              placeholder="Search components..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-white"
            />
            <div className="space-y-2">
              {filteredComponents.map((component) => (
                <DraggableComponentItem key={component.id} component={component} />
              ))}
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name..."
                className="w-full bg-transparent text-white text-2xl font-bold border-none outline-none placeholder-gray-500 mb-8"
              />

              <SortableContext items={formComponents.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4 min-h-96">
                  {formComponents.length === 0 ? (
                    <div className="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-700">
                      <p className="text-gray-400 text-lg">No components yet</p>
                      <p className="text-gray-500 text-sm mt-2">Drag components from the left panel to build your form</p>
                      
                      <div className="mt-6">
                        <button
                          onClick={() => setShowAIModal(true)}
                          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Start with AI</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    formComponents.map((component, index) => (
                      <FormComponentItem
                        key={component.id}
                        component={component}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                        canMoveUp={index > 0}
                        canMoveDown={index < formComponents.length - 1}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          </div>

          <div className="w-80 bg-gray-900 border-l border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4">Properties</h3>
            {selectedComponentData ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Label</label>
                  <input
                    type="text"
                    value={selectedComponentData.label}
                    onChange={(e) => {
                      setFormComponents(items =>
                        items.map(item =>
                          item.id === selectedComponent
                            ? { ...item, label: e.target.value }
                            : item
                        )
                      )
                    }}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                  />
                </div>

                {selectedComponentData.type !== "divider" && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Placeholder</label>
                    <input
                      type="text"
                      value={selectedComponentData.placeholder || ""}
                      onChange={(e) => {
                        setFormComponents(items =>
                          items.map(item =>
                            item.id === selectedComponent
                              ? { ...item, placeholder: e.target.value }
                              : item
                          )
                        )
                      }}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                    />
                  </div>
                )}

                {(selectedComponentData.type === "text" || selectedComponentData.type === "email" || selectedComponentData.type === "number" || selectedComponentData.type === "textarea") && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Help Text (Optional)</label>
                    <input
                      type="text"
                      value={selectedComponentData.comment || ""}
                      onChange={(e) => {
                        setFormComponents(items =>
                          items.map(item =>
                            item.id === selectedComponent
                              ? { ...item, comment: e.target.value }
                              : item
                          )
                        )
                      }}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                      placeholder="Add helpful text that appears below the input..."
                    />
                  </div>
                )}

                {(selectedComponentData.type === "select" || selectedComponentData.type === "radio" || selectedComponentData.type === "checkbox") && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Options ({selectedComponentData.options?.length || 0} of 5)</label>
                    <div className="space-y-2">
                      {selectedComponentData.options?.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(selectedComponentData.options || [])]
                              newOptions[index] = e.target.value
                              setFormComponents(items =>
                                items.map(item =>
                                  item.id === selectedComponent
                                    ? { ...item, options: newOptions }
                                    : item
                                )
                              )
                            }}
                            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                          />
                          <button
                            onClick={() => {
                              const filteredOptions = selectedComponentData.options?.filter((_, i) => i !== index) || []
                              const newOptions = filteredOptions.map((option, i) => {
                                const defaultPattern = /^Option \d+$/
                                if (defaultPattern.test(option)) {
                                  return `Option ${i + 1}`
                                }
                                return option
                              })
                              setFormComponents(items =>
                                items.map(item =>
                                  item.id === selectedComponent
                                    ? { ...item, options: newOptions }
                                    : item
                                )
                              )
                            }}
                            className="px-2 py-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const currentOptions = selectedComponentData.options || []
                          if (currentOptions.length < 5) {
                            const newOptionNumber = currentOptions.length + 1
                            const newOptions = [...currentOptions, `Option ${newOptionNumber}`]
                            setFormComponents(items =>
                              items.map(item =>
                                item.id === selectedComponent
                                  ? { ...item, options: newOptions }
                                  : item
                              )
                            )
                          }
                        }}
                        disabled={(selectedComponentData.options || []).length >= 5}
                        className="w-full py-2 text-gray-400 hover:text-white border border-gray-700 rounded-md hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:border-gray-700"
                      >
                        Add Option {(selectedComponentData.options || []).length >= 5 ? "(Max 5)" : ""}
                      </button>
                    </div>
                  </div>
                )}

                {selectedComponentData.type === "number" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setFormComponents(items =>
                          items.map(item =>
                            item.id === selectedComponent
                              ? { ...item, disallowDecimals: !item.disallowDecimals }
                              : item
                          )
                        )
                      }}
                      className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
                        selectedComponentData.disallowDecimals
                          ? 'bg-cyan-600 border-cyan-600'
                          : 'bg-transparent border-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {selectedComponentData.disallowDecimals && (
                        <svg
                          className="absolute inset-0 w-3 h-3 m-auto text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <label className="text-sm text-gray-300 cursor-pointer" onClick={() => {
                      setFormComponents(items =>
                        items.map(item =>
                          item.id === selectedComponent
                            ? { ...item, disallowDecimals: !item.disallowDecimals }
                            : item
                        )
                      )
                    }}>
                      Disallow decimal numbers
                    </label>
                  </div>
                )}

                {selectedComponentData.type === "slider" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Min</label>
                      <input
                        type="number"
                        value={selectedComponentData.min || 0}
                        max={selectedComponentData.max || 100}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value) || 0
                          const currentMax = selectedComponentData.max || 100
                          if (newMin <= currentMax) {
                            setFormComponents(items =>
                              items.map(item =>
                                item.id === selectedComponent
                                  ? { ...item, min: newMin }
                                  : item
                              )
                            )
                          }
                        }}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Max</label>
                      <input
                        type="number"
                        value={selectedComponentData.max || 100}
                        min={selectedComponentData.min || 0}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value) || 100
                          const currentMin = selectedComponentData.min || 0
                          if (newMax >= currentMin) {
                            setFormComponents(items =>
                              items.map(item =>
                                item.id === selectedComponent
                                  ? { ...item, max: newMax }
                                  : item
                              )
                            )
                          }
                        }}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>
                )}

                {selectedComponentData.type === "email" && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Allowed Domains</label>
                    <div className="space-y-2">
                      {selectedComponentData.allowedDomains?.map((domain, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={domain}
                            onChange={(e) => {
                              const newDomains = [...(selectedComponentData.allowedDomains || [])]
                              newDomains[index] = e.target.value
                              setFormComponents(items =>
                                items.map(item =>
                                  item.id === selectedComponent
                                    ? { ...item, allowedDomains: newDomains }
                                    : item
                                )
                              )
                            }}
                            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                            placeholder="example.com"
                          />
                          <button
                            onClick={() => {
                              const newDomains = selectedComponentData.allowedDomains?.filter((_, i) => i !== index) || []
                              setFormComponents(items =>
                                items.map(item =>
                                  item.id === selectedComponent
                                    ? { ...item, allowedDomains: newDomains }
                                    : item
                                )
                              )
                            }}
                            className="px-2 py-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newDomains = [...(selectedComponentData.allowedDomains || []), ""]
                          setFormComponents(items =>
                            items.map(item =>
                              item.id === selectedComponent
                                ? { ...item, allowedDomains: newDomains }
                                : item
                            )
                          )
                        }}
                        className="w-full py-2 text-gray-400 hover:text-white border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                      >
                        Add Domain
                      </button>
                    </div>
                  </div>
                )}

                {selectedComponentData.type === "rating" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setFormComponents(items =>
                          items.map(item =>
                            item.id === selectedComponent
                              ? { ...item, allowHalf: !item.allowHalf }
                              : item
                          )
                        )
                      }}
                      className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
                        selectedComponentData.allowHalf
                          ? 'bg-cyan-600 border-cyan-600'
                          : 'bg-transparent border-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {selectedComponentData.allowHalf && (
                        <svg
                          className="absolute inset-0 w-3 h-3 m-auto text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <label className="text-sm text-gray-300 cursor-pointer" onClick={() => {
                      setFormComponents(items =>
                        items.map(item =>
                          item.id === selectedComponent
                            ? { ...item, allowHalf: !item.allowHalf }
                            : item
                        )
                      )
                    }}>
                      Allow half stars
                    </label>
                  </div>
                )}

                {selectedComponentData.type === "iframe" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Source URL</label>
                      <input
                        type="url"
                        value={selectedComponentData.src || ""}
                        onChange={(e) => {
                          setFormComponents(items =>
                            items.map(item =>
                              item.id === selectedComponent
                                ? { ...item, src: e.target.value }
                                : item
                            )
                          )
                        }}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Width</label>
                        <input
                          type="text"
                          value={selectedComponentData.width || "100%"}
                          onChange={(e) => {
                            setFormComponents(items =>
                              items.map(item =>
                                item.id === selectedComponent
                                  ? { ...item, width: e.target.value }
                                  : item
                              )
                            )
                          }}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                          placeholder="100%"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Height</label>
                        <input
                          type="text"
                          value={selectedComponentData.height || "400px"}
                          onChange={(e) => {
                            setFormComponents(items =>
                              items.map(item =>
                                item.id === selectedComponent
                                  ? { ...item, height: e.target.value }
                                  : item
                              )
                            )
                          }}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-white"
                          placeholder="400px"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedComponentData.required}
                    onCheckedChange={(checked) => {
                      setFormComponents(items =>
                        items.map(item =>
                          item.id === selectedComponent
                            ? { ...item, required: !!checked }
                            : item
                        )
                      )
                    }}
                  />
                  <label className="text-sm text-gray-300 cursor-pointer" onClick={() => {
                    setFormComponents(items =>
                      items.map(item =>
                        item.id === selectedComponent
                          ? { ...item, required: !item.required }
                          : item
                      )
                    )
                  }}>
                    Required
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                Select a component to edit its properties
              </div>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
              <span className="text-white text-sm">
                {draggableComponents.find(c => c.id === activeId)?.label || 
                 formComponents.find(c => c.id === activeId)?.label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showPublishModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPublishModal(false)}
        >
          <div 
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-semibold mb-4">Publish Form</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to publish "{formName || 'Untitled Form'}"? 
              This will make your form live and accessible to users.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setShowFormsBar(!showFormsBar)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">
              Published Forms ({publishedForms.length})
            </span>
            <svg 
              className={`w-4 h-4 transition-transform ${showFormsBar ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => fetchPublishedForms()}
            className="text-gray-400 hover:text-white transition-colors"
            title="Refresh forms"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {showFormsBar && (
          <div className="max-h-48 overflow-y-auto border-t border-gray-700">
            <div className="p-4">
              {publishedForms.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No published forms yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {publishedForms.map((form) => (
                    <div key={form.uuid} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm truncate">
                          {form.name || 'Untitled Form'}
                        </h4>
                        <span className="text-xs text-gray-400 ml-2">
                          {form.submissions?.length || 0} submissions
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={`/f/${form.uuid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors text-center"
                        >
                          View
                        </a>
                        {form.submissions && form.submissions.length > 0 && (
                          <button
                            onClick={() => {
                              const submissionsWindow = window.open('', '_blank', 'width=800,height=600')
                              if (submissionsWindow) {
                                const firstThreeSubmissions = form.submissions.slice(0, 3)
                                const html = `
                                  <!DOCTYPE html>
                                  <html>
                                  <head>
                                    <title>Submissions for ${form.name || 'Untitled Form'}</title>
                                    <style>
                                      body { 
                                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                        background: #111827; 
                                        color: white; 
                                        margin: 0; 
                                        padding: 20px; 
                                      }
                                      .submission { 
                                        background: #1f2937; 
                                        border: 1px solid #374151; 
                                        border-radius: 8px; 
                                        padding: 20px; 
                                        margin-bottom: 20px; 
                                      }
                                      .submission-header { 
                                        display: flex; 
                                        justify-content: space-between; 
                                        align-items: center; 
                                        margin-bottom: 15px; 
                                      }
                                      .submission-title { 
                                        font-weight: 600; 
                                        font-size: 18px; 
                                      }
                                      .submission-date { 
                                        color: #9ca3af; 
                                        font-size: 14px; 
                                      }
                                      .form-field { 
                                        margin-bottom: 15px; 
                                      }
                                      .field-label { 
                                        font-weight: 500; 
                                        margin-bottom: 5px; 
                                        display: block; 
                                      }
                                      .field-value { 
                                        background: #374151; 
                                        border: 1px solid #4b5563; 
                                        border-radius: 4px; 
                                        padding: 8px 12px; 
                                        color: #e5e7eb; 
                                      }
                                      .checkbox-option, .radio-option { 
                                        display: flex; 
                                        align-items: center; 
                                        gap: 8px; 
                                        margin-bottom: 5px; 
                                      }
                                      .checkbox-option input, .radio-option input { 
                                        margin: 0; 
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>Submissions for "${form.name || 'Untitled Form'}"</h1>
                                    ${firstThreeSubmissions.map((submission: any, index: number) => `
                                      <div class="submission">
                                        <div class="submission-header">
                                          <div class="submission-title">Submission #${index + 1}</div>
                                          <div class="submission-date">${new Date(submission.createdAt).toLocaleString()}</div>
                                        </div>
                                        ${form.content?.formComponents?.map((component: any) => {
                                          const value = submission.data[component.id] || ''
                                          switch (component.type) {
                                            case 'text':
                                            case 'email':
                                            case 'number':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  <div class="field-value">${value}</div>
                                                </div>
                                              `
                                            case 'textarea':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  <div class="field-value">${value}</div>
                                                </div>
                                              `
                                            case 'select':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  <div class="field-value">${value || 'No selection'}</div>
                                                </div>
                                              `
                                            case 'radio':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  ${component.options?.map((option: string) => `
                                                    <div class="radio-option">
                                                      <input type="radio" ${value === option ? 'checked' : ''} disabled>
                                                      <span>${option}</span>
                                                    </div>
                                                  `).join('')}
                                                </div>
                                              `
                                            case 'checkbox':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  ${component.options?.map((option: string) => `
                                                    <div class="checkbox-option">
                                                      <input type="checkbox" ${Array.isArray(value) && value.includes(option) ? 'checked' : ''} disabled>
                                                      <span>${option}</span>
                                                    </div>
                                                  `).join('')}
                                                </div>
                                              `
                                            case 'slider':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  <div class="field-value">${value || component.value || 50}</div>
                                                </div>
                                              `
                                            case 'date':
                                            case 'time':
                                            case 'url':
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  <div class="field-value">${value || 'No value'}</div>
                                                </div>
                                              `
                                            case 'rating':
                                              const ratingValue = parseFloat(value) || 0
                                              const fullStars = Math.floor(ratingValue)
                                              const hasHalfStar = ratingValue % 1 !== 0
                                              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
                                              const ratingDisplay = '★'.repeat(fullStars) + (hasHalfStar ? '⭐' : '') + '☆'.repeat(emptyStars)
                                              return `
                                                <div class="form-field">
                                                  <label class="field-label">${component.label}</label>
                                                  <div class="field-value">${ratingValue ? ratingDisplay + ' (' + ratingValue + '/5)' : 'No rating'}</div>
                                                </div>
                                              `
                                            default:
                                              return ''
                                          }
                                        }).join('')}
                                      </div>
                                    `).join('')}
                                  </body>
                                  </html>
                                `
                                submissionsWindow.document.write(html)
                                submissionsWindow.document.close()
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors"
                            title="View submissions"
                          >
                            Submissions
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            try {
                              const url = `${window.location.origin}/f/${form.uuid}`
                              if (navigator.clipboard && navigator.clipboard.writeText) {
                                await navigator.clipboard.writeText(url)
                              } else {
                                const textArea = document.createElement('textarea')
                                textArea.value = url
                                document.body.appendChild(textArea)
                                textArea.select()
                                document.execCommand('copy')
                                document.body.removeChild(textArea)
                              }
                              setShowCopyAlert(true)
                              setTimeout(() => setShowCopyAlert(false), 2000)
                            } catch (error) {
                              console.error('Failed to copy:', error)
                              setShowCopyAlert(true)
                              setTimeout(() => setShowCopyAlert(false), 2000)
                            }
                          }}
                          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded transition-colors"
                          title="Copy link"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCopyAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Link copied to clipboard!
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h3 className="text-white text-lg font-semibold">Generate Form with AI</h3>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              Describe the form you want to create and AI will generate it for you.
            </p>
            
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Create a contact form with name, email, subject dropdown, and message fields..."
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAIModal(false)
                  setAiPrompt("")
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => generateFormWithAI(aiPrompt)}
                disabled={!aiPrompt.trim() || isGenerating}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
