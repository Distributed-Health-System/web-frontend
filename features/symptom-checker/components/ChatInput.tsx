"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="flex items-end gap-2 p-4 border-t border-border bg-background">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={isLoading}
        placeholder="Describe your symptoms… (Shift+Enter for new line)"
        rows={1}
        className="flex-1 resize-none rounded-xl border border-input bg-muted/30 px-4 py-3 body-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 min-h-[48px] max-h-40"
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        className="h-12 w-12 rounded-xl flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
