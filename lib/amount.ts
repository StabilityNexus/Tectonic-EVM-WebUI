/* ─────────────────────────────────────────────────────────────────────────────
   Pure helpers for turning a user-typed amount into wei
───────────────────────────────────────────────────────────────────────────── */
import { parseEther } from "viem";

/**
 * Expand exponent notation into a plain decimal string ("1e5" → "100000").
 *
 * `<input type="number">` accepts exponent notation — it is a valid
 * floating-point number per the HTML spec — but viem's `parseEther` rejects
 * it, so the string has to be expanded before it is converted. Digits are
 * moved as text rather than through `Number`, which would lose precision on
 * amounts with more significant digits than a double can hold.
 */
export function expandExponent(value: string): string {
  const match = /^([+-]?)(\d*)(?:\.(\d*))?[eE]([+-]?\d+)$/.exec(value);
  if (!match) {
    return value;
  }
  const [, sign, integer, fraction = "", exponent] = match;
  const digits = integer + fraction;
  const pointAt = integer.length + Number(exponent);
  if (pointAt <= 0) {
    return `${sign}0.${"0".repeat(-pointAt)}${digits}`;
  }
  if (pointAt >= digits.length) {
    return `${sign}${digits}${"0".repeat(pointAt - digits.length)}`;
  }
  return `${sign}${digits.slice(0, pointAt)}.${digits.slice(pointAt)}`;
}

/**
 * Convert a user-typed amount to wei, or `undefined` when it is not an amount
 * `parseEther` can take. Returning `undefined` lets the caller report the
 * problem in the form instead of throwing out of a submit handler.
 */
export function amountToWei(amount: string): bigint | undefined {
  try {
    const wei = parseEther(expandExponent(amount.trim()));
    return wei > BigInt(0) ? wei : undefined;
  } catch {
    return undefined;
  }
}
