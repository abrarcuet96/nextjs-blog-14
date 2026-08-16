const WORDS_PER_MINUTE = 200;

export function getReadingTime(text = "") {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function makeExcerpt(text = "", length = 155) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  return cleanText.length > length
    ? `${cleanText.slice(0, length - 1).trimEnd()}…`
    : cleanText;
}

export function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  const cleanTags = tags
    .filter((tag) => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase().slice(0, 30))
    .filter(Boolean);
  return [...new Set(cleanTags)].slice(0, 5);
}

export function splitTagsInput(value = "") {
  return normalizeTags(value.split(","));
}

export function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
