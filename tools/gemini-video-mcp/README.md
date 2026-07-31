# gemini-video-mcp

Local MCP server that exposes Google's Veo video generation and Gemini image generation (via the official `@google/genai` SDK) as tools Claude Code can call while building this site's 3D/animation assets. It talks to Gemini directly with your own API key — no third-party service sits in between.

## Setup

1. Get an API key from [Google AI Studio](https://aistudio.google.com/apikey). Veo video generation and Gemini image generation are billed usage, not covered by the free consumer Gemini app subscription — make sure billing is enabled on the project behind the key (free-tier keys get 0 quota for these models).
2. Copy `.env.example` to `.env` in this folder and fill in the real key:
   ```bash
   cd tools/gemini-video-mcp
   cp .env.example .env   # then edit .env and paste your key in
   ```
   `.env` is gitignored — it never gets committed. `.env.example` is the tracked template; keep it in sync whenever a new variable is added here.
3. Install dependencies once:
   ```bash
   npm install
   ```
4. Restart Claude Code so it picks up `.mcp.json` at the repo root, which launches this server (it loads `.env` itself on startup).

## Tools

- `list_video_models` — known Veo model IDs.
- `generate_video` — text-to-video (optionally seeded with a local image as the first frame). Polls until done or a timeout, then saves the clip to `tools/gemini-video-mcp/output/<jobId>.mp4`. **Each call spends real API credit.**
- `check_video_job` — polls a job that didn't finish within `generate_video`'s wait window and downloads it once ready.
- `list_image_models` — known Gemini image-generation model IDs.
- `generate_image` — text-to-image via a Gemini image model (e.g. `gemini-2.5-flash-image`). Saves result(s) to `tools/gemini-video-mcp/output/<jobId>-<n>.png`. **Each call spends real API credit.**

`output/` is gitignored — generated clips are build assets, not source, and shouldn't be committed as-is.
