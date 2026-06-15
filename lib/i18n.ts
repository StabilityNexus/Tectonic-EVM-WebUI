import en from "./i18n/locales/en.json";

export function getTranslation(key: string, replacements?: Record<string, string>): string {
  const keys = key.split(".");
  let current: any = en;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
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
