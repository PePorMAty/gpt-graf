export const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input" },
  },
  {
    id: "2",
    data: { label: "node 2" },
  },
  {
    id: "2a",
    data: { label: "node 2a" },
  },
  {
    id: "2b",
    data: { label: "node 2b" },
  },
  {
    id: "2c",
    data: { label: "node 2c" },
  },
  {
    id: "2d",
    data: { label: "node 2d" },
  },
  {
    id: "3",
    data: { label: "node 3" },
  },
  {
    id: "4",
    data: { label: "node 4" },
  },
  {
    id: "5",
    data: { label: "node 5" },
  },
  {
    id: "6",
    type: "output",
    data: { label: "output" },
  },
  {
    id: "7",
    type: "output",
    data: { label: "output" },
  },
];

export const initialEdges = [
  { id: "e12", source: "1", target: "2" },
  { id: "e13", source: "1", target: "3" },
  { id: "e22a", source: "2", target: "2a" },
  { id: "e22b", source: "2", target: "2b" },
  { id: "e22c", source: "2", target: "2c" },
  { id: "e2c2d", source: "2c", target: "2d" },
  { id: "e45", source: "4", target: "5" },
  { id: "e56", source: "5", target: "6" },
  { id: "e57", source: "5", target: "7" },
];

//Антон Pepormaty, [10/28/2025 3:56 PM]
/* import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', data: { label: '-' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const UpdateNode = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [nodeName, setNodeName] = useState('Node 1');
  const [nodeBg, setNodeBg] = useState('#dbdbdb');
  const [nodeHidden, setNodeHidden] = useState(false);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          // it's important that you create a new node object
          // in order to notify react flow about the change
          return {
            ...node,
            data: {
              ...node.data,
              label: nodeName,
            },
          };
        }

        return node;
      }),
    );
  }, [nodeName, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          // it's important that you create a new node object
          // in order to notify react flow about the change
          return {
            ...node,
            style: {
              ...node.style,
              backgroundColor: nodeBg,
            },
          };
        }

        return node;
      }),
    );
  }, [nodeBg, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          // it's important that you create a new node object
          // in order to notify react flow about the change
          return {
            ...node,
            hidden: nodeHidden,
          };
        }

        return node;
      }),
    );
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === 'e1-2') {
          return {
            ...edge,
            hidden: nodeHidden,
          };
        }

        return edge;
      }),
    );
  }, [nodeHidden, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultViewport={defaultViewport}
      minZoom={0.2}
      maxZoom={4}
      attributionPosition="bottom-left"
      fitView
      fitViewOptions={{ padding: 0.5 }}
    >
      <Panel position="top-left" style={{ width: 200 }}>
        <label className="xy-theme__label">Label: </label>
        <input
          value={nodeName}
          onChange={(evt) => setNodeName(evt.target.value)}
          className="xy-theme__input"
        />

        <label className="xy-theme__label">Background: </label>
        <input
          value={nodeBg}
          onChange={(evt) => setNodeBg(evt.target.value)}
          className="xy-theme__input"
        />

        <label className="xy-theme__label">Hidden:</label>
        <input
          type="checkbox"
          checked={nodeHidden}
          onChange={(evt) => setNodeHidden(evt.target.checked)}
          className="xy-theme__checkbox"
        />
      </Panel>
      <Background />
    </ReactFlow>
  );
};

export default UpdateNode;

Антон Pepormaty, [10/28/2025 8:08 PM]
data: {
      nodes: [
        {
          id: 'Продукт1',
          type: 'Продукт',
          name: 'автомобиль легковой',
          description: 'Современное транспортное средство, предназначенное для перевозки людей и багажа. Характеризуется сложной конструкцией, включающей кузов, шасси, двигатель, трансмиссию, системы управления и безопасности. Применяется для личных, коммерческих и государственных нужд.'
        },
        {
          id: 'Преобразование1',
          type: 'Преобразование',
          name: 'Автомобильная сборка на конвейере',
          description: 'Промышленный конвейерный процесс сборки автомобилей, включающий поэтапную установку агрегатов и компонентов — кузова, двигателя, трансмиссии, шасси, электроники, интерьера. Осуществляется на специализированных заводах с использованием автоматизированных линий, робототехники и диагностического оборудования.',
          inputs: [
            'Продукт2',
            'Продукт3',
            'Продукт4',
            'Продукт5',
            'Продукт6',
            'Продукт7',
            'Продукт8'
          ],
          outputs: [
            'Продукт1'
          ]
        },
        {
          id: 'Продукт2',
          type: 'Продукт',
          name: 'кузов автомобиля',
          description: 'Основа несущей конструкции автомобиля, совмещающая элементы пассивной безопасности, эстетики и удобства. Включает наружные и внутренние панели, дверные проёмы, багажник и капот. Для производства используются сборы сварки и штамповки.'
        },
        {
          id: 'Преобразование2',
          type: 'Преобразование',
          name: 'Промышленное производство автомобильных кузовов',
          description: 'Комплексный процесс производства включает штамповку панелей из стального листа, сварку каркаса, антикоррозийную обработку и покраску. Используется оборудование для глубокой вытяжки металла, роботизированные сварочные станции и линии нанесения покрытий.',
          inputs: [
            'Продукт9',
            'Продукт10',
            'Продукт11',
            'Продукт12',
            'Продукт13'
          ],
          outputs: [
            'Продукт2'
          ]
        },
        {
          id: 'Продукт3',
          type: 'Продукт',
          name: 'двигатель внутреннего сгорания',
          description: 'Сердце автомобиля — силовая установка, преобразующая химическую энергию топлива в механическую. Состоит из блока цилиндров, поршней, коленвала, клапанного механизма, систем впрыска и охлаждения.'
        },
        {
          id: 'Преобразование3',
          type: 'Преобразование',
          name: 'Сборка двигателя внутреннего сгорания',
          description: 'Процесс сборки с высокой прецизионностью: монтаж блока, поршней, клапанов и вспомогательных систем. Используются линии с контролем качества, автоматизированные станции подачи компонентов и стенды для обкатки.',
          inputs: [
            'Продукт14',
            'Продукт15',
            'Продукт16',
            'Продукт17',
            'Продукт18',
            'Продукт19',
            'Продукт20',
            'Продукт21'
          ],
          outputs: [
            'Продукт3'
          ]
        },
        {
          id: 'Продукт4',
          type: 'Продукт',
          name: 'трансмиссия автомобиля',
          description: 'Механизм передачи крутящего момента от двигателя к колёсной паре, включает сцепление, коробку передач, карданные и приводные валы. Ключевые детали — шестерни, синхронизаторы, подшипники.'
        },
        {
          id: 'Преобразование4',
          type: 'Преобразование',
          name: 'Сборка трансмиссии',
          description: 'Монтаж и юстировка узлов: изготовление зубчатых колёс, корпуса, валы. Сборочные линии оснащены прецизионной механической обработкой, и системами контроля соосности и зазоров.',
          inputs: [
            'Продукт22',
            'Продукт23',
            'Продукт24',
            'Продукт25'
          ],
          outputs: [
            'Продукт4'
          ]
        },
        {
          id: 'Продукт5',
          type: 'Продукт',

Антон Pepormaty, [10/28/2025 8:08 PM]
name: 'шасси и подвеска автомобиля',
          description: 'Узлы, отвечающие за ходовые качества, управляемость и надёжность. Включают раму (реже несущую), рычаги, пружины, стойки амортизаторов и стабилизаторы.'
        },
        {
          id: 'Преобразование5',
          type: 'Преобразование',
          name: 'Сборка шасси и подвески',
          description: 'Сборка рамы с приваркой кронштейнов, подбор и монтаж амортизаторов и упругих элементов. Линии оснащены гидропрессами, стендами центровки, автоматизированными сварочными роботами.',
          inputs: [
            'Продукт26',
            'Продукт27',
            'Продукт28'
          ],
          outputs: [
            'Продукт5'
          ]
        },
        {
          id: 'Продукт6',
          type: 'Продукт',
          name: 'электрооборудование автомобиля',
          description: 'Система обеспечения управления, освещения, комфорта и безопасности. Содержит блоки управления, кабели, предохранители, освещение, электродвигатели и прочие компоненты.'
        },
        {
          id: 'Преобразование6',
          type: 'Преобразование',
          name: 'Комплектация электросистем автомобиля',
          description: 'Изготовление и монтаж кабельных жгутов, установка блоков электронных систем, освещения и датчиков. Используются автоматизированные рабочие места для тестирования соединений, сборочные стенды.',
          inputs: [
            'Продукт29',
            'Продукт30',
            'Продукт31',
            'Продукт32',
            'Продукт33'
          ],
          outputs: [
            'Продукт6'
          ]
        },
        {
          id: 'Продукт7',
          type: 'Продукт',
          name: 'интерьер и оснащение салона',
          description: 'Комплекс деталей для внутренней отделки и комфорта: сиденья, панели, обивка, шумоизоляция, стекла, элементы управления климатом, мультимедия.'
        },
        {
          id: 'Преобразование7',
          type: 'Преобразование',
          name: 'Сборка и монтаж автомобильного интерьера',
          description: 'Изготовление и установка панелей, сидений, обивки из текстиля и пластмасс, стекол, шумоизоляции. Рабочие участки оборудованы покроечными, пресс-формами, автоматизированными линиями и установками для нанесения мягких покрытий.',
          inputs: [
            'Продукт34',
            'Продукт35',
            'Продукт36',
            'Продукт37',
            'Продукт38'
          ],
          outputs: [
            'Продукт7'
          ]
        },
        {
          id: 'Продукт8',
          type: 'Продукт',
          name: 'колёса и шины',
          description: 'Комплекс для передачи крутящего момента, амортизации и обеспечения сцепления с дорогой. Содержит металлические диски и эластомерные шины.'
        },
        {
          id: 'Преобразование8',
          type: 'Преобразование',
          name: 'Сборка колесного комплекта',
          description: 'Процесс объединяет производство шин (вулканизация резиновых смесей, армирование кордами) с литьём и обработкой металлических дисков. Сборочные линии оснащены вулканизационными прессами, станками и роботами.',
          inputs: [
            'Продукт39',
            'Продукт40'
          ],
          outputs: [
            'Продукт8'
          ]
        }
      ]
    }, */
