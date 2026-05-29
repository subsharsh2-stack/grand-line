// ============================================================
// GRAND LINE — AI Engine
// Primary: Groq API (free tier, Llama 3.1 8B — ~200ms responses)
// Fallback: Google Gemini Flash (free tier, 1M tokens/day)
// Zero cost in dev, scales very cheaply in prod.
//
// Groq free: 6,000 tokens/min | 500,000 tokens/day
// Gemini Flash free: 1,500 req/day | 1M tokens/day
// ============================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const GROQ_MODEL = "llama-3.1-8b-instant"; // fastest, free
const GROQ_MODEL_SMART = "llama-3.1-70b-versatile"; // smarter, still free

interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ---- Core AI call -------------------------------------------
async function callGroq(
  messages: AIMessage[],
  options: { maxTokens?: number; temperature?: number; smart?: boolean } = {}
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.smart ? GROQ_MODEL_SMART : GROQ_MODEL,
      messages,
      max_tokens: options.maxTokens || 512,
      temperature: options.temperature || 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Fallback to Gemini if Groq fails
async function callGemini(prompt: string, maxTokens: number = 512): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
  });

  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Resilient call — tries Groq first, falls back to Gemini
async function callAI(
  messages: AIMessage[],
  options: { maxTokens?: number; temperature?: number; smart?: boolean } = {}
): Promise<string> {
  try {
    return await callGroq(messages, options);
  } catch (groqErr) {
    console.warn("Groq failed, trying Gemini:", groqErr);
    try {
      const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
      return await callGemini(prompt, options.maxTokens);
    } catch (geminiErr) {
      console.error("Both AI providers failed:", geminiErr);
      return "";
    }
  }
}

// ============================================================
// AI FEATURES
// ============================================================

// ---- 1. Personalized "What to Watch Next" -------------------
export async function getPersonalizedRecommendation(params: {
  username: string;
  totalEpisodes: number;
  lastWatchedEpisode: number | null;
  lastArc: string | null;
  watchStreak: number;
  rank: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}): Promise<{ message: string; tip: string; urgency: "low" | "medium" | "high" }> {
  const { username, totalEpisodes, lastWatchedEpisode, lastArc, watchStreak, rank, timeOfDay } = params;

  const systemPrompt = `You are the Den Den Mushi (a transponder snail) for Grand Line, a One Piece watch-tracking platform.
You're enthusiastic, uses One Piece references naturally, and give short punchy messages (max 2 sentences).
You address pirates by their username. Never use markdown. Be motivational and fun.`;

  const userPrompt = `The pirate "${username}" has watched ${totalEpisodes} episodes.
Their last episode was ${lastWatchedEpisode || "none"} (${lastArc || "not started"} arc).
Watch streak: ${watchStreak} days. Current rank: ${rank}. Time of day: ${timeOfDay}.

Give them a SHORT personalized "what to watch next" message (1-2 sentences max).
Then give a SHORT insider tip about the next episode or arc (1 sentence).
Reply ONLY as JSON: { "message": "...", "tip": "...", "urgency": "low|medium|high" }`;

  try {
    const response = await callAI([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], { maxTokens: 200, temperature: 0.8 });

    const parsed = JSON.parse(response.replace(/```json|```/g, "").trim());
    return parsed;
  } catch {
    return {
      message: `Set sail, ${username}! Episode ${(lastWatchedEpisode || 0) + 1} awaits.`,
      tip: "Every episode brings you closer to the treasure.",
      urgency: watchStreak > 3 ? "high" : "medium",
    };
  }
}

// ---- 2. Den Den Mushi Chatbot --------------------------------
export async function getDenDenMushiResponse(
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  userContext: {
    username: string;
    episodesWatched: number;
    lastArc: string | null;
  }
): Promise<string> {
  const systemPrompt = `You are Den Den Mushi 🐌, the Grand Line platform's AI assistant — a talking snail.
You have encyclopedic knowledge of One Piece (anime, manga, lore, characters, story).
You are helpful, enthusiastic, and naturally weave in One Piece references.
IMPORTANT: Never spoil arcs the user hasn't reached yet. They've watched ${userContext.episodesWatched} episodes (up to ${userContext.lastArc || "start"} arc).
Keep responses concise (under 150 words). No markdown, plain conversational text.`;

  const messages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-6), // Keep last 3 exchanges
    { role: "user", content: userMessage },
  ];

  return await callAI(messages, { maxTokens: 300, temperature: 0.8 });
}

// ---- 3. AI Episode Quiz Generator ---------------------------
export interface GeneratedQuiz {
  question: string;
  options: Array<{ text: string; is_correct: boolean }>;
  explanation: string;
}

export async function generateEpisodeQuiz(params: {
  episodeNumber: number;
  episodeTitle: string;
  synopsis: string | null;
  arcName: string | null;
}): Promise<GeneratedQuiz | null> {
  const { episodeNumber, episodeTitle, synopsis, arcName } = params;

  const prompt = `You are a One Piece expert creating a quiz for Episode ${episodeNumber}: "${episodeTitle}" (${arcName || "Unknown"} arc).

${synopsis ? `Synopsis: ${synopsis}` : "No synopsis available — use your One Piece knowledge."}

Create ONE multiple choice question about a specific plot point, character moment, or key event from this episode.
Make it engaging but not too hard — test if they watched it, not deep lore.

Reply ONLY as valid JSON (no markdown):
{
  "question": "...",
  "options": [
    { "text": "...", "is_correct": true },
    { "text": "...", "is_correct": false },
    { "text": "...", "is_correct": false },
    { "text": "...", "is_correct": false }
  ],
  "explanation": "Brief explanation of why the correct answer is right (1 sentence)"
}`;

  try {
    const response = await callAI(
      [{ role: "user", content: prompt }],
      { maxTokens: 400, temperature: 0.6, smart: true }
    );
    const cleaned = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Quiz generation failed:", err);
    return null;
  }
}

// ---- 4. Personalized Daily Motivation -----------------------
export async function getDailyMotivation(params: {
  username: string;
  rank: string;
  streak: number;
  totalEpisodes: number;
  lastArc: string | null;
  daysSinceLastWatch: number;
}): Promise<string> {
  const { username, rank, streak, totalEpisodes, lastArc, daysSinceLastWatch } = params;

  const isLapsed = daysSinceLastWatch > 3;

  const prompt = `Write a single short motivational message (1 sentence, max 25 words) for a One Piece fan named "${username}".
Context: ${totalEpisodes} episodes watched, ${streak}-day streak, rank: ${rank}, last arc: ${lastArc || "just starting"}.
${isLapsed ? `They haven't watched in ${daysSinceLastWatch} days — they need a gentle nudge back.` : "Keep their momentum going."}
Use a One Piece quote style or reference. No markdown. Just the message.`;

  const response = await callAI(
    [{ role: "user", content: prompt }],
    { maxTokens: 80, temperature: 0.9 }
  );

  return response.trim() || `The sea awaits, ${username}. Set sail.`;
}

// ---- 5. Smart Arc Recommendation ----------------------------
export async function getNextArcRecommendation(params: {
  completedArcs: string[];
  currentArc: string | null;
  totalEpisodes: number;
  preferredStyle: "action" | "adventure" | "emotional" | "comedy" | null;
}): Promise<{
  arcName: string;
  reason: string;
  hypeLevel: "high" | "extreme" | "legendary";
}> {
  const { completedArcs, currentArc, totalEpisodes } = params;

  const prompt = `One Piece expert: The user has completed these arcs: ${completedArcs.join(", ") || "none"}.
Currently on: ${currentArc || "not started"} (${totalEpisodes} total episodes watched).

Recommend the ONE most exciting arc they should focus on next.
Reply ONLY as JSON: { "arcName": "...", "reason": "1 sentence why it's amazing", "hypeLevel": "high|extreme|legendary" }`;

  try {
    const response = await callAI(
      [{ role: "user", content: prompt }],
      { maxTokens: 150, temperature: 0.6 }
    );
    return JSON.parse(response.replace(/```json|```/g, "").trim());
  } catch {
    return {
      arcName: currentArc || "Romance Dawn",
      reason: "Every episode of One Piece is worth watching.",
      hypeLevel: "high",
    };
  }
}

// ---- 6. AI Episode Recap (no spoilers) ----------------------
export async function getEpisodeRecap(params: {
  episodeNumber: number;
  title: string;
  synopsis: string | null;
  arcName: string | null;
}): Promise<string> {
  const { episodeNumber, title, synopsis, arcName } = params;

  const prompt = `Write a SHORT spoiler-free recap of One Piece Episode ${episodeNumber}: "${title}" (${arcName} arc).
${synopsis ? `Synopsis hint: ${synopsis}` : ""}
2-3 sentences max. Exciting tone. Don't reveal major plot twists. No markdown.`;

  return await callAI(
    [{ role: "user", content: prompt }],
    { maxTokens: 120, temperature: 0.7 }
  );
}

// ---- 7. Personalized Bounty Message -------------------------
export async function getBountyUnlockMessage(params: {
  username: string;
  newRank: string;
  bounty: number;
  episodesWatched: number;
}): Promise<string> {
  const prompt = `Write a 1-sentence congratulations message for a One Piece fan who just reached the rank of "${params.newRank}" with ฿${params.bounty.toLocaleString()} bounty after watching ${params.episodesWatched} episodes. Username: ${params.username}. Sound like the World Government issuing a new bounty poster. Dramatic and fun. No markdown.`;

  return await callAI(
    [{ role: "user", content: prompt }],
    { maxTokens: 80, temperature: 0.85 }
  );
}
