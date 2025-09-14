import { Star } from "lucide-react"

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  max?: number
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  allowHalf?: boolean
}

export function Rating({ value, onChange, max = 5, disabled = false, size = "md", allowHalf = false }: RatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  const handleClick = (star: number, isHalf: boolean = false) => {
    if (disabled) return
    const ratingValue = isHalf ? star - 0.5 : star
    onChange?.(ratingValue)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const isFilled = star <= value
        const isHalfFilled = allowHalf && star - 0.5 <= value && value < star
        
        return (
          <div key={star} className="relative">
            {allowHalf && (
              <div 
                className="absolute inset-0 overflow-hidden"
                onClick={() => handleClick(star, true)}
              >
                <Star
                  className={`${sizeClasses[size]} cursor-pointer transition-colors ${
                    isHalfFilled 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-400 hover:text-yellow-400'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                />
              </div>
            )}
            <Star
              className={`${sizeClasses[size]} cursor-pointer transition-colors ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-400 hover:text-yellow-400'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => handleClick(star)}
            />
          </div>
        )
      })}
    </div>
  )
}
