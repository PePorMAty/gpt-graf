import { type Node, type Edge, type XYPosition } from "@xyflow/react";

// Базовый тип данных узла
export interface CustomNodeData {
  label: string;
  description?: string;
  [key: string]: unknown; // Индексная сигнатура
}

// Основной тип узла, который будет использоваться в Redux store
export type CustomNode = Node<CustomNodeData>;

// Тип для узлов без позиции (если нужен где-то еще)
export type CustomNodeWithoutPosition = Omit<CustomNode, "position"> & {
  position?: XYPosition;
};

// Тип для узлов с обязательной позицией
export type CustomNodeWithPosition = CustomNode;

export type CustomEdge = Edge;

// Дополнительные типы если нужно
export interface ApiData {
  nodes: Array<{
    id: string;
    type: string;
    name?: string;
    description?: string;
  }>;
  edges?: Edge[];
}

export interface EditData {
  label?: string;
  description?: string;
}
