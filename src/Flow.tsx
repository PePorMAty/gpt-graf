import { useCallback, useRef, useState } from "react";
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Controls,
  reconnectEdge,
  type Node,
  type OnConnect,
  type OnReconnect,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./Flow.module.css"; // Импорт CSS модуля

import { initialNodes, initialEdges } from "./initialElements";
import { getLayoutedElements } from "./utils/get-layouted-elements";
import type { CustomEdge, CustomNode } from "./types";
import { FlowPanel } from "./components/flow-panel/FlowPanel";

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

export const Flow = () => {
  const edgeReconnectSuccessful = useRef<boolean>(true);
  const [nodes, setNodes, onNodesChange] =
    useNodesState<CustomNode>(layoutedNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CustomEdge>(layoutedEdges);

  // Состояния для панели
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  // Получаем актуальные данные выбранного узла
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const nodeName = selectedNode?.data?.label || "";

  // Обработчик клика по узлу
  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      setSelectedNodeId(node.id);
      setIsPanelOpen(true);
    },
    [setSelectedNodeId, setIsPanelOpen]
  );

  // Закрытие панели
  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    // После завершения анимации сбрасываем выбранный узел
    setTimeout(() => setSelectedNodeId(null), 300);
  }, [setIsPanelOpen, setSelectedNodeId]);

  // Обработчик изменения имени узла
  const handleNodeNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newLabel = event.target.value;

      if (selectedNodeId) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === selectedNodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                },
              };
            }
            return node;
          })
        );
      }
    },
    [selectedNodeId, setNodes]
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params }, eds)),
    [setEdges]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, [edgeReconnectSuccessful]);

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [edgeReconnectSuccessful, setEdges]
  );

  const onReconnectEnd = useCallback(
    (_: unknown, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [edgeReconnectSuccessful, setEdges]
  );

  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        snapToGrid
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-left" style={{ bottom: "25%" }} />
        <Background />
      </ReactFlow>
      <FlowPanel
        onClose={closePanel}
        isOpen={isPanelOpen}
        value={nodeName}
        onChangeValue={handleNodeNameChange}
      />
    </div>
  );
};
