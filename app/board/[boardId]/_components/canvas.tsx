"use client"

// 画布
import { Info } from "./info"
import { Participants } from "./participant"
import { Toolbar } from './toolbar'
import { useState } from "react"
import { CanvasMode, CanvasState } from "@/types/canvas"
import { useHistory,useCanRedo,useCanUndo } from "@/liveblocks.config";
interface CanvasProps {
    boardId:string
}

export const Canvas = ({
    boardId
}: CanvasProps) => {
    // 设置画板状态
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode:CanvasMode.None
    })
    const canUndo = useCanUndo()
    const canRedo = useCanRedo()
    const history = useHistory()
    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <Info boardId={ boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}

            />
        </main>
    )
}