"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BrainCircuit, X } from "lucide-react"
import { SymptomChat } from "./SymptomChat"

const SPRING = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const

export function SymptomCheckerPanel() {
  const [open, setOpen] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        // ── Button ──
        <motion.button
          key="trigger"
          layoutId="symptom-checker"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 text-white shadow-xl"
          style={{
            borderRadius: 16,
            backgroundImage: "linear-gradient(122deg, #021f3a 0%, #005c92 52%, #021f3a 100%)",
          }}
          transition={SPRING}
          aria-label="Open symptom checker"
        >
          <motion.span layoutId="symptom-icon" transition={SPRING}>
            <BrainCircuit className="h-5 w-5 shrink-0" />
          </motion.span>
          <motion.span
            className="label-sm whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            Check Symptoms
          </motion.span>
        </motion.button>
      ) : (
        // ── Panel ──
        <motion.div
          key="panel"
          layoutId="symptom-checker"
          className="fixed bottom-6 right-6 z-50 flex flex-col bg-card border border-border shadow-2xl overflow-hidden"
          style={{ width: "52vw", height: "92vh", borderRadius: 16 }}
          transition={SPRING}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <motion.div
                layoutId="symptom-icon"
                transition={SPRING}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <BrainCircuit className="h-4 w-4 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.18 } }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
              >
                <p className="label text-foreground">AI Symptom Checker</p>
                <p className="helper-text text-muted-foreground">
                  Preliminary assessment · Not a diagnosis
                </p>
              </motion.div>
            </div>
            <motion.button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Chat body */}
          <motion.div
            className="flex-1 min-h-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <SymptomChat />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
