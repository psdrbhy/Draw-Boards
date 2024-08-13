import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { NoteLayer } from "@/types/canvas";
import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});
// 跟随高宽变化字体大小
const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBaseOnHeight = height * scaleFactor;
  const fontSizeBaseOnWidth = width * scaleFactor;
  return Math.min(fontSizeBaseOnHeight, fontSizeBaseOnWidth, maxFontSize);
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: NoteProps) => {
    // 获取该图层数据
  const { x, y, width, height, fill, value } = layer;
    // 更新Note内容
  const updateValue = useMutation(({ storage }, newValue: string) => {
    
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", newValue);
  }, []);
  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };
  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
          }}
          className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center outline-none",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? getContrastingTextColor(fill) : "#000",
        }}
      />
    </foreignObject>
  );
};
