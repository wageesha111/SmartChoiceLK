"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

export interface NavBarProps {
  items: NavItem[]
  className?: string
  activeTab?: string
  onTabChange?: (name: string) => void
}

export function NavBar({ items, className, activeTab: controlledActiveTab, onTabChange }: NavBarProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(items[0]?.name || "")
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/80 border border-white/10 backdrop-blur-xl py-1 px-1.5 rounded-full shadow-2xl">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => {
                setInternalActiveTab(item.name)
                onTabChange?.(item.name)
              }}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-semibold px-3 sm:px-4 md:px-5 py-2 rounded-full transition-all duration-200 select-none flex items-center gap-1.5",
                "text-slate-300 hover:text-white",
                isActive ? "bg-white/10 text-white font-bold shadow-inner" : "hover:bg-white/5",
              )}
            >
              <Icon size={16} strokeWidth={2.2} className="flex-shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#266bf9] rounded-t-full shadow-[0_0_14px_#266bf9]">
                    <div className="absolute w-12 h-6 bg-[#266bf9]/30 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-[#266bf9]/40 rounded-full blur-sm -top-1" />
                    <div className="absolute w-4 h-4 bg-[#266bf9]/50 rounded-full blur-xs top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
