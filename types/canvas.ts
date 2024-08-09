export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};
// 图层类型
export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
}
// 定义图层
export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer;
// 不同图层需要的参数
export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};
// x轴y轴
export type Point = {
  x: number;
  y: number;
};
// x轴y轴以及长宽
export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};
// 图层的边
export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}
// 画布每种模式下的数据状态
export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note;
    }
  | {
      mode: CanvasMode.Resizing;
      initialBounds: XYWH;
      corner: Side;
    }
  | {
      mode: CanvasMode.Pencil;
    };
// 定义画布不同的操作模式
export enum CanvasMode {
  None, //空闲
  Pressing, //按压
  SelectionNet, //选择框
  Translating, //平移
  Inserting, //插入
  Resizing, //调整大小
  Pencil, //笔绘制
}
