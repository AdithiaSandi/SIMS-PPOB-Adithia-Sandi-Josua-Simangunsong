export const formatIDR = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("id-ID").format(num);
};

export const maskBalance = (
  value: number | string,
  isVisible: boolean,
  maskAmount?: number
): string => {
  if (isVisible) return formatIDR(value);

  const dot = "●";
  if (maskAmount !== undefined) {
    return dot.repeat(maskAmount);
  }

  const formattedStr = formatIDR(value);
  return dot.repeat(formattedStr.length);
};
