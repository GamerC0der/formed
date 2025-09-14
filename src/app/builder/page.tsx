"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  Plus, 
  Type, 
  Sliders, 
  Link, 
  Minus, 
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
  LogIn
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface FormComponent {
  id: string
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio" | "slider" | "divider"
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
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
            <Checkbox disabled />
            <span className="text-gray-300 text-sm">Checkbox option</span>
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
          options: componentType.type === "select" || componentType.type === "radio" 
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

  const selectedComponentData = formComponents.find(c => c.id === selectedComponent)
  
  const filteredComponents = draggableComponents.filter(component =>
    component.label.toLowerCase().includes(componentSearch.toLowerCase())
  )

  const handlePublish = () => {
    console.log("Publishing form:", { formName, formComponents })
    setShowPublishModal(false)
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
        <button 
          onClick={() => setShowPublishModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Publish
        </button>
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

                {(selectedComponentData.type === "select" || selectedComponentData.type === "radio") && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Options</label>
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
                          const newOptionNumber = currentOptions.length + 1
                          const newOptions = [...currentOptions, `Option ${newOptionNumber}`]
                          setFormComponents(items =>
                            items.map(item =>
                              item.id === selectedComponent
                                ? { ...item, options: newOptions }
                                : item
                            )
                          )
                        }}
                        className="w-full py-2 text-gray-400 hover:text-white border border-gray-700 rounded-md hover:border-gray-600 transition-colors"
                      >
                        Add Option
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
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
    </div>
  )
}
