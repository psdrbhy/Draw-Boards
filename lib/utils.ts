import { Camera, Color } from "@/types/canvas"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = ['#DC2626', '#D97706', '#059669', '#7C3AED', '#DB2777']
// 解决一些css的合并重复和冲突
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 随机color
export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}
// 转化为css样式 eg:{ r: 255, g: 0, b: 0 }=>#ff0000
export function colorToCss(color: Color): string {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g
    .toString(16)
    .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}