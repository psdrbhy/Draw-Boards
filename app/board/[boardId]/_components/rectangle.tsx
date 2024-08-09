// 矩形组件
// import { colorToCss } from '@/lib/utils'
import { colorToCss } from '@/lib/utils'
import { RectangleLayer } from '@/types/canvas'

interface RectangleProps {
  id: string
  layer: RectangleLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer

  return (
    <rect
      className="drop-shadow-md"
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px ${y}px)`,
      }}
      strokeWidth={1}
      fill={fill ? colorToCss(fill) : '#000'}
      stroke={selectionColor || 'transparent'}
    />
  )
}
