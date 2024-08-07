"use client"
// 画布
import { Info } from "./info"
import { Participants } from "./participant"
import { Toolbar } from './toolbar'

interface CanvasProps {
    boardId:string
}

export const Canvas = ({
    boardId
}:CanvasProps) => {
    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <Info />
            <Participants />
            <Toolbar/>
        </main>
    )
}