"use client"

// 画布
import { Info } from "./info"
import { Participants } from "./participant"
import { Toolbar } from './toolbar'
import { useCallback, useMemo, useState } from "react"
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point } from "@/types/canvas"
import { useHistory,useCanRedo,useCanUndo,useMutation, useStorage, useOther, useOthersMapped } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence"
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils"
import {nanoid} from 'nanoid'
import { LiveObject } from "@liveblocks/client"
import { LayerPreview } from './layer-preview'

const MAX_LAYERS = 100;
interface CanvasProps {
    boardId:string
}

export const Canvas = ({
    boardId
}: CanvasProps) => {

    const layerIds = useStorage((root)=>root.layerIds)

    // 设置画板状态
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    })
    // 初始化相机状态
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b:0
    })

    const canUndo = useCanUndo()
    const canRedo = useCanRedo()
    const history = useHistory()

    // 插入图层
    const insertLayer = useMutation((
        { storage, setMyPresence },
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, //图层类型
        position:Point //图层位置
    ) => {
        const liveLayers = storage.get("layers")
        // 如果图层数大于最大值就返回
        if (liveLayers.size >= MAX_LAYERS) {
            return;
        }
        // 初始化图层数据
        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill:lastUsedColor
        })
        liveLayerIds.push(layerId)
        liveLayers.set(layerId, layer)
        setMyPresence(
            {
              selection: [layerId],
            },
            {
              addToHistory: true, //添加到history中，undo和redo就可以使用
            }
        )
        // 插入完回到None
          setCanvasState({ mode: CanvasMode.None })
          history.resume()
    },[lastUsedColor])


    // 鼠标滚轮
    const onWheel = useCallback((e: React.WheelEvent) => {
        // 更新
        setCamera(() => ({
            x: camera.x - e.deltaX,
            y:camera.y - e.deltaY
        }))
    }, [])
    // 鼠标滑动
    const onPointerMove = useMutation((
        { setMyPresence },
        e: React.PointerEvent
    ) => {
            e.preventDefault()
            const current = pointerEventToCanvasPoint(e, camera)
            // 更新光标位置
            setMyPresence({cursor:current})

        },[]
    )
    //鼠标离开（当鼠标离开当前页的时候，置空）
    const onPointLeave = useMutation((
        { setMyPresence }
    ) => {
        setMyPresence({cursor:null})
    }, [])
    // 鼠标按下抬起（这里只针对哪些图形）
    const onPointerUp = useMutation((
        { },
        e
    ) => {
        const point = pointerEventToCanvasPoint(e, camera)
        // 如果你的状态是Inserting就进行插入（也就是点击图形的时候）
        if (canvasState.mode === CanvasMode.Inserting) {  //子组件进行设置会影响到这里的结果吗？
            insertLayer(canvasState.layerType, point)
        } else {
            // 回到None
            setCanvasState({
                mode:CanvasMode.None
            })
        }
        
    },[
        camera,
        canvasState,
        history,
        insertLayer
    ])
    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId:string
    ) => {
        // 排除插入点击和画笔点击（也就是只有当我们选择空闲：None的时候去进行点击才会触发）
        if (canvasState.mode === CanvasMode.Inserting || canvasState.mode === CanvasMode.Pencil) {
            return;
        }
        history.pause();
        e.stopPropagation()

        
        const point = pointerEventToCanvasPoint(e, camera)
        // 如果selection中没有选中的这个图层就加入并添加历史
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence(
          {
            selection: [layerId],
          },
          {
            addToHistory: true,
          }
        )
        }
        // 更新成平移状态（Translating）
      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      })
    },[setCanvasState, camera, history, canvasState.mode])
    const selections = useOthersMapped((other) => other.presence.selection)
    console.log(selections,"selectionsselectionsselectionsselectionsselections")
    //当点击一个图层selection变化，然后layerIdsToColorSelection进行计算，改变selectionColor，实现点击改变图层stroke颜色
    // 计算出一个layerIdsToColorSelection对象，里面是layerId对应的随机颜色值（基于connectionId）
    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {}
    
        for (const user of selections) {
          const [connectionId, selection] = user
    
          for (const layerId of selection) {
            layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
          }
        }
    
        return layerIdsToColorSelection
      }, [selections]) 
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
                onPointerUp={onPointerUp}
            >
                <g
                    style={
                        {transform:`translate(${camera.x}px,,${camera.y}px)`}
                    }
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
   

                        />
                    ))}
                    <CursorsPresence/>
                </g>
            </svg>
        </main>
    )
}