// Flow.tsx
import { useCallback, useRef, useState, useEffect } from "react";
import {
  Background,
  ReactFlow,
  ConnectionLineType,
  Controls,
  type Node,
  type OnConnect,
  type NodeChange,
  type EdgeChange,
  type OnReconnect,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { getLayoutedElements } from "./utils/get-layouted-elements";
import { FlowPanel } from "./components/flow-panel/FlowPanel";
import styles from "./styles/Flow.module.css";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import {
  updateNode,
  setNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  removeEdge,
  onReconnect,
} from "./store/slices/gptSlice";

export const Flow = () => {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((store) => store.gpt);

  const edgeReconnectSuccessful = useRef<boolean>(true);

  // Применяем layout только один раз при монтировании
  useEffect(() => {
    const { nodes: layoutedNodes } = getLayoutedElements(
      data.nodes,
      data.edges
    );
    dispatch(setNodes(layoutedNodes));
  }, []); // Только при монтировании

  // Состояния для панели
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [tempNodeLabel, setTempNodeLabel] = useState<string>("");
  const [initialLabel, setInitialLabel] = useState<string>("");

  // Находим выбранный узел
  const selectedNode = data.nodes.find((node) => node.id === selectedNodeId);

  // При открытии панели устанавливаем текущее значение только один раз
  useEffect(() => {
    if (selectedNodeId && selectedNode && isPanelOpen) {
      const label = selectedNode.data?.label || "";
      setTempNodeLabel(label);
      setInitialLabel(label);
    }
  }, [selectedNodeId, isPanelOpen]);

  // Обработчик клика по узлу
  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedNodeId(node.id);
    setIsPanelOpen(true);
  }, []);

  // Закрытие панели с сохранением изменений
  const closePanel = useCallback(() => {
    if (selectedNodeId && tempNodeLabel !== initialLabel) {
      dispatch(
        updateNode({
          nodeId: selectedNodeId,
          label: tempNodeLabel,
        })
      );
    }

    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedNodeId(null);
      setTempNodeLabel("");
      setInitialLabel("");
    }, 300);
  }, [selectedNodeId, tempNodeLabel, initialLabel, dispatch]);

  // Обработчик изменения имени узла
  const handleNodeNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempNodeLabel(event.target.value);
    },
    []
  );

  // Обработчики изменений узлов и ребер
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      dispatch(onNodesChange(changes));
    },
    [dispatch]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      dispatch(onEdgesChange(changes));
    },
    [dispatch]
  );

  const handleConnect: OnConnect = useCallback(
    (params) => {
      dispatch(onConnect(params));
    },
    [dispatch]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const handleReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      dispatch(onReconnect({ oldEdge, newConnection }));
    },
    [dispatch]
  );

  const onReconnectEnd = useCallback(
    (_: unknown, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        dispatch(removeEdge(edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [dispatch]
  );

  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={data.nodes}
        edges={data.edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onNodeClick={onNodeClick}
        onReconnect={handleReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        snapToGrid
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-left" style={{ bottom: "25%" }} />
        <Background />
      </ReactFlow>
      <FlowPanel
        onClose={closePanel}
        isOpen={isPanelOpen}
        value={tempNodeLabel}
        onChangeValue={handleNodeNameChange}
      />
    </div>
  );
};
