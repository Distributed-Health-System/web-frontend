import { AlertCircle, AlertTriangle, CheckCircle, Heart, Stethoscope, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { SymptomAnalysis } from "../lib/symptom-checker.api"

const urgencyConfig = {
  emergency: {
    label: "Emergency",
    icon: AlertCircle,
    className: "bg-destructive text-destructive-foreground",
    cardClass: "border-destructive/50",
  },
  urgent: {
    label: "Urgent",
    icon: AlertTriangle,
    className: "bg-orange-500 text-white",
    cardClass: "border-orange-500/50",
  },
  routine: {
    label: "Routine",
    icon: Heart,
    className: "bg-primary text-primary-foreground",
    cardClass: "border-primary/30",
  },
  "self-care": {
    label: "Self-Care",
    icon: CheckCircle,
    className: "bg-success text-success-foreground",
    cardClass: "border-success/30",
  },
}

const likelihoodConfig = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-orange-100 text-orange-700 border-orange-200",
  low: "bg-muted text-muted-foreground border-border",
}

interface AnalysisResultProps {
  analysis: SymptomAnalysis
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const urgency = urgencyConfig[analysis.urgencyLevel]
  const UrgencyIcon = urgency.icon

  return (
    <Card className={cn("w-full border-2 mt-2", urgency.cardClass)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="h4">Preliminary Assessment</CardTitle>
          <Badge className={cn("flex items-center gap-1.5 px-3 py-1", urgency.className)}>
            <UrgencyIcon className="h-3.5 w-3.5" />
            {urgency.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Possible Conditions */}
        <div>
          <p className="label mb-2">Possible Conditions</p>
          <div className="space-y-2">
            {analysis.possibleConditions.map((condition, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="body-base font-medium">{condition.name}</span>
                    <Badge
                      variant="outline"
                      className={cn("text-xs capitalize", likelihoodConfig[condition.likelihood])}
                    >
                      {condition.likelihood}
                    </Badge>
                  </div>
                  <p className="helper-text">{condition.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Recommended Specialties */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
            <p className="label">Recommended Specialties</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.recommendedSpecialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="body-sm">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* General Advice */}
        <div>
          <p className="label mb-1.5">General Advice</p>
          <p className="body-base text-muted-foreground">{analysis.generalAdvice}</p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/60">
          <Info className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
          <p className="helper-text text-accent-foreground">{analysis.disclaimer}</p>
        </div>
      </CardContent>
    </Card>
  )
}
