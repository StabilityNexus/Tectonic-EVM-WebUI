import en from "./i18n/locales/en.json";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function getTranslation(key: string, replacements?: Record<string, string>): string {
  const keys = key.split(".");
  let current: JsonValue = en as JsonValue;
  for (const k of keys) {
    if (current && typeof current === "object" && !Array.isArray(current) && k in current) {
      current = (current as Record<string, JsonValue>)[k];
    } else {
      return key;
    }
  }
  if (typeof current !== "string") {
    return key;
  }
  let result = current;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`{${k}}`, "g"), v);
    }
  }
  return result;
}

export function useTranslations(prefix?: string) {
  return (key: string, replacements?: Record<string, string>) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return getTranslation(fullKey, replacements);
  };
}
