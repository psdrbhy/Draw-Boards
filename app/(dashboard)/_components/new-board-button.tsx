"use client"

import { useApiMutation } from "@/hooks/use-api-mutation"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { toast} from "sonner"
import { error } from "console"
interface NewBoardButtonProps {
    orgId: string,
    disabled?:boolean
}
export const NewBoardButton = ({
    orgId,
    disabled
    
}: NewBoardButtonProps) => {
    const { mutate, pending } = useApiMutation(api.board.create)
    const onClick = () => {
        mutate({
            orgId,
            title:"Untitled"
        }).then(() => {
            toast.success("Board created!")
        }).catch(() => {
            toast.error("Failed to create!")
        })
    }
    return (
        <button
            disabled={ pending || disabled}
            onClick={onClick}
            className={cn("col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6", (pending || disabled) && "opacity-75") }
            
        >
            <div></div>
            <Plus className="h-12 w-12 text-white stroke-1" />
            <p className="text-sm text-white font-light">
                新建画板
            </p>
        </button>
        
    )
}