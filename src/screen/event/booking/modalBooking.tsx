import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function CustomAnswerDialog({
  answers,
}: {
  answers: Array<{ label: string; value: string }>
}) {
  if (!answers || answers.length === 0) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Lihat
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Jawaban Form</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {answers.map((item, idx) => (
            <div
              key={idx}
              className="rounded-md border p-3 bg-muted/30"
            >
              <div className="text-sm font-medium">
                {item.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {item.value || "-"}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
