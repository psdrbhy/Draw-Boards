"use client";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useMutation, useSelf } from "@/liveblocks.config";
// 选中图层工具组件
import { Camera, Color } from "@/types/canvas";
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import { useDeleteLayers } from "@/hooks/use-delete-layer";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Trash2,BringToFront,SendToBack} from "lucide-react";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((me) => me.presence.selection);
    // 修改颜色
    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        // 更改填充颜色
        setLastUsedColor(fill);
        selection.forEach((id) => {
          liveLayers.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );
    // 删除图层
    const deleteLayers = useDeleteLayers();
    // 改变图层显示级
    // 向上移动（通过改变liveLayerIds中的排序实现）
    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get('layerIds')
        const indices: number[] = []

        const arr = liveLayerIds.toImmutable()
        // 同时在选中列表和图层列表中
        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i)
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          )
        }
      },
      [selection]
    )
    // 向下移动
    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get('layerIds')
        const indices: number[] = []

        const arr = liveLayerIds.toImmutable()

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i)
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i)
        }
      },
      [selection]
    )
    const selectionBounds = useSelectionBounds();
    if (!selectionBounds) {
      return null;
    }
    // 计算选中图层的xy轴（考虑偏移量）
    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className=" absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(
            calc(${x}px - 50%),
            calc(${y - 16}px - 100%)
          )`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="flex flex-col gap-y-0.5">
          <Hint label="Bring to front">
            <Button variant={'board'} size={'icon'} onClick={moveToFront}>
              <BringToFront />
            </Button>
          </Hint>
          <Hint label="Send to back" side="bottom">
            <Button variant={'board'} size={'icon'} onClick={moveToBack}>
              <SendToBack />
            </Button>
          </Hint>
        </div>
        <div className=" flex items-center pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Delete">
            <Button variant={"board"} size={"icon"} onClick={deleteLayers}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";