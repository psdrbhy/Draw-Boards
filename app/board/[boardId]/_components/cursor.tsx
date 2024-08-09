"use client"

import { memo } from 'react'
import { MousePointer2 } from 'lucide-react'
import { connectionIdToColor } from '@/lib/utils'
import { useOther } from '@/liveblocks.config'
interface CursorProps {
    connectionId:number
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
    // 获取其他连接人的信息（除了自己），这里的信息是会实时变化的，所以使用了memo和throttle
    const info = useOther(connectionId, (user) => user?.info)
    const cursor = useOther(connectionId, (user) => user?.presence.cursor)
  const name = info?.name || "Teammate"

    if (!cursor) {
        return null
    }
    // 拿到其他人光标的位置
    const { x, y } = cursor

    return (
        <foreignObject
        style={{
          transform: `translate(${x}px, ${y}px)`, //定位到对应位置
        }}
        height={50}
        width={name.length * 10 + 24}
        className="relative drop-shadow-md"
      >
        <MousePointer2
          className="h-5 w-5"
          style={{
            fill: connectionIdToColor(connectionId),
            color: connectionIdToColor(connectionId),
          }}
        />
        <div
          className=" absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
          style={{
            backgroundColor: connectionIdToColor(connectionId),
          }}
        >
          {name}
        </div>
      </foreignObject>
    )
})


Cursor.displayName = "Cursor"
 