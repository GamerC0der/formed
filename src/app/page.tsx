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
      if (e.deltaY < 0) { // Scrolling up
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-center h-screen">
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
        </div>
      </div>
    </div>
  );
}
