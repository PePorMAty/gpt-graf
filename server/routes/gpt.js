const express = require("express");
const { HttpsProxyAgent } = require("https-proxy-agent");
const axios = require("axios");
const Graph = require("../models/Graph");

const router = express.Router();

const createAxiosWithProxy = () => {
  const proxyUrl = process.env.HTTPS_PROXY;

  const agent = new HttpsProxyAgent(proxyUrl);

  return axios.create({
    httpsAgent: agent,
    timeout: 30000,
  });
};

// Создание нового графа из GPT ответа
router.post("/create-from-gpt", async (req, res) => {
  try {
    const { userPrompt, graphName, graphDescription } = req.body;

    const axiosWithProxy = createAxiosWithProxy();

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        error: "userPrompt обязателен",
      });
    }

    console.log(
      "Создание графа из пользовательского запроса:",
      userPrompt.substring(0, 100) + "..."
    );

    // Получаем шаблон промта из .env и добавляем пользовательский запрос
    const fullPrompt = `${process.env.GPT_PROMT_LAYOUT} "${userPrompt}"`;

    // Запрос к GPT API
    const gptResponse = await axiosWithProxy.post(
      `${process.env.GPT_REQUEST_URL}`,
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: fullPrompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3, // Для более предсказуемых результатов
        max_tokens: 4000, // Увеличиваем лимит для больших графов
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GPT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let graphData;
    try {
      graphData = JSON.parse(gptResponse.data.choices[0].message.content);

      // Валидация структуры данных
      if (!graphData.nodes || !graphData.edges) {
        throw new Error("Некорректная структура ответа от GPT");
      }

      // Добавляем позиции для узлов, если их нет
      graphData.nodes = graphData.nodes.map((node, index) => ({
        ...node,
        position: node.position || {
          x: Math.random() * 800,
          y: Math.random() * 600,
        },
      }));
    } catch (parseError) {
      console.error("Ошибка парсинга JSON от GPT:", parseError);
      return res.status(500).json({
        success: false,
        error: "Неверный формат ответа от GPT",
        rawResponse: gptResponse.data.choices[0].message.content,
      });
    }

    // Создание графа в базе данных
    const graph = new Graph({
      name: graphName || `Граф: ${userPrompt.substring(0, 50)}...`,
      description:
        graphDescription || `Создан на основе запроса: ${userPrompt}`,
      data: graphData,
      metadata: {
        originalPrompt: userPrompt,
        fullPrompt: fullPrompt.substring(0, 500), // Сохраняем для отладки
      },
    });

    await graph.save();

    console.log(
      `Граф создан успешно. Узлов: ${graphData.nodes.length}, Связей: ${graphData.edges.length}`
    );

    res.json({
      success: true,
      graphId: graph._id,
      data: graph.data,
      stats: {
        nodes: graphData.nodes.length,
        edges: graphData.edges.length,
      },
      message: "Граф успешно создан",
    });
  } catch (error) {
    console.error("Ошибка при создании графа:", error);

    // Более детальная обработка ошибок
    let errorMessage = "Внутренняя ошибка сервера";
    if (error.response) {
      errorMessage = `Ошибка GPT API: ${
        error.response.data.error?.message || error.response.statusText
      }`;
    } else if (error.request) {
      errorMessage = "Не удалось соединиться с GPT API";
    } else {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Получить все графы
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const graphs = await Graph.find()
      .select("name description metadata createdAt")
      .sort({ "metadata.createdAt": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Graph.countDocuments();

    res.json({
      success: true,
      data: graphs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении графов:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Получить конкретный граф по ID
router.get("/:id", async (req, res) => {
  try {
    const graph = await Graph.findById(req.params.id);

    if (!graph) {
      return res.status(404).json({
        success: false,
        error: "Граф не найден",
      });
    }

    res.json({
      success: true,
      data: graph,
    });
  } catch (error) {
    console.error("Ошибка при получении графа:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Обновить граф
router.put("/:id", async (req, res) => {
  try {
    const { data, name, description } = req.body;

    const updateFields = {
      "metadata.updatedAt": Date.now(),
    };

    if (data) updateFields.data = data;
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    const graph = await Graph.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!graph) {
      return res.status(404).json({
        success: false,
        error: "Граф не найден",
      });
    }

    res.json({
      success: true,
      data: graph,
      message: "Граф успешно обновлен",
    });
  } catch (error) {
    console.error("Ошибка при обновлении графа:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Удалить граф
router.delete("/:id", async (req, res) => {
  try {
    const graph = await Graph.findByIdAndDelete(req.params.id);

    if (!graph) {
      return res.status(404).json({
        success: false,
        error: "Граф не найден",
      });
    }

    res.json({
      success: true,
      message: "Граф успешно удален",
    });
  } catch (error) {
    console.error("Ошибка при удалении графа:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
