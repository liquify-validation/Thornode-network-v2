export const RUNE_SYMBOL = "\u16B1";

export const parseFiniteNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value ?? "")
    .replace(/,/g, "")
    .trim();

  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const baseUnitsToWholeRune = (value) =>
  Math.round(parseFiniteNumber(value) / 1e8);

export const formatWholeRune = (value) =>
  `${RUNE_SYMBOL}${parseFiniteNumber(value).toLocaleString()}`;

export const formatRuneFromBaseUnits = (value) =>
  formatWholeRune(baseUnitsToWholeRune(value));

export const formatUsdValue = (value) =>
  `$${parseFiniteNumber(value).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
