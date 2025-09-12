"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, LogIn } from "lucide-react"
import confetti from "canvas-confetti"
import { ConfettiButton } from "@/components/ui/confetti"

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
    
    const handleScroll = (e) => {
      if (window.scrollY < document.body.scrollHeight - window.innerHeight) {
        e.preventDefault()
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
    
    const handleWheel = (e) => {
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

  const handleCreateFormClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    // Navigate to /form after confetti animation
    setTimeout(() => {
      router.push('/form')
    }, 1000)
  }

  const handleLoginClick = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 rounded-lg mx-4 mt-4 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-white font-semibold">Home</span>
          <span className="text-gray-300 hover:text-white cursor-pointer flex items-center gap-2" onClick={handleCreateFormClick}>
            <FileText size={16} />
            Create Form
          </span>
        </div>
        <button className="text-white hover:text-gray-300 flex items-center gap-2" onClick={handleLoginClick}>
          <LogIn size={16} />
          Login
        </button>
      </nav>

      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mb-8">Formed</h1>
          <p className="text-xl mb-8">Forms, Done Right.</p>
          <ConfettiButton 
            className="bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2"
            onClick={() => {
              setTimeout(() => {
                router.push('/form')
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
