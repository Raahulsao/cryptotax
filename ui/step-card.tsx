import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import Image from "next/image" // Import Image component

interface StepCardProps {
  icon: LucideIcon
  title: string
  description: string
  imageUrl: string // Changed from backgroundImageQuery to imageUrl
}

export function StepCard({ icon: Icon, title, description, imageUrl }: StepCardProps) {
  return (
    <div className="max-w-sm w-full group/step-card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-72 rounded-xl shadow-lg max-w-sm mx-auto flex flex-col justify-end p-6",
          "transition-all duration-500 group-hover/step-card:scale-[1.02]",
        )}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          layout="fill" // Make image fill the parent
          objectFit="cover" // Cover the area without distortion
          className="absolute inset-0 rounded-xl" // Apply rounded corners to image
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition duration-300 group-hover/step-card:from-black/80 rounded-xl"></div>
        <div className="relative z-10 flex flex-col items-start text-left">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mb-4">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-2xl text-white mb-2">{title}</h3>
          <p className="font-normal text-base text-gray-200">{description}</p>
        </div>
      </div>
    </div>
  )
}
