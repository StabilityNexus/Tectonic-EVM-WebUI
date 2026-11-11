
import { parseEther } from "viem";

/**
 * Expand exponent notation without using floating-point arithmetic.
 * Example: 1.5e3 -> 1500
 */
export function expandExponent(value: string): string {
  const match = /^([+-]?)(\d*)(?:\.(\d*))?[eE]([+-]?\d+)$/.exec(value);

  if (!match) return value;

  const [, sign, integer, fraction = "", exponent] = match;

  const digits = integer + fraction;

  if (!digits || !/^\d+$/.test(digits)) return value;

  const exp = Number(exponent);

  // Avoid excessively large string allocations.
  if (!Number.isSafeInteger(exp) || Math.abs(exp) > 1000) {
    return value;
  }

  const pointAt = integer.length + exp;

  if (pointAt <= 0) {
    return `${sign}0.${"0".repeat(-pointAt)}${digits}`;
  }

  if (pointAt >= digits.length) {
    return `${sign}${digits}${"0".repeat(pointAt - digits.length)}`;
  }

  return `${sign}${digits.slice(0, pointAt)}.${digits.slice(pointAt)}`;
}

/**
 * Convert a positive amount to wei.
 * Return undefined if the amount is invalid.
 */
export function amountToWei(amount: string): bigint | undefined {
  try {
    const expanded = expandExponent(amount.trim());

    if (!expanded || expanded.length > 1100) {
      return undefined;
    }

    // Accept ordinary positive decimal notation only.
    if (!/^\d*\.?\d+$/.test(expanded) || !/\d/.test(expanded)) {
      return undefined;
    }

    const [integer = "", fraction = ""] = expanded.split(".");

    // Ethereum's standard ether denomination supports 18 decimals.
    if (fraction.length > 18) {
      return undefined;
    }

    const normalized = `${integer || "0"}.${fraction || "0"}`;
    const wei = parseEther(normalized);

    return wei > BigInt(0) ? wei : undefined;
  } catch {
    return undefined;
  }
}
