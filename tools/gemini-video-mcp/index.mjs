import { readFile, mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(SCRIPT_DIR, ".env") });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Add it to tools/gemini-video-mcp/.env before starting this MCP server.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const OUTPUT_DIR = path.resolve(SCRIPT_DIR, "output");
await mkdir(OUTPUT_DIR, { recursive: true });

const KNOWN_MODELS = [
  "veo-3.1-generate-preview",
  "veo-3.1-fast-generate-preview",
  "veo-3-generate-preview",
  "veo-2.0-generate-001",
];

const KNOWN_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3-pro-image-preview",
  "gemini-3-pro-image",
  "gemini-3.1-flash-image-preview",
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-lite-image",
];

const jobs = new Map();

function mimeTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function loadImage(imagePath) {
  const absolute = path.resolve(imagePath);
  const bytes = await readFile(absolute);
  return { imageBytes: bytes.toString("base64"), mimeType: mimeTypeFor(absolute) };
}

function extFor(mimeType) {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  return "png";
}

async function pollUntilDone(operation, { timeoutMs, intervalMs }) {
  const deadline = Date.now() + timeoutMs;
  let current = operation;
  while (!current.done) {
    if (Date.now() > deadline) return current;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    current = await ai.operations.getVideosOperation({ operation: current });
  }
  return current;
}

async function saveResult(operation, jobId) {
  const video = operation.response?.generatedVideos?.[0]?.video;
  if (!video) return null;
  const filePath = path.join(OUTPUT_DIR, `${jobId}.mp4`);
  await ai.files.download({ file: video, downloadPath: filePath });
  return filePath;
}

function operationStatus(operation) {
  if (operation.error) {
    return { done: true, error: operation.error };
  }
  if (!operation.done) {
    return { done: false };
  }
  const filtered = operation.response?.raiMediaFilteredReasons;
  if (filtered?.length) {
    return { done: true, filtered: filtered };
  }
  return { done: true };
}

const server = new McpServer({ name: "gemini-video-mcp", version: "0.1.0" });

server.registerTool(
  "list_video_models",
  {
    title: "List Veo video models",
    description:
      "List known Veo model IDs usable with generate_video. Check https://ai.google.dev/gemini-api/docs/veo for the current list and pricing, since new previews roll out often.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: JSON.stringify(KNOWN_MODELS, null, 2) }],
  }),
);

server.registerTool(
  "list_image_models",
  {
    title: "List Gemini image models",
    description:
      "List known Gemini image-generation model IDs usable with generate_image. Check https://ai.google.dev/gemini-api/docs/image-generation for the current list and pricing, since new versions roll out often.",
    inputSchema: {},
  },
  async () => ({
    content: [{ type: "text", text: JSON.stringify(KNOWN_IMAGE_MODELS, null, 2) }],
  }),
);

server.registerTool(
  "generate_image",
  {
    title: "Generate an image with Gemini",
    description:
      "Generates one or more images from a text prompt using a Gemini image-generation model. Each call spends real Gemini API credit. Saves the results under tools/gemini-video-mcp/output/ and returns the file paths.",
    inputSchema: {
      prompt: z.string().describe("Text description of the image to generate"),
      model: z.string().optional().describe(`Gemini image model id, default "${KNOWN_IMAGE_MODELS[0]}"`),
      numberOfImages: z.number().optional().describe("How many images to generate, default 1"),
      aspectRatio: z
        .enum(["1:1", "3:4", "4:3", "9:16", "16:9"])
        .optional()
        .describe('Default "1:1"'),
      negativePrompt: z.string().optional().describe("Things to avoid in the generated image"),
      seed: z.number().optional().describe("Random seed for reproducible generation"),
    },
  },
  async ({ prompt, model, numberOfImages, aspectRatio, negativePrompt, seed }) => {
    const fullPrompt = negativePrompt ? `${prompt}\n\nAvoid: ${negativePrompt}` : prompt;

    const response = await ai.models.generateContent({
      model: model ?? KNOWN_IMAGE_MODELS[0],
      contents: fullPrompt,
      config: {
        candidateCount: numberOfImages ?? 1,
        seed,
        imageConfig: { aspectRatio: aspectRatio ?? "1:1" },
      },
    });

    const candidates = response?.candidates ?? [];
    const images = [];
    for (const candidate of candidates) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData?.data) images.push(part.inlineData);
      }
    }

    if (!images.length) {
      const blockReason = response?.promptFeedback?.blockReason;
      const text = blockReason
        ? `Image blocked by safety policy: ${blockReason}`
        : "No images returned.";
      return { content: [{ type: "text", text }], isError: true };
    }

    const jobId = randomUUID();
    const savedPaths = [];
    for (const [index, entry] of images.entries()) {
      const ext = extFor(entry.mimeType);
      const filePath = path.join(OUTPUT_DIR, `${jobId}-${index}.${ext}`);
      await writeFile(filePath, Buffer.from(entry.data, "base64"));
      savedPaths.push(filePath);
    }

    return {
      content: [{ type: "text", text: `Saved image(s) to:\n${savedPaths.join("\n")}` }],
    };
  },
);

server.registerTool(
  "generate_video",
  {
    title: "Generate a video with Veo",
    description:
      "Starts a Veo video generation job from a text prompt (optionally seeded with a local image as the first frame) and waits for it to finish, up to a bounded timeout. Each call spends real Gemini API credit. Saves the result under tools/gemini-video-mcp/output/ and returns the file path. If it does not finish in time, returns a jobId to pass to check_video_job instead.",
    inputSchema: {
      prompt: z.string().describe("Text description of the video to generate"),
      imagePath: z
        .string()
        .optional()
        .describe("Optional local path to an image to use as the first frame (image-to-video)"),
      model: z.string().optional().describe(`Veo model id, default "${KNOWN_MODELS[0]}"`),
      aspectRatio: z.enum(["16:9", "9:16"]).optional().describe('Default "16:9"'),
      durationSeconds: z.number().optional().describe("Clip length in seconds, default 8"),
      resolution: z.enum(["720p", "1080p"]).optional().describe('Default "720p"'),
      negativePrompt: z.string().optional().describe("Things to avoid in the generated video"),
      generateAudio: z.boolean().optional().describe("Whether to generate native audio, default true"),
      waitTimeoutSeconds: z
        .number()
        .optional()
        .describe("Max seconds to poll before returning a jobId instead of the finished video, default 240"),
    },
  },
  async ({
    prompt,
    imagePath,
    model,
    aspectRatio,
    durationSeconds,
    resolution,
    negativePrompt,
    generateAudio,
    waitTimeoutSeconds,
  }) => {
    const image = imagePath ? await loadImage(imagePath) : undefined;

    let operation = await ai.models.generateVideos({
      model: model ?? KNOWN_MODELS[0],
      prompt,
      image,
      config: {
        aspectRatio: aspectRatio ?? "16:9",
        durationSeconds: durationSeconds ?? 8,
        resolution: resolution ?? "720p",
        negativePrompt,
        generateAudio: generateAudio ?? true,
      },
    });

    const jobId = operation.name ?? randomUUID();
    jobs.set(jobId, operation);

    operation = await pollUntilDone(operation, {
      timeoutMs: (waitTimeoutSeconds ?? 240) * 1000,
      intervalMs: 10_000,
    });
    jobs.set(jobId, operation);

    const status = operationStatus(operation);
    if (!status.done) {
      return {
        content: [
          {
            type: "text",
            text: `Still generating after the wait window. Poll it with check_video_job using jobId: ${jobId}`,
          },
        ],
      };
    }
    if (status.error) {
      return {
        content: [{ type: "text", text: `Generation failed: ${JSON.stringify(status.error)}` }],
        isError: true,
      };
    }
    if (status.filtered) {
      return {
        content: [{ type: "text", text: `Video filtered by safety policy: ${status.filtered.join(", ")}` }],
        isError: true,
      };
    }

    const filePath = await saveResult(operation, jobId);
    return {
      content: [{ type: "text", text: `Saved video to ${filePath}` }],
    };
  },
);

server.registerTool(
  "check_video_job",
  {
    title: "Check a Veo video generation job",
    description: "Polls a previously started generate_video job by jobId and downloads it once finished.",
    inputSchema: {
      jobId: z.string().describe("The jobId returned by generate_video"),
    },
  },
  async ({ jobId }) => {
    const operation = jobs.get(jobId);
    if (!operation) {
      return { content: [{ type: "text", text: `Unknown jobId: ${jobId}` }], isError: true };
    }
    const refreshed = operation.done ? operation : await ai.operations.getVideosOperation({ operation });
    jobs.set(jobId, refreshed);

    const status = operationStatus(refreshed);
    if (!status.done) {
      return { content: [{ type: "text", text: "Still generating, try again shortly." }] };
    }
    if (status.error) {
      return {
        content: [{ type: "text", text: `Generation failed: ${JSON.stringify(status.error)}` }],
        isError: true,
      };
    }
    if (status.filtered) {
      return {
        content: [{ type: "text", text: `Video filtered by safety policy: ${status.filtered.join(", ")}` }],
        isError: true,
      };
    }
    const filePath = await saveResult(refreshed, jobId);
    return { content: [{ type: "text", text: `Saved video to ${filePath}` }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
