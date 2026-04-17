"use client"

import { useEffect, useRef } from "react"
import { Plus, BrainCircuit, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { ChatMessage } from "./ChatMessage"
import { AnalysisResult } from "./AnalysisResult"
import { ChatInput } from "./ChatInput"
import { useSymptomChat } from "../hooks/useSymptomChat"

export function SymptomChat() {
  const {
    sessionId,
    messages,
    analysis,
    isLoading,
    error,
    sessions,
    sessionsLoading,
    send,
    startNewSession,
    loadSessions,
    loadSession,
  } = useSymptomChat()

  const bottomRef = useRef<HTMLDivElement>(null)

  // Load past sessions on mount
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const isEmpty = messages.length === 0

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px]    md:min-w-[450px]"
    >
      <ResizablePanel defaultSize="25%">
        <aside className="h-full border-r border-border flex flex-col bg-background">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="label">Conversations</span>
            <Button size="sm" variant="outline" onClick={startNewSession} className="h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessionsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))
            ) : sessions.length === 0 ? (
              <p className="helper-text text-center py-8">No past conversations</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.sessionId}
                  onClick={() => loadSession(s.sessionId)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2.5 transition-colors",
                    "hover:bg-accent",
                    s.sessionId === sessionId && "bg-accent",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    {s.analysis && (
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          s.analysis.urgencyLevel === "emergency" &&
                          "bg-destructive/10 text-destructive",
                          s.analysis.urgencyLevel === "urgent" &&
                          "bg-orange-100 text-orange-700",
                          s.analysis.urgencyLevel === "routine" &&
                          "bg-primary/10 text-primary",
                          s.analysis.urgencyLevel === "self-care" &&
                          "bg-success/10 text-success",
                        )}
                      >
                        {s.analysis.urgencyLevel}
                      </span>
                    )}
                  </div>
                  <p className="helper-text line-clamp-2">{s.lastMessage}</p>
                </button>
              ))
            )}
          </div>
        </aside>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        <div className="h-full flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {isEmpty && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <BrainCircuit className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="h4 mb-1">How are you feeling?</p>
                  <p className="body-base text-muted-foreground max-w-xs">
                    Describe your symptoms and I&apos;ll help assess them and recommend the right specialist.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} />
                ))}

                {/* Analysis card — shown inline after the last assistant message */}
                {analysis && <AnalysisResult analysis={analysis} />}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <BrainCircuit className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="body-sm text-muted-foreground">Analysing…</span>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 text-destructive body-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={send} isLoading={isLoading} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
