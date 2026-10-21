import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = process.env.AZURE_SPEECH_REGION;

if (!speechKey || !speechRegion) {
  throw new Error("Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION before generating clips.");
}

const html = await readFile(join(projectRoot, "index.html"), "utf8");
const thisWeekMatch = html.match(/const THIS_WEEKS_WORDS=(\[[^\]]+\]);/);
const previousWordsMatch = html.match(/const PREVIOUS_WORDS=(\[[^\]]+\]);/);
if (!thisWeekMatch || !previousWordsMatch) {
  throw new Error("Could not find both word lists in index.html.");
}

const words = [...new Set([...JSON.parse(previousWordsMatch[1]), ...JSON.parse(thisWeekMatch[1])])];
const clips = [
  ...words.map(word => ({ text: word, path: `audio/ava/words/${word}.mp3` })),
  { text: "Try again", path: "audio/ava/phrases/try-again.mp3" }
];
const endpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

function escapeXml(text) {
  return text.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[character]);
}

for (const [index, clip] of clips.entries()) {
  const ssml = `<speak version="1.0" xml:lang="en-US"><voice name="en-US-AvaNeural"><prosody rate="-10%" volume="soft">${escapeXml(clip.text)}</prosody></voice></speak>`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/ssml+xml",
      "Ocp-Apim-Subscription-Key": speechKey,
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "site-words-game"
    },
    body: ssml
  });

  if (!response.ok) {
    throw new Error(`Speech generation failed for "${clip.text}" (${response.status}): ${await response.text()}`);
  }

  const outputPath = join(projectRoot, clip.path);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, new Uint8Array(await response.arrayBuffer()));
  console.log(`Generated ${index + 1}/${clips.length}: ${clip.text}`);
}