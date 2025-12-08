const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
});

const nodeDataSchema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
});

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: {
    type: String,
    required: true,
    enum: ["Продукт", "Преобразование"],
  },
  data: { type: nodeDataSchema, required: true },
  position: { type: positionSchema, default: { x: 0, y: 0 } },
  level: { type: Number, default: 0 }, // для иерархии
});

const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  source: { type: String, required: true, ref: "Node" },
  target: { type: String, required: true, ref: "Node" },
  type: { type: String, default: "default" },
});

const graphSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // если будет авторизация
  data: {
    nodes: [{ type: nodeSchema }],
    edges: [{ type: edgeSchema }],
  },
  metadata: {
    nodeCount: { type: Number, default: 0 },
    edgeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
});

// Предварительный подсчет перед сохранением
graphSchema.pre("save", function (next) {
  this.metadata.nodeCount = this.data.nodes.length;
  this.metadata.edgeCount = this.data.edges.length;
  this.metadata.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Graph", graphSchema);
