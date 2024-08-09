"use client"

// 画布
import { Info } from "./info"
import { Participants } from "./participant"
import { Toolbar } from './toolbar'
import { useCallback, useState } from "react"
import { Camera, CanvasMode, CanvasState } from "@/types/canvas"
import { useHistory,useCanRedo,useCanUndo,useMutation } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence"
import { pointerEventToCanvasPoint } from "@/lib/utils"
interface CanvasProps {
    boardId:string
}

export const Canvas = ({
    boardId
}: CanvasProps) => {
    // 设置画板状态
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    })
    // 初始化相机状态
    const [camera,setCamera] = useState<Camera>({x:0,y:0})

    const canUndo = useCanUndo()
    const canRedo = useCanRedo()
    const history = useHistory()
    // 鼠标滚轮
    const onWheel = useCallback((e: React.WheelEvent) => {
        // 更新
        setCamera(() => ({
            x: camera.x - e.deltaX,
            y:camera.y - e.deltaY
        }))
    }, [])
    // 鼠标滑动
    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault()
            const current = pointerEventToCanvasPoint(e, camera)
            // 更新Camera位置
            setMyPresence({cursor:current})

        },[]
    )
    //鼠标离开（当鼠标离开当前页的时候，置空）
    const onPointLeave = useMutation(({setMyPresence}) => {
        setMyPresence({cursor:null})
    },[])

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
            {/* 绘制板 */}
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointLeave}
            >
                <g>
                    <CursorsPresence/>
                </g>
            </svg>
        </main>
    )
}