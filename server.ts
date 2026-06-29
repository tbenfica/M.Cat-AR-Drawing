import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON body parser
app.use(express.json());

// Initialize Gemini AI client server-side only
const geminiApiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY environment variable is not defined. AI generation features will be disabled.");
}

// API Route: Generate a custom tracing sketch (SVG) based on a text prompt
app.post("/api/generate-sketch", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      res.status(400).json({ error: "O prompt de texto é obrigatório para gerar o esboço." });
      return;
    }

    if (!ai) {
      res.status(503).json({ 
        error: "O serviço de IA não está configurado. Por favor, configure a chave GEMINI_API_KEY nas Configurações > Secrets do AI Studio." 
      });
      return;
    }

    console.log(`[AI Sketch] Generating sketch for prompt: "${prompt}"`);

    // We will ask Gemini to generate a beautiful, clean, single-color line art vector graphic.
    // Specifying a very strict format guarantees we get a valid SVG that we can render easily in the frontend.
    const systemInstruction = `Você é um gerador especialista em criar desenhos de linhas vetorizadas (esboços ou "line art") formatados em SVG limpo, perfeitos para serem usados como guias de decalque (AR Drawing).

Instruções fundamentais:
1. Retorne APENAS o código SVG válido, sem nenhuma explicação, sem preâmbulos, sem markdown de bloco de código (ou seja, NÃO use marcadores de código como \`\`\`xml ou \`\`\`svg). Comece diretamente com "<svg" e termine com "</svg>".
2. O SVG deve usar viewBox="0 0 100 100".
3. Todos os elementos visuais devem ser linhas (paths, circles, ellipses, polylines) com fill="none" e stroke="currentColor" com stroke-width adequado (entre 1.5 e 2.5) para que o usuário possa enxergar claramente o contorno.
4. Mantenha o esboço simples e elegante. Ele deve representar de forma clara as linhas principais do objeto solicitado pelo usuário para que seja fácil de contornar à mão livre.
5. Evite áreas preenchidas com preto ou cores sólidas. Queremos apenas as linhas de contorno (wireframe/contour lines).
6. Garanta que todas as tags sejam fechadas corretamente e o XML/SVG seja 100% válido.`;

    const userPrompt = `Crie um esboço de contorno vetorizado (line art) minimalista de: "${prompt}".
O desenho deve ser limpo, focado nos contornos principais e ideal para decalcar no papel.
Lembre-se: retorne apenas o código SVG puro que caiba na viewBox="0 0 100 100".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    let rawSvg = response.text || "";

    // Clean up response if the model accidentally included markdown block wrappers
    rawSvg = rawSvg.trim();
    if (rawSvg.startsWith("```")) {
      // Remove starting backticks
      rawSvg = rawSvg.replace(/^```[a-zA-Z]*\n?/, "");
      // Remove ending backticks
      rawSvg = rawSvg.replace(/```$/, "");
      rawSvg = rawSvg.trim();
    }

    // Basic check to see if we got something resembling an SVG
    if (!rawSvg.startsWith("<svg") || !rawSvg.includes("</svg>")) {
      console.error(`[AI Sketch Error] Invalid SVG returned from model:`, rawSvg);
      throw new Error("O modelo gerou um formato de imagem inválido. Tente novamente com outro termo.");
    }

    res.json({
      success: true,
      svgContent: rawSvg,
      prompt: prompt
    });

  } catch (error: any) {
    console.error("[AI Sketch Error] Failed to generate sketch:", error);
    res.status(500).json({ 
      error: error.message || "Ocorreu um erro ao gerar o esboço com Inteligência Artificial. Tente novamente." 
    });
  }
});

// Configure Vite or Static Assets serving based on Environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, mount Vite middleware to handle hot module reloading & frontend assets
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🚀 Vite middleware mounted in DEVELOPMENT mode.");
  } else {
    // In production mode, serve the static files compiled by Vite inside /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("🚀 Serving static files in PRODUCTION mode from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`💻 AR Drawing Server running on http://localhost:${PORT}`);
  });
}

setupServer();
