import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const VOICE = "en-US-AvaNeural";

const html = await readFile(join(projectRoot, "index.html"), "utf8");
const weeksMatch = html.match(/const SIGHT_WORD_WEEKS=(\[[\s\S]*?\]);/);
if (!weeksMatch) {
  throw new Error("Could not find SIGHT_WORD_WEEKS in index.html.");
}

const words = [...new Set(JSON.parse(weeksMatch[1]).flat())];
const clips = [
  ...words.map(word => ({ text: word, path: `audio/ava/words/${word}.mp3` })),
  { text: "Try again", path: "audio/ava/phrases/try-again.mp3" }
];

for (const [index, clip] of clips.entries()) {
  const outputPath = join(projectRoot, clip.path);
  await mkdir(dirname(outputPath), { recursive: true });
  const result = spawnSync(
    "python",
    ["-m", "edge_tts", "--voice", VOICE, "--rate=-10%", "--text", clip.text, "--write-media", outputPath],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
  if (result.status !== 0) {
    throw new Error(`Speech generation failed for "${clip.text}". Run: pip install edge-tts`);
  }
  console.log(`Generated ${index + 1}/${clips.length}: ${clip.text}`);
}
