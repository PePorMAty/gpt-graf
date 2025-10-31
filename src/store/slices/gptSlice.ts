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
import type { CustomNode } from "../../types";

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
        data: { label: "inputdsadas" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        data: { label: "node 2" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2a",
        data: { label: "node 2a" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2b",
        data: { label: "node 2b" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2c",
        data: { label: "node 2c" },
        position: { x: 0, y: 0 },
      },
      {
        id: "2d",
        data: { label: "node 2d" },
        position: { x: 0, y: 0 },
      },
      {
        id: "3",
        data: { label: "node 3" },
        position: { x: 0, y: 0 },
      },
      {
        id: "4",
        data: { label: "node 4" },
        position: { x: 0, y: 0 },
      },
      {
        id: "5",
        data: { label: "node 5" },
        position: { x: 0, y: 0 },
      },
      {
        id: "6",
        type: "output",
        data: { label: "output" },
        position: { x: 0, y: 0 },
      },
      {
        id: "7",
        type: "output",
        data: { label: "output" },
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
    updateNode: (
      state,
      action: PayloadAction<{ nodeId: string; label: string }>
    ) => {
      const { nodeId, label } = action.payload;
      const node = state.data.nodes.find((node) => node.id === nodeId);
      if (node) {
        node.data.label = label;
      }
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
  updateNode,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onReconnect,
  removeEdge,
} = gptSlice.actions;
export default gptSlice.reducer;
