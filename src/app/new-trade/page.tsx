import { NewTradeForm } from "@/components/new-trade-form"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function NewTradePage() {
  return (
    <NewTradeForm
      trigger={
        <Button variant="outline">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Trade
        </Button>
      }
    />
  )
}