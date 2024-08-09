"use client"

// 画布
import { Info } from "./info"
import { Participants } from "./participant"
import { Toolbar } from './toolbar'
import { useCallback, useState } from "react"
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point } from "@/types/canvas"
import { useHistory,useCanRedo,useCanUndo,useMutation, useStorage } from "@/liveblocks.config";
import { CursorsPresence } from "./cursors-presence"
import { pointerEventToCanvasPoint } from "@/lib/utils"
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
              addToHistory: true,
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
            // 更新Camera位置
            setMyPresence({cursor:current})

        },[]
    )
    //鼠标离开（当鼠标离开当前页的时候，置空）
    const onPointLeave = useMutation((
        { setMyPresence }
    ) => {
        setMyPresence({cursor:null})
    }, [])
    // 鼠标点击
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
                            // onLayerPointerDown={onLayerPointerDown}
                            // selectionColor={layerIdsToColorSelection[layerId]}
                            onLayerPointerDown={()=>{}}
                            selectionColor="#000"
                        />
                    ))}
                    <CursorsPresence/>
                </g>
            </svg>
        </main>
    )
}