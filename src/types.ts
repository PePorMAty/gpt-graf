import { type Node, type Edge } from "@xyflow/react";

// Исправленные типы для узлов с индексной сигнатурой
export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}

export type CustomNode = Node<CustomNodeData>;
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
