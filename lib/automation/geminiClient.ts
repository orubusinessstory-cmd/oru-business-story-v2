// SERVER-ONLY. Calls the Google Gemini API directly with fetch (no SDK
// dependency needed). GEMINI_API_KEY must never be exposed to the browser —
// this file must only ever be imported from server code (route handlers /
// server actions).

export type GeneratedArticle = {
  title: string;
  tag: string;
  tagColor: "blue" | "green" | "purple" | "orange";
  description: string;
  profitPotential: "High" | "Medium" | "Low";
  investmentRange: string;
  content: string;
  imageQuery: string;
};

const VALID_TAG_COLORS = new Set(["blue", "green", "purple", "orange"]);
const VALID_PROFIT = new Set(["High", "Medium", "Low"]);

// Stable Gemini model, no scheduled shutdown as of writing, and on the cheap
// "lite" tier — one article a day comfortably fits Google AI Studio's free
// quota. If Google retires this model name later, swap it here for whatever
// https://ai.google.dev/gemini-api/docs/models currently lists as the
// stable "Flash-Lite" model — everything else in this file stays the same.
const GEMINI_MODEL = "gemini-3.1-flash-lite";

function buildPrompt(categoryName: string, avoidTitles: string[]): { system: string; user: string } {
  const avoidList =
    avoidTitles.length > 0
      ? `ഈ ബിസിനസ് ഐഡിയകൾ/ടൈറ്റിലുകൾ മുൻപ് publish ചെയ്തതാണ് — ഇവ ആവർത്തിക്കരുത്, ഇവയോട് വളരെ സാമ്യമുള്ള ഐഡിയയും തിരഞ്ഞെടുക്കരുത്:\n- ${avoidTitles.join("\n- ")}`
      : "ഇതുവരെ ഈ category-യിൽ ഒരു ആർട്ടിക്കിളും publish ചെയ്തിട്ടില്ല.";

  const system = `നീ "Oru Business Story" എന്ന Malayalam YouTube ചാനലിന്റെയും വെബ്സൈറ്റിന്റെയും ബിസിനസ് കണ്ടന്റ് റൈറ്റർ ആണ്. ഇന്ത്യയിലെ (പ്രത്യേകിച്ച് കേരളത്തിലെ) വായനക്കാർക്കായി practical, realistic ബിസിനസ് ഐഡിയ ആർട്ടിക്കിളുകൾ എഴുതുന്നു.

നിർബന്ധമായ നിയമങ്ങൾ:
1. Output ആയി ഒരു single valid JSON object മാത്രം തരുക. JSON-ന് മുൻപോ ശേഷമോ ഒരു വാക്കും, markdown code fence-ഉം (\`\`\`) പാടില്ല.
2. Content പൂർണമായും Malayalam ഭാഷയിൽ ആയിരിക്കണം. ആവശ്യമായിടത്ത് മാത്രം common English business terms (e.g. GST, ROI, marketing, raw material) ഉപയോഗിക്കാം.
3. എല്ലാ investment/expense/revenue/profit figures ഉം ഇന്ത്യൻ രൂപയിൽ (₹) ആയിരിക്കണം, realistic ആയിരിക്കണം (2026-ലെ ഇന്ത്യൻ വിലനിലവാരം അനുസരിച്ച്).
4. ആർട്ടിക്കിൾ ഒരു പുതിയ, നിർദ്ദിഷ്ട ബിസിനസ് ഐഡിയയെ കുറിച്ച് ആയിരിക്കണം (category-യുടെ പേര് തന്നെ ടൈറ്റിൽ ആക്കരുത്).
5. content ഫീൽഡ് Markdown ഫോർമാറ്റിൽ ആയിരിക്കണം: ## ഉപയോഗിച്ച് ഓരോ സെക്ഷനും heading കൊടുക്കുക, ആവശ്യമുള്ളിടത്ത് - ബുള്ളറ്റ് points, ചെലവ്/വരുമാനം കാണിക്കാൻ ഒരു markdown table.`;

  const user = `Category: "${categoryName}"

${avoidList}

ഈ category-യിൽ പെടുന്ന ഒരു പുതിയ ബിസിനസ് ഐഡിയ തിരഞ്ഞെടുത്ത് അതിനെ കുറിച്ച് വിശദമായ ഒരു ആർട്ടിക്കിൾ എഴുതുക.

content ഫീൽഡിൽ ഈ സെക്ഷനുകൾ (ഇതേ ക്രമത്തിൽ, Malayalam headings ആയി) നിർബന്ധമായും ഉണ്ടാകണം:
1. ബിസിനസ് അവലോകനം (Business Overview) — എന്താണ് ഈ ബിസിനസ്, എന്തുകൊണ്ട് ഇത് നല്ല അവസരമാണ്
2. വേണ്ട Investment — ആകെ എത്ര മുതൽമുടക്ക് വേണം (₹ range)
3. Equipment / Raw Materials — വേണ്ട സാധനങ്ങൾ, യന്ത്രങ്ങൾ, അസംസ്കൃത വസ്തുക്കൾ
4. തുടങ്ങുന്നത് എങ്ങനെ (Setup Process) — സ്റ്റെപ്പ് ബൈ സ്റ്റെപ്പ്
5. ചെലവുകൾ (Expenses) — പ്രതിമാസ/പ്രാരംഭ ചെലവുകളുടെ ഒരു ഭംഗിയുള്ള table
6. Pricing — എന്ത് വിലയ്ക്ക് വിൽക്കാം
7. വരുമാനം (Revenue) — പ്രതീക്ഷിക്കുന്ന വരുമാനം
8. ഏകദേശ ലാഭം (Approximate Profit) — പ്രതിമാസ ലാഭ കണക്ക്
9. Customers — ആരാണ് target customers
10. Marketing — എങ്ങനെ പ്രമോട്ട് ചെയ്യാം
11. Selling Methods — എങ്ങനെ / എവിടെ വിൽക്കാം
12. വെല്ലുവിളികൾ (Challenges) — സാധ്യമായ പ്രശ്നങ്ങളും അവയെ എങ്ങനെ കൈകാര്യം ചെയ്യാം

Output ഇതേ shape-ൽ ഒരു JSON object ആയി തരുക:
{
  "title": "ഐഡിയയുടെ ആകർഷകമായ Malayalam ടൈറ്റിൽ",
  "tag": "ഒന്നോ രണ്ടോ വാക്കിന്റെ ഒരു ചെറിയ ടാഗ് (e.g. പുതിയത്, ട്രെൻഡിംഗ്, ലാഭകരം)",
  "tag_color": "blue | green | purple | orange എന്നിവയിൽ ഒന്ന്",
  "description": "കാർഡിൽ കാണിക്കാനുള്ള ഒന്നോ രണ്ടോ വാചകത്തിന്റെ ഒരു ചെറിയ Malayalam വിവരണം",
  "profit_potential": "High | Medium | Low എന്നിവയിൽ ഒന്ന് മാത്രം (ഈ exact വാക്കുകൾ, ഇംഗ്ലീഷിൽ തന്നെ)",
  "investment_range": "ഉദാ: ₹50,000 - ₹2,00,000",
  "content": "മുകളിൽ പറഞ്ഞ 12 സെക്ഷനുകളും അടങ്ങിയ പൂർണ്ണമായ Markdown ആർട്ടിക്കിൾ",
  "image_query": "ഈ ബിസിനസ്സിനെ realistic ആയി കാണിക്കുന്ന ഒരു stock-photo search query, 2-4 ഇംഗ്ലീഷ് വാക്കുകളിൽ മാത്രം (e.g. \\"tailoring shop interior\\", \\"organic vegetable farm\\", \\"home bakery kitchen\\") — ഒരു real photo-യിൽ കാണാവുന്ന, concrete, generic ആയ ഒരു scene ആയിരിക്കണം, ബ്രാൻഡ് പേരുകളോ ആളുകളുടെ പേരുകളോ പാടില്ല"
}`;

  return { system, user };
}

function extractJson(raw: string): unknown {
  let text = raw.trim();
  // Strip a ```json ... ``` fence if the model added one anyway.
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) text = fenceMatch[1].trim();

  const start = text.indexOf("{");
  if (start === -1) {
    throw new Error("Gemini response did not contain a JSON object.");
  }

  // Scan forward from the first "{", tracking string state and brace depth,
  // and stop at the FIRST complete JSON object — ignoring anything after it
  // (e.g. Gemini occasionally appends extra "thinking" text past the JSON,
  // which broke a naive indexOf("{")..lastIndexOf("}") extraction).
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(text.slice(start, i + 1));
      }
    }
  }
  throw new Error("Gemini response JSON object was never closed.");
}

function validate(parsed: any): GeneratedArticle {
  const required = [
    "title",
    "tag",
    "tag_color",
    "description",
    "profit_potential",
    "investment_range",
    "content",
    "image_query",
  ];
  for (const field of required) {
    if (!parsed || typeof parsed[field] !== "string" || !parsed[field].trim()) {
      throw new Error(`Generated article is missing required field: ${field}`);
    }
  }
  if (!VALID_TAG_COLORS.has(parsed.tag_color)) {
    throw new Error(`Invalid tag_color: ${parsed.tag_color}`);
  }
  if (!VALID_PROFIT.has(parsed.profit_potential)) {
    throw new Error(`Invalid profit_potential: ${parsed.profit_potential}`);
  }

  return {
    title: parsed.title.trim(),
    tag: parsed.tag.trim(),
    tagColor: parsed.tag_color,
    description: parsed.description.trim(),
    profitPotential: parsed.profit_potential,
    investmentRange: parsed.investment_range.trim(),
    content: parsed.content.trim(),
    imageQuery: parsed.image_query.trim(),
  };
}

async function callGemini(system: string, user: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY environment variable.");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: user }] }],
      systemInstruction: { parts: [{ text: system }] },
      generationConfig: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini API error (${response.status}): ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((p: any) => !p.thought) // skip any internal "thinking" part, keep only the actual answer
    .map((p: any) => p.text ?? "")
    .join("\n");

  if (!text.trim()) {
    const finishReason = data?.candidates?.[0]?.finishReason;
    throw new Error(`Gemini API returned an empty response${finishReason ? ` (finishReason: ${finishReason})` : ""}.`);
  }
  return text;
}

// Generates one article, retrying once (with a stronger duplicate warning) if
// the model reuses a title that's already in avoidTitles.
export async function generateBusinessArticle(
  categoryName: string,
  avoidTitles: string[]
): Promise<GeneratedArticle> {
  const normalizedAvoid = new Set(avoidTitles.map((t) => t.trim().toLowerCase()));

  for (let attempt = 1; attempt <= 2; attempt++) {
    const extraAvoid = attempt === 2 ? [...avoidTitles, "(മുകളിൽ പറഞ്ഞവയിൽ നിന്ന് തീർത്തും വ്യത്യസ്തമായ ഒരു ഐഡിയ തിരഞ്ഞെടുക്കുക)"] : avoidTitles;
    const { system, user } = buildPrompt(categoryName, extraAvoid);
    const raw = await callGemini(system, user);
    const parsed = validate(extractJson(raw));

    if (!normalizedAvoid.has(parsed.title.trim().toLowerCase())) {
      return parsed;
    }
    // exact-title duplicate — loop once more before giving up
  }

  throw new Error("Could not generate a non-duplicate article after 2 attempts.");
}