"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, LogIn, Wrench } from "lucide-react"
import confetti from "canvas-confetti"
import { ConfettiButton } from "@/components/ui/confetti"

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
    
    const handleScroll = (e: Event) => {
      if (window.scrollY < document.body.scrollHeight - window.innerHeight) {
        e.preventDefault()
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
    
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) { 
        e.preventDefault()
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: false })
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])


  const handleFormBuilderClick = () => {
    router.push('/builder')
  }

  const handleLoginClick = () => {
    router.push('/login')
  }

  const handleDemoClick = () => {
    const demoData = {
      formName: "Contact Form Demo",
      formComponents: [
        {
          id: "1",
          type: "text",
          label: "Name",
          placeholder: "Enter your name...",
          required: true
        },
        {
          id: "2", 
          type: "email",
          label: "Email",
          placeholder: "Enter your email...",
          required: true
        },
        {
          id: "3",
          type: "select",
          label: "Subject",
          options: ["General Inquiry", "Support", "Sales", "Other"]
        },
        {
          id: "4",
          type: "textarea", 
          label: "Message",
          placeholder: "Enter your message...",
          required: true
        }
      ]
    }
    document.cookie = `formData=${encodeURIComponent(JSON.stringify(demoData))}; path=/`
    router.push('/form')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex items-center justify-center flex-1">
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mb-8">Formed</h1>
          <p className="text-xl mb-8">Forms, Done Right.</p>
          <ConfettiButton 
            className="bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
            onClick={() => {
              setTimeout(() => {
                router.push('/builder')
              }, 1000)
            }}
          >
            <Plus size={16} />
            Create Form
          </ConfettiButton>
          <a 
            href="/form" 
            onClick={handleDemoClick}
            className="text-gray-400 hover:text-white underline mt-4"
          >
            Try Demo
          </a>
        </div>
      </div>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Formed
          </p>
        </div>
      </footer>
    </div>
  );
}
