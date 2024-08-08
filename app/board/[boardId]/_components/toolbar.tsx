import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolBarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}
// 工具箱组件
export const Toolbar = ({
  canvasState,
  setCanvasState,
  canRedo,
  canUndo,
  undo,
  redo,
}: ToolBarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="select"
          icon={MousePointer2}
          onClick={() => setCanvasState({mode:CanvasMode.None})}
          isActive={
            // 做这些操作的时候进行选择
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() => setCanvasState(
            {
              mode: CanvasMode.Inserting,
              layerType:LayerType.Text
            
          })}
          isActive={
            canvasState.mode == CanvasMode.Inserting &&
            canvasState.layerType == LayerType.Text
          }
        />
        <ToolButton
          label="Sticky note"
          icon={StickyNote}
          onClick={() => setCanvasState(
            {
              mode: CanvasMode.Inserting,
              layerType:LayerType.Note
            
          })}
          isActive={
            canvasState.mode == CanvasMode.Inserting &&
            canvasState.layerType == LayerType.Note
          }
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() => setCanvasState(
            {
              mode: CanvasMode.Inserting,
              layerType:LayerType.Rectangle
            
          })}
          isActive={
            canvasState.mode == CanvasMode.Inserting &&
            canvasState.layerType == LayerType.Rectangle
          }
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() => setCanvasState(
            {
              mode: CanvasMode.Inserting,
              layerType:LayerType.Ellipse
            
          })}
          isActive={
            canvasState.mode == CanvasMode.Inserting &&
            canvasState.layerType == LayerType.Ellipse
          }
        />
        <ToolButton
          label="pen"
          icon={Pencil}
          onClick={() => setCanvasState(
            {
              mode: CanvasMode.Pencil,
          })}
          isActive={
            canvasState.mode == CanvasMode.Pencil
          }
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          isActive={false}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          isActive={false}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = function () {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md"></div>
  );
};
