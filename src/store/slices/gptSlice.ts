// store/slices/gptSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  reconnectEdge,
} from "@xyflow/react";
import type { CustomNode, CustomNodeData } from "../../types";

interface InitialStateI {
  data: {
    nodes: CustomNode[];
    edges: Edge[];
  };
  isLoading: boolean;
  isError: boolean;
}

const initialState: InitialStateI = {
  data: {
    nodes: [
      {
        id: "1",
        type: "input",
        data: { label: "inputdsadas", description: "Входной узел" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        data: { label: "node 2", description: "Описание узла 2" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2a",
        data: { label: "node 2a", description: "Описание узла 2" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2b",
        data: { label: "node 2b", description: "Описание узла 2" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2c",
        data: { label: "node 2c", description: "Описание узла 2" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2d",
        data: { label: "node 2d", description: "Описание узла 3" },
        position: { x: 0, y: 0 },
      },
      {
        id: "3",
        data: { label: "node 3", description: "Описание узла 3" },
        position: { x: 0, y: 0 },
      },
      {
        id: "4",
        data: { label: "node 4", description: "Описание узла 3" },
        position: { x: 0, y: 0 },
      },
      {
        id: "5",
        data: { label: "node 5", description: "Описание узла 3" },
        position: { x: 0, y: 0 },
      },
      {
        id: "6",
        type: "output",
        data: { label: "output", description: "Описание узла 3" },
        position: { x: 0, y: 0 },
      },
      {
        id: "7",
        type: "output",
        data: { label: "output", description: "Описание узла 3" },
        position: { x: 0, y: 0 },
      },
    ],
    edges: [
      { id: "e12", source: "1", target: "2" },
      { id: "e13", source: "1", target: "3" },
      { id: "e22a", source: "2", target: "2a" },
      { id: "e22b", source: "2", target: "2b" },
      { id: "e22c", source: "2", target: "2c" },
      { id: "e2c2d", source: "2c", target: "2d" },
      { id: "e45", source: "4", target: "5" },
      { id: "e56", source: "5", target: "6" },
      { id: "e57", source: "5", target: "7" },
    ],
  },
  isLoading: false,
  isError: false,
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    // Обновление метки узла
    updateNodeData: (
      state,
      action: PayloadAction<{ nodeId: string; data: Partial<CustomNodeData> }>
    ) => {
      const { nodeId, data } = action.payload;
      const node = state.data.nodes.find((node) => node.id === nodeId);
      if (node) {
        node.data = { ...node.data, ...data };
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;

      // Удаляем узел
      state.data.nodes = state.data.nodes.filter((node) => node.id !== nodeId);

      // Удаляем все ребра, связанные с этим узлом
      state.data.edges = state.data.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
    },
    // Установка узлов (для инициализации layout)
    setNodes: (state, action: PayloadAction<CustomNode[]>) => {
      state.data.nodes = action.payload;
    },
    // Установка ребер
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.data.edges = action.payload;
    },
    // Обработка изменений узлов из React Flow
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.data.nodes = applyNodeChanges(
        action.payload,
        state.data.nodes
      ) as CustomNode[];
    },
    // Обработка изменений ребер из React Flow
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      state.data.edges = applyEdgeChanges(action.payload, state.data.edges);
    },
    // Добавление нового соединения
    onConnect: (state, action: PayloadAction<Connection>) => {
      state.data.edges = addEdge(action.payload, state.data.edges);
    },
    // Переподключение ребра
    onReconnect: (
      state,
      action: PayloadAction<{ oldEdge: Edge; newConnection: Connection }>
    ) => {
      const { oldEdge, newConnection } = action.payload;
      state.data.edges = reconnectEdge(
        oldEdge,
        newConnection,
        state.data.edges
      );
    },
    // Удаление ребра
    removeEdge: (state, action: PayloadAction<string>) => {
      state.data.edges = state.data.edges.filter(
        (edge) => edge.id !== action.payload
      );
    },
  },
});

export const {
  updateNodeData,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
  removeEdge,
  removeNode,
} = gptSlice.actions;
export default gptSlice.reducer;
